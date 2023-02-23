import { SiteConfig, SiteInfoDto } from "@/request/generator"

const useBlogStore = defineStore("useBlogStore", {
  state: (): SiteInfoDto => ({
    articleCount: 0,
    categoryCount: 0,
    tagCount: 0,
    viewCount: 0,
    siteConfig: {} as SiteConfig
  }),
  actions: {
    setBlogInfo(siteInfo: SiteInfoDto) {
      this.articleCount = siteInfo.articleCount
      this.categoryCount = siteInfo.categoryCount
      this.tagCount = siteInfo.tagCount
      this.viewCount = siteInfo.viewCount
      this.siteConfig = siteInfo.siteConfig
    }
  },
  getters: {},
  persist: {
    key: "blog",
    storage: sessionStorage
  }
})

export default useBlogStore
