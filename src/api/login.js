const apiURL = process.env.REACT_APP_API_URL
const API_URL = `${apiURL}api`;
console.log("API_URL", API_URL);

const getHeaders = ({token}) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

export const apiService = {
    getUsers: async ({token}) => {
        const response = await fetch(`${API_URL}/user/list`, {
            method: 'GET',
            headers: getHeaders({token})
        });
        return handleResponse(response);
    },

    updateUserRole: async (userId, role) => {
        const response = await fetch(`${API_URL}/user/update-role/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });
        return handleResponse(response);
    },

    registerUser: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    loginUser: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const data = await handleResponse(response);
        return data;
    },

    forgetPassword: async (email) => {
        const response = await fetch(`${API_URL}/auth/forget-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        return handleResponse(response);
    },

    resetCodeCheck: async (data) => {
        const response = await fetch(`${API_URL}/auth/reset-code-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    
    resetPassword: async (data) => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    
    verifyEmail: async (data) => {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    meUser: async ({token}) => {
        const response = await fetch(`${API_URL}/user/me`, {
            method: 'GET',
            headers: getHeaders({token})
        });
        return handleResponse(response);
    },

};