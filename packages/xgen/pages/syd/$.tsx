import { useMatch } from '@/hooks'
import { history, useSearchParams, getLocale } from '@umijs/max'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { render as renderAmis } from 'amis';
import type { Global, Response } from '@/types'

/** Dynamically forward to the components */
const Index = async () => {
	const locale = getLocale()
	const [params] = useSearchParams()
	const search_params = Object.fromEntries(params)

	let [schema,setSchema] = useState({type:"page",body:{}})
	const { moduleId, pageId = 'index', param0, param1, param2 } = useMatch<Global.AnyObject>(
		/^\/syd\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['moduleId', 'pageId', 'param0', 'param1', 'param2']
	)

	const getPageSchema = () => {
		return axios.get<Global.AnyObject, Response<Global.AnyObject>>(`/api/v1/syd/schema/${moduleId}/${pageId}`,{ param0, param1, param2 })
	}	

	// 初始化获取所有页面信息
	useEffect(() => {
		getPageSchema().then((res:any) => {
			if (res.code && res.message && res.code == 200) {
				setSchema(res)
			}
		})
	  }, [])


	if (!moduleId) history.push('/404')
	

	const __s = JSON.stringify(schema, null, 2).toString() 
	return (
		<div>xxx</div>//<div dangerouslySetInnerHTML={{ __html: JSON.stringify(__s, null, 2) }} />
	)
}

export default Index
