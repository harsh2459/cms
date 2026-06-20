import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  message = "There's nothing to show here yet.",
  actionLabel,
  onAction 
}) {
  return (
    <div className="empty-state">
      <div className="w-16 h-16 bg-slate-100  rounded-full flex items-center justify-center text-slate-400  mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-primary  mb-1">{title}</h3>
      <p className="text-slate-500  max-w-sm mx-auto mb-6">
        {message}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
