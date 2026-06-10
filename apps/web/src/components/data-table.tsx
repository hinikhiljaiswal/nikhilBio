export function DataTable({
  columns,
  rows,
  onEdit,
  onDelete
}: {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          {onEdit || onDelete ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="muted">
              No records found.
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr key={String(row._id ?? index)}>
              {columns.map((column) => (
                <td key={column}>{String(row[column] ?? "-")}</td>
              ))}
              {onEdit || onDelete ? (
                <td>
                  <div className="row-actions">
                    {onEdit ? (
                      <button className="button secondary" type="button" onClick={() => onEdit(row)}>
                        Edit
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button className="button danger" type="button" onClick={() => onDelete(row)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
