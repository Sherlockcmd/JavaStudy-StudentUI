import service from '@/utils/request.js'
// 将所有的针对student的请求，都封装到一个对象中
const studentApi = {
    list(studentQuery) {
        return service.get('/student/list', {params: studentQuery})
    },
    deleteById(id) {
        return service.delete( `/student/deleteById/${id}`)
    },
    deleteAll(ids) {
        return service.delete( `/student/deleteAll/${ids}`)
    },
    add(student) {
        //student以JSON形式传递到后台，后端使用@RequestBody接收
        return service.post('/student/add', student)
    },
    selectById(id) {
        return service.get(`/student/selectById/${id}`)
    },
    update(student) {
        return service.put('/student/update', student)
    }
}

export default studentApi