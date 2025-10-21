<script setup>
    import {
        Management,
        Promotion,
        UserFilled,
        User,
        Crop,
        EditPen,
        SwitchButton,
        CaretBottom
    } from '@element-plus/icons-vue'
    import avatar from '@/assets/default.png'

    //条目被点击后,调用的函数
    import {useRouter} from 'vue-router'
    import {ref} from "vue";



    import defaultAvatar from '@/assets/default.png'
    import userApi from '@/api/user.js'
    import {useUserInfoStore} from '@/store/userInfo.js'
    const userInfoStore = useUserInfoStore();

    const getUserInfo = ()=> {
        userApi.userInfo().then(result => {
            if (result.code == 0) {
                //数据存在pinia中
                userInfoStore.setUserInfo(result.data)
            }
        })
    }

    getUserInfo()

    //dialogUpdateUserInfoVisible是用来决定是否要显示出“用户信息”界面的
    const dialogUpdateUserInfoVisible = ref(false)
    const user = ref({})



    const router = useRouter();
    import {ElMessage, ElMessageBox} from 'element-plus'

    import {useTokenStore} from "@/store/token.js";

    const tokenStore = useTokenStore()

    const handleCommand = (command) => {
        //判断指令
        if (command === 'logout') {
            //退出登录
            tokenStore.removeToken();
            userInfoStore.removeUserInfo();

            // 跳转到登录
            router.push('/login')
        } else if(command==='updateUserInfo'){
            dialogUpdateUserInfoVisible.value=true;
            //这样下会有严重问题，两个数据是绑定在一起的，修改了user里面数据，userInfoStore.user也会修改，
            //如果用户点击取消没有修改，就会造成userInfoStore.user里面数据修改了
            //user.value = userInfoStore.user
            Object.assign(user.value, userInfoStore.user)
        } else if(command==='resetPassword'){
            dialogResetPasswordDialog.value=true
        }
        else{
            //路由
            router.push('/admin/' + command)
        }
    }
    const headers = ref({
        //携带token传递到后端
        Authorization: tokenStore.token
    })
    //图片上传
    const handleAvatarSuccess = (result, uploadFile) => {
        user.value.avatar = result.data
    }

const updateUserInfo= () => {
        userApi.update(user.value).then(result => {
          if(result.code===0){
              ElMessage.success(result.msg)
              dialogUpdateUserInfoVisible.value=false
              //重新加载数据
              getUserInfo()
          }else{
              ElMessage.error(result.msg)
          }

        })
    }

    //重置密码
    const userPasswordDTO = ref({
        oldPassword: '',
        newPassword: ''
    });
    const dialogResetPasswordDialog = ref(false)
    const resetForm = ref()
    //自定义确认密码的校验函数
    const rePasswordValid = (rule, value, callback) => {
        if (value == null || value === '') {
            return callback(new Error('请再次确认密码'))
        }
        //响应式对象要：registerData.value才能拿到值
        if (userPasswordDTO.value.newPassword !== value) {
            return callback(new Error('两次输入密码不一致'))
        }

        callback()
    }
    const rules = ref({
        oldPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 16, message: '密码长度必须为3~16位', trigger: 'blur'}
        ],
        newPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 16, message: '密码长度必须为3~16位', trigger: 'blur'}
        ],
        reNewPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: rePasswordValid, trigger: 'blur' }
        ]
    })
    const resetPassword = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                userApi.resetPassword(userPasswordDTO.value).then(result => {
                    if (result.code === 0) {
                        ElMessage.success(result.msg)
                        dialogUpdateUserInfoVisible.value = false
                        tokenStore.removeToken();
                        userInfoStore.removeUserInfo();
                        // 跳转到登录
                        router.push('/login')
                    } else {
                        ElMessage.error(result.msg)
                    }
                })
            } else {
                ElMessage.error('表单验证失败');
            }
        })
    }


</script>

<template>
	<!-- element-plus中的容器 -->
	<el-container class="layout-container">
		<!-- 左侧菜单 -->
		<el-aside width="200px">
			<div class="el-aside__logo"></div>
			<!-- element-plus的菜单标签 -->
			<el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff"
					 router>
				<el-menu-item index="/user">
					<el-icon>
						<Management/>
					</el-icon>
					<span>管理员管理</span>
				</el-menu-item>
				<el-menu-item index="/student">
					<el-icon>
						<Promotion/>
					</el-icon>
					<span>学生管理</span>
				</el-menu-item>
                <el-menu-item index="/banji">
                    <el-icon>
                        <Management/>
                    </el-icon>
                    <span>班级管理</span>
                </el-menu-item>
                <el-menu-item index="/chart">
                    <el-icon>
                        <Management/>
                    </el-icon>
                    <span>统计图表</span>
                </el-menu-item>
				<el-sub-menu>
					<template #title>
						<el-icon>
							<UserFilled/>
						</el-icon>
						<span>个人中心</span>
					</template>
					<el-menu-item index="/user/info">
						<el-icon>
							<User/>
						</el-icon>
						<span>基本资料</span>
					</el-menu-item>
					<el-menu-item index="/user/avatar">
						<el-icon>
							<Crop/>
						</el-icon>
						<span>更换头像</span>
					</el-menu-item>
					<el-menu-item index="/user/resetPassword">
						<el-icon>
							<EditPen/>
						</el-icon>
						<span>重置密码</span>
					</el-menu-item>
				</el-sub-menu>
			</el-menu>
		</el-aside>
		<!-- 右侧主区域 -->
		<el-container>
			<!-- 头部区域 -->
			<el-header>
				<div><strong>后台管理系统{{ zhansgan }}</strong></div>
				<!-- 下拉菜单 -->
				<!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
				<el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.user.avatar?userInfoStore.user.avatar:avatar"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="updateUserInfo" :icon="User">基本资料</el-dropdown-item>
							<el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
							<el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-header>
			<!-- 中间区域 -->
			<el-main>
				<!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
				<router-view></router-view>
			</el-main>
			<!-- 底部区域 -->
			<el-footer>后台管理 ©2025 Created by EasyJava</el-footer>
		</el-container>
	</el-container>



<!--基本质料界面-->
    <el-dialog v-model="dialogUpdateUserInfoVisible" :title="修改个人信息" width="500" :lock-scroll="false">
        <el-form :model="user">
            <el-form-item label="名字" :label-width="60">
                <el-input v-model="user.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="60">
                <el-input v-model="user.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="60">
                <el-input v-model="user.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="头像" :label-width="60">
                <el-upload
                    class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :headers="headers">
                    <img v-if="user.avatar" :src="user.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogUpdateUserInfoVisible = false">取消</el-button>
                <el-button type="primary" @click="updateUserInfo">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>



    <el-dialog  v-model="dialogResetPasswordDialog" title="重置密码" width="500" :lock-scroll="false">
        <el-form ref="resetForm" :rules="rules" :model="userPasswordDTO">
            <el-form-item prop="oldPassword" label="原密码" :label-width="100">
                <el-input v-model="userPasswordDTO.oldPassword" autocomplete="off"/>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码" :label-width="100">
                <el-input v-model="userPasswordDTO.newPassword" autocomplete="off"/>
            </el-form-item>
            <el-form-item prop="reNewPassword" label="重复新密码" :label-width="100">
                <el-input v-model="userPasswordDTO.reNewPassword" autocomplete="off"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogResetPasswordDialog = false">取消</el-button>
                <el-button type="primary" @click="resetPassword(resetForm)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style lang="scss" scoped>
    .layout-container {
        height: 100vh;

        .el-aside {
            background-color: #232323;

            &__logo {
                height: 120px;
                background: url('@/assets/logo.svg') no-repeat center / 120px auto;
            }

            .el-menu {
                border-right: none;
            }
        }

        .el-header {
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .el-dropdown__box {
                display: flex;
                align-items: center;

                .el-icon {
                    color: #999;
                    margin-left: 10px;
                }

                &:active,
                &:focus {
                    outline: none;
                }
            }
        }

        .el-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
        }
    }


    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
</style>