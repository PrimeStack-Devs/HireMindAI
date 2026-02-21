'use client'

export default function Header() {
    return (
        <header className="h-16 border-b border-blue-700/30 bg-slate-950/60 backdrop-blur-md flex items-center justify-between px-6">

            <h2 className="text-lg font-semibold text-gray-200">
                Admin Panel
            </h2>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-semibold">
                    D
                </div>
            </div>

        </header>
    )
}