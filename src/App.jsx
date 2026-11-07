import { useState, useMemo, useCallback } from 'react'
import MetricsCards from './components/MetricsCards'
import SearchBox from './components/SearchBox'
import PerformanceTable from './components/PerformanceTable'
import RecordForm from './components/RecordForm'
import { logAnalytics } from './utils/analytics'
import './App.css'

const INITIAL_RECORDS = [
  {
    id: 1,
    title: 'Tech Innovations in Online Journalism 2026',
    url: 'https://newsblog.com/tech-innovations',
    loadTime: '165',
    status: 'Good (LCP 1.1s)'
  },
  {
    id: 2,
    title: 'Comprehensive Performance Guide for Newsrooms',
    url: 'https://newsblog.com/performance-guide',
    loadTime: '190',
    status: 'Good (LCP 1.3s)'
  },
  {
    id: 3,
    title: 'Breaking News Edge Delivery & CDN Caching',
    url: 'https://newsblog.com/edge-caching',
    loadTime: '215',
    status: 'Moderate (LCP 2.1s)'
  }
]

export default function App() {
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Derived filtered records using useMemo
  const filteredRecords = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase()
    if (!trimmed) {
      return records
    }
    return records.filter(
      (record) =>
        record.title.toLowerCase().includes(trimmed) ||
        record.url.toLowerCase().includes(trimmed)
    )
  }, [records, searchQuery])

  // Derived performance metrics using useMemo
  const metrics = useMemo(() => {
    const count = records.length
    if (count === 0) {
      return {
        avgLoadTime: '0.0',
        total: 0,
        score: 'N/A'
      }
    }
    const sum = records.reduce((acc, curr) => acc + Number(curr.loadTime || 0), 0)
    const avg = (sum / count).toFixed(1)
    const score =
      Number(avg) < 200
        ? '96 / 100 — Optimal'
        : Number(avg) < 500
        ? '82 / 100 — Moderate'
        : '54 / 100 — Poor'

    return {
      avgLoadTime: avg,
      total: count,
      score
    }
  }, [records])

  // Search input handler with analytics logging
  const handleSearchChange = useCallback((query) => {
    logAnalytics()
    setSearchQuery(query)
  }, [])

  // Async refresh metrics simulation
  const handleRefreshMetrics = useCallback(() => {
    logAnalytics()
    setIsLoading(true)

    // Simulate async data fetching operation
    setTimeout(() => {
      setIsLoading(false)
    }, 100)
  }, [])

  // Add new performance record
  const handleAddRecord = useCallback((newRecord) => {
    setRecords((prev) => [newRecord, ...prev])
  }, [])

  return (
    <div
      className="dashboard-wrapper"
      aria-busy={isLoading ? 'true' : undefined}
    >
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-titles">
            <h1 className="dashboard-title">
              News Blog Performance Optimization
            </h1>
            <p className="dashboard-subtitle">
              Auditing page speed metrics, latency, and site responsiveness across publication articles.
            </p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRefreshMetrics}
              disabled={isLoading}
              aria-label="Refresh Metrics"
            >
              Refresh Metrics
            </button>
          </div>
        </div>

        {isLoading && (
          <div
            role="status"
            data-testid="loading-indicator"
            className="loading-banner"
            aria-live="polite"
          >
            <span className="spinner" aria-hidden="true" />
            <span>Loading performance metrics...</span>
          </div>
        )}
      </header>

      <main className="dashboard-main">
        {/* Metric Overview Cards */}
        <MetricsCards
          avgLoadTime={metrics.avgLoadTime}
          totalRecords={metrics.total}
          performanceScore={metrics.score}
        />

        {/* Add Record Form */}
        <RecordForm onAddRecord={handleAddRecord} />

        {/* Search & Records Section */}
        <section aria-label="Performance Audit Records" className="records-section">
          <div className="records-toolbar">
            <h2 className="section-title">Audit Records</h2>
            <SearchBox query={searchQuery} onChange={handleSearchChange} />
          </div>

          <PerformanceTable records={filteredRecords} />
        </section>
      </main>
    </div>
  )
}
