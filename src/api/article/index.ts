import { PageQuery, PageResult, Result } from "@/model"
import { AxiosPromise } from "axios"
import { Article, ArticleInfo, ArticleRecommend, ArticleSearch } from "./types"
import { request as request1 } from "@/request/service"

/**
 * 查看文章列表
 * @param params 查询条件
 * @returns 文章列表
 */
export function getArticleList(params: PageQuery): AxiosPromise<Result<PageResult<Article[]>>> {
  return request1({
    url: "/article/list",
    method: "get",
    params
  })
}

/**
 * 查看文章
 * @param articleId 文章id
 */
export function getArticle(articleId: number): AxiosPromise<Result<ArticleInfo>> {
  return request1({
    url: `/article/${articleId}`,
    method: "get"
  })
}

/**
 * 查看推荐文章
 * @returns 推荐文章
 */
export function getArticleRecommend(): AxiosPromise<Result<ArticleRecommend[]>> {
  return request1({
    url: "/article/recommend",
    method: "get"
  })
}

/**
 * 搜索文章
 * @returns 文章列表
 */
export function searchArticle(keyword: string): AxiosPromise<Result<ArticleSearch[]>> {
  return request1({
    url: "/article/search",
    method: "get",
    params: {
      keyword
    }
  })
}

/**
 * 点赞文章
 * @param articleId 文章id
 */
export function likeArticle(articleId: number): AxiosPromise<Result<null>> {
  return request1({
    url: `/article/${articleId}/like`,
    method: "post"
  })
}
