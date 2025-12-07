<template>
  <div>
    <h2>本年度水电用量统计</h2>

    <div class="table-wrapper">
      <!-- ================== 用水量 ================== -->
      <el-card class="table-card">
        <h3>{{ year }}年 用水量排行</h3>

        <el-table :data="waterList" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template #default="props">
              <div class="inner-table-wrapper">
                <el-table class="inner-table"  :data="props.row.detail" size="small" border stripe>
                  <el-table-column prop="month" label="月份" align="center" />
                  <el-table-column prop="value" label="用量(吨)" align="center" />
                </el-table>
              </div>
            </template>
          </el-table-column>

          <el-table-column type="index" label="排名" width="60" align="center" />
          <el-table-column prop="building" label="楼栋" align="center"/>
          <el-table-column prop="roomNumber" label="房号" align="center" />
          <el-table-column prop="used" label="年度用水量(吨)" align="center" />
        </el-table>
      </el-card>

      <!-- ================== 用电量 ================== -->
      <el-card class="table-card">
        <h3>{{ year }}年 用电量排行</h3>

        <el-table :data="eleList" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template #default="props">
              <div class="inner-table-wrapper">
                <el-table class="inner-table" :data="props.row.detail" size="small" border stripe>
                  <el-table-column prop="month" label="月份" align="center" />
                  <el-table-column prop="value" label="用量(度)" align="center" />
                </el-table>
              </div>
            </template>
          </el-table-column>

          <el-table-column type="index" label="排名" width="60" align="center" />
          <el-table-column prop="building" label="楼栋" align="center"/>
          <el-table-column prop="roomNumber" label="房号" align="center" />
          <el-table-column prop="used" label="年度用电量(度)" align="center" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import statApi from "../api/stat"
import dayjs from "dayjs"
const waterList = ref([])
const eleList = ref([])

//水电记录查询参数
const year = new Date().getFullYear()
const month = String(new Date().getMonth() + 1).padStart(2, '0')
const day = String(dayjs().date()).padStart(2, '0');

// 前一年，年度统计查询参数
const prevYear = year - 1;
const defaultStartDate = `${prevYear}-12-01`;
const defaultEndDate = `${year}-${month}-${day}`;
const query = reactive({
  startDate: defaultStartDate,
  endDate: defaultEndDate
})

// 加载数据
onMounted(() => {
  load()
})

function load() {
  statApi.report(query).then(res => {
    waterList.value = res.waterList
    eleList.value = res.eleList
  })
}

defineOptions({
  name: "Report"
})
</script>

<style scoped>
.table-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap; /* 小屏自动换行 */
  align-items: flex-start; /* ⭐️ 阻止两个卡片高度同步 */
}

.table-card {
  width: 48%; /* 两列布局 */
  min-width: 350px;
}

.inner-table-wrapper {
  background: #ecf0f0;  /* 背景色（可自定义） */
  padding: 2px;         /* 让小表格不顶边 */
  border-radius: 1px;
  border: 1px solid #bdc3c7;
}

/* ⭐ 深度覆盖小表格背景色 */
::v-deep(.inner-table .el-table__body-wrapper) {
  background-color: #ecf0f0;  /* 整体背景 */
}

::v-deep(.inner-table .el-table__row) {
  background-color: #ecf0f0 !important; /* 每一行背景色 */
}

::v-deep(.inner-table .el-table__cell) {
  background-color: #ecf0f0 !important; /* 单元格背景 */
  border: 1px solid #bdc3c7;
}
</style>

