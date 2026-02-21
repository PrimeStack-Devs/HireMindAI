'use client'

import Header from "./Header"
import Sidebar from "./Sidebar"


export default function AdminShell({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-black text-gray-200 grid grid-cols-[16rem_1fr]">

            {/* Sidebar */}
            <Sidebar />

            {/* Right Area */}
            <div className="flex flex-col h-screen overflow-hidden">

                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

            </div>
        </div>
    )
}