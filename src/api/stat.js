import request from "./request";

export default {
  stat() {
    return request.get("/stat/roomReport");
  },
  report (params) {
    return request.get("/stat/waterEleReport", { params })
  }
};
