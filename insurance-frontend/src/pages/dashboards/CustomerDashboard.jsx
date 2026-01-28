import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, FileText, CreditCard, Bell, ChevronRight, Lock, ArrowRight } from 'lucide-react';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Secure & Protected</h1>
                    <p className="text-slate-400 text-lg max-w-xl">Your coverage is our priority. Everything you need to manage your policies is right here.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={() => navigate('/customer/claims')}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all"
                    >
                        File a Claim
                    </button>
                    <button
                        onClick={() => navigate('/customer/policies')}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all"
                    >
                        Browse Plans
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Active Policies</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { name: 'Comprehensive Health', id: 'POL-7821', type: 'Health', status: 'Active' },
                                { name: 'Modern Auto Care', id: 'POL-1092', type: 'Vehicle', status: 'Renewing' },
                            ].map((policy, i) => (
                                <div key={i} className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full border border-green-500/20">
                                            {policy.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{policy.name}</h3>
                                    <p className="text-slate-500 text-xs mb-4">Policy ID: {policy.id}</p>
                                    <div className="flex items-center gap-1 text-primary-400 text-sm font-bold group-hover:gap-2 transition-all">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Claims</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Dental Checkup', date: 'Oct 12, 2025', amount: '$420', status: 'Approved' },
                            ].map((claim, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{claim.name}</p>
                                            <p className="text-xs text-slate-500">{claim.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">{claim.amount}</p>
                                        <p className="text-[10px] text-green-500 font-bold uppercase">{claim.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-primary-600 p-8 rounded-3xl text-white shadow-xl shadow-primary-900/20">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="w-6 h-6" /> Next Payment
                        </h2>
                        <p className="text-4xl font-bold mb-2">$840.50</p>
                        <p className="text-primary-100 text-sm mb-8">Due on November 15, 2025</p>
                        <button
                            onClick={() => navigate('/customer/payments')}
                            className="w-full py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            Pay Now <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Bell className="w-5 h-5 text-yellow-400" />
                            Notifications
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Security Alert', msg: 'New login from Chrome on Windows.', time: '1h ago' },
                                { title: 'Policy Ready', msg: 'Your auto policy is ready for review.', time: 'Yesterday' },
                            ].map((note, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-bold text-white">{note.title}</p>
                                        <span className="text-[10px] text-slate-500 uppercase">{note.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{note.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
