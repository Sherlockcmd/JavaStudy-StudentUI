import service from '@/utils/request.js'
// 将所有的针对user的请求，都封装到一个对象中
const chartApi = {
    selectBanjiCount() {
        return service.get('/chart/selectBanjiCount', {})
    }
}

export default chartApi