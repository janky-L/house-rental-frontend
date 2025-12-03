import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'
import Login from '../pages/Login.vue'
import CostList from '../pages/CostList.vue'
import TenantList from '../pages/TenantList.vue'
import RoomList from '../pages/RoomList.vue'
import Statistics from '../pages/Statistics.vue'
import HistoryList from '../pages/HistoryList.vue'
import WaterEleRecord from '../pages/waterEleRecord.vue'
import Report from '../pages/Report.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/cost', component: CostList },
      { path: '/history', component: HistoryList },
      { path: '/tenant', component: TenantList },
      { path: '/room', component: RoomList },
      { path: '/stat', component: Statistics },
      { path: '/waterEleRecord', component: WaterEleRecord },
      { path: '/report', component: Report }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
