import { useResponsive } from "@/hooks/theme";

import NavHorizontal from "./nav-horizontal";
import NavVertical from "./nav-vertical";
import { useGlobal } from '@/context/app'
import { ThemeLayout } from "#/enum";

export default function Nav() {
	const global = useGlobal()
	const { themeLayout } = global.settings??{};
	const { screenMap } = useResponsive();

	if (themeLayout === ThemeLayout.Horizontal) return <NavHorizontal />;

	if (screenMap.md) return <NavVertical />;
	return null;
}
