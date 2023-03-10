import { getUserInfo, setUserInfo, clearUserInfo } from "@/utils/localStorage"
import { UserInfo } from "@/store/types"

const useUserStore = defineStore("useUserStore", {
  state: () => ({
    userName: getUserInfo()?.userName || "",
    userEmail: getUserInfo()?.userEmail,
    allowNotify: getUserInfo()?.allowNotify || true,
    rememberMe: getUserInfo()?.rememberMe || true,
    likedArticle: [] as number[]
  }),
  actions: {
    SetUserInfo(userInfo: UserInfo) {
      this.userName = userInfo.userName
      this.userEmail = userInfo.userEmail
      this.allowNotify = userInfo.allowNotify
      this.rememberMe = userInfo.rememberMe
      setUserInfo(userInfo)
    },
    GetUserInfo() {
      return getUserInfo()
    },
    init() {
      this.likedArticle = new Array<number>()
    },
    CLearUserInfo() {
      clearUserInfo()
      this.userName = ""
      this.userEmail = undefined
      this.allowNotify = true
      this.rememberMe = false
    },
    articleLike(articleId: number) {
      const index = this.likedArticle.indexOf(articleId)
      if (index != -1) {
        this.likedArticle.splice(index, 1)
      } else {
        this.likedArticle.push(articleId)
      }
    }
    // talkLike(talkId: number) {
    //   const index = this.talkLikeSet.indexOf(talkId)
    //   if (index != -1) {
    //     this.talkLikeSet.splice(index, 1)
    //   } else {
    //     this.talkLikeSet.push(talkId)
    //   }
    // }
  },
  getters: {},
  persist: {
    key: "user",
    storage: sessionStorage
  }
})

export default useUserStore
