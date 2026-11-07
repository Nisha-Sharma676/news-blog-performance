/**
 * Search box component for filtering performance records.
 *
 * @param {object} props
 * @param {string} props.query
 * @param {(val: string) => void} props.onChange
 */
export default function SearchBox({ query, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="search-container">
      <label htmlFor="search-records" className="search-label">
        Search Records
      </label>
      <div className="search-input-wrapper">
        <input
          id="search-records"
          name="search-records"
          type="search"
          role="searchbox"
          className="search-input"
          placeholder="Filter records..."
          value={query}
          onChange={handleChange}
          aria-label="Search Records"
        />
      </div>
    </div>
  )
}
