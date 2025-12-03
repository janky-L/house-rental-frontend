import request from "./request";

export default {
  // ⭐ 查询房间列表
  list(params) {
    return request.get("/room/list", { params });
  },
  add(data) {
    return request.post("/room/add", data);
  },
  update(data) {
    return request.post("/room/update", data);
  },
  checkIn(data) {
    return request.post("/room/checkIn", data);
  },
  checkOut(id) {
    return request.get('/room/checkOut/' + id);
  },
  remove(id) {
    return request.delete('/room/delete/' + id);
  }
};
