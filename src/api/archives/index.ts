import {PageQuery, PageResult, Result} from "@/model";
import {AxiosPromise} from "axios";
import {Archives} from "./types";
import {request as request1} from "@/request/service";

/**
 * 查看文章归档
 * @param params 查询条件
 * @returns 文章归档
 */
export function getArchivesList(params: PageQuery): AxiosPromise<Result<PageResult<Archives[]>>> {
  return request1({
    url: "/archives/list",
    method: "get",
    params,
  });
}
