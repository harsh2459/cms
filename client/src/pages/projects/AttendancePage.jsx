import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { attendanceAPI, workersAPI } from '../../api';
import { ChevronLeft, ChevronRight, Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTS = ['P', 'A', 'HD'];
const STATUS_LABELS = { P: 'Present', A: 'Absent', HD: 'Half Day' };
const STATUS_STYLES = {
  P:  'bg-green-100 text-green-800 border-green-200',
  A:  'bg-red-100 text-red-800 border-red-200',
  HD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  '': 'bg-slate-50 text-slate-400 border-slate-100',
};


function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AttendancePage() {
  const { id } = useParams();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [workers, setWorkers] = useState([]);
  const [grid, setGrid] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null); // for mobile day-picker

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    workersAPI.getAll({ project_id: id }).then(r => setWorkers(r.data || [])).catch(() => setWorkers([]));
    attendanceAPI.getByProject(id, { month: month + 1, year }).then(r => {
      const g = {};
      (r.data || []).forEach(a => {
        if (!g[a.worker_id]) g[a.worker_id] = {};
        g[a.worker_id][new Date(a.date).getDate()] = a.status === 'Present' ? 'P' : a.status === 'Absent' ? 'A' : 'HD';
      });
      setGrid(g);
    }).catch(() => {});
  }, [id, month, year]);

  const toggle = (workerId, day) => {
    setGrid(prev => {
      const current = prev[workerId]?.[day] || '';
      const next = current === '' ? 'P' : current === 'P' ? 'A' : current === 'A' ? 'HD' : '';
      return { ...prev, [workerId]: { ...(prev[workerId] || {}), [day]: next } };
    });
  };

  const getDayName = (day) => ['Su','Mo','Tu','We','Th','Fr','Sa'][new Date(year, month, day).getDay()];
  const isWeekend = (day) => { const d = new Date(year, month, day).getDay(); return d === 0 || d === 6; };

  const calcSalary = (workerId, wage) => {
    const att = grid[workerId] || {};
    const present = Object.values(att).filter(v => v === 'P').length;
    const half = Object.values(att).filter(v => v === 'HD').length;
    return (present + half * 0.5) * Number(wage);
  };

  const getAttSummary = (workerId) => {
    const att = grid[workerId] || {};
    return {
      P: Object.values(att).filter(v => v === 'P').length,
      A: Object.values(att).filter(v => v === 'A').length,
      HD: Object.values(att).filter(v => v === 'HD').length,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = [];
      workers.forEach(w => {
        const att = grid[w.id] || {};
        days.forEach(day => {
          if (att[day]) {
            const statusMap = { P: 'Present', A: 'Absent', HD: 'Half Day' };
            records.push({ worker_id: w.id, project_id: id, date: `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`, status: statusMap[att[day]] });
          }
        });
      });
      await attendanceAPI.bulkLog(records);
      toast.success('Attendance saved!');
    } catch { toast.error('Failed to save attendance'); }
    finally { setSaving(false); }
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    (w.skill || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="page-title">Attendance Sheet</h1>
          <p className="page-subtitle hidden sm:block">Tap cells to toggle P → A → HD → blank</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-input px-3 py-1.5">
            <button onClick={() => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }} className="p-0.5">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-medium text-primary px-1 min-w-[80px] text-center">{MONTH_NAMES[month]} {year}</span>
            <button onClick={() => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }} className="p-0.5">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <button className="btn-primary flex-1 sm:flex-none justify-center" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Legend + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded border text-center leading-6 font-bold ${STATUS_STYLES[k]}`}>{k}</span>{v}
            </div>
          ))}
        </div>
        <div className="relative sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search workers..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
      </div>

      {/* MOBILE: card-based attendance */}
      <div className="md:hidden space-y-3">
        {filteredWorkers.map(w => {
          const summary = getAttSummary(w.id);
          return (
            <div key={w.id} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center text-primary font-semibold text-sm">{w.name[0]}</div>
                  <div>
                    <p className="font-medium text-primary text-sm">{w.name}</p>
                    <p className="text-xs text-slate-400">{w.skill} · ₹{w.daily_wage}/day</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary text-sm">₹{calcSalary(w.id, w.daily_wage).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-400">estimated</p>
                </div>
              </div>

              {/* Summary badges */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                {[['P','Present','text-success'],['A','Absent','text-danger'],['HD','Half Day','text-warning']].map(([k,lbl,cls]) => (
                  <div key={k} className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">{lbl}</p>
                    <p className={`font-bold ${cls}`}>{summary[k]}</p>
                  </div>
                ))}
              </div>

              {/* Expand to show day grid */}
              <button
                onClick={() => setSelectedWorker(selectedWorker === w.id ? null : w.id)}
                className="btn-secondary w-full justify-center text-xs py-1.5"
              >
                {selectedWorker === w.id ? 'Hide Days ▲' : `Edit Days for ${MONTH_NAMES[month]} ▼`}
              </button>

              {selectedWorker === w.id && (
                <div className="mt-3">
                  <div className="grid grid-cols-7 gap-1">
                    {days.map(d => {
                      const val = grid[w.id]?.[d] || '';
                      return (
                        <div key={d} className="flex flex-col items-center gap-0.5">
                          <span className={`text-[9px] font-medium ${isWeekend(d) ? 'text-danger' : 'text-slate-400'}`}>{d}</span>
                          <button
                            onClick={() => toggle(w.id, d)}
                            className={`w-8 h-8 rounded border font-bold text-xs transition-colors ${STATUS_STYLES[val]}`}
                            title={STATUS_LABELS[val] || `Day ${d}`}
                          >
                            {val || '·'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DESKTOP: scrollable grid table */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-slate-100">
        <table className="text-xs min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="sticky left-0 bg-slate-50 px-4 py-3 text-left text-slate-500 font-semibold w-40">Worker</th>
              {days.map(d => (
                <th key={d} className={`px-1 py-3 text-center font-semibold w-10 ${isWeekend(d) ? 'text-danger' : 'text-slate-500'}`}>
                  <div>{d}</div><div className="text-slate-400 font-normal">{getDayName(d)}</div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-slate-500 font-semibold whitespace-nowrap">Salary Est.</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map(w => (
              <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="sticky left-0 bg-white px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-navy-50 rounded-full flex items-center justify-center text-primary font-semibold flex-shrink-0">{w.name[0]}</div>
                    <div><p className="font-medium text-primary truncate max-w-28">{w.name}</p><p className="text-slate-400">{w.skill}</p></div>
                  </div>
                </td>
                {days.map(d => {
                  const val = grid[w.id]?.[d] || '';
                  return (
                    <td key={d} className="text-center px-1 py-2">
                      <button onClick={() => toggle(w.id, d)} className={`w-8 h-8 rounded border font-bold transition-colors hover:opacity-80 ${STATUS_STYLES[val]}`} title={STATUS_LABELS[val] || 'Click to mark'}>{val}</button>
                    </td>
                  );
                })}
                <td className="px-4 py-2 text-right">
                  <span className="font-semibold text-primary">₹{calcSalary(w.id, w.daily_wage).toLocaleString('en-IN')}</span>
                  <p className="text-slate-400">₹{w.daily_wage}/day</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
