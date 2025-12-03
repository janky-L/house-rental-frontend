<template>
  <div>
    <el-card>
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>费用管理</h2>
        <div style="display:flex; gap:10px;">
            <el-button type="primary" @click="openAdd">新增费用</el-button>
            <el-button type="success" @click="exportExcel">导出 Excel</el-button>
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

        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" style="width: 90px">
            <el-option label="未缴费" :value="0"/>
            <el-option label="已缴费" :value="1"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="list" stripe border size="small" :header-cell-style="{ background: '#f7f8fa' }" show-summary :summary-method="summaryMethod">
        <el-table-column prop="roomNumber" label="房号" align="center"/>
        <el-table-column prop="building" label="楼栋" align="center"/>
        <el-table-column prop="recordMonth" label="月份" align="center" width="100">
          <template #default="scope">
            {{ formatDateMonth(scope.row.recordMonth) }}
          </template>
        </el-table-column>
        <el-table-column prop="rentFee" label="房租" align="center"/>
        <el-table-column prop="waterFee" label="水费" align="center"/>
        <el-table-column prop="electricityFee" label="电费" align="center"/>
        <!-- <el-table-column prop="gasFee" label="燃气费" align="center"/>
        <el-table-column prop="internetFee" label="网费" align="center"/> -->
        <el-table-column prop="otherFee" label="其他" align="center"/>
        <el-table-column prop="totalFee" label="总费用" align="center">
            <template #default="scope">{{ scope.row.totalFee }}元</template>
        </el-table-column>

        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'">
              {{ scope.row.status === 0 ? '未缴费' : '已缴费' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="150">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" align="center"/>

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.status === 0" size="small" @click="edit(scope.row)">缴费</el-button>
            <el-button v-if="scope.row.status !== 1" size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- ⭐ 分页 -->
      <div style="margin-top: 15px; text-align:right;">
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

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="费用信息" width="640px" align-center :close-on-click-modal="false">
      <el-form :model="form" label-width="100px">
        <el-form-item label="房号">
          <el-select v-model="form.roomNumber" placeholder="选择房号" @change="onRoomChange" filterable clearable :disabled="isEdit">
            <el-option
              v-for="r in roomList"
              :key="r.id"
              :label="r.roomNumber"
              :value="r.roomNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-input v-model="form.building" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker v-model="form.recordMonth" type="month" placeholder="选择月份" :disabled="isEdit"/>
        </el-form-item>
        <el-form-item label="房租">
          <el-input v-model="form.rentFee" type="number"/>
        </el-form-item>
        <el-form-item label="水费">
          <el-input v-model="form.waterFee" type="number"/>
        </el-form-item>
        <el-form-item label="电费">
          <el-input v-model="form.electricityFee" type="number"/>
        </el-form-item>
        <!-- <el-form-item label="燃气费">
          <el-input v-model="form.gasFee" type="number"/>
        </el-form-item>
        <el-form-item label="网费">
          <el-input v-model="form.internetFee" type="number"/>
        </el-form-item> -->
        <el-form-item label="其他费用">
          <el-input v-model="form.otherFee" type="number"/>
        </el-form-item>
        <el-form-item label="总费用">
            <el-input v-model="form.totalFee" :disabled="true">
                <template #append>元</template>
            </el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="未缴费" :value="0"/>
            <el-option label="已缴费" :value="1"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="form.remark"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import * as XLSX from "xlsx"
import costApi from '../api/cost'
import roomApi from '../api/room'
import { confirmDelete, messageSuccess, messageError, formatDateTime, formatDateMonth } from '../utils/utils';

const list = ref([])
const total = ref(0)

const roomList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({})

// 监听费用变化，自动计算总费用
watch(
  () => [form.rentFee, form.waterFee, form.electricityFee, form.gasFee, form.internetFee, form.otherFee],
  () => {
    form.totalFee =
      (Number(form.rentFee) || 0) +
      (Number(form.waterFee) || 0) +
      (Number(form.electricityFee) || 0) +
      (Number(form.gasFee) || 0) +
      (Number(form.internetFee) || 0) +
      (Number(form.otherFee) || 0)
  },
  { immediate: true }
)

const year = new Date().getFullYear()
const month = String(new Date().getMonth() + 1).padStart(2, '0')
const defaultStartDate = `${year}-01`
const defaultEndDate = `${year}-${month}`

// ⭐ 查询 + 分页参数
const query = reactive({
  roomNumber: '',
  monthRange: [defaultStartDate, defaultEndDate],      // ['2024-01', '2024-05']
  startDate: '',
  endDate: '',
  status: null,
  pageNum: 1,
  pageSize: 10
})

onMounted(() => {
  load()
  roomApi.list().then(res => roomList.value = res)
})

// ⭐ 加载列表
function load() {
  if (query.monthRange?.length === 2) {
    query.startDate = query.monthRange[0] + '-01'
    query.endDate = query.monthRange[1] + '-01'
  } else {
    query.startDate = ''
    query.endDate = ''
  }

  costApi.list(query).then(res => {
    list.value = res.records
    total.value = res.total
  })
}

// 房号改变时，自动填充楼栋
function onRoomChange() {
  const room = roomList.value.find(r => r.roomNumber === form.roomNumber)
  if (room) {
    form.building = room.building
    form.rentFee = room.rentPerMonth   // ⭐ 自动填入房租
  }
}



// ⭐ 分页
function handlePageChange(page) {
  query.pageNum = page
  load()
}
function handleSizeChange(size) {
  query.pageSize = size
  load()
}

function resetQuery() {
  Object.assign(query, {
    roomNumber: '',
    monthRange: [],
    startDate: '',
    endDate: '',
    status: null,
    pageNum: 1
  })
  load()
}

function summaryMethod({ columns, data }) {
  const sums = []
  columns.forEach((column, index) => {
    if (column.property === 'totalFee') {
      const total = data.reduce((acc, row) => acc + (Number(row.totalFee) || 0), 0)
      sums[index-1] = '合计'
      sums[index] = total + '元'
    } else {
      sums[index] = ''
    }
  })
  return sums
}

function openAdd() {
  Object.assign(form, {
    id: null,
    roomNumber: '',
    building: '',
    rentFee: 0,
    waterFee: 0,
    electricityFee: 0,
    gasFee: 0,
    internetFee: 0,
    otherFee: 0,
    totalFee: 0,
    recordMonth: '',
    status: 0,
    remark: ''
  })
  dialogVisible.value = true
}

function edit(row) {
  Object.assign(form, row)
  isEdit.value = true
  dialogVisible.value = true
}

function save() {
    // 验证必填字段
    if (!form.roomNumber) {
        messageError('请选择房号')
        return
    }
    if (!form.recordMonth) {
        messageError('请选择月份')
        return
    }
    if (form.recordMonth) {
        form.recordMonth = dayjs(form.recordMonth).format('YYYY-MM-01')
    }

    if (form.id) {
        if (form.status === 1) {
            messageError('不能重复缴费')
            return
        }
        if (!form.totalFee || form.totalFee <= 0) {
            messageError('请输入总费用')
            return
        }
        confirmDelete('请确认是否已收到的总金额为:' + form.totalFee + '元').then(() => {
            costApi.update(form).then(() => {
                isEdit.value = false
                messageSuccess('更新成功')
                load()
            })
        })
    } else {
        //校验每个月只能有一条记录
        for (let item of list.value) {
            if (item.roomNumber === form.roomNumber && formatDateMonth(item.recordMonth) === formatDateMonth(form.recordMonth)) {
                return messageError("该月已存在记录")
            }
        }
        costApi.add(form).then(() => {
            messageSuccess('新增成功')
            load()
        })
    }
    dialogVisible.value = false
}

function remove(row) {
    if (!row.id) {
        messageError('请选择要删除的记录')
        return
    }
    if (row.status === 1) {
        messageError('已缴费的记录不能删除')
        return
    }
    confirmDelete().then(() => {
        costApi.delete(row.id).then(() => {
            messageSuccess('删除成功')
            load()
        })
    })
}

function exportExcel() {
  const data = list.value.map(row => ({
    '房号': row.roomNumber,
    '楼栋': row.building,
    '月份': formatDateMonth(row.recordMonth),
    '房租': row.rentFee,
    '水费': row.waterFee,
    '电费': row.electricityFee,
    '其他费用': row.otherFee,
    '总费用': row.totalFee,
    '状态': row.status === 0 ? '未缴费' : '已缴费',
    '创建时间': formatDateTime(row.createTime),
    '备注': row.remark
  }))

  const sheet = XLSX.utils.json_to_sheet(data)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, "缴费记录")

  XLSX.writeFile(book, "缴费记录.xlsx")
}

defineOptions({
  name: "CostList"
})

</script>
