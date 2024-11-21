import { useMatch } from '@/hooks'
import { history, useSearchParams } from '@umijs/max'
import axios from 'axios'
import { useEffect, useState } from 'react'
import type { Global, Response } from '@/types'

/** Dynamically forward to the components */
const Index = async () => {
	const locale = getLocale()
	const [params] = useSearchParams()
	const search_params = Object.fromEntries(params)

	let [schema,setSchema] = useState({type:"page",body:{}})
	const { type, model } = useMatch<Global.Match>(
		/^\/syd\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['type', 'model']
	)

	const getPageSchema = () => {
		return axios.get<Global.AnyObject, Response<Global.AnyObject>>(`/api/v1/syd/schema/${type}/${model}`)
	}	

	// 初始化获取所有页面信息
	useEffect(() => {
		getPageSchema().then((res:any) => {
			if (res.code && res.message && res.code == 200) {
				setSchema(res)
			}
		})
	  }, [])


	if (!model) history.push('/404')
	return (
		<div>{ `${schema},${search_params}` } </div>
	)
}

export default Index
