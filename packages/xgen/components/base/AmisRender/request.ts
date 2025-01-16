import axios from 'axios'
import type { Global, Response } from '@/types'
import { makeTranslator, attachmentAdpator } from 'amis-core'
import { message } from 'antd'
export const amisRequest = (api, locale: string) => {
  const { method, url, data } = api
  const check = (response, api) => {
    const __ = makeTranslator(locale || 'zh-CN');
    let _response = {
      data: {
        status: (response && (response.data?.code || response?.code || response?.status)) ?? 0,
        msg: response && (response.data?.message || response.data?.msg || response.message || response.msg) || "处理成功",
        data: response && (response.data === undefined || response.data === null || response.data === '') ? response : response.data
      }
    };

    _response = attachmentAdpator(_response, __, api);
    //判断返回结构是否已经是amis结构
    if (
      typeof _response.data === "object" &&
      _response.data !== null &&
      "data" in _response.data &&
      "msg" in _response.data &&
      "status" in _response.data
    ) {
      return new Promise(function (resolve, reject) {
        resolve(_response);
      });
    }

    if (!url.startsWith("/api")) {
      return new Promise(function (resolve, reject) {
        resolve(_response);
      });
    }

    //组成新的payload,即是修改response的数据
    let payload = {
      status: _response.data?.status,
      msg: _response.data?.msg,
      data: _response.data,
    };

    _response.data = payload;

    // 在这个回调函数中返回一个新的 Promise 对象
    return new Promise(function (resolve, reject) {
      // 这里应该返回一个新的response,可以在下一个adapter里使用
      // 执行异步操作
      // 在异步操作完成后调用 resolve 或 reject
      resolve(_response);
    });
  };
  return axios[method]<Global.AnyObject, Response<Global.AnyObject>>(url, data)
    .then(check)
    .catch((err) => {
      try {
        return JSON.parse(err.message)
      } catch (error) {
        return err.message
      }
    })
}