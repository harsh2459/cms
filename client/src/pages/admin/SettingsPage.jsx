// Admin Settings Page
import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [form, setForm] = useState({ company_name:'BuildTrack Construction', timezone:'Asia/Kolkata', currency:'INR', currency_symbol:'₹' });
  const save = (e) => { e.preventDefault(); toast.success('Settings saved!'); };
  return (
    <div className="page-wrapper">
      <div className="page-header"><div><h1 className="page-title">System Settings</h1><p className="page-subtitle">Company configuration</p></div></div>
      <div className="card max-w-lg">
        <div className="flex items-center gap-2 mb-5"><Settings className="w-5 h-5 text-accent" /><h3 className="font-semibold text-primary">General Settings</h3></div>
        <form onSubmit={save} className="flex flex-col gap-4">
          <div className="form-group"><label className="label">Company Name</label><input className="input" value={form.company_name} onChange={e => setForm(f=>({...f,company_name:e.target.value}))} /></div>
          <div className="form-group"><label className="label">Timezone</label>
            <select className="select" value={form.timezone} onChange={e => setForm(f=>({...f,timezone:e.target.value}))}>
              {['Asia/Kolkata','Asia/Dubai','UTC','America/New_York','Europe/London'].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group"><label className="label">Currency</label><input className="input" value={form.currency} onChange={e => setForm(f=>({...f,currency:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Symbol</label><input className="input" value={form.currency_symbol} onChange={e => setForm(f=>({...f,currency_symbol:e.target.value}))} /></div>
          </div>
          <button type="submit" className="btn-primary w-fit"><Save className="w-4 h-4" /> Save Settings</button>
        </form>
      </div>
    </div>
  );
}
