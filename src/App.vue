<template>
  <Provider>
    <div class="app-wrapper">
      <Header />
      <main class="main-wrapper">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </main>
      <Footer />
      <Tool />
      <Search />
      <!--      <Login />-->
      <!--      <Register />-->
      <!--      <Forget />-->
      <!--      <Email />-->
      <Drawer />
      <!--      <MusicPlayer />-->
    </div>
  </Provider>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import useStore from "@/store"
import { api } from "@/request/service"
import ActionType from "@/constant/actionType"

const { blog, user } = useStore()

onMounted(() => {
  console.log(
    "%c Hello World %c By ZhengZhiCong %c",
    "background:#e9546b ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; padding:5px 0;",
    "background:#ec8c69 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #000; padding:5px 0;",
    "background:transparent"
  )
  user.init()
  api.SiteApi.getSiteInfo().then((res) => {
    blog.setBlogInfo(res.data)
  })

  api.SiteApi.onAction({
    typ: ActionType.VISIT,
    resourceId: -1,
    resourceInfo: "/"
  })
})
</script>

<style scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0 8rem;
}
</style>
