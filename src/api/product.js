const apiURL = process.env.REACT_APP_API_URL
const API_URL = `${apiURL}api/product`

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
};

const getHeaders = ({ token }) => ({
    'Authorization': `Bearer ${token}`
});

export const productService = {
    getAllProducts: async () => {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET'
        });
        return handleResponse(response);
    },

    getProductById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET'
        });
        return handleResponse(response);
    },

    addProduct: async (productData, { token }) => {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: getHeaders({ token }),
            body: productData
        });
        return handleResponse(response);
    },

    updateProduct: async (id, productData, { token }) => {
        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT',
            headers: getHeaders({ token }),
            body: productData
        });
        return handleResponse(response);
    },

    deleteProduct: async (id, { token }) => {
        const response = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: getHeaders({ token })
        });
        return handleResponse(response);
    }
};