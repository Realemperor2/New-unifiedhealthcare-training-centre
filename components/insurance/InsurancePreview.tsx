import Link from 'next/link'

export default function InsurancePreview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Unified Insurance</h2>
      <p className="mb-4">Manage your annual coverage and payments.</p>
      <Link href="/insurance" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300">
        Go to Insurance
      </Link>
    </div>
  )
}

