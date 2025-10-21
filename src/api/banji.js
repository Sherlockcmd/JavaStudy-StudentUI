import service from '@/utils/request.js'
// 将所有的针对banji的请求，都封装到一个对象中
const banjiApi = {
    list(banjiQuery) {
        return service.get('/banji/list', {params: banjiQuery})
    },
    deleteById(id) {
        return service.delete( `/banji/deleteById/${id}`)
    },
    deleteAll(ids) {
        return service.delete( `/banji/deleteAll/${ids}`)
    },
    add(banji) {
        //banji以JSON形式传递到后台，后端使用@RequestBody接收
        return service.post('/banji/add', banji)
    },
    selectById(id) {
        return service.get(`/banji/selectById/${id}`)
    },
    selectAll() {
        return service.get('/banji/selectAll')
    },
    update(banji) {
        return service.put('/banji/update', banji)
    }

}

export default banjiApi