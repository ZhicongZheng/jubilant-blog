import {Result} from "@/model";
import {AxiosPromise} from "axios";
import {ArticleConditionList, ArticleQuery} from "../article/types";
import {Tag} from "./types";
import {request as request1} from "@/request/service";

/**
 * 查看文章标签
 * @returns 文章标签
 */
export function getTagList(): AxiosPromise<Result<Tag[]>> {
  return request1({
    url: "/tag/list",
    method: "get",
  });
}

/**
 * 查看标签文章
 * @returns 文章分类
 */
export function getTagArticleList(
  params: ArticleQuery
): AxiosPromise<Result<ArticleConditionList>> {
  return request1({
    url: "/tag/article",
    method: "get",
    params,
  });
}
