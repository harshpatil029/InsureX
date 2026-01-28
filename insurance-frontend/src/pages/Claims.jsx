import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, XCircle, Search, Loader2, FileText, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Claims = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policies, setPolicies] = useState([]); // Customer's policies
    const [formData, setFormData] = useState({
        customerPolicyId: '',
        claimAmount: '',
        description: ''
    });

    useEffect(() => {
        fetchClaims();
        if (user?.role === 'ROLE_CUSTOMER') {
            fetchUserPolicies();
        }
    }, [user]);

    const fetchUserPolicies = async () => {
        try {
            const custRes = await axios.get(`/customers/user/${user.id}`);
            const customerId = custRes.data.id;
            const polRes = await axios.get(`/enrollments/customer/${customerId}`);
            setPolicies(polRes.data);
        } catch (error) {
            console.error('Error fetching policies for claims:', error);
        }
    };

    const fetchClaims = async () => {
        try {
            const response = await axios.get('/claims');
            setClaims(response.data);
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/claims', formData);
            fetchClaims();
            closeModal();
        } catch (error) {
            console.error('Error filing claim:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`/claims/${id}/status`, null, { params: { status } });
            fetchClaims();
        } catch (error) {
            console.error('Error updating claim status:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ customerPolicyId: '', claimAmount: '', description: '' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8 bg-slate-800/20 p-6 rounded-2xl border border-white/5">
                <div>
                    <h1 className="text-3xl font-bold text-white">Claims History</h1>
                    <p className="text-slate-400 mt-1">
                        {user?.role === 'ROLE_ADMIN' ? 'Review and process all system claims' : 'Track and manage your insurance claims'}
                    </p>
                </div>
                {user?.role === 'ROLE_CUSTOMER' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus className="w-5 h-5" /> File New Claim
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {claims.map((claim) => (
                        <div key={claim.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-primary-500/30 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-primary-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white">Claim #{claim.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(claim.status)}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-2">{claim.description}</p>
                                        <div className="flex gap-4 text-xs text-slate-500">
                                            <span>Policy ID: {claim.customerPolicyId}</span>
                                            <span>Date: {claim.claimDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 min-w-[150px]">
                                    <p className="text-2xl font-bold text-white">${claim.claimAmount}</p>
                                    <div className="flex gap-2">
                                        {user?.role === 'ROLE_ADMIN' && claim.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
                                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {claims.length === 0 && (
                        <div className="py-20 text-center text-slate-500 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                            No claims filed yet.
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="File New Claim"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Select Enrolled Policy</label>
                        <select
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.customerPolicyId}
                            onChange={(e) => setFormData({ ...formData, customerPolicyId: e.target.value })}
                        >
                            <option value="">Choose a policy...</option>
                            {policies.map(p => (
                                <option key={p.id} value={p.id}>{p.policy.policyName} (#{p.id})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Claim Amount ($)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            placeholder="0.00"
                            value={formData.claimAmount}
                            onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none"
                            placeholder="Describe the incident..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl mt-4 transition-all"
                    >
                        Submit Claim Request
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Claims;
