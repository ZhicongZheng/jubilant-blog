<template>
  <div class="page-header">
    <h1 class="page-title">分类</h1>
    <img
      class="page-cover"
      src="https://ik.imagekit.io/nicexl/Wallpaper/ba41a32b219e4b40ad055bbb52935896_Y0819msuI.jpg"
      alt=""
    />
    <Waves />
  </div>
  <div class="bg">
    <div class="page-container">
      <n-grid x-gap="15" y-gap="15" cols="1 s:2 m:3" responsive="screen">
        <n-grid-item class="article-item" v-for="article of articles" :key="article.id">
          <div class="article-cover">
            <router-link :to="`/article/${article.id}`"><img class="cover" v-lazy="article.frontCover" /></router-link>
          </div>
          <div class="article-info">
            <div class="article-title">
              <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
            </div>
            <div class="article-meta">
              <span><svg-icon icon-class="calendar" size="0.95rem" /> {{ formatDate(article.createAt) }}</span>
              <router-link :to="`/category/${article.category.id}`"
                ><svg-icon icon-class="qizhi" size="0.9rem" />{{ article.category.name }}</router-link
              >
            </div>
            <div class="tag-info">
              <router-link :to="`/tag/${tag.id}`" class="article-tag" v-for="tag in article.tags" :key="tag.id">
                <svg-icon icon-class="tag" size="0.8rem" />
                {{ tag.name }}
              </router-link>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/date"
import { reactive, onMounted, toRefs } from "vue"
import { useRoute } from "vue-router"
import { api } from "@/request/service"
import { ArticleDto } from "@/request/generator"

const route = useRoute()
const data = reactive({
  queryParams: {
    current: 1,
    size: 5,
    categoryId: Number(route.params.categoryId)
  },
  name: "",
  articles: [] as Array<ArticleDto>
})
const { queryParams, name, articles } = toRefs(data)
onMounted(() => {
  api.ArticleApi.listArticleByPage(
    queryParams.value.current,
    queryParams.value.size,
    undefined,
    queryParams.value.categoryId
  ).then((res) => {
    const pageResult = res.data
    if (pageResult.data) {
      articles.value = pageResult.data
      const categoryName = pageResult.data.map((article) => article.category?.name).pop()
      if (categoryName) {
        name.value = categoryName
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.article-item {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.625rem 1.875rem -0.9375rem var(--box-bg-shadow);
  transition: all 0.2s ease-in-out 0s;
  animation: zoomIn 1s both;

  &:hover {
    box-shadow: 0 0 2rem var(--box-bg-shadow);
  }
}

.article-cover {
  width: 100%;
  height: 12rem;
  overflow: hidden;
  border-radius: 0.625rem 0.625rem 0 0;
}

.cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}

.article-item:hover .cover {
  transform: scale(1.1);
}

.article-info {
  padding: 0.6rem 0.8rem 1rem;
}

.article-title {
  font-size: 23px;
  font-weight: 400;
  line-height: 1.25;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.625rem;
  font-size: 14px;
  color: var(--grey-5);
}
</style>
