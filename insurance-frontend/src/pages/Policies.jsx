import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Shield, ShoppingCart, Users } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Policies = () => {
    const { user } = useAuth();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [customer, setCustomer] = useState(null);
    // Agent specific state
    const [agentCustomers, setAgentCustomers] = useState([]);
    const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    const [formData, setFormData] = useState({
        policyName: '',
        policyDescription: '',
        coverageAmount: '',
        premiumAmount: '',
        durationInMonths: ''
    });

    useEffect(() => {
        fetchPolicies();
        if (user?.role === 'ROLE_CUSTOMER' && user?.id) {
            fetchCustomer();
        }
        if (user?.role === 'ROLE_AGENT') {
            fetchAgentCustomers();
        }
    }, [user]);

    const fetchAgentCustomers = async () => {
        try {
            const response = await axios.get('/customers');
            setAgentCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers for agent:', error);
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await axios.get(`/customers/user/${user.id}`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer record:', error);
        }
    };

    const fetchPolicies = async () => {
        try {
            const response = await axios.get('/policies');
            setPolicies(response.data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPolicy) {
                await axios.put(`/policies/${editingPolicy.id}`, formData);
            } else {
                await axios.post('/policies', formData);
            }
            fetchPolicies();
            closeModal();
        } catch (error) {
            console.error('Error saving policy:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                await axios.delete(`/policies/${id}`);
                fetchPolicies();
            } catch (error) {
                console.error('Error deleting policy:', error);
            }
        }
    };

    const handleEnroll = async (policyId) => {
        if (!customer) {
            alert('Customer profile not found. Please complete your profile first.');
            return;
        }
        try {
            await axios.post(`/enrollments/customer/${customer.id}/policy/${policyId}`);
            alert('Successfully enrolled in policy!');
        } catch (error) {
            console.error('Error enrolling in policy:', error);
            alert('Enrollment failed. Please try again.');
        }
    };

    const handleAgentEnrollInit = (policyId) => {
        setSelectedPolicyId(policyId);
        setEnrollmentModalOpen(true);
    };

    const confirmAgentEnroll = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/enrollments/customer/${selectedCustomerId}/policy/${selectedPolicyId}`);
            alert('Successfully enrolled customer in policy!');
            setEnrollmentModalOpen(false);
            setSelectedCustomerId('');
            setSelectedPolicyId(null);
        } catch (error) {
            console.error('Error enrolling customer:', error);
            alert('Enrollment failed. Please try again.');
        }
    };

    const openModal = (policy = null) => {
        if (policy) {
            setEditingPolicy(policy);
            setFormData({
                policyName: policy.policyName,
                policyDescription: policy.policyDescription,
                coverageAmount: policy.coverageAmount,
                premiumAmount: policy.premiumAmount,
                durationInMonths: policy.durationInMonths
            });
        } else {
            setEditingPolicy(null);
            setFormData({
                policyName: '',
                policyDescription: '',
                coverageAmount: '',
                premiumAmount: '',
                durationInMonths: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPolicy(null);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8 bg-slate-800/20 p-6 rounded-2xl border border-white/5">
                <div>
                    <h1 className="text-3xl font-bold text-white">Insurance Plans</h1>
                    <p className="text-slate-400 mt-1">Explore and manage our coverage options</p>
                </div>
                {user?.role === 'ROLE_ADMIN' && (
                    <button
                        onClick={() => openModal()}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus className="w-5 h-5" /> Add New Policy
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map((policy) => (
                        <div key={policy.id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 flex flex-col hover:border-primary-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary-400" />
                                </div>
                                {user?.role === 'ROLE_ADMIN' && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(policy)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(policy.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{policy.policyName}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">{policy.policyDescription}</p>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6 mb-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Coverage</p>
                                    <p className="text-lg font-bold text-white">${policy.coverageAmount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Premium</p>
                                    <p className="text-lg font-bold text-primary-400">${policy.premiumAmount}/yr</p>
                                </div>
                            </div>

                            {user?.role === 'ROLE_CUSTOMER' && (
                                <button
                                    onClick={() => handleEnroll(policy.id)}
                                    className="w-full py-3 bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-4 h-4" /> Enroll Now
                                </button>
                            )}
                            {user?.role === 'ROLE_AGENT' && (
                                <button
                                    onClick={() => handleAgentEnrollInit(policy.id)}
                                    className="w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Users className="w-4 h-4" /> Enroll Customer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingPolicy ? 'Edit Policy' : 'Create New Policy'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Policy Name</label>
                        <input
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.policyName}
                            onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none"
                            value={formData.policyDescription}
                            onChange={(e) => setFormData({ ...formData, policyDescription: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Coverage Amount ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                value={formData.coverageAmount}
                                onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Premium Amount ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                value={formData.premiumAmount}
                                onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Duration (Months)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.durationInMonths}
                            onChange={(e) => setFormData({ ...formData, durationInMonths: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl mt-4 transition-all"
                    >
                        {editingPolicy ? 'Update Policy' : 'Create Policy'}
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={enrollmentModalOpen}
                onClose={() => setEnrollmentModalOpen(false)}
                title="Enroll Customer in Policy"
            >
                <form onSubmit={confirmAgentEnroll} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Select Customer</label>
                        <select
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                        >
                            <option value="">Choose a customer...</option>
                            {agentCustomers.map(c => (
                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4 transition-all"
                    >
                        Confirm Enrollment
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Policies;
