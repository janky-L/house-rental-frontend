import request from "./request";

export default {
  list(params) {
    return request.get("/cost/list", { params });
  },
  add(data) {
    return request.post("/cost/add", data);
  },
  update(data) {
    return request.post("/cost/update", data);
  },
  delete(id) {
    return request.delete(`/cost/delete/${id}`);
  }
};
