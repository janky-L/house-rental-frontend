import request from "./request"

export default {
  list(params) {
    return request.get("/history/list", { params })
  }
}
