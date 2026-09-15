'use client'

export function NotFoundBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      Go Back
    </button>
  )
}
