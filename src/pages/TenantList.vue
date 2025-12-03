<template>
  <div>
    <el-card>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>租户管理</h2>
        <el-button type="primary" @click="openAdd">新增租户</el-button>
      </div>

      <!-- 查询条件 -->
      <el-form :inline="true" :model="query" style="margin: 15px 0">
        <el-form-item label="姓名">
          <el-input v-model="query.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="query.phone" placeholder="请输入电话" clearable />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="query.idCard" placeholder="请输入身份证" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="list" stripe border size="small" :header-cell-style="{ background: '#f7f8fa' }" style="margin-top:20px">
        <el-table-column prop="name" label="姓名" align="center"/>
        <el-table-column prop="phone" label="电话" align="center"/>
       <el-table-column prop="idCard" label="身份证" align="center"/>
        <el-table-column prop="remark" label="备注" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="scope">
                {{ formatDateTime(scope.row.createTime) }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
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

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="租户信息" width="560px" align-center :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">

        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="身份证">
          <el-input v-model="form.idCard"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
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
import { ref, reactive, onMounted } from "vue"
import api from "../api/tenant"
import { confirmDelete, messageSuccess, messageError, formatDateTime } from '../utils/utils';

const list = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const form = reactive({})

// 查询 + 分页参数
const query = reactive({
    name: "",
    phone: "",
    idCard: "",
    pageNum: 1,
    pageSize: 10
})

onMounted(load)

function load() {
  api.list(query).then(res => {
    list.value = res.records
    total.value = res.total
  })
}

function reset() {
  query.name = ""
  query.phone = ""
  query.idCard = ""
  query.pageNum = 1
  load()
}

function openAdd() {
  form.id = null
  form.name = ''
  form.phone = ''
  form.idCard = ''
  form.remark = ''
  dialogVisible.value = true
}


function edit(row) {
  Object.assign(form, row)
  dialogVisible.value = true
}

function save() {
    if (!form.name) return messageError('请输入姓名')
    if (!form.phone) return messageError('请输入电话')
    if (!form.idCard) return messageError('请输入身份证')
    if (form.id) api.update(form).then(load)
    else api.add(form).then(load)
    dialogVisible.value=false
}

function remove(id) {
  confirmDelete('确定删除该租户吗？')
    .then(() => api.remove(id))
    .then(() => {
      messageSuccess('删除成功')
      load()
    })
}

// 分页处理
function handlePageChange(page) {
  query.pageNum = page
  load()
}

function handleSizeChange(size) {
  query.pageSize = size
  query.pageNum = 1
  load()
}

defineOptions({
  name: "TenantList"
})
</script>
