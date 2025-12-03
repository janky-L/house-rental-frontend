<template>
  <div class="login-container">
    <el-card class="box">
      <h2 style="text-align:center">房屋租赁系统(房东)</h2>

      <el-form :model="form" label-width="70px">
        <el-form-item label="账号">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>

        <el-button type="primary" style="width:100%" @click="login">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store";
import request from "../api/request";

const router = useRouter();
const store = useUserStore();

const form = reactive({
  username: "",
  password: ""
});

const login = async () => {
  const res = await request.post("/auth/login", form);
  store.setToken(res.token);

  router.push("/stat"); // 登录成功进入系统
};

</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.box {
  width: 350px;
}

/* 如果想去掉背景色边缘 */
:deep(.el-input__wrapper) {
  padding-left: 0;
  padding-right: 0;
}
</style>
