import { useMatch } from '@/hooks'
// import { useMount, useRequest } from 'ahooks'
import { history, useSearchParams, getLocale } from '@umijs/max'
import axios from 'axios'
import { useEffect, useState } from 'react'
import type { Global, Response } from '@/types'
import AmisRender from '@/components/base/AmisRender'
import { BasePage } from '@/components'

/** Dynamically forward to the components */
const Index = () => {
	// const locale = getLocale()
	// const [params] = useSearchParams()
	// const search_params = Object.fromEntries(params)
	let { moduleId, pageId = 'index', param } = useMatch<Global.AnyObject>(
		/^\/syd\/([^/]+)(?:\/(.*?))?(?:\/([^/]+))?$/,
		['moduleId', 'pageId', 'param']
	)
	const menuIndex = pageId && pageId.indexOf('/_menu')
	if (menuIndex !== -1) {
		pageId = pageId.substr(0, menuIndex)
	}

	const [schema, setSchema] = useState({ type: "page", body: {}, full: false })
	const [loading, setLoading] = useState(true)
	const getPageSchema = () => {
		return axios.get<Global.AnyObject, Response<Global.AnyObject>>(`/api/v1/syd/schema/${moduleId}/${pageId}`, { params: param })
	}

	// 初始化获取所有页面信息
	useEffect(() => {
		getPageSchema().then((res: any) => {
			setLoading(false)
			if (res && res.body) {
				if (!schema.full)
					schema.full = false
				setSchema(res)
			}
		}).catch(res => {
			const { response: data } = res
			const { data: data2 } = data
			data2.code === 404 && history.push('/404')
		})
	}, [moduleId, pageId])


	if (!moduleId) history.push('/404')
	const { title, full, header = true } = schema
	if (header === true) {
		return (
			<BasePage title={title} className='w_100' full={full} withRows>
				<AmisRender schema={schema} />
			</BasePage>
		)
	} else {
		return (<AmisRender schema={schema} />)
	}
}

export default window.$app.memo(Index)
