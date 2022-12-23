import { Affix, Button } from 'antd'
import clsx from 'clsx'
import { Fragment, useMemo, useState } from 'react'
import { When } from 'react-if'

import { useAction } from '@/actions'
import { useActionDisabled, useActionStyle } from '@/hooks'
import { getTemplateValue } from '@/utils'
import { Icon } from '@/widgets'

import styles from './index.less'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { namespace, primary, type, id, actions, data, disabledActionsAffix } = props
	const [stick, setStick] = useState<boolean | undefined>(false)
	const getStyle = useActionStyle()
	const getDisabled = useActionDisabled()
	const onAction = useAction()
	const when_add_and_view = id === 0 || type === 'view'

	const _actions = useMemo(() => {
		if (when_add_and_view) {
			return getTemplateValue(actions!, data).filter((item) => item.showWhenAddAndView)
		}

		return getTemplateValue(actions!, data)
	}, [actions, data, when_add_and_view])

	return (
		<Affix offsetTop={11} style={{ zIndex: disabledActionsAffix ? 0 : 101 }} onChange={(v) => setStick(v)}>
			<div
				className={clsx([
					styles._local,
					'w_100 border flex align_center transition_normal',
					stick && styles.stick
				])}
			>
				<div className='flex align_center'>
					{_actions?.map((it, index) => (
						<Fragment key={index}>
							<Button
								className={clsx([
									'btn_action border_box flex justify_center align_center clickable',
									getStyle(it.style),
									getDisabled(it.disabled)
								])}
								icon={<Icon name={it.icon} size={15}></Icon>}
								onClick={() =>
									onAction({
										namespace,
										primary,
										data_item: data,
										it
									})
								}
							>
								{it.title}
                                          </Button>
                                          <When condition={it.divideLine}>
								<div className='divide_line'></div>
							</When>
						</Fragment>
					))}
				</div>
			</div>
		</Affix>
	)
}

export default window.$app.memo(Index)
