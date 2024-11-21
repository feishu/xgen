import { useMatch } from '@/hooks'
import { history, useSearchParams } from '@umijs/max'
import axios from 'axios'
import type { Global, Response } from '@/types'

/** Dynamically forward to the components */
const Index = async () => {
	const locale = getLocale()
	const [params] = useSearchParams()
	const search_params = Object.fromEntries(params)

	const { type, model, id, formType } = useMatch<Global.Match>(
		/^\/syd\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['type', 'model', 'id', 'formType']
	)

	const getPageSchema = async () => {
		const schema = await axios.get<Global.AnyObject, Response<Global.AnyObject>>(`/api/v1/syd/schema/${type}/${model}`)
		return schema
	}	

	if (!model) history.push('/404')
	
	return (
		<div>{await getPageSchema()}</div>
	)
}

export default Index
