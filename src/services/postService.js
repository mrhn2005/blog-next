import axios from "@/lib/axios";

export const postService = {
    getAll,
    getById,
    delete: _delete
};

function getAll(pageNumber,searchTerm) {
    return axios.get('/api/posts', { params: { page: pageNumber, q:searchTerm } });
}

function getById(id) {
    return axios.get('/api/posts/'+id);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return axios.delete('/api/posts/'+id)
}
