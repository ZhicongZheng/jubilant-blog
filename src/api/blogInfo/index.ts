import { Result } from "@/model"
import { AxiosPromise } from "axios"
import { BlogInfo } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 获取博客信息
 * @returns 博客信息
 */
export function getBlogInfo(): AxiosPromise<Result<BlogInfo>> {
  return request1({
    url: "/",
    method: "get"
  })
}

/**
 * 上传访客信息
 */
export function report(): AxiosPromise<Result<null>> {
  return request1({
    url: "/report",
    method: "post"
  })
}
