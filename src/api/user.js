import service from '@/utils/request.js'
import request from "@/utils/request.js";

// 将所有的针对user的请求，都封装到一个对象中
const userApi = {
    list(userQuery) {
        return service.get('/user/list', {params: userQuery})
    },
    deleteById(id) {
        return service.delete( `/user/deleteById/${id}`)
    },
    deleteAll(ids) {
        return service.delete( `/user/deleteAll/${ids}`)
    },
    add(user) {
        //user以JSON形式传递到后台，后端使用@RequestBody接收
        return service.post('/user/add', user)
    },
    selectById(id) {
        return service.get(`/user/selectById/${id}`)
    },
    update(user) {
        return service.put('/user/update', user)
    },
    login(user) {
        return service.post('/user/login', user)
    },
    userInfo(){
        return service.get('/user/userInfo')
    },
    resetPassword(userPasswordDTO) {
        return service.put('/user/resetPassword', userPasswordDTO)
    }

}

export default userApi