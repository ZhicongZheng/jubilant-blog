import { Result } from "@/model"
import { AxiosPromise } from "axios"
import { Message, MessageForm } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 查看留言列表
 * @returns 文章分类
 */
export function getMessageList(): AxiosPromise<Result<Message[]>> {
  return request1({
    url: "/message/list",
    method: "get"
  })
}

/**
 * 添加留言
 * @param data 留言
 */
export function addMessage(data: MessageForm): AxiosPromise<Result<null>> {
  return request1({
    url: "/message/add",
    method: "post",
    data
  })
}
