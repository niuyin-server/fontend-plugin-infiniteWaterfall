<template>
  <div class="min-h-screen min-w-full bg-gray-100 ">
    <!--    <h1 class="text-3xl font-bold text-center mb-8">瀑布流演示</h1>-->
    <InfiniteWaterfall :fetchItems="fetchItems" :columnCount="5"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import InfiniteWaterfall from '../components/InfiniteWaterfall.vue'
import axios from "axios";

const fetchItems = async (page) => {
  // 模拟 API 调用
  await axios.get('/mock/recommend/video/feed').then(res => {
    return res.data.data
  })
}
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
<!--
// await new Promise((resolve) => setTimeout(resolve, 2000))
// return Array.from({length: 10}, (_, i) => ({
//   id: page * 10 + i,
//   // image: `./placeholder.svg?height=${Math.floor(Math.random() * 200 + 100)}&width=300`,
//   image: `https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2023/12/27/de26f6b8579b40f2bf8948a1bcb7e236.mp4?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto`,
//   title: `Item ${page * 10 + i + 1}`,
//   // height: Math.floor(Math.random() * 200 + 100),
//   // 高度设置为 屏幕比例 16：9
//   height: Math.floor(window.innerWidth * 9 / 16 / 5),
// }))-->
