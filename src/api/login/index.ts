import {Result, UserForm} from "@/model";
import {AxiosPromise} from "axios";
import {GitInfo, LoginForm, UserInfo} from "./types";
import {request as request1} from "@/request/service";

/**
 * 用户登录
 * @param data 登录信息
 * @returns Token
 */
export function login(data: LoginForm): AxiosPromise<Result<string>> {
  return request1({
    url: "/login",
    method: "post",
    data,
  });
}

/**
 * 邮箱注册
 * @param data 注册信息
 */
export function register(data: UserForm): AxiosPromise<Result<null>> {
  return request1({
    url: "/register",
    method: "post",
    data,
  });
}

/**
 * 获取登录用户信息
 * @returns 登录用户信息
 */
export function getUserInfo(): AxiosPromise<Result<UserInfo>> {
  return request1({
    url: "/user/getUserInfo",
    method: "get",
  });
}

/**
 * 发送邮箱验证码
 * @param params 邮箱
 */
export function getCode(username: string): AxiosPromise<Result<null>> {
  return request1({
    url: "/code",
    method: "get",
    params: {
      username,
    },
  });
}

/**
 * 用户退出
 */
export function logout(): AxiosPromise<Result<null>> {
  return request1({
    url: "/logout",
    method: "get",
  });
}

/**
 * gitee登录
 * @param data 第三方code
 * @returns Token
 */
export function giteeLogin(data: GitInfo): AxiosPromise<Result<string>> {
  return request1({
    url: "/oauth/gitee",
    method: "post",
    data,
  });
}

/**
 * github登录
 * @param code 第三方code
 * @returns Token
 */
export function githubLogin(data: GitInfo): AxiosPromise<Result<string>> {
  return request1({
    url: "/oauth/github",
    method: "post",
    data,
  });
}
