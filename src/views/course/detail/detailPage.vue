<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <router-link
        :to="`/course/DetailSelect/${id}/DetailContent/${id}`"
        :class="{ [$style.active]: $route.path != `/course/DetailSelect/${id}/DetailData/${id}` }"
      >
        选课内容
      </router-link>

      <router-link
        :to="`/course/DetailSelect/${id}/DetailData/${id}`"
        :class="{ [$style.active]: $route.path == `/course/DetailSelect/${id}/DetailData/${id}` }"
      >
        选课设置
      </router-link>
    </div>
    <div :class="$style.content">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = route.params.id
onMounted(() => {
  if (route.path === `/course/DetailSelect/${id}`) {
    router.push({
      name: 'DetailContent',
      params: {
        id: id
      }
    })
  }
})
</script>
<style lang="scss" module>
.container {
  @include bg_style_edit;
  .header {
    display: flex;
    width: 100%;
    line-height: 30px;
    a {
      box-sizing: border-box;
      text-decoration: none;
      margin-left: 20px;
      color: #000;
      &.active {
        // 在链接激活时的样式
        // 例如：font-weight: bold;
        color: $primary;
        border-bottom: 2px solid $primary;
      }
    }
  }
}
</style>
