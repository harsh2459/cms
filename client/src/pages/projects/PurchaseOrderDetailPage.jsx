// Purchase Order Detail page
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchaseOrdersAPI } from '../../api';
import { ArrowLeft, Download, CheckCircle, XCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';

const STATUS_COLORS = { Draft:'badge-gray', Approved:'badge-green', Ordered:'badge-blue', Delivered:'badge-purple', Closed:'badge-navy' };

export default function PurchaseOrderDetailPage() {
  const { id, poId } = useParams();
  const { user } = useAuth();
  const [po, setPO] = useState(null);
  const [actioning, setActioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => purchaseOrdersAPI.getById(poId).then(r => setPO(r.data)).catch(err => setError(err.response?.data?.message || 'Failed to load PO details')).finally(() => setLoading(false));
  useEffect(() => { load(); }, [poId]);

  const approve = async () => {
    setActioning(true);
    try { await purchaseOrdersAPI.approve(poId, {}); toast.success('PO approved!'); load(); }
    catch { toast.error('Failed to approve PO'); }
    finally { setActioning(false); }
  };

  const reject = async () => {
    setActioning(true);
    try { await purchaseOrdersAPI.reject(poId, { notes: 'Rejected' }); toast.success('PO rejected'); load(); }
    catch { toast.error('Failed to reject PO'); }
    finally { setActioning(false); }
  };

  if (loading) return <div className="page-wrapper flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (error) return <div className="page-wrapper"><div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div></div>;
  if (!po) return null;

  return (
    <div className="page-wrapper">
      <Link to={`/projects/${id}/purchase-orders`} className="btn-ghost btn-sm mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to Purchase Orders
      </Link>

      <div className="card mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-primary font-heading">{po.po_number}</h1>
              <span className={`${STATUS_COLORS[po.status]} badge`}>{po.status}</span>
            </div>
            <p className="text-xs text-slate-400">Created by {po.created_by_name} on {po.created_at}</p>
            {po.approved_at && <p className="text-xs text-success">Approved by {po.approved_by_name} on {po.approved_at}</p>}
          </div>
          <div className="flex gap-2">
            {po.status === 'Draft' && (user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <button className="btn-success" onClick={approve} disabled={actioning}><CheckCircle className="w-4 h-4" /> Approve</button>
                <button className="btn-danger" onClick={reject} disabled={actioning}><XCircle className="w-4 h-4" /> Reject</button>
              </>
            )}
            <button className="btn-secondary"><Download className="w-4 h-4" /> PDF</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg text-sm">
          <div><p className="text-slate-500">Supplier</p><p className="font-medium text-primary">{po.supplier_name}</p></div>
          <div><p className="text-slate-500">Phone</p><p className="font-medium">{po.supplier_phone}</p></div>
          <div><p className="text-slate-500">Expected Delivery</p><p className="font-medium">{po.expected_delivery || '—'}</p></div>
          <div><p className="text-slate-500">Notes</p><p className="font-medium">{po.notes || '—'}</p></div>
        </div>
      </div>

      {/* Line Items */}
      <div className="card mb-5">
        <h3 className="text-sm font-semibold text-primary mb-4">Line Items</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th><th>Received</th></tr></thead>
            <tbody>
              {po.items?.map(item => (
                <tr key={item.id}>
                  <td className="font-medium text-primary">{item.description}</td>
                  <td>{item.quantity}</td>
                  <td className="text-slate-500">{item.unit}</td>
                  <td>₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                  <td className="font-semibold">₹{Number(item.total_price).toLocaleString('en-IN')}</td>
                  <td><span className={item.received_qty > 0 ? 'text-success font-medium' : 'text-slate-400'}>{item.received_qty}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 gap-8 text-sm">
          <div className="text-right">
            <p className="text-slate-500">Subtotal: <span className="font-medium text-primary">₹{Number(po.subtotal).toLocaleString('en-IN')}</span></p>
            <p className="text-slate-500">GST ({po.tax_percent}%): <span className="font-medium">₹{(po.subtotal * po.tax_percent / 100).toLocaleString('en-IN')}</span></p>
            <p className="text-base font-bold text-primary mt-1">Grand Total: ₹{Number(po.grand_total).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
