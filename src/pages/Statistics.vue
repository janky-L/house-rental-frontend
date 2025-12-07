<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <span>{{ new Date().getFullYear() }}年{{ new Date().getMonth() + 1 }}月</span>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshData">刷新</el-button>
        </div>
      </template>

      <h2>本月应收租</h2>
      
      <el-table :data="list" stripe border size="small" :header-cell-style="{ background: '#f7f8fa' }" style="margin-top:20px">
        <el-table-column prop="roomNumber" label="房间" align="center"/>
        <el-table-column prop="recordMonth" label="月份" align="center"/>
        <el-table-column prop="rentDay" label="收租日" align="center"/>
        <el-table-column prop="rentFee" label="月租金" align="center"/>
        <el-table-column prop="waterNum" label="用水量(吨)" align="center"/>
        <el-table-column prop="waterFee" label="水费" align="center"/>
        <el-table-column prop="eleNum" label="用电量(度)" align="center"/>
        <el-table-column prop="eleFee" label="电费" align="center"/>
        <el-table-column prop="otherFee" label="其他" align="center"/>
        <el-table-column prop="totalFee" label="应收(元)" align="center" width="120"/>
        <el-table-column prop="createAt" label="状态" align="center" width="200">
          <template #default="scope">
            <el-tag :type="scope.row.status === 2 ? 'success' : 'danger'">
              {{ scope.row.status === 2 ? '已缴费' : scope.row.status === 1 ? '未缴费' : '未抄水电' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue"
import dayjs from "dayjs"
import api from "../api/stat"

const list = ref([])

onMounted(() => {
  api.stat().then(res => list.value = res)
})

// 刷新数据
function refreshData() {
  api.stat().then(res => list.value = res)
}



defineOptions({
  name: "Statistics"
})
</script>
