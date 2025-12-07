<template>
  <div>
    <el-card>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>房间管理</h2>
        <el-button type="primary" @click="openAdd">新增房间</el-button>
      </div>

      <!-- ⭐ 查询条件 -->
      <el-form :inline="true" :model="query" style="margin: 20px 0;">
        <el-form-item label="房号">
          <el-input v-model="query.roomNumber" placeholder="房号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable placeholder="全部" style="width: 90px">
            <el-option label="空置" :value="0"/>
            <el-option label="已租" :value="1"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 房间列表 -->
      <el-table :data="list" stripe border size="small" :header-cell-style="{ background: '#f7f8fa' }" style="margin-top:20px">
        <el-table-column prop="building" label="楼栋" align="center"/>
        <el-table-column prop="roomNumber" label="房号" align="center"/>
        <el-table-column prop="tenantName" label="租户" align="center"/>
        <el-table-column prop="phone" label="租户电话" align="center"/>
        <el-table-column prop="checkInDate" label="入住时间" align="center"/>
        <el-table-column prop="rentPerMonth" label="月租金" align="center"/>
        <el-table-column prop="preAmount" label="押金" align="center"/>
        <el-table-column label="状态" width="100" align="center">
            <template #default="scope">
                <el-tag
                :type="scope.row.status === 1 ? 'success' : 'info'"
                >
                {{ scope.row.status === 1 ? '已租' : '空置' }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.status === 0" size="small" @click="openCheckIn(scope.row)">入住</el-button>
            <el-button v-if="scope.row.status === 1" size="small" @click="checkOut(scope.row)">退房</el-button>
            <el-button size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 房间信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="房间信息" width="640px" align-center :close-on-click-modal="false">

      <el-form :model="form" label-width="85px">

        <el-form-item label="楼栋">
          <el-input v-model="form.building" :disabled="form.checkIn"></el-input>
        </el-form-item>

        <el-form-item label="房间号" required>
          <el-input v-model="form.roomNumber" :disabled="form.checkIn"></el-input>
        </el-form-item>

        <el-form-item label="租户">
            <el-select
                v-model="form.tenantId"
                placeholder="选择租户"
                 @change="onTenantChange" 
                filterable = "filterTenant"
                clearable
            >
                <el-option
                v-for="t in tenantList"
                :key="t.id"
                :label="t.name"
                :value="t.id"
                />
            </el-select>
        </el-form-item>

        <el-form-item label="租户电话">
          <el-input v-model="form.phone" placeholder="请输入租户电话"></el-input>
        </el-form-item>

        <el-form-item label="入住时间">
          <el-date-picker v-model="form.checkInDate" type="date"/>
        </el-form-item>

        <el-form-item label="月租金">
          <el-input v-model="form.rentPerMonth"></el-input>
        </el-form-item>

        <el-form-item label="押金">
          <el-input v-model="form.preAmount"></el-input>
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
import { ref, reactive, onMounted } from "vue";
import roomApi from "../api/room";
import tenantApi from "../api/tenant";
import { confirmDelete, messageSuccess, messageError } from '../utils/utils';

// ⭐ 查询参数
const query = reactive({
  roomNumber: '',
  status: null
})

const list = ref([]);
const tenantList = ref([]);

const dialogVisible = ref(false);
const form = reactive({});

const filterTenant = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
};

onMounted(() => {
  load();
  tenantApi.list().then(res => tenantList.value = res.records);
});

function load() {
  roomApi.list(query).then(res => list.value = res);
}

function openAdd() {
  tenantApi.list().then(res => tenantList.value = res.records);

  form.id = null
  form.roomNumber = ''
  form.building = ''
  form.phone = ''
  form.tenantName = ''
  form.tenantId = null
  form.checkInDate = null
  form.rentPerMonth = ''
  dialogVisible.value = true
}


function edit(row) {
  Object.assign(form, row);
  dialogVisible.value = true;
}

function save() {
    if (!form.roomNumber) return messageError('请输入房间号')
  // 自动根据 tenantId 取出 tenantName
  if (form.tenantId) {
    const tenant = tenantList.value.find(t => t.id === form.tenantId);
    form.tenantName = tenant ? tenant.name : null;
  }
  if (form.checkIn) {
    if (!form.tenantId) {
        messageError('请选择租户')
        return
    }
    if (!form.checkInDate) {
        messageError('请选择入住时间')
        return
    }
    if (!form.rentPerMonth) {
        messageError('请输入月租金')
        return
    }
    roomApi.checkIn(form).then(load);
    form.checkIn = false;
  } else {
    if (form.id) {
        roomApi.update(form).then(load);
    } else {
        roomApi.add(form).then(load);
    }
  }
  
  dialogVisible.value = false;
}

function onTenantChange() {
    if (form.tenantId) {
        const tenant = tenantList.value.find(t => t.id === form.tenantId);
        form.phone = tenant ? tenant.phone : null;
    }
}

function openCheckIn(row) {
    Object.assign(form, row);
    form.checkInDate = new Date();
    form.checkIn = true;
    dialogVisible.value = true;
}

function checkOut(row) {
    if (row.status !== 1) {
        messageError('该房间未被租出')
        return
    }
    confirmDelete('确定要退房该房间吗？')
    .then(() => {
      return roomApi.checkOut(row.id)
    })
    .then(() => {
      messageSuccess('退房成功')
      load()
    })
    .catch(() => {
      // 用户取消，不做任何事
    })
}

function remove(row) {
    if (row.status === 1) {
        messageError('该房间已被租出，不能删除')
        return
    }

    confirmDelete('确定删除该房间吗？')
    .then(() => roomApi.remove(row.id))
    .then(() => {
      messageSuccess('删除成功')
      load()
    })
    .catch(() => {
      // 用户取消，不做任何事
    })
}

defineOptions({
  name: "RoomList"
})
</script>
