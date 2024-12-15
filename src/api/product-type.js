const apiURL = process.env.REACT_APP_API_URL
const API_URL =`${apiURL}api/product-type`

const getHeaders = ({ token }) => {
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

export const productTypeService = {
    getAllProductTypes: async () => {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',        });
        return handleResponse(response);
    },

    getProductTypeById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
        });
        return handleResponse(response);
    },

    addProductType: async (productTypeData, { token }) => {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: getHeaders({ token }),
            body: JSON.stringify(productTypeData)
        });
        return handleResponse(response);
    },

    updateProductType: async (id, productTypeData, { token }) => {
        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT',
            headers: getHeaders({ token }),
            body: JSON.stringify(productTypeData)
        });
        return handleResponse(response);
    },

    deleteProductType: async (id, { token }) => {
        const response = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: getHeaders({ token })
        });
        return handleResponse(response);
    }
};