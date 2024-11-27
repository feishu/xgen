import { Menu, type MenuProps } from "antd";
import { useMemo } from "react";
import { useNavigate, useLocation } from "@umijs/max";
import { useThemeToken } from "@/hooks/theme";
import type { IPropsMenu } from '../../types'
import { NAV_HORIZONTAL_HEIGHT } from "../config";
import { useMenuItems, useSearch } from '../../components/Menu/hooks'

type Props = {
	closeSideBarDrawer?: () => void;
};

export default function NavHorizontal(props: IPropsMenu & Props) {
	const { items } = props
	const { current_items } = useSearch(items)
	const { menu_items } = useMenuItems(current_items)

	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { colorBgElevated } = useThemeToken();
	const selectedKeys = useMemo(() => [pathname], [pathname]);

	const onClick: MenuProps["onClick"] = ({ key }) => {
		navigate(key);
	};

	return (
		<div className="w-screen" style={{ height: NAV_HORIZONTAL_HEIGHT }}>
			<Menu
				mode="horizontal"
				items={menu_items}
				defaultOpenKeys={[]}
				selectedKeys={selectedKeys}
				onClick={onClick}
				className="!z-10 !border-none"
				style={{ background: colorBgElevated }}
			/>
		</div>
	);
}
