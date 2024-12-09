import axios from 'axios'
import type { Global, Response } from '@/types'
import { makeTranslator, attachmentAdpator } from 'amis-core'
export const amisRequest = (api,locale:string) => {
    const { method, url, data } = api
    const check = (response, api) => {
        const __ = makeTranslator(locale || 'zh-CN');
        response = attachmentAdpator(response, __, api);
        //判断返回结构是否已经是amis结构
        if (
          typeof response.data === "object" &&
          response.data !== null &&
          "data" in response.data &&
          "msg" in response.data &&
          "status" in response.data
        ) {
          return new Promise(function (resolve, reject) {
            resolve(response);
          });
        }
    
        if (!url.startsWith("/api")) {
          return new Promise(function (resolve, reject) {
            resolve(response);
          });
        }
    
        //组成新的payload,即是修改response的数据
        let payload = {
          status: !response.data?.code ? 200 : response.data.code,
          msg: response.data?.message ? response.data?.message ?? response.data.msg : "处理成功",
          data: response.data,
        };
    
        response.data = payload;
    
        // 在这个回调函数中返回一个新的 Promise 对象
        return new Promise(function (resolve, reject) {
          // 这里应该返回一个新的response,可以在下一个adapter里使用
          // 执行异步操作
          // 在异步操作完成后调用 resolve 或 reject
          resolve(response);
        });
    };
    return axios[method]<Global.AnyObject, Response<Global.AnyObject>>(url, data)
            .then(check)
}