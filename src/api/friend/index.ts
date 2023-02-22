import { Result } from "@/model"
import { AxiosPromise } from "axios"
import { Friend } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 查看友链列表
 * @returns 文章分类
 */
export function getFriendList(): AxiosPromise<Result<Friend[]>> {
  return request1({
    url: "/friend/list",
    method: "get"
  })
}
