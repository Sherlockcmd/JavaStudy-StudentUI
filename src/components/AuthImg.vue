<template>
<img :src="imgUrl" alt="图片加载中..." />
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'

// 接收 props
const props = defineProps(['url', 'token'])

const imgUrl = ref(null) // 用于存储 Blob URL

onMounted( () => {
    getImgUrl()
})

const getImgUrl = async () => {
    try {
        const res = await fetch(props.url, {
            headers: {
                Authorization: props.token
            }
        })
        const blob = await res.blob()
        imgUrl.value = URL.createObjectURL(blob)
    } catch (e) {
        console.error('图片加载失败:', e)
    }
}

watch(()=> props.url,() => {
    getImgUrl()
})
</script>