import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
            <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search for policies, claims..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
            </div>


            <div className="flex items-center gap-6">
                <div className="h-8 w-px bg-slate-800"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white">{user?.email}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-400" />
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Navbar;
