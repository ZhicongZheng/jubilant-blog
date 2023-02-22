import { PageQuery, PageResult, Result } from "@/model"
import { AxiosPromise } from "axios"
import { Comment, CommentForm, CommentQuery, RecentComment, Reply } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 查看最新评论
 * @returns 最新评论
 */
export function getRecentComment(): AxiosPromise<Result<RecentComment[]>> {
  return request1({
    url: "/recent/comment",
    method: "get"
  })
}

/**
 * 添加评论
 */
export function addComment(data: CommentForm): AxiosPromise<Result<null>> {
  return request1({
    url: "/comment/add",
    method: "post",
    data
  })
}

/**
 * 查看评论列表
 * @returns 评论列表
 */
export function getCommentList(params: CommentQuery): AxiosPromise<Result<PageResult<Comment[]>>> {
  return request1({
    url: "/comment/list",
    method: "get",
    params
  })
}

/**
 * 查看回复评论
 * @param commentId 评论id
 * @param params 分页参数
 * @returns 回复评论列表
 */
export function getReplyList(commentId: number, params: PageQuery): AxiosPromise<Result<Reply[]>> {
  return request1({
    url: `/comment/${commentId}/reply`,
    method: "get",
    params
  })
}

/**
 * 点赞评论
 * @param commentId 评论id
 */
export function likeComment(commentId: number): AxiosPromise<Result<null>> {
  return request1({
    url: `/comment/${commentId}/like`,
    method: "post"
  })
}
