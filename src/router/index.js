// 创建一个路由器，并暴露出去
// 第一步：引入createRouter
import {createRouter, createWebHistory} from 'vue-router'
// 引入一个一个可能要呈现组件
import Layout from '@/views/Layout.vue'
import Login from '@/views/Login.vue'
import User from '@/views/User.vue'
import Student from '@/views/Student.vue'
import Banji from '@/views/Banji.vue'
import Chart from "@/views/Chart.vue";

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login', component: Login},
        {
            path: '/', component: Layout, children: [
                {path: '/user', component: User},
                {path: '/student', component: Student},
                {path: '/banji', component:Banji},
                {path: '/chart', component:Chart}
            ]
        }
    ]
})

// 暴露出去router
export default router