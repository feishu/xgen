import type { Theme, Locale, Menu } from '@/types'
import type { GlobalModel } from '@/context/app'

export interface IPropsNav {
	theme: GlobalModel['theme']
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	menu: Array<Menu>
	visible_nav: GlobalModel['visible_nav']
	current_nav: GlobalModel['current_nav']
	setTheme: GlobalModel['setTheme']
	setAvatar: GlobalModel['setAvatar']
	setCurrentNav: (current: GlobalModel['current_nav']) => void
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsLogo {
	logo: GlobalModel['app_info']['icons']
}

export interface IPropsItems {
	menu: Array<Menu>
	current_nav: GlobalModel['current_nav']
	setCurrentNav: (current: GlobalModel['current_nav']) => void
}

export interface IPropsOptions {
	theme: GlobalModel['theme']
	avatar: GlobalModel['avatar']
	app_info: GlobalModel['app_info']
	user: GlobalModel['user']
	setTheme: GlobalModel['setTheme']
	setAvatar: GlobalModel['setAvatar']
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsMenu {
	visible: boolean
	blocks: boolean
	title: Menu['name']
	items: Array<any>
	current_menu: GlobalModel['current_menu']
	setCurrentMenu: (current: GlobalModel['current_menu']) => void
}

export interface IPropsContainer {
	visible_nav: GlobalModel['visible_nav']
	visible_menu: GlobalModel['visible_menu']
}

export interface IPropsSettingModalContent {
	locale_messages: GlobalModel['locale_messages']
	locale: Locale
	theme: Theme
	setTheme: GlobalModel['setTheme']
	getUserMenu: GlobalModel['getUserMenu']
}

export interface IPropsUserModalContent {
	user: IPropsOptions['user']
	locale_messages: GlobalModel['locale_messages']
      Avatar: JSX.Element
	setAvatar: GlobalModel['setAvatar']
}
