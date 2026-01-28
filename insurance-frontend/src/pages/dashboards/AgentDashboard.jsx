import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus, FileCheck, ClipboardList, Zap, ArrowRight, Star } from 'lucide-react';

const AgentDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-primary-600/20 to-blue-600/20 p-8 rounded-3xl border border-primary-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white">Agent Workspace</h1>
                    <p className="text-slate-300 mt-2 max-w-2xl">Manage your clients, process applications, and track your performance for the current quarter.</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'New Clients', value: '12', icon: UserPlus, color: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Policy Quotes', value: '28', icon: FileCheck, color: 'bg-primary-500/20 text-primary-400' },
                    { label: 'Performance', value: '94%', icon: Star, color: 'bg-yellow-500/20 text-yellow-400' },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${item.color}`}>
                            <item.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Zap className="text-yellow-400 w-5 h-5" />
                            Quick Actions
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Onboard Client', icon: UserPlus, desc: 'Add new customer info', action: () => navigate('/agent/customers') },
                            { label: 'View Claims', icon: ClipboardList, desc: 'Check claim status', action: () => navigate('/agent/claims') },
                            { label: 'Enroll Client', icon: FileCheck, desc: 'Assign new policy', action: () => navigate('/agent/policies') },
                            { label: 'Performance', icon: Star, desc: 'View monthly goals', action: () => { } },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={action.action}
                                className="flex flex-col items-start p-6 bg-slate-900/40 rounded-2xl border border-white/5 hover:border-primary-500/50 transition-all group text-left"
                            >
                                <action.icon className="w-6 h-6 text-slate-500 group-hover:text-primary-400 mb-3 transition-colors" />
                                <p className="text-sm font-bold text-white mb-1">{action.label}</p>
                                <p className="text-xs text-slate-500">{action.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                    <h2 className="text-xl font-bold text-white mb-8">Upcoming Meetings</h2>
                    <div className="space-y-6">
                        {[
                            { name: 'Robert Fox', time: '10:30 AM', type: 'Policy Review' },
                            { name: 'Jane Cooper', time: '02:00 PM', type: 'Life Insurance' },
                            { name: 'Floyd Miles', time: '04:15 PM', type: 'Claim Settlement' },
                        ].map((meeting, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-primary-400 font-bold">
                                        {meeting.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{meeting.name}</p>
                                        <p className="text-xs text-slate-500">{meeting.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{meeting.time}</p>
                                    <button className="text-xs text-primary-400 hover:text-primary-300">Reschedule</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
