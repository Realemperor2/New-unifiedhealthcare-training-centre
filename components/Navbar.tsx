import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/health', label: 'Health' },
    { href: '/production', label: 'Production' },
    { href: '/ai-models', label: 'AI Models' },
    { href: '/insurance', label: 'Insurance' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Unified Healthcare</Link>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`hover:text-blue-200 transition-colors ${
                  pathname === item.href ? 'text-blue-200 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

