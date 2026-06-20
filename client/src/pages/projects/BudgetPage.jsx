import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { expensesAPI, projectsAPI } from '../../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, X, TrendingUp, AlertTriangle, Clock, Activity, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Labour', 'Material', 'Equipment', 'Transport', 'Miscellaneous'];
const CAT_COLORS  = { Labour: '#3A7BD5', Material: '#1A7A4A', Equipment: '#B07D00', Transport: '#7c3aed', Miscellaneous: '#64748b' };


function AddExpenseModal({ projectId, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ? { category: initial.category, amount: initial.amount,
    expense_date: initial.expense_date?.slice(0, 10) || '', description: initial.description || '' }
    : { category:'Material', amount:'', expense_date:'', description:'' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (initial?.id) await expensesAPI.update(initial.id, form);
      else await expensesAPI.create({ ...form, project_id: projectId });
      toast.success(initial?.id ? 'Expense updated!' : 'Expense logged!'); onSave();
    } catch { toast.error('Failed to log expense'); }
    finally { setLoading(false); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-semibold text-primary">{initial?.id ? 'Edit Expense' : 'Log Expense'}</h3>
          <button onClick={onClose} className="btn-icon btn-ghost"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Amount (₹) *</label>
                <input type="number" className="input" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Date *</label>
              <input type="date" className="input" value={form.expense_date} onChange={e => setForm(f=>({...f,expense_date:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="textarea" rows={2} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : initial?.id ? 'Save Changes' : 'Log Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget]     = useState({ total: 0, spent: 0 });
  const [catFilter, setCatFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [project, setProject] = useState(null);

  useEffect(() => {
    expensesAPI.getByProject(id).then(r => setExpenses(r.data || [])).catch(() => {});
    projectsAPI.getBudget(id).then(r => setBudget(r.data || budget)).catch(() => {});
    projectsAPI.getById(id).then(r => setProject(r.data || project)).catch(() => {});
  }, [id]);

  const load = () => expensesAPI.getByProject(id).then(r => setExpenses(r.data || [])).catch(() => {});

  const filtered = catFilter === 'All' ? expenses : expenses.filter(e => e.category === catFilter);
  const spentPct = Math.round((budget.spent / budget.total) * 100) || 0;

  // Pie chart data
  const pieData = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0),
  })).filter(d => d.value > 0);

  const fmt = (n) => `₹${(Number(n)/1000).toFixed(0)}K`;

  // Forecasting Logic
  const calculateForecast = () => {
    if (!project || !project.start_date || !budget.spent) return null;
    const start = new Date(project.start_date);
    const end = project.end_date ? new Date(project.end_date) : new Date(start.getTime() + 365*24*60*60*1000);
    const today = new Date();
    
    // Days elapsed so far
    const daysElapsed = Math.max(1, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
    const totalDurationDays = Math.max(1, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
    
    // Daily burn rate
    const dailyBurnRate = budget.spent / daysElapsed;
    
    // Remaining runway (days until budget hits 0)
    const remainingBudget = budget.total - budget.spent;
    const runwayDays = dailyBurnRate > 0 ? Math.floor(remainingBudget / dailyBurnRate) : 0;
    
    // Forecast completion cost
    const projectedCost = budget.spent + (dailyBurnRate * (totalDurationDays - daysElapsed));
    
    return {
      dailyBurnRate,
      runwayDays,
      projectedCost,
      isOverBudget: projectedCost > budget.total
    };
  };

  const forecast = calculateForecast();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Tracker</h1>
          <p className="page-subtitle">Monitor expenses and budget utilisation</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      {/* Budget Bar */}
      <div className={`card mb-5 ${spentPct > 80 ? 'border-danger/40' : ''}`}>
        {spentPct > 80 && (
          <div className="flex items-center gap-2 text-danger text-sm mb-3">
            <AlertTriangle className="w-4 h-4" />
            Budget alert — over 80% utilised!
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-primary">Budget Utilisation</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-primary font-heading">
              ₹{(budget.spent/100000).toFixed(1)}L
            </span>
            <span className="text-sm text-slate-400"> / ₹{(budget.total/100000).toFixed(1)}L</span>
          </div>
        </div>
        <div className="progress-bar h-4">
          <div className={`progress-fill ${spentPct > 80 ? 'bg-danger' : spentPct > 60 ? 'bg-warning' : 'bg-success'}`}
            style={{ width: `${Math.min(spentPct, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{spentPct}% used</span>
          <span>₹{((budget.total - budget.spent)/100000).toFixed(1)}L remaining</span>
        </div>
      </div>

      {/* FORECASTING WIDGET */}
      {forecast && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="card-sm bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Burn Rate</span>
            </div>
            <p className="text-xl font-bold text-slate-800">₹{forecast.dailyBurnRate.toLocaleString('en-IN', {maximumFractionDigits:0})}<span className="text-sm font-normal text-slate-500"> / day</span></p>
            <p className="text-xs text-slate-500 mt-1">Average daily spending</p>
          </div>
          
          <div className="card-sm bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Runway</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{forecast.runwayDays} <span className="text-sm font-normal text-slate-500">days</span></p>
            <p className="text-xs text-slate-500 mt-1">Estimated until budget exhausted</p>
          </div>

          <div className={`card-sm bg-gradient-to-br ${forecast.isOverBudget ? 'from-red-50' : 'from-green-50'} to-white`}>
            <div className={`flex items-center gap-2 ${forecast.isOverBudget ? 'text-danger' : 'text-success'} mb-2`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Projected Cost</span>
            </div>
            <p className="text-xl font-bold text-slate-800">
              ₹{(forecast.projectedCost/100000).toFixed(2)}L
            </p>
            <p className={`text-xs mt-1 ${forecast.isOverBudget ? 'text-danger font-medium' : 'text-slate-500'}`}>
              {forecast.isOverBudget ? `Over budget by ₹${((forecast.projectedCost - budget.total)/100000).toFixed(2)}L` : 'On track within budget'}
            </p>
          </div>
        </div>
      )}

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[entry.name] || '#94a3b8'} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Amount']} />
              <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-primary">Expense History</h3>
            <div className="flex gap-2 flex-wrap">
              {['All', ...CATEGORIES].map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr>
                <th>Date</th><th>Category</th><th>Description</th><th className="text-right">Amount</th><th></th>
              </tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="text-slate-500 text-xs whitespace-nowrap">{(() => {
                      const d = new Date(e.expense_date);
                      return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
                    })()}</td>
                    <td className="whitespace-nowrap"><span className="badge" style={{ backgroundColor: CAT_COLORS[e.category]+'22', color: CAT_COLORS[e.category] }}>{e.category}</span></td>
                    <td className="text-slate-700 max-w-[200px] break-words whitespace-normal">{e.description || '—'}</td>
                    <td className="text-right font-semibold text-primary">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                    <td><button type="button" className="btn-icon btn-ghost" title="Edit expense"
                      onClick={() => { setEditingExpense(e); setShowModal(true); }}><Pencil className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <AddExpenseModal projectId={id} initial={editingExpense}
        onClose={() => { setShowModal(false); setEditingExpense(null); }}
        onSave={() => { setShowModal(false); setEditingExpense(null); load(); }} />}
    </div>
  );
}
