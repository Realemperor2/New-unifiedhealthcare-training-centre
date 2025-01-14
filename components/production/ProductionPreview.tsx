import Link from 'next/link'

export default function ProductionPreview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Production Line Design</h2>
      <p className="mb-4">Design and assemble from 150 available production lines.</p>
      <Link href="/production" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
        Go to Production
      </Link>
    </div>
  )
}

