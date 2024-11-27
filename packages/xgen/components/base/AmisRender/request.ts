import axios from 'axios'
import type { Global, Response } from '@/types'
export const amisRequest = (url, method, data) => axios[method]<Global.AnyObject, Response<Global.AnyObject>>(url, data)