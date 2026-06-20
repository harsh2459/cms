export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="table-wrapper animate-pulse">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}><div className="h-4 bg-slate-200  rounded w-20"></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c}>
                  <div className="h-4 bg-slate-100  rounded w-full max-w-[150px]"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card h-40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-200  rounded w-1/2"></div>
            <div className="h-5 bg-slate-200  rounded w-10"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-100  rounded w-3/4"></div>
            <div className="h-4 bg-slate-100  rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
