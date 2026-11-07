/**
 * Renders structured performance summary metrics cards.
 *
 * @param {object} props
 * @param {number|string} props.avgLoadTime
 * @param {number} props.totalRecords
 * @param {string} props.performanceScore
 */
export default function MetricsCards({ avgLoadTime, totalRecords, performanceScore }) {
  return (
    <section aria-label="Performance Summary" className="metrics-grid">
      <div className="metric-card">
        <h2 className="metric-title">Average Load Time</h2>
        <p className="metric-value">{avgLoadTime} ms</p>
        <span className="metric-caption">Target: &lt; 200 ms</span>
      </div>

      <div className="metric-card">
        <h2 className="metric-title">Total Records Monitored</h2>
        <p className="metric-value">{totalRecords} Posts</p>
        <span className="metric-caption">Active news articles</span>
      </div>

      <div className="metric-card">
        <h2 className="metric-title">Core Web Vitals / Performance Score</h2>
        <p className="metric-value">{performanceScore}</p>
        <span className="metric-caption">Aggregate health grade</span>
      </div>
    </section>
  )
}
