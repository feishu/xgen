import { useMatch } from '@/hooks'
import { history, useSearchParams } from '@umijs/max'

import type { Global } from '@/types'

/** Dynamically forward to the components */
const Index = () => {
	const [params] = useSearchParams()
	const search_params = Object.fromEntries(params)

	const { type, model, id, formType } = useMatch<Global.Match>(
		/^\/syd\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/,
		['type', 'model', 'id', 'formType']
	)

	if (!model) history.push('/404')
	const html =  `type={type},model={model},id={id},formType={formType},search_params={search_params}`
	return (
		<div>{html}</div>
	)
}

export default Index
