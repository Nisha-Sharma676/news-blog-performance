import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import App from './App'

describe('ENG-84718: News Blog Performance Optimization - TDD Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // =========================================================================
  // Criterion 1: Dashboard renders correctly with a clear heading and structured performance information
  // =========================================================================
  describe('Criterion 1: Dashboard Rendering & Structured Performance Information', () => {
    it('renders the main dashboard heading for News Blog Performance Optimization', () => {
      render(<App />)
      // Expect a prominent heading (level 1) representing the performance dashboard
      const heading = screen.getByRole('heading', {
        level: 1,
        name: /news blog performance optimization/i
      })
      expect(heading).toBeInTheDocument()
    })

    it('renders structured performance summary cards (metrics overview)', () => {
      render(<App />)
      // Expect structured metrics cards displaying key performance metrics (Average Load Time, Total Records, Core Web Vitals)
      expect(screen.getByText(/average load time/i)).toBeInTheDocument()
      expect(screen.getByText(/total (articles|records|posts)/i)).toBeInTheDocument()
      expect(screen.getByText(/core web vitals|performance score/i)).toBeInTheDocument()
    })

    it('renders a structured performance records table or list with standard column headers', () => {
      render(<App />)
      // Expect structured table or data grid with appropriate column headers
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      const columnHeaders = within(table).getAllByRole('columnheader')
      const headerTexts = columnHeaders.map((header) => header.textContent?.toLowerCase())

      expect(headerTexts.some((text) => text?.includes('article') || text?.includes('title'))).toBe(true)
      expect(headerTexts.some((text) => text?.includes('url'))).toBe(true)
      expect(headerTexts.some((text) => text?.includes('load time') || text?.includes('speed'))).toBe(true)
      expect(headerTexts.some((text) => text?.includes('metric') || text?.includes('status'))).toBe(true)
    })
  })

  // =========================================================================
  // Criterion 2: Users can view and search performance records
  // =========================================================================
  describe('Criterion 2: View and Search Performance Records', () => {
    it('displays initial performance records on load', () => {
      render(<App />)
      // The dashboard should display initial blog performance records
      const records = screen.getAllByRole('row')
      // At least 1 header row + 1 or more data rows
      expect(records.length).toBeGreaterThan(1)
    })

    it('filters performance records based on search input query', async () => {
      render(<App />)
      // Find search input by label, placeholder, or searchbox role
      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)
      expect(searchInput).toBeInTheDocument()

      // Type search query to filter for a specific record
      fireEvent.change(searchInput, { target: { value: 'Tech' } })

      // Only records matching "Tech" should be rendered
      await waitFor(() => {
        const rows = screen.getAllByRole('row')
        // Filtered rows should contain the search term in at least one cell
        const dataRows = rows.slice(1) // exclude header row
        expect(dataRows.length).toBeGreaterThan(0)
        dataRows.forEach((row) => {
          expect(row.textContent?.toLowerCase()).toContain('tech')
        })
      })
    })

    it('performs case-insensitive search filtering', async () => {
      render(<App />)
      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)

      // Search in uppercase should match lowercase records
      fireEvent.change(searchInput, { target: { value: 'GUIDE' } })

      await waitFor(() => {
        const rows = screen.getAllByRole('row')
        const dataRows = rows.slice(1)
        expect(dataRows.length).toBeGreaterThan(0)
        dataRows.forEach((row) => {
          expect(row.textContent?.toLowerCase()).toContain('guide')
        })
      })
    })
  })

  // =========================================================================
  // Criterion 3: Empty search results display a user-friendly "No data found" message
  // =========================================================================
  describe('Criterion 3: Empty Search Results Handling', () => {
    it('displays a user-friendly "No data found" message when query yields no results', async () => {
      render(<App />)
      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)

      fireEvent.change(searchInput, { target: { value: 'XYZ_NonExistent_Query_9999' } })

      await waitFor(() => {
        const noDataMessage = screen.getByText(/no data found/i)
        expect(noDataMessage).toBeInTheDocument()
        expect(noDataMessage).toBeVisible()
      })
    })

    it('clears the "No data found" message and restores records when search is cleared', async () => {
      render(<App />)
      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)

      // Search for non-existent item
      fireEvent.change(searchInput, { target: { value: 'XYZ_NonExistent_Query_9999' } })
      await waitFor(() => {
        expect(screen.getByText(/no data found/i)).toBeInTheDocument()
      })

      // Clear search query
      fireEvent.change(searchInput, { target: { value: '' } })

      await waitFor(() => {
        expect(screen.queryByText(/no data found/i)).not.toBeInTheDocument()
        const rows = screen.getAllByRole('row')
        expect(rows.length).toBeGreaterThan(1)
      })
    })
  })

  // =========================================================================
  // Criterion 4: Asynchronous operations display a visible loading indicator
  // =========================================================================
  describe('Criterion 4: Asynchronous Operations & Loading Indicator', () => {
    it('displays a visible loading indicator during asynchronous refresh or audit', async () => {
      render(<App />)
      // Find refresh / fetch metrics button
      const refreshButton = screen.getByRole('button', {
        name: /refresh|fetch metrics|run audit|analyze/i
      })
      expect(refreshButton).toBeInTheDocument()

      fireEvent.click(refreshButton)

      // Loading indicator should appear with role="status", aria-busy="true", or loading text
      const loadingIndicator =
        screen.getByRole('status') ||
        screen.getByTestId('loading-indicator') ||
        screen.getByText(/loading/i)
      expect(loadingIndicator).toBeInTheDocument()
      expect(loadingIndicator).toBeVisible()

      // Loading indicator should dismiss once async operation completes
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })

    it('indicates aria-busy="true" on the dashboard container during loading', async () => {
      render(<App />)
      const refreshButton = screen.getByRole('button', {
        name: /refresh|fetch metrics|run audit|analyze/i
      })

      fireEvent.click(refreshButton)

      // Container or loading region should have aria-busy="true"
      const busyElement = document.querySelector('[aria-busy="true"]')
      expect(busyElement).toBeInTheDocument()

      await waitFor(() => {
        expect(document.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
      })
    })
  })

  // =========================================================================
  // Criterion 5: Forms reject missing or malformed inputs
  // =========================================================================
  describe('Criterion 5: Form Input Validation (Missing & Malformed Data)', () => {
    it('rejects submission when all required fields are empty', async () => {
      render(<App />)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.click(submitButton)

      // Verify submission is rejected and validation errors are shown
      await waitFor(() => {
        expect(screen.getByText(/title is required|please enter a title/i)).toBeInTheDocument()
        expect(screen.getByText(/url is required|please enter a url/i)).toBeInTheDocument()
        expect(screen.getByText(/load time is required|please enter load time/i)).toBeInTheDocument()
      })
    })

    it('rejects submission when URL is malformed', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.change(titleInput, { target: { value: 'Valid Article Title' } })
      fireEvent.change(urlInput, { target: { value: 'invalid-url-without-protocol' } })
      fireEvent.change(loadTimeInput, { target: { value: '250' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid url|please enter a valid url/i)).toBeInTheDocument()
      })
    })

    it('rejects submission when load time is negative or non-numeric', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.change(titleInput, { target: { value: 'Speed Analysis Post' } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/speed' } })
      fireEvent.change(loadTimeInput, { target: { value: '-350' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/load time must be a positive number|invalid load time/i)
        ).toBeInTheDocument()
      })
    })

    it('rejects submission when title contains only whitespace', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.change(titleInput, { target: { value: '     ' } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/post' } })
      fireEvent.change(loadTimeInput, { target: { value: '180' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/title is required|please enter a title/i)).toBeInTheDocument()
      })
    })
  })

  // =========================================================================
  // Criterion 6: Invalid fields receive accessible error messages and red error styling
  // =========================================================================
  describe('Criterion 6: Accessible Error Messages and Red Error Styling', () => {
    it('sets aria-invalid="true" on invalid form inputs', async () => {
      render(<App />)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.click(submitButton)

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i)
        const urlInput = screen.getByLabelText(/url/i)
        const loadTimeInput = screen.getByLabelText(/load time/i)

        expect(titleInput).toHaveAttribute('aria-invalid', 'true')
        expect(urlInput).toHaveAttribute('aria-invalid', 'true')
        expect(loadTimeInput).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('associates error messages via aria-describedby or role="alert"', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.click(submitButton)

      await waitFor(() => {
        const describedById = titleInput.getAttribute('aria-describedby')
        expect(describedById).toBeTruthy()
        const errorElement = document.getElementById(describedById)
        expect(errorElement).toBeInTheDocument()
        expect(errorElement?.textContent).toMatch(/required|title/i)
      })
    })

    it('applies red error styling to invalid input fields', async () => {
      render(<App />)
      const urlInput = screen.getByLabelText(/url/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.change(urlInput, { target: { value: 'invalid-url' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Check for red border or error class
        const hasRedClass =
          urlInput.className.includes('error') ||
          urlInput.className.includes('border-red') ||
          urlInput.className.includes('invalid')

        const inlineOrComputedColor =
          window.getComputedStyle(urlInput).borderColor ||
          urlInput.style.borderColor ||
          urlInput.getAttribute('style')

        const hasRedStyle =
          inlineOrComputedColor?.includes('red') ||
          inlineOrComputedColor?.includes('rgb(239, 68, 68)') ||
          inlineOrComputedColor?.includes('rgb(220, 38, 38)') ||
          inlineOrComputedColor?.includes('#')

        expect(hasRedClass || hasRedStyle).toBe(true)
      })
    })

    it('clears aria-invalid and red styling once field is corrected', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      // Trigger error
      fireEvent.click(submitButton)
      await waitFor(() => {
        expect(titleInput).toHaveAttribute('aria-invalid', 'true')
      })

      // Correct input
      fireEvent.change(titleInput, { target: { value: 'Now Valid Title' } })

      await waitFor(() => {
        expect(titleInput).not.toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  // =========================================================================
  // Criterion 7: Text inputs are sanitized before being stored
  // =========================================================================
  describe('Criterion 7: Input Sanitization Before Storage', () => {
    it('sanitizes script tags from title input before storing and rendering record', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      const maliciousPayload = '<script>alert("xss")</script>Secure Blog Post'

      fireEvent.change(titleInput, { target: { value: maliciousPayload } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/secure' } })
      fireEvent.change(loadTimeInput, { target: { value: '190' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        // Verify no raw script tag is executed or injected into DOM
        const scripts = document.querySelectorAll('script')
        scripts.forEach((script) => {
          expect(script.textContent).not.toContain('alert("xss")')
        })

        // Rendered text in table should be sanitized (script removed or escaped)
        const renderedTitle = screen.getByText(/secure blog post/i)
        expect(renderedTitle).toBeInTheDocument()
        expect(renderedTitle.innerHTML).not.toContain('<script>')
      })
    })

    it('sanitizes dangerous HTML event handlers (e.g. onerror, onload) from inputs', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      const maliciousPayload = '<img src="x" onerror="alert(1)">Image Attack Article'

      fireEvent.change(titleInput, { target: { value: maliciousPayload } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/image-test' } })
      fireEvent.change(loadTimeInput, { target: { value: '220' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        // Verify no image with onerror handler is rendered into the DOM
        const images = document.querySelectorAll('img[onerror]')
        expect(images.length).toBe(0)

        // The safe title should be stored and rendered
        expect(screen.getByText(/image attack article/i)).toBeInTheDocument()
      })
    })
  })

  // =========================================================================
  // Criterion 8: Primary user actions trigger the console message:
  // [Analytics] User interacted with Performance Optimization
  // =========================================================================
  describe('Criterion 8: Analytics Interaction Logging', () => {
    it('logs analytics message when primary form submission button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      render(<App />)

      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })
      fireEvent.click(submitButton)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with Performance Optimization'
      )
    })

    it('logs analytics message when user performs a search action', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      render(<App />)

      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)
      fireEvent.change(searchInput, { target: { value: 'Performance' } })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with Performance Optimization'
      )
    })

    it('logs analytics message when user clicks refresh or analyze button', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      render(<App />)

      const refreshButton = screen.getByRole('button', {
        name: /refresh|fetch metrics|run audit|analyze/i
      })
      fireEvent.click(refreshButton)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with Performance Optimization'
      )
    })
  })

  // =========================================================================
  // Criterion 9: Buttons and inputs have accessible labels and support keyboard navigation
  // =========================================================================
  describe('Criterion 9: Accessibility Labels & Keyboard Navigation', () => {
    it('provides accessible labels for all inputs via associated <label> elements', () => {
      render(<App />)

      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const searchInput = screen.getByRole('searchbox') || screen.getByLabelText(/search/i)

      expect(titleInput).toHaveAttribute('id')
      expect(urlInput).toHaveAttribute('id')
      expect(loadTimeInput).toHaveAttribute('id')
      expect(searchInput).toBeInTheDocument()

      // Verify label elements have matching htmlFor attributes
      const titleLabel = document.querySelector(`label[for="${titleInput.id}"]`)
      expect(titleLabel).toBeInTheDocument()

      const urlLabel = document.querySelector(`label[for="${urlInput.id}"]`)
      expect(urlLabel).toBeInTheDocument()

      const loadTimeLabel = document.querySelector(`label[for="${loadTimeInput.id}"]`)
      expect(loadTimeLabel).toBeInTheDocument()
    })

    it('provides accessible names for all interactive buttons', () => {
      render(<App />)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })
      const refreshButton = screen.getByRole('button', {
        name: /refresh|fetch metrics|run audit|analyze/i
      })

      expect(submitButton).toHaveAccessibleName()
      expect(refreshButton).toHaveAccessibleName()
    })

    it('supports keyboard navigation and focus management', () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)

      titleInput.focus()
      expect(document.activeElement).toBe(titleInput)

      urlInput.focus()
      expect(document.activeElement).toBe(urlInput)
    })

    it('allows form submission via keyboard Enter key', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)

      fireEvent.change(titleInput, { target: { value: 'Keyboard Accessible Post' } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/keyboard' } })
      fireEvent.change(loadTimeInput, { target: { value: '210' } })

      // Press Enter key on input to submit
      fireEvent.keyDown(loadTimeInput, { key: 'Enter', code: 'Enter', charCode: 13 })

      await waitFor(() => {
        expect(screen.getByText('Keyboard Accessible Post')).toBeInTheDocument()
      })
    })
  })

  // =========================================================================
  // Criterion 10: Interactive functionality works correctly without unexpected crashes
  // =========================================================================
  describe('Criterion 10: Interactive Stability & Edge Case Handling', () => {
    it('handles rapid consecutive search query changes without crashing', async () => {
      render(<App />)
      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i)

      // Simulate rapid user keystrokes
      const keystrokes = ['a', 'ab', 'abc', 'abcd', '', 'news', '']
      for (const stroke of keystrokes) {
        fireEvent.change(searchInput, { target: { value: stroke } })
      }

      // Component should remain stable
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('successfully adds a valid performance record and updates metrics', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      fireEvent.change(titleInput, { target: { value: 'Speeding Up React News Feeds' } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/react-feed' } })
      fireEvent.change(loadTimeInput, { target: { value: '145' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        // Record appears in the list
        expect(screen.getByText('Speeding Up React News Feeds')).toBeInTheDocument()
        expect(screen.getByText('https://newsblog.com/react-feed')).toBeInTheDocument()
      })

      // Form inputs should be cleared after successful submission
      expect(titleInput).toHaveValue('')
      expect(urlInput).toHaveValue('')
      expect(loadTimeInput).toHaveValue('')
    })

    it('handles decimal and large boundary load times without calculation or rendering errors', async () => {
      render(<App />)
      const titleInput = screen.getByLabelText(/title/i)
      const urlInput = screen.getByLabelText(/url/i)
      const loadTimeInput = screen.getByLabelText(/load time/i)
      const submitButton = screen.getByRole('button', {
        name: /add record|submit|add performance record/i
      })

      // Test decimal load time
      fireEvent.change(titleInput, { target: { value: 'High Latency Report' } })
      fireEvent.change(urlInput, { target: { value: 'https://newsblog.com/latency' } })
      fireEvent.change(loadTimeInput, { target: { value: '4520.85' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('High Latency Report')).toBeInTheDocument()
        expect(screen.getByText(/4520\.85|4521/)).toBeInTheDocument()
      })
    })

    it('renders cleanly without throwing uncaught exceptions during lifecycle', () => {
      expect(() => {
        const { unmount } = render(<App />)
        unmount()
      }).not.toThrow()
    })
  })
})
