import { useState } from 'react'
import { sanitizeText, isValidUrl, isValidLoadTime } from '../utils/sanitize'
import { logAnalytics } from '../utils/analytics'

/**
 * Form component to submit and validate new performance records.
 *
 * @param {object} props
 * @param {(record: object) => void} props.onAddRecord
 */
export default function RecordForm({ onAddRecord }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    loadTime: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    // Trigger analytics logging on primary form submission attempt
    logAnalytics()

    const validationErrors = {}

    // Title validation
    const rawTitle = formData.title
    const sanitizedTitle = sanitizeText(rawTitle)
    if (!rawTitle.trim() || !sanitizedTitle) {
      validationErrors.title = 'Title is required'
    }

    // URL validation
    const rawUrl = formData.url.trim()
    if (!rawUrl) {
      validationErrors.url = 'URL is required'
    } else if (!isValidUrl(rawUrl)) {
      validationErrors.url = 'Invalid URL: Please enter a valid URL'
    }

    // Load time validation
    const rawLoadTime = formData.loadTime.trim()
    if (!rawLoadTime) {
      validationErrors.loadTime = 'Load time is required'
    } else if (!isValidLoadTime(rawLoadTime)) {
      validationErrors.loadTime = 'Load time must be a positive number'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Sanitize before storing
    const newRecord = {
      id: Date.now(),
      title: sanitizedTitle,
      url: sanitizeText(rawUrl),
      loadTime: rawLoadTime,
      status: Number(rawLoadTime) < 200 ? 'Good' : Number(rawLoadTime) < 500 ? 'Moderate' : 'Poor'
    }

    onAddRecord(newRecord)

    // Reset form fields and error state
    setFormData({
      title: '',
      url: '',
      loadTime: ''
    })
    setErrors({})
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <section aria-label="Add Performance Record" className="form-card">
      <h2 className="form-title">Add Performance Record</h2>
      <form onSubmit={handleSubmit} noValidate className="record-form">
        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="record-title" className="form-label">
              Article Title
            </label>
            <input
              id="record-title"
              name="title"
              type="text"
              className={`form-input ${errors.title ? 'input-error border-red' : ''}`}
              style={{ borderColor: errors.title ? '#dc2626' : undefined }}
              placeholder="e.g. Optimizing Core Web Vitals"
              value={formData.title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <span id="title-error" role="alert" className="error-message">
                {errors.title}
              </span>
            )}
          </div>

          {/* URL Field */}
          <div className="form-group">
            <label htmlFor="record-url" className="form-label">
              Article URL
            </label>
            <input
              id="record-url"
              name="url"
              type="url"
              className={`form-input ${errors.url ? 'input-error border-red' : ''}`}
              style={{ borderColor: errors.url ? '#dc2626' : undefined }}
              placeholder="https://newsblog.com/post-name"
              value={formData.url}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-invalid={errors.url ? 'true' : 'false'}
              aria-describedby={errors.url ? 'url-error' : undefined}
            />
            {errors.url && (
              <span id="url-error" role="alert" className="error-message">
                {errors.url}
              </span>
            )}
          </div>

          {/* Load Time Field */}
          <div className="form-group">
            <label htmlFor="record-load-time" className="form-label">
              Load Time (ms)
            </label>
            <input
              id="record-load-time"
              name="loadTime"
              type="text"
              className={`form-input ${errors.loadTime ? 'input-error border-red' : ''}`}
              style={{ borderColor: errors.loadTime ? '#dc2626' : undefined }}
              placeholder="e.g. 175"
              value={formData.loadTime}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-invalid={errors.loadTime ? 'true' : 'false'}
              aria-describedby={errors.loadTime ? 'load-time-error' : undefined}
            />
            {errors.loadTime && (
              <span id="load-time-error" role="alert" className="error-message">
                {errors.loadTime}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Add Performance Record"
          >
            Add Performance Record
          </button>
        </div>
      </form>
    </section>
  )
}
