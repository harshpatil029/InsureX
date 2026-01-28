import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Payments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/payments');
            setPayments(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (paymentId) => {
        try {
            await axios.post(`/payments/${paymentId}/process`);
            fetchPayments();
        } catch (err) {
            setError(err.message || 'Failed to process payment');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredPayments = filter === 'all'
        ? payments
        : payments.filter(p => p.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Payments</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        Completed
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {payment.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ${payment.amount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(payment.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {payment.status === 'pending' && (
                                                <button
                                                    onClick={() => handlePayment(payment.id)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Process
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
