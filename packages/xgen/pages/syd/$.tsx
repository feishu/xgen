import { useMatch } from '@/hooks'
// import { useMount, useRequest } from 'ahooks'
import { history, useSearchParams, getLocale } from '@umijs/max'
import axios from 'axios'
import { useEffect, useState } from 'react'
import type { Global, Response } from '@/types'
import AmisRender from '@/components/base/AmisRender'
import { Page } from '@/components'

/** Dynamically forward to the components */
const Index = () => {
	const locale = getLocale()
	const [params] = useSearchParams()
	const search_params = Object.fromEntries(params)
	const { moduleId, pageId = 'index', param0, param1, param2 } = useMatch<Global.AnyObject>(
		/^\/syd\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['moduleId', 'pageId', 'param0', 'param1', 'param2']
	)

	const [schema,setSchema] = useState({type:"page",body:{}})
	const [loading, setLoading] = useState(true)	
	const getPageSchema = () => {
		return axios.get<Global.AnyObject, Response<Global.AnyObject>>(`/api/v1/syd/schema/${moduleId}/${pageId}`,{ param0, param1, param2 })
	}	

	// 初始化获取所有页面信息
	useEffect(() => {
		getPageSchema().then((res:any) => {
			setLoading(false)
			if (res && res.body) {
				if(!schema.full)
					schema.full = false
				setSchema(res)
			}
		})
	  }, [moduleId,pageId])


	if (!moduleId) history.push('/404')

	return (
		<Page title={schema.title} className='w_100' full={schema.full} withRows>
			<AmisRender schema={schema}/>
		</Page>
	)
}

export default Index
