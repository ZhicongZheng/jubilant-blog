import { getUserInfo, setUserInfo } from "@/utils/localStorage"
import { UserInfo } from "@/store/types"

const useUserStore = defineStore("useUserStore", {
  state: () => ({
    userName: getUserInfo()?.userName,
    userEmail: getUserInfo()?.userEmail,
    allowNotify: getUserInfo()?.allowNotify || true,
    rememberMe: getUserInfo()?.rememberMe || true,
    likeArticle: []
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
    }
    // articleLike(articleId: number) {
    //   const index = this.articleLikeSet.indexOf(articleId)
    //   if (index != -1) {
    //     this.articleLikeSet.splice(index, 1)
    //   } else {
    //     this.articleLikeSet.push(articleId)
    //   }
    // },
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
