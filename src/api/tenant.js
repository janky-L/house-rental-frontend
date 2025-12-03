import request from "./request";

export default {
  list(params) {
    return request.get("/tenant/list", { params });
  },
  add(data) {
    return request.post("/tenant/add", data);
  },
  update(data) {
    return request.post("/tenant/update", data);
  },
  remove(id) {
    return request.delete(`/tenant/delete/${id}`);
  }
};
