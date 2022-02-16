import { fetchWrapper } from "@/helpers/fetch-wrapper";
import axios from "@/lib/axios";


const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`;

export const postService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll(pageNumber,searchTerm) {
    return axios.get('/api/posts', { params: { page: pageNumber, q:searchTerm } });
}

function getById(id) {
    return axios.get('/api/posts/'+id);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return axios
    .post('/register', props)
    .then(() => revalidate())
    .catch(error => {
        if (error.response.status !== 422) throw error

        setErrors(Object.values(error.response.data.errors).flat())
    })
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return axios.delete('/api/posts/'+id)
}
