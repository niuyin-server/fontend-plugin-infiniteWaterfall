<template>
  <div class="p-4">
    <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
    >
      <!--     foreach items-->
      <div
          v-for="item in items"
          :key="item.id"
          class="break-inside-avoid mb-4"
      >
        <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-auto rounded-lg shadow-md"
            :style="{ height: `${item.height}px` }"
        />
        <h3 class="mt-2 text-lg font-semibold">{{ item.title }}</h3>
      </div>
    </div>
    <div ref="loadingRef" class="flex justify-center items-center py-4">
      <Loader2 v-if="loading" class="animate-spin"/>
      <p v-if="!hasMore" class="text-gray-500">没有更多内容了</p>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue'
import {Loader2} from 'lucide-vue-next'

const props = defineProps({
  fetchItems: {
    type: Function,
    required: true
  },
  columnCount: {
    type: Number,
    default: 3
  }
})

const items = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerRef = ref(null)
const loadingRef = ref(null)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  console.log('Loading more items...') // 调试信息
  loading.value = true
  try {
    const newItems = await props.fetchItems(page.value)
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
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
