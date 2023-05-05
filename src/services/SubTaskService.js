import http from "../http-common";

const getAll = taskId => {
    return http.get(`/subtasks?taskId=${taskId}`);
};

const get = id => {
    return http.get(`/subtasks/${id}`);
};

const create = data => {
    return http.post("/subtasks", data);
};

const update = (id, data) => {
    return http.put(`/subtasks/${id}`, data);
};

const remove = id => {
    return http.delete(`/subtasks/${id}`);
};

const removeAll = () => {
    return http.delete('/subtasks');
};

const functions = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll
};

export default functions;