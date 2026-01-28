import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    FileText,
    CreditCard,
    Info,
    Mail,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getMenuItems = () => {
        const common = [
            { path: '/about', icon: Info, label: 'About Us' },
            { path: '/contact', icon: Mail, label: 'Contact Support' },
        ];

        if (!user) return common;

        const adminItems = [
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
            { path: '/admin/customers', icon: Users, label: 'Customers' },
            { path: '/admin/policies', icon: ShieldCheck, label: 'Policies' },
        ];

        const agentItems = [
            { path: '/agent/dashboard', icon: LayoutDashboard, label: 'Workspace' },
            { path: '/agent/customers', icon: Users, label: 'Customers' },
            { path: '/agent/policies', icon: ShieldCheck, label: 'Policies' },
            { path: '/agent/claims', icon: FileText, label: 'Claims' },
        ];

        const customerItems = [
            { path: '/customer/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
            { path: '/customer/policies', icon: ShieldCheck, label: 'Browse Policies' },
            { path: '/customer/claims', icon: FileText, label: 'My Claims' },
            { path: '/customer/payments', icon: CreditCard, label: 'Payments' },
        ];

        let roleItems = [];
        if (user.role === 'ROLE_ADMIN') roleItems = adminItems;
        else if (user.role === 'ROLE_AGENT') roleItems = agentItems;
        else roleItems = customerItems;

        return [...roleItems, ...common];
    };

    const menuItems = getMenuItems();

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 z-20 flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-3 text-primary-400 mb-8">
                    <ShieldCheck className="w-8 h-8" />
                    <span className="text-xl font-bold text-white">InsureX</span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
