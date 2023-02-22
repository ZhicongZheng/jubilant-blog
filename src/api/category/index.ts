import { Result } from "@/model"
import { AxiosPromise } from "axios"
import { ArticleConditionList, ArticleQuery } from "../article/types"
import { Category } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 查看文章分类
 * @returns 文章分类
 */
export function getCategoryList(): AxiosPromise<Result<Category[]>> {
  return request1({
    url: "/category/list",
    method: "get"
  })
}

/**
 * 查看分类文章
 * @returns 文章分类
 */
export function getCategoryArticleList(params: ArticleQuery): AxiosPromise<Result<ArticleConditionList>> {
  return request1({
    url: "/category/article",
    method: "get",
    params
  })
}
