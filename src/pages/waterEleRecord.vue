<template>
  <div>
    <el-card>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>水电记录管理</h2>

        <div style="display:flex; gap:10px;">
          <el-button type="primary" @click="openAdd">新增记录</el-button>
        </div>
      </div>

      <!-- ⭐ 查询条件 -->
      <el-form :inline="true" :model="query" style="margin: 20px 0;">
        <el-form-item label="房号">
          <el-input v-model="query.roomNumber" placeholder="房号" clearable />
        </el-form-item>

        <el-form-item label="月份范围">
          <el-date-picker
            v-model="query.monthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="YYYY-MM"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- ⭐ 表格 -->
      <el-table :data="list" border stripe>
        <el-table-column prop="roomNumber" label="房号" align="center" />
        <el-table-column prop="recordMonth" label="月份" align="center">
          <template #default="scope">
            {{ formatDateMonth(scope.row.recordMonth) }}
          </template>
        </el-table-column>
        <el-table-column prop="recordType" label="记录类型" align="center">
          <template #default="scope">
            {{ scope.row.recordType === 0 ? '收租' : scope.row.recordType === 1 ? '新入住' : '退房' }}
          </template>
        </el-table-column>
        <el-table-column prop="waterRecord" label="水表读数" align="center" />
        <el-table-column prop="waterPrice" label="水费单价(元/吨)" align="center" width="100"/>
        <el-table-column prop="eleRecord" label="电表读数" align="center" />
        <el-table-column prop="elePrice" label="电费单价(元/吨)" align="center" width="100"/>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="创建时间" align="center" width="200">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <!-- <el-button size="small" @click="edit(scope.row)">编辑</el-button> -->
            <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- ⭐ 分页 -->
      <div style="text-align:right; margin-top: 15px;">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :page-sizes="[10,20,50,100]"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- ⭐ 新增 / 编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" title="水电记录" width="560px" align-center>
        <!-- 🔴 红色说明文字 -->
        <p style="color: red; margin-bottom: 10px;">
            只需要输入本月对应的水电表读数，系统会根据上一次的读数和当前单价自动计算本月水电费用，并自动在费用管理模块生成一条对应的缴费记录（状态为未缴费）。
        </p>
      <el-form :model="form" label-width="150px">

        <el-form-item label="房号">
          <el-select v-model="form.roomNumber" placeholder="选择房号" filterable clearable :disabled="isEdit">
            <el-option
              v-for="r in roomList"
              :key="r.id"
              :label="r.roomNumber"
              :value="r.roomNumber"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="月份">
          <el-date-picker
            v-model="form.recordMonth"
            type="month"
            value-format="YYYY-MM-01"
            placeholder="选择月份"
             :disabled-date="disableFutureMonth"
          />
        </el-form-item>

        <el-form-item label="记录类型">
          <el-radio-group v-model="form.recordType">
            <el-radio label="0">收租</el-radio>
            <el-radio label="1">新入住</el-radio>
            <el-radio label="2">退房</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="水表读数">
          <el-input v-model="form.waterRecord" type="number"/>
        </el-form-item>

        <el-form-item :label="`水费单价(${form.waterPrice}元/吨)`">
          <el-input v-model="form.waterPrice" type="number"/>
        </el-form-item>

        <el-form-item label="电表读数">
          <el-input v-model="form.eleRecord" type="number"/>
        </el-form-item>

        <el-form-item :label="`电费单价(${form.elePrice}元/度)`">
          <el-input v-model="form.elePrice" type="number"/>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" />
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import waterApi from '../api/waterEleRecord'
import roomApi from '../api/room'
import { confirmDelete, messageSuccess, messageError, formatDateTime, formatDateMonth } from '../utils/utils'

// 列表 & 分页
const list = ref([])
const total = ref(0)
const roomList = ref([])

//水电记录查询参数
const year = new Date().getFullYear()
const month = String(new Date().getMonth() + 1).padStart(2, '0')
const defaultDate = `${year}-${month}`

const query = reactive({
  roomNumber: '',
  monthRange: [defaultDate, defaultDate],
  startDate: '',
  endDate: '',
  pageNum: 1,
  pageSize: 10
})

function disableFutureMonth(date) {
  const today = new Date()
  // 只比较 年+月
  const select = date.getFullYear() * 100 + date.getMonth()
  const current = today.getFullYear() * 100 + today.getMonth()

  return select > current   // 返回 true = 禁用
}

// 弹窗
const dialogVisible = ref(false)
const form = reactive({waterPrice: 3.5, elePrice: 1.5})

// 加载数据
onMounted(() => {
  load()
  roomApi.list().then(res => roomList.value = res)
})

function load() {
  if (query.monthRange?.length === 2) {
    query.startDate = query.monthRange[0] + '-01'
    query.endDate = query.monthRange[1] + '-01'
  } else {
    query.startDate = ''
    query.endDate = ''
  }

  waterApi.list(query).then(res => {
    list.value = res.records
    total.value = res.total
  })
}

function resetQuery() {
  Object.assign(query, {
    roomNumber: '',
    monthRange: [],
    startDate: '',
    endDate: '',
    pageNum: 1
  })
  load()
}

// 分页
function handlePageChange(page) {
  query.pageNum = page
  load()
}
function handleSizeChange(size) {
  query.pageSize = size
  load()
}

// 新增
function openAdd() {
  Object.assign(form, {
    id: null,
    roomNumber: '',
    recordMonth: '',
    recordType: '0',
    waterRecord: '',
    eleRecord: '',
    remark: ''
  })
  dialogVisible.value = true
}

// 保存
function save() {
    if (!form.roomNumber) return messageError("请输入房号")
    if (!form.recordMonth) return messageError("请选择月份")
    if (!form.waterRecord) return messageError("请输入水表读数")
    if (!form.eleRecord) return messageError("请输入电表读数")
    if (!form.waterPrice) return messageError("请输入水费单价")
    if (!form.elePrice) return messageError("请输入电费单价")

    //校验每个月只能有一条记录
    for (let item of list.value) {
      if (item.roomNumber === form.roomNumber && formatDateMonth(item.recordMonth) === formatDateMonth(form.recordMonth)) {
        return messageError("该月已存在记录")
      }
    }

    waterApi.add(form).then(() => {
        messageSuccess("新增成功")
        load()
    })
    dialogVisible.value = false
}

// 删除
function remove(id) {
  confirmDelete("确认删除该条记录吗？")
    .then(() => waterApi.delete(id))
    .then(() => {
      messageSuccess("删除成功")
      load()
    })
}

defineOptions({
  name: "WaterEleRecord"
})
</script>

