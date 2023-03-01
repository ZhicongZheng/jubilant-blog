/** 统一处理 localStorage */
import { UserInfo } from "@/store/types"

export const getUserInfo = () => {
  const item = localStorage.getItem("userInfo")
  return item ? JSON.parse(item) : undefined
}

export const setUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo))
}
