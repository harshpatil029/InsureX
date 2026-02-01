import api from '../utils/api';

// Auth API calls
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    forgotPassword: async (data) => {
        const response = await api.post('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },

    validateResetToken: async (token) => {
        const response = await api.get(`/auth/validate-reset-token?token=${token}`);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// Customer API calls
export const customerAPI = {
    getAll: async () => {
        const response = await api.get('/customers');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    getByUserId: async (userId) => {
        const response = await api.get(`/customers/user/${userId}`);
        return response.data;
    },

    create: async (customerData) => {
        const response = await api.post('/customers', customerData);
        return response.data;
    },

    update: async (id, customerData) => {
        const response = await api.put(`/customers/${id}`, customerData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },

    deactivate: async (id) => {
        const response = await api.post(`/customers/${id}/deactivate`);
        return response.data;
    },
};

// Policy API calls
export const policyAPI = {
    getAll: async () => {
        const response = await api.get('/policies');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/policies/${id}`);
        return response.data;
    },

    create: async (policyData) => {
        const response = await api.post('/policies', policyData);
        return response.data;
    },

    update: async (id, policyData) => {
        const response = await api.put(`/policies/${id}`, policyData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/policies/${id}`);
        return response.data;
    },
};

// Claim API calls
export const claimAPI = {
    getAll: async () => {
        const response = await api.get('/claims');
        return response.data;
    },

    getByEnrollment: async (enrollmentId) => {
        const response = await api.get(`/claims/enrollment/${enrollmentId}`);
        return response.data;
    },

    create: async (claimData) => {
        const response = await api.post('/claims', claimData);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/claims/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },
};

// Customer Policy (Enrollment) API calls
// Customer Policy (Enrollment) API calls - FIXED to match Controller
export const customerPolicyAPI = {
    enroll: async (enrollmentData) => {
        // Backend expects: POST /enrollments/customer/{customerId}/policy/{policyId}
        const { customerId, policyId } = enrollmentData;
        const response = await api.post(`/enrollments/customer/${customerId}/policy/${policyId}`);
        return response.data;
    },

    getByCustomer: async (customerId) => {
        const response = await api.get(`/enrollments/customer/${customerId}`);
        return response.data;
    },

    getById: async (id) => {
        // Backend might not have direct getById exposed in the snippet, 
        // but assuming standard REST if it exists. 
        // IF NOT, this might fail, but user isn't using it yet.
        // Based on controller, only getByCustomer is exposed.
        const response = await api.get(`/enrollments/${id}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/enrollments/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },
};

// Payment API calls
export const paymentAPI = {
    create: async (paymentData) => {
        const response = await api.post('/customer-payments', paymentData);
        return response.data;
    },

    getByEnrollment: async (enrollmentId) => {
        const response = await api.get(`/customer-payments/enrollment/${enrollmentId}`);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/customer-payments');
        return response.data;
    },
};
