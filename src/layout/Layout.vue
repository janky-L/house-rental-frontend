<template>
  <el-container style="height: 100vh">

    <!-- 左侧菜单 -->
    <el-aside width="200px" class="aside">
      <el-menu
        :default-active="active"
        class="el-menu-vertical-demo"
        @select="addTab"
      >
        <el-menu-item index="/stat">本月应收租</el-menu-item>
        <el-menu-item index="/tenant">租户管理</el-menu-item>
        <el-menu-item index="/room">房间管理</el-menu-item>
        <el-menu-item index="/cost">缴费管理</el-menu-item>
        <el-menu-item index="/history">租房记录</el-menu-item>
        <el-menu-item index="/waterEleRecord">水电表管理</el-menu-item>
        <el-menu-item index="/report">水电用量统计</el-menu-item>
        <el-menu-item index="/login" @click="logout">退出登录</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主布局 -->
    <el-container>

      <!-- 顶部 -->
      <el-header class="header">

        <!-- 顶部标题部分 -->
        <div class="header-inner">
          <div class="brand">
            <img src="/src/assets/vue.svg" class="logo" />
            <span class="title">房东房屋租赁系统</span>
          </div>
          <div class="header-actions">
            <el-avatar class="avatar" size="32">房东</el-avatar>
          </div>
        </div>

        <!-- Tabs 部分（重要：要放在 header 里面） -->
        <div class="tabs-wrapper">
          <el-tabs
            v-model="activeTab"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="clickTab"
          >
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.path"
              :label="tab.title"
              :name="tab.path"
            />
          </el-tabs>
        </div>

      </el-header>

      <!-- 内容区：这个地方无需改 -->
      <el-main>
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </el-main>

    </el-container>
  </el-container>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../store";

const router = useRouter();
const route = useRoute();
const store = useUserStore();

const activeTab = ref(route.path);

// tab 列表
const tabs = ref([
  {
    title: "本月应收租",
    path: "/stat",
  }
]);

// 左侧菜单当前选中项
const active = computed(() => activeTab.value);

onMounted(() => {
  addTab(route.path)
});

// 添加 Tab
const addTab = (path) => {
  const menuMap = {
    "/stat": "本月应收租",
    "/tenant": "租户管理",
    "/room": "房间管理",
    "/cost": "缴费管理",
    "/history": "租房记录",
    "/waterEleRecord": "水电表管理",
    "/report": "水电用量统计",
  };

  // 若不存在则添加
  if (!tabs.value.find((t) => t.path === path)) {
    tabs.value.push({ title: menuMap[path], path });
  }

  // 激活当前 tab + 路由跳转
  activeTab.value = path;
  router.push(path);
};

// 删除 tab
const removeTab = (path) => {
  let newTabs = tabs.value.filter((t) => t.path !== path);
  tabs.value = newTabs;

  if (activeTab.value === path) {
    // 若关闭的是当前页，跳到最后一个 tab
    const last = newTabs[newTabs.length - 1];
    activeTab.value = last.path;
    router.push(last.path);
  }
};

// 点击 tab
const clickTab = (tab) => {
  router.push(tab.props.name);
};

// 退出登录
const logout = () => {
  store.setToken("");
  router.push("/login");
};
</script>


<style scoped>
.aside {
  background: linear-gradient(180deg, #2d3a4b, #1f2a38);
  color: #fff;
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.06);
}
.header {
  background: #fff;
  line-height: 60px;
  border-bottom: 1px solid #eee;
  padding: 0;
  box-shadow: 0 1px 8px rgba(0,0,0,0.05);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.brand {
  display: flex;
  align-items: center;
}
.logo {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search {
  width: 200px;
}
.avatar {
  background: #409eff;
  color: #fff;
}
.tabs-wrapper {
  background: #fff;
  padding: 0 10px;
}
:deep(.el-tabs__header) {
  background: #fff;
}
:deep(.el-tabs--card > .el-tabs__header) {
  background: #fff;
}
</style>
