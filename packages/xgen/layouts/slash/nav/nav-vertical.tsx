import { Layout, Menu, type MenuProps } from "antd";
import { useDeepCompareEffect } from 'ahooks'
import Color from "color";
import { useMemo, useState } from "react";
import { useNavigate } from "@umijs/max";
import type { IPropsMenu } from '../../types'
import { useMenuItems, useSearch } from '../../components/Menu/hooks'
import { useThemeToken } from "@/hooks/theme";
import { NAV_WIDTH } from "../config";
import NavLogo from "./nva-logo";
import { ThemeLayout, ThemeMode } from "#/enum";
import { useGlobal } from '@/context/app'

const { Sider } = Layout;

type Props = {
	closeSideBarDrawer?: () => void;
};
export default function NavVertical(props: IPropsMenu & Props) {
	const global = useGlobal()
	const navigate = useNavigate();
	const { colorBorder } = useThemeToken();
	const { themeLayout, themeMode, darkSidebar } = global.settings??{};


	const { items, menu_selected_keys } = props
	const { current_items } = useSearch(items)
	const { menu_items } = useMenuItems(current_items)
	const [openKeys, setOpenKeys] = useState<Array<string>>([])

	useDeepCompareEffect(() => {
		setOpenKeys(menu_selected_keys)
	}, [menu_selected_keys])

	const collapsed = useMemo(
		() => themeLayout === ThemeLayout.Mini,
		[themeLayout],
	);

	const sidebarTheme = useMemo(() => {
		if (themeMode === ThemeMode.Dark) {
			return darkSidebar ? "light" : "dark";
		}
		return darkSidebar ? "dark" : "light";
	}, [themeMode, darkSidebar]);

	const handleToggleCollapsed = () => {
		setSettings({
			...settings,
			themeLayout: collapsed ? ThemeLayout.Vertical : ThemeLayout.Mini,
		});
	};

	const onClick: MenuProps["onClick"] = ({ key }) => {
		navigate(key);
		props?.closeSideBarDrawer?.();
	};

	const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
		if (collapsed) return;
		setOpenKeys(keys);
	};

	const props_menu: MenuProps = {
		items: menu_items,
		mode: 'inline',
		theme: sidebarTheme,
		selectedKeys: menu_selected_keys,
		...(!collapsed && { openKeys }),
		onOpenChange: handleOpenChange,
		className:"!border-none",
		onClick: onClick
	}

	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={collapsed}
			width={NAV_WIDTH}
			theme={sidebarTheme}
			style={{
				height: "100vh",
				borderRight: `1px dashed ${Color(colorBorder).alpha(0.6).toString()}`,
			}}
		>
			<NavLogo collapsed={collapsed} onToggle={handleToggleCollapsed} />

			<Scrollbar>
				<Menu { ...props_menu }
				/>
			</Scrollbar>
		</Sider>
	);
}
