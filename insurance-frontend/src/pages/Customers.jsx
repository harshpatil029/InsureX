import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit, Trash2, Search, Loader2, User, Phone, MapPin } from 'lucide-react';
import Modal from '../components/Modal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, formData);
            } else {
                await api.post('/customers', formData);
            }
            fetchCustomers();
            closeModal();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}`);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const openModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                dateOfBirth: customer.dateOfBirth
            });
        } else {
            setEditingCustomer(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                dateOfBirth: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8 bg-slate-800/20 p-6 rounded-2xl border border-white/5">
                <div>
                    <h1 className="text-3xl font-bold text-white">Customer Directory</h1>
                    <p className="text-slate-400 mt-1">Manage client information and registrations</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
                >
                    <Plus className="w-5 h-5" /> Add Customer
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-700/50 border-b border-slate-700">
                                <th className="px-6 py-4 text-slate-300 font-semibold uppercase tracking-wider text-xs">Customer</th>
                                <th className="px-6 py-4 text-slate-300 font-semibold uppercase tracking-wider text-xs">Contact</th>
                                <th className="px-6 py-4 text-slate-300 font-semibold uppercase tracking-wider text-xs">Address</th>
                                <th className="px-6 py-4 text-slate-300 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-700/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary-400 font-bold">
                                                {customer.firstName[0]}{customer.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{customer.firstName} {customer.lastName}</p>
                                                <p className="text-slate-500 text-xs">ID: {customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <User className="w-3 h-3" /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Phone className="w-3 h-3" /> {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <MapPin className="w-3 h-3" /> {customer.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(customer)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(customer.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {customers.length === 0 && (
                        <div className="py-20 text-center text-slate-500">
                            No customers found. Click "Add Customer" to get started.
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                            <input
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                            <input
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                        <input
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
                        <input
                            required
                            type="date"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl mt-4 transition-all"
                    >
                        {editingCustomer ? 'Update Customer' : 'Add Customer'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
