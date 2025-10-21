import service from '@/utils/request.js'
// 单独封装对于统计图表的请求
const chartApi = {
    selectBanjiCount() {
        return service.get('/chart/selectBanjiCount', {})
    }
}

export default chartApi