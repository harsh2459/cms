import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../../api';
import { Download, FileText, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Loader2, AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const reportRef = useRef();
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    projectsAPI.getReport(id)
      .then(r => setReport(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load report'))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${report.project.name}-Report.pdf`);
    } catch(e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const fmt = (n) => `₹${(Number(n)/100000).toFixed(1)}L`;
  const r = report;

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;
  if (!report) return null;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Report</h1>
          <p className="page-subtitle">Full summary — download as PDF</p>
        </div>
        <button className="btn-primary" onClick={downloadPDF} disabled={generating}>
          <Download className="w-4 h-4" />
          {generating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Report Preview */}
      <div ref={reportRef} className="bg-white rounded-xl p-8 shadow-card border border-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-primary font-heading">{r.project?.name}</h2>
            <p className="text-slate-500 text-sm">{r.project?.location}</p>
            <p className="text-xs text-slate-400 mt-1">Report generated: {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">BuildTrack CMS</p>
            <p className="text-xs text-slate-400">Construction Management System</p>
            <span className="badge badge-blue mt-1">{r.project?.status}</span>
          </div>
        </div>

        {/* KPIs */}
        <h3 className="text-sm font-semibold text-primary mb-3">Project Summary</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label:'Overall Progress', value:`${r.kpis?.progress}%`, color:'text-accent' },
            { label:'Budget Spent', value:fmt(r.kpis?.spent), color:'text-danger' },
            { label:'Budget Total', value:fmt(r.project?.total_budget), color:'text-primary' },
            { label:'Workers', value:r.kpis?.workers, color:'text-primary' },
            { label:'Tasks Completed', value:`${r.kpis?.tasks_done}/${r.kpis?.tasks_total}`, color:'text-success' },
            { label:'Open Issues', value:r.kpis?.open_issues, color:r.kpis?.open_issues > 0 ? 'text-danger' : 'text-success' },
          ].map(k => (
            <div key={k.label} className="bg-slate-50 rounded-lg p-4">
              <p className={`text-xl font-bold font-heading ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Expense Breakdown */}
        <h3 className="text-sm font-semibold text-primary mb-3">Expense Breakdown</h3>
        <table className="w-full text-sm mb-6">
          <thead><tr className="bg-slate-50"><th className="text-left py-2 px-3 text-xs text-slate-500">Category</th><th className="text-right py-2 px-3 text-xs text-slate-500">Amount</th></tr></thead>
          <tbody>
            {(r.expenses_by_category || []).map(e => (
              <tr key={e.category} className="border-b border-slate-50">
                <td className="py-2 px-3 text-slate-700">{e.category}</td>
                <td className="py-2 px-3 text-right font-semibold">₹{Number(e.total).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Issues */}
        <h3 className="text-sm font-semibold text-primary mb-3">Issues Overview</h3>
        <div className="flex flex-col gap-2">
          {(r.recent_issues || []).map((issue, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
              <span className="text-primary">{issue.title}</span>
              <div className="flex gap-2">
                <span className={`badge ${issue.priority === 'Critical' ? 'badge-red' : issue.priority === 'High' ? 'badge-yellow' : 'badge-gray'}`}>{issue.priority}</span>
                <span className={`badge ${issue.status === 'Resolved' ? 'badge-green' : issue.status === 'Open' ? 'badge-red' : 'badge-yellow'}`}>{issue.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          {r.project?.name} · BuildTrack Construction Management System · Confidential
        </div>
      </div>
    </div>
  );
}
