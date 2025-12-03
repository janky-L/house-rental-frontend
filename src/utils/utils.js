import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'

export function confirmDelete(message = '确定删除？不可恢复！') {
  return ElMessageBox.confirm(
    message,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
}

export function messageSuccess(message = '操作成功') {
  ElMessage.success(message)
}

export function messageError(message = '操作失败') {
  ElMessage.error(message)
}

export function formatDateTime(date) {
  return date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : ""
}

export function formatDate(date) {
  return date ? dayjs(date).format("YYYY-MM-DD") : ""
}

export function formatDateMonth(date) {
  return date ? dayjs(date).format("YYYY-MM") : ""
}




