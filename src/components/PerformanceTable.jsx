/**
 * Structured data table for viewing performance audit records.
 *
 * @param {object} props
 * @param {Array<object>} props.records
 */
export default function PerformanceTable({ records }) {
  if (records.length === 0) {
    return (
      <div className="table-empty-state" role="region" aria-label="Performance Records">
        <p className="no-data-message" role="status">
          No data found matching your query.
        </p>
      </div>
    )
  }

  return (
    <div className="table-responsive" tabIndex={0} aria-label="Performance Records Table Container">
      <table className="performance-table" aria-label="News Blog Performance Records">
        <thead>
          <tr>
            <th scope="col">Article Title</th>
            <th scope="col">Article URL</th>
            <th scope="col">Load Time (ms)</th>
            <th scope="col">Metric / Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td className="cell-title font-medium">
                {record.title}
              </td>
              <td className="cell-url">
                <a
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="table-link"
                >
                  {record.url}
                </a>
              </td>
              <td className="cell-load-time font-mono">
                {record.loadTime} ms
              </td>
              <td className="cell-status">
                <span className={`status-badge status-${(record.status || 'good').toLowerCase().includes('good') ? 'good' : 'warning'}`}>
                  {record.status || 'Good'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
