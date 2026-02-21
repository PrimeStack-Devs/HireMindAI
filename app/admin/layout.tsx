// 'use client';

import AdminShell from "@/components/layout/AdminShell";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}


// import React from 'react';
// import { motion } from 'framer-motion';
// import {
//   LayoutDashboard,
//   ClipboardList,
//   Users,
//   BarChart3,
//   Settings,
// } from 'lucide-react';
// import { useRouter, usePathname } from 'next/navigation';

// const navItems = [
//   {
//     icon: LayoutDashboard,
//     label: 'Dashboard',
//     href: '/admin/dashboard',
//   },
//   {
//     icon: ClipboardList,
//     label: 'Assessments',
//     href: '/admin/assessments',
//   },
//   {
//     icon: Users,
//     label: 'Candidates',
//     href: '/dashboard/candidates',
//   },
//   {
//     icon: BarChart3,
//     label: 'Results',
//     href: '/dashboard/results',
//   },
//   {
//     icon: Settings,
//     label: 'Settings',
//     href: '/dashboard/settings',
//   },
// ];

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-black text-gray-200">
      
//       {/* Sidebar */}
//       <aside className="w-64 border-r border-blue-700/30 bg-slate-950/80 backdrop-blur-sm flex flex-col fixed h-screen">
        
//         {/* Logo */}
//         <div className="p-6 border-b border-blue-700/30">
//           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//             HireMind.ai
//           </h1>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href;

//             return (
//               <motion.button
//                 key={item.label}
//                 whileHover={{ x: 4 }}
//                 onClick={() => router.push(item.href)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isActive
//                     ? 'bg-blue-600/20 border border-blue-600/50 text-blue-300 shadow-lg shadow-blue-600/20'
//                     : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
//                 }`}
//               >
//                 <Icon size={20} />
//                 <span className="text-sm font-medium">{item.label}</span>
//               </motion.button>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 flex-1 overflow-auto p-2">
//         {children}
//       </main>
//     </div>
//   );
// }

// import AdminShell from '@/components/layout/AdminShell'
