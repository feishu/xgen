import { useMemoizedFn, useTitle } from 'ahooks'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useGlobal } from '@/context/app'
import styles from './index.less'
import Left from './components/Left'
import type { CSSProperties } from 'react'
import type { IProps, IPropsLeft } from './types'
import { getItemBy } from '@/utils'

const Index = (props: IProps) => {
	const { children, title: page_title, className, style, withRows, full } = props
	const global = useGlobal()
	const { layout } = global
	let title = page_title
	if( !page_title && global.menu.length >=  global.current_nav + 1){
		const menuItem = global.menu[global.current_nav]?.children || []
		title = menuItem.length > 0 ? getItemBy('key',menuItem || [], global.menu_key_path)?.name ?? '' : global.menu[global.current_nav]?.name
	}

	useTitle(`${global.app_info.name} - ${global.menu[global.current_nav]?.name} - ${title}`)
	const toggleVisibleMenu = useMemoizedFn(() => (global.visible_menu = !global.visible_menu))
	const props_left: IPropsLeft = {
		title,
		visible_menu: global.visible_menu,
		layout: global.layout,
		toggleVisibleMenu
	}

	const wrap_style = full
		? ({
				padding: layout && layout == 'Admin' ? '0 60px' : '0 32px',
				maxWidth: '100%'
		  } as CSSProperties)
		: {}

	return (
		<div
			className={clsx([styles._local, className, withRows ? styles.with_rows : '', 'relative'])}
			style={style}
		>
			<div
				id='page_content_wrap'
				className='page_content_wrap flex flex_column transition_normal'
				style={wrap_style}
			>
				<header
					className={clsx([
						'header w_100 border_box flex justify_between align_center',
						layout == 'Chat' ? 'header_chat' : ''
					])}
				>
					<Left {...props_left}></Left>
				</header>
				<div className='ml-2 mr-2'>{children}</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
