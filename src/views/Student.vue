<script setup>
import studentApi from '@/api/student.js'
import banjiApi from "@/api/banji.js";
import {ref, reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'

//表格数据
const list = ref([])
const total = ref(0)
//分页信息和搜索条件
const studentQuery = reactive({
    name: '',
    banjiId: '',
    page: 1,
    limit: 10
})

/*function loadData() {
    studentApi.list(studentQuery).then(result => {
        list.value = result.data.list
        total.value = result.data.total
    })
}*/
const loadData = () => {
    studentApi.list(studentQuery).then(result => {
        list.value = result.data.list
        total.value = result.data.total
    })
}

loadData()

const onSearch = () => {
    studentQuery.page = 1
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
        studentApi.deleteById(id).then(result => {
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
        studentApi.deleteAll(ids.value).then(result => {
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
const student = ref({})
const title = ref()

const showAddDialog = () => {
    dialogFormVisible.value = true
    title.value = '添加'
    student.value = {}
}

const showUpdateDialog = (id) => {
    dialogFormVisible.value = true
    title.value = '编辑'
    student.value = {}
    studentApi.selectById(id).then(result => {
        student.value = result.data
    })
}

const addOrUpdate = () => {
    if (student.value.id) {//编辑
        studentApi.update(student.value).then(result => {
            if (result.code == 0) {
                ElMessage.success(result.msg)
                dialogFormVisible.value = false
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    } else {//添加
        studentApi.add(student.value).then(result => {
            if (result.code == 0) {
                ElMessage.success(result.msg)
                dialogFormVisible.value = false
                loadData()
            } else {
                ElMessage.error(result.msg)
            }
        })
    }
}
//查询所有班级
const banjiList = ref([])
banjiApi.selectAll().then(result=>{
    if(result.code==0){
        banjiList.value=result.data
    }
})





//查询所有班级绑定事件
// const banjiList = ref([])
//
// const selectChange=()=> {
//     banjiApi.selectAll().then(result => {
//         if (result.code == 0) {
//             banjiList.value = result.data
//         }
//     })
// }




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
            <el-input v-model="studentQuery.name" placeholder="请输入名字" clearable/>
        </el-form-item>


<!--        <el-form-item label="班级ID">-->
<!--            <el-input v-model="studentQuery.banjiId" placeholder="请输入年龄" clearable/>-->
<!--        </el-form-item>-->

        <el-form-item label="班级" >
            <el-select clearable v-model="studentQuery.banjiId"  placeholder="请选择班级"
                       style="width: 140px">
                <el-option
                    v-for="banji in banjiList"
                    :key="banji.id"
                    :label="banji.name"
                    :value="banji.id"
                />
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" ref="multipleTableRef" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="id" label="ID"/>
        <el-table-column prop="name" label="名字"/>
        <el-table-column prop="age" label="年龄"/>
        <el-table-column prop="gender" label="性别"/>
        <el-table-column prop="banjiId" label="班级id"/>
        <el-table-column prop="banjiName" label="班级名称"/>


        <el-table-column fixed="right" label="Operations">
            <template #default="{ row }">
                <el-button type="primary" @click="showUpdateDialog(row.id)">编辑</el-button>
                <el-button type="danger" @click="deleteById(row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="studentQuery.page"
        v-model:page-size="studentQuery.limit"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @change="loadData"
        style="margin-top: 20px; justify-content: flex-end"
    />
</el-card>


<!--添加、编辑弹出框-->
<el-dialog v-model="dialogFormVisible" :title="title" width="500" :lock-scroll="false">
    <el-form :model="student">
        <el-form-item label="名字" :label-width="60">
            <el-input v-model="student.name" autocomplete="off" />
        </el-form-item>


<!--        <el-form-item label="年龄" :label-width="60">-->
<!--            <el-input v-model="student.age" autocomplete="off" />-->
<!--        </el-form-item>-->

        <el-form-item label="年龄" :label-width="60">
            <el-input-number v-model="student.age" :min="1" :max="100"  autocomplete="off" />
        </el-form-item>


        <el-form-item label="性别" :label-width="60">
            <el-input v-model="student.gender" autocomplete="off" />
        </el-form-item>

        <el-form-item label="班级" :label-width="80">
            <el-select clearable v-model="student.banjiId"  placeholder="请选择班级"
                       style="width: 140px">
                <el-option
                    v-for="banji in banjiList"
                    :key="banji.id"
                    :label="banji.name"
                    :value="banji.id"
                />
            </el-select>
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