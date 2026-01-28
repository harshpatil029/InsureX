import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, TrendingUp, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: '1,240',
        activePolicies: '4,500',
        totalRevenue: '$1.2M',
        pendingClaims: '24'
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/20 p-8 rounded-3xl border border-white/5">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time performance metrics and user activity</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        System Healthy
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary-400', bg: 'bg-primary-500/10' },
                    { label: 'Active Policies', value: stats.activePolicies, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Total Revenue', value: stats.totalRevenue, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Pending Claims', value: stats.pendingClaims, icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Activity className="text-primary-400 w-5 h-5" />
                        Recent System Activity
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-white/5 hover:bg-slate-900/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-200">New agent account created <span className="font-bold text-white">#A-421</span></p>
                                        <p className="text-xs text-slate-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <button className="text-primary-400 hover:text-primary-300 transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                    <h2 className="text-xl font-bold text-white mb-6">User Distribution</h2>
                    <div className="space-y-6">
                        {[
                            { label: 'Customers', count: 850, percentage: 68, color: 'bg-primary-500' },
                            { label: 'Agents', count: 320, percentage: 25, color: 'bg-blue-500' },
                            { label: 'Admins', count: 70, percentage: 7, color: 'bg-green-500' },
                        ].map((dist, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{dist.label}</span>
                                    <span className="text-white font-bold">{dist.count}</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dist.percentage}%` }}
                                        className={`h-full ${dist.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
