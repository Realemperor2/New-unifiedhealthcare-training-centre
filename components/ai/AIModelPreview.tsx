import Link from 'next/link'

export default function AIModelPreview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">AI Model Creation</h2>
      <p className="mb-4">Create and train custom AI models for healthcare and production.</p>
      <Link href="/ai-models" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
        Go to AI Models
      </Link>
    </div>
  )
}

