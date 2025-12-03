import request from "./request"

export default {
  list(params) {
    return request.get("/waterEleRecord/list", { params })
  },
  add(data) {
    return request.post("/waterEleRecord/add", data)
  },
  update(data) {
    return request.post("/waterEleRecord/update", data)
  },
  delete(id) {
    return request.delete(`/waterEleRecord/delete/${id}`)
  }
}
