<template>
  <div class="p-4">
    <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
    >
      <!-- foreach items video card-->
      <div
          v-for="item in items"
          :key="item.videoId"
          class="flex flex-col break-inside-avoid shadow-md hover:shadow-lg transition ease-in-out duration-300 rounded-lg"

      >
        <!-- 封面区域 -->
        <div class="w-full h-auto relative"
             :style="{ height: `${height}px` }"
             @mouseover="playVideo(item)"
             @mouseout="pauseVideo(item)">
          <img
              :src="item.coverImage"
              :alt="item.videoTitle"
              class="w-full h-full rounded-t-lg absolute top-0 left-0"
              :style="{ height: `${height}px`, objectFit: 'cover' }"
              v-if="!item.showVideo"
          />
          <!-- 发布类型：publishType：0视频1图文 -->
          <video
              :src="item.videoUrl"
              class="w-full h-full rounded-t-lg absolute top-0 left-0"
              :style="{ height: `${height}px`, objectFit: 'cover' }"
              v-if="item.publishType==='0' && item.showVideo"
              controls
              preload="auto"
          ></video>
          <div class="w-full h-full rounded-t-lg absolute top-0 left-0"
               :style="{ height: `${height}px`, objectFit: 'cover' }"
               v-else-if="item.publishType==='1' && item.showVideo">
            轮播图
          </div>
          <img v-else
               :src="item.coverImage"
               :alt="item.videoTitle"
               :style="{ height: `${height}px`, objectFit: 'cover' }"
               class="w-full h-full rounded-t-lg absolute top-0 left-0"/>
        </div>
        <!-- 标题区域 -->
        <div class="h-auto p-3 flex flex-col justify-between grow">
          <div class="text-base text-clamp-2 font-semibold text-left">{{ item.videoTitle }}</div>
          <div class="flex justify-start mt-1">
            <img :src="item.userAvatar" :alt="item.userNickName" class="shadow-md size-8 rounded-full"/>
            <span class="text-xs flex ml-2" style="align-items: center;">{{ item.userNickName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="loadingRef" class="flex justify-center items-center py-8">
      <Loader2 v-if="loading" class="animate-spin"/>
      <p v-if="!hasMore" class="text-gray-500">没有更多内容了</p>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue'
import {Loader2} from 'lucide-vue-next'
import {recommendVideoFeed} from "@/api/recommend.js";

const props = defineProps({
  columnCount: {
    type: Number,
    default: 5
  }
})

const items = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerRef = ref(null)
const loadingRef = ref(null)
// 每个视频的高度根据屏幕宽度和列数动态计算 比例16：9
const height = ref(window.innerWidth * 9 / 16 / props.columnCount)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  console.log('Loading more items...')
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const res = await recommendVideoFeed(page.value)
    const newItems = res.data.data
    console.log('New items:', newItems)
    if (newItems.length === 0) {
      hasMore.value = false
    } else {
      items.value = [...items.value, ...newItems]
      page.value += 1
      // 重新计算页面高度
      nextTick(() => {
        if (loadingRef.value) {
          observerRef.value.unobserve(loadingRef.value)
          observerRef.value.observe(loadingRef.value)
        }
      })
    }
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

const observeIntersection = (entries) => {
  if (entries[0].isIntersecting) {
    loadMore()
  }
}

onMounted(() => {
  // height.value = Math.floor(window.innerWidth * 9 / 16 / props.columnCount)
  observerRef.value = new IntersectionObserver(observeIntersection, {threshold: 0.1}) // 调整阈值
  if (loadingRef.value) {
    observerRef.value.observe(loadingRef.value)
  }
})

onUnmounted(() => {
  if (observerRef.value) {
    observerRef.value.disconnect()
  }
})

watch(() => props.columnCount, (newColumnCount) => {
  // 如果需要处理列数变化的情况，可以在这里添加逻辑
})

const playVideo = (item) => {
  console.log("hover")
  item.showVideo = true
  const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
  if (videoElement && !videoElement.paused) {
    // 视频已经在播放中
    console.log('Video is already playing');
  } else if (videoElement) {
    // 开始播放视频
    videoElement.play().catch((error) => {
      console.error('Error playing video:', error);
    });
  }
}

const pauseVideo = (item) => {
  item.showVideo = false
  const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
  if (videoElement) {
    videoElement.pause()
    videoElement.currentTime = 0
  }
}
</script>

<style scoped>
</style>
