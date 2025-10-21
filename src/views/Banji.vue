<script setup>
import banjiApi from '@/api/banji.js'
import {ref, reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'

//表格数据
const list = ref([])
const total = ref(0)
//分页信息和搜索条件
const banjiQuery = reactive({
    name: '',
    address: '',
    page: 1,
    limit: 10
})


const loadData = () => {
    banjiApi.list(banjiQuery).then(result => {
        list.value = result.data.list
        total.value = result.data.total
    })
}

loadData()

const onSearch = () => {
    banjiQuery.page = 1
    loadData()
}

//根据id删除
const deleteById = (id) => {
    ElMessageBox.confirm(
        '您确认要删除么?',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            lockScroll: false //防止抖动
        }
    ).then(() => {
        banjiApi.deleteById(id).then(result => {
            if (result.code === 0) {
                ElMessage.success(result.msg)
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    })
}

const ids = ref([])
const handleSelectionChange = (rows) => {
    // console.log('多选', rows)
    ids.value = rows.map(row => row.id)
    console.log(ids.value)
}

const deleteAll = () => {
    ElMessageBox.confirm(
        '您确认要删除么?',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            lockScroll: false //防止抖动
        }
    ).then(() => {
        banjiApi.deleteAll(ids.value).then(result => {
            if (result.code === 0) {
                ElMessage.success(result.msg)
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    })
}


//添加、编辑
const dialogFormVisible = ref(false)
const banji = ref({})
const title = ref()

const showAddDialog = () => {
    dialogFormVisible.value = true
    title.value = '添加'
    banji.value = {}
}

const showUpdateDialog = (id) => {
    dialogFormVisible.value = true
    title.value = '编辑'
    banji.value = {}
    banjiApi.selectById(id).then(result => {
        banji.value = result.data
    })
}

const addOrUpdate = () => {
    if (banji.value.id) {//编辑
        banjiApi.update(banji.value).then(result => {
            if (result.code === 0) {
                ElMessage.success(result.msg)
                dialogFormVisible.value = false
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    } else {//添加
        banjiApi.add(banji.value).then(result => {
            if (result.code === 0) {
                ElMessage.success(result.msg)
                dialogFormVisible.value = false
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    }
}


</script>

<template>
<el-card class="">
    <template #header>
        <div class="header">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
            <el-button type="primary" @click="deleteAll">批量删除</el-button>
        </div>
    </template>
    <el-form :inline="true">
        <el-form-item label="名字">
            <el-input v-model="banjiQuery.name" placeholder="请输入名字" clearable/>
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="banjiQuery.address" placeholder="请输入地址" clearable/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" ref="multipleTableRef" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="id" label="班级ID"/>
        <el-table-column prop="name" label="班级名字"/>
        <el-table-column prop="address" label="班级地址"/>


        <el-table-column fixed="right" label="Operations">
            <template #default="{ row }">
                <el-button type="primary" @click="showUpdateDialog(row.id)">编辑</el-button>
                <el-button type="danger" @click="deleteById(row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="banjiQuery.page"
        v-model:page-size="banjiQuery.limit"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @change="loadData"
        style="margin-top: 20px; justify-content: flex-end"
    />
</el-card>


<!--添加、编辑弹出框-->
<el-dialog v-model="dialogFormVisible" :title="title" width="500" :lock-scroll="false">
    <el-form :model="banji">
        <el-form-item label="名字" :label-width="60">
            <el-input v-model="banji.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="60">
            <el-input v-model="banji.address" autocomplete="off" />
        </el-form-item>


    </el-form>
    <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addOrUpdate">
                确认
            </el-button>
        </div>
    </template>
</el-dialog>
</template>

<style scoped>

</style>