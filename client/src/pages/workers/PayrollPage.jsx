import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ChevronLeft, ChevronRight, FileDown, Search, Building2, IndianRupee, X, Banknote, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/ui/Pagination';

function PayModal({ worker, remaining, onClose, onConfirm }) {
  const [amount, setAmount] = useState(remaining.toFixed(2));
  const [method, setMethod] = useState('Cash');
  const [paymentId, setPaymentId] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (method === 'Online' && !paymentId.trim()) { toast.error('Enter a payment ID for online payments'); return; }
    setSaving(true);
    try {
      await onConfirm(amt, method, paymentId.trim() || null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">Record Payment</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <p className="text-sm text-slate-500 mb-4">
              Paying <strong className="text-slate-800">{worker.name}</strong><br />
              Remaining balance: <strong className="text-warning">₹{remaining.toFixed(2)}</strong>
            </p>

            <div className="form-group">
              <label className="label">Payment Method</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMethod('Cash'); setPaymentId(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${method === 'Cash'
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <Banknote className="w-4 h-4" />Cash
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Online')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${method === 'Online'
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <CreditCard className="w-4 h-4" />Online
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Amount to Pay (₹)</label>
              <input
                type="number" min="0.01" max={remaining} step="0.01"
                className="input" value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>

            {method === 'Online' && (
              <div className="form-group">
                <label className="label">Payment ID / Reference No.</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. UPI ref, NEFT/IMPS ID…"
                  value={paymentId}
                  onChange={e => setPaymentId(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WorkerPayCard({ w, salary, remaining, onPay }) {
  return (
    <div className="card p-4 space-y-3">
      {/* Name + badges */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800">{w.name}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap ${w.worker_type === 'Core' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{w.worker_type}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 whitespace-nowrap">{w.skill}</span>
          </div>
          {w.project_name && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <Building2 className="w-3 h-3" />{w.project_name}
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-400">Base Rate</p>
          <p className="font-medium text-slate-700 text-sm">₹{Number(w.daily_wage).toFixed(0)}<span className="text-xs text-slate-400">/{w.wage_type === 'Monthly' ? 'mo' : 'day'}</span></p>
        </div>
      </div>

      {/* Attendance row */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-2 text-center">
        <div>
          <p className="text-xs text-slate-400">Present</p>
          <p className="font-bold text-success text-sm">{w.present_days}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Half Day</p>
          <p className="font-bold text-warning text-sm">{w.half_days}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Absent</p>
          <p className="font-bold text-danger text-sm">{w.absent_days}</p>
        </div>
      </div>

      {/* Salary row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-slate-400">Total Salary</p>
          <p className="font-bold text-primary text-sm">₹{salary.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Paid</p>
          <p className="font-bold text-success text-sm">₹{Number(w.amount_paid || 0).toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Remaining</p>
          <p className="font-bold text-warning text-sm">₹{remaining.toFixed(0)}</p>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={() => onPay({ worker: w, remaining })}
        disabled={remaining <= 0}
        className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {remaining <= 0 ? 'Fully Paid ✓' : `Pay ₹${remaining.toFixed(0)}`}
      </button>
    </div>
  );
}

export default function PayrollPage() {
  const [workers, setWorkers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalEstimated, setTotalEstimated] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [payTarget, setPayTarget] = useState(null);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => { fetchPayroll(); }, 500);
    return () => clearTimeout(timer);
  }, [search, typeFilter, month]);

  useEffect(() => { fetchPayroll(); }, [currentPage]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workers/payroll', {
        params: { month, page: currentPage, limit: ITEMS_PER_PAGE, search, type: typeFilter }
      });
      setWorkers(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalEstimated(res.data.totalEstimated || 0);
      setTotalPaid(res.data.totalPaid || 0);
    } catch {
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSalary = (w) => {
    const present = Number(w.present_days) || 0;
    const half    = Number(w.half_days)    || 0;
    const rate    = Number(w.daily_wage)   || 0;
    if (w.wage_type === 'Monthly') {
      // Days in the selected month
      const [yr, mo] = month.split('-').map(Number);
      const daysInMonth = new Date(yr, mo, 0).getDate();
      const dailyEq = rate / daysInMonth;
      // Every day not marked Present or Half Day is absent (unrecorded = absent)
      const paidDays = present + (half * 0.5);
      return Math.max(0, paidDays * dailyEq);
    }
    return (present * rate) + (half * (rate / 2));
  };

  const handlePay = async (workerId, amount, method, paymentId) => {
    try {
      await api.post('/workers/payroll/pay', { worker_id: workerId, month, amount, payment_method: method, payment_id: paymentId });
      toast.success('Payment recorded');
      setPayTarget(null);
      fetchPayroll();
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const downloadCSV = async () => {
    try {
      const res = await api.get('/workers/payroll', { params: { month, search, type: typeFilter, limit: 10000, page: 1 } });
      const allData = res.data.data || [];
      const headers = ['Worker Name', 'Skill', 'Type', 'Wage Type', 'Base Rate', 'Present', 'Half Day', 'Absent', 'Total Salary (₹)', 'Project'];
      const rows = allData.map(w => [
        w.name, w.skill, w.worker_type, w.wage_type, w.daily_wage,
        w.present_days, w.half_days, w.absent_days, calculateSalary(w).toFixed(2), w.project_name || 'Unassigned'
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `Payroll_Report_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to download CSV');
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="page-wrapper max-w-7xl mx-auto">
      {/* Header */}
      <div className="page-header flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="page-subtitle">Monthly wages based on attendance</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="input w-auto"
          />
          <button onClick={downloadCSV} className="btn-secondary whitespace-nowrap">
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="card bg-primary/5 border-none p-4">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <IndianRupee className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Total Estimated</h3>
          </div>
          <p className="text-2xl font-bold text-primary">₹{totalEstimated.toFixed(0)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{total} workers · {new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="card bg-success/5 border-none p-4">
          <div className="flex items-center gap-2 mb-1 text-success">
            <IndianRupee className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Total Paid</h3>
          </div>
          <p className="text-2xl font-bold text-success">₹{totalPaid.toFixed(0)}</p>
        </div>
        <div className="card bg-warning/5 border-none p-4">
          <div className="flex items-center gap-2 mb-1 text-warning">
            <IndianRupee className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Remaining</h3>
          </div>
          <p className="text-2xl font-bold text-warning">₹{Math.max(0, totalEstimated - totalPaid).toFixed(0)}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search workers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Core', 'Local Daily'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none ${typeFilter === t ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP TABLE — hidden on mobile */}
      <div className="hidden md:block card p-0 overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Worker</th>
                <th className="px-4 py-3 text-left font-semibold">Project</th>
                <th className="px-4 py-3 text-left font-semibold">Base Rate</th>
                <th className="px-4 py-3 text-center font-semibold text-success">P</th>
                <th className="px-4 py-3 text-center font-semibold text-warning">HD</th>
                <th className="px-4 py-3 text-center font-semibold text-danger">A</th>
                <th className="px-4 py-3 text-right font-semibold text-primary">Total</th>
                <th className="px-4 py-3 text-right font-semibold text-success">Paid</th>
                <th className="px-4 py-3 text-right font-semibold text-warning">Remaining</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr><td colSpan="10" className="p-8 text-center text-slate-400">Loading payroll data...</td></tr>
              ) : workers.length === 0 ? (
                <tr><td colSpan="10" className="p-8 text-center text-slate-400">No workers found.</td></tr>
              ) : workers.map(w => {
                const salary = calculateSalary(w);
                const remaining = Math.max(0, salary - Number(w.amount_paid || 0));
                return (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{w.name}</p>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap ${w.worker_type === 'Core' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{w.worker_type}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 whitespace-nowrap">{w.skill}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {w.project_name ? <div className="flex items-center gap-1"><Building2 className="w-3 h-3" />{w.project_name}</div> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">₹{Number(w.daily_wage).toFixed(2)}</span>
                      <span className="text-xs text-slate-400">/{w.wage_type === 'Monthly' ? 'mo' : 'day'}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-success">{w.present_days}</td>
                    <td className="px-4 py-3 text-center font-semibold text-warning">{w.half_days}</td>
                    <td className="px-4 py-3 text-center font-semibold text-danger">{w.absent_days}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-primary bg-blue-50 px-2 py-1 rounded">₹{salary.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-success">₹{Number(w.amount_paid || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-warning">₹{remaining.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setPayTarget({ worker: w, remaining })}
                        className="btn-primary py-1 px-3 text-xs"
                        disabled={remaining <= 0}
                      >
                        {remaining <= 0 ? '✓' : 'Pay'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS — shown only on mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="card p-8 text-center text-slate-400">Loading payroll data...</div>
        ) : workers.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">No workers found.</div>
        ) : workers.map(w => {
          const salary = calculateSalary(w);
          const remaining = Math.max(0, salary - Number(w.amount_paid || 0));
          return (
            <WorkerPayCard
              key={w.id}
              w={w}
              salary={salary}
              remaining={remaining}
              onPay={setPayTarget}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-wrap gap-3">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–<span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, total)}</span> of <span className="font-medium text-slate-900">{total}</span>
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {payTarget && (
        <PayModal
          worker={payTarget.worker}
          remaining={payTarget.remaining}
          onClose={() => setPayTarget(null)}
          onConfirm={(amt, method, paymentId) => handlePay(payTarget.worker.id, amt, method, paymentId)}
        />
      )}
    </div>
  );
}
