"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 overflow-auto max-h-[300px]">
              <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                {this.state.error?.toString() || "Unknown error"}
              </p>
              {this.state.errorInfo && (
                <pre className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                  {JSON.stringify(this.state.errorInfo, null, 2)}
                </pre>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Refresh the page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
