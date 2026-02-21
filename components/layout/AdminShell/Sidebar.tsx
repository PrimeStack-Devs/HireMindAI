'use client'

import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    BarChart3,
    Settings,
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: ClipboardList, label: 'Assessments', href: '/admin/assessments' },
    { icon: Users, label: 'Candidates', href: '/admin/candidates' },
    { icon: BarChart3, label: 'Results', href: '/admin/results' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen border-r border-blue-700/30 bg-slate-950/80 backdrop-blur-md flex flex-col">

            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-blue-700/30">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    HireMind.ai
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <motion.button
                            key={item.label}
                            whileHover={{ x: 4 }}
                            onClick={() => router.push(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/20 border border-blue-600/40 text-blue-300'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </motion.button>
                    )
                })}
            </nav>
        </aside>
    )
}