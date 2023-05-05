import http from "../http-common";

const getAll = () => {
    return http.get("/tasks");
};

const get = id => {
    return http.get(`/tasks/${id}`);
};

const getDueToday = date => {
    return http.get(`/tasks/today?date=${date}`);
};

const getDueUpcoming = date => {
    return http.get(`/tasks/upcoming?date=${date}`);
};

const getUncomplete = () => {
    return http.get("/tasks/uncomplete");
};

const create = data => {
    return http.post("/tasks", data);
};

const update = (id, data) => {
    return http.put(`/tasks/${id}`, data);
};

const remove = id => {
    return http.delete(`/tasks/${id}`);
};

const removeAll = () => {
    return http.delete(`/tasks`);
};

const functions = {
    getAll,
    get,
    getDueToday,
    getDueUpcoming,
    getUncomplete,
    create,
    update,
    remove,
    removeAll
};

export default functions;