<template>
  <div>
    <el-card>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>租房历史记录</h2>
        <el-button type="success" @click="exportExcel">导出 Excel</el-button>
      </div>

      <!-- 查询条件 -->
        <el-form :inline="true" :model="query" style="margin: 15px 0">
        <el-form-item label="房号">
            <el-input v-model="query.roomNumber" placeholder="输入房号" clearable />
        </el-form-item>

        <el-form-item label="入住时间范围">
            <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            start-placeholder="开始"
            end-placeholder="结束"
            range-separator="至"
            value-format="YYYY-MM-DD"
            clearable
            />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="load">查询</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
        </el-form>


      <!-- 表格 -->
      <el-table :data="list" stripe border>
        <el-table-column prop="roomNumber" label="房号" align="center" />
        <el-table-column prop="tenantName" label="租户" align="center" />
        <el-table-column prop="phone" label="电话" align="center" width="120" />
        <el-table-column prop="idCard" label="身份证" align="center" width="180" />

        <el-table-column label="入住时间" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.startDate) }}
          </template>
        </el-table-column>

        <el-table-column label="退房时间" align="center">
          <template #default="scope">
            {{ formatDate(scope.row.endDate) }}
          </template>
        </el-table-column>

        <el-table-column prop="rent" label="租金" align="center" width="100" />

        <el-table-column label="创建时间" align="center" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top: 15px; text-align: right;">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :page-size="query.pageSize"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import dayjs from "dayjs"
import * as XLSX from "xlsx"
import historyApi from "../api/history"

const list = ref([])
const total = ref(0)

const year = new Date().getFullYear();
const month = String(new Date().getMonth() + 1).padStart(2, '0');
const day = String(dayjs().date()).padStart(2, '0');

const defaultStartDate = `${year}-01-01`;
const defaultEndDate = `${year}-${month}-${day}`;

// 查询 + 分页参数
const query = reactive({
  roomNumber: "",
  dateRange: [defaultStartDate, defaultEndDate],   // 新增：日期范围
  inStartDate: "",
  inEndDate: "",
  pageNum: 1,
  pageSize: 10
})

onMounted(load)

function load() {
    if (query.dateRange && query.dateRange.length === 2) {
        query.inStartDate = query.dateRange[0]
        query.inEndDate = query.dateRange[1]
    } else {
        query.inStartDate = ""
        query.inEndDate = ""
    }
    historyApi.list(query).then((res) => {
    list.value = res.records
    total.value = res.total
    })
}

function reset() {
    Object.assign(query, {
    roomNumber: "",
    dateRange: [],
    inStartDate: "",
    inEndDate: "",
    pageNum: 1
    })
    load()
}

function handlePageChange(page) {
  query.pageNum = page
  load()
}

function handleSizeChange(size) {
  query.pageSize = size
  load()
}

function formatDate(date) {
  return date ? dayjs(date).format("YYYY-MM-DD") : ""
}

function formatDateTime(date) {
  return date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : ""
}

function exportExcel() {
  const data = list.value.map(row => ({
    房号: row.roomNumber,
    租户: row.tenantName,
    电话: row.phone,
    身份证: row.idCard,
    入住时间: formatDate(row.startDate),
    退房时间: formatDate(row.endDate),
    租金: row.rent,
    创建时间: formatDateTime(row.createTime)
  }))

  const sheet = XLSX.utils.json_to_sheet(data)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, "租房历史")

  XLSX.writeFile(book, "租房历史.xlsx")
}

defineOptions({
  name: "HistoryList"
})
</script>
