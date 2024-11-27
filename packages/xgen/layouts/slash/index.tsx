import { Layout } from "antd";
import { useScroll } from "framer-motion";
import {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styled from "styled-components";

// import { CircleLoading } from "@/components/loading";
import Loading from '../components/Loading'
import ProgressBar from "@/widgets/ProgressBar";
import clsx from 'clsx'
import { toJS } from 'mobx'
import Header from "./header";
import Main from "./main";
import Nav from "./nav";

import { ThemeLayout, ThemeMode } from "@/types/enum";
import { useGlobal } from '@/context/app'

import type {
	IPropsLoading,
} from '../types'


function SlashLayout() {
    const global = useGlobal()
	const mainEl = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll({ container: mainEl });

	/**
	 *  Tracks if content is scrolled
	 */
	const [offsetTop, setOffsetTop] = useState(false);

	const onOffSetTop = useCallback(() => {
		scrollY.on("change", (scrollHeight) => {
			setOffsetTop(scrollHeight > 0);
		});
	}, [scrollY]);

	useEffect(() => {
		onOffSetTop();
	}, [onOffSetTop]);

	// Memoize layout className
	const layoutClassName = useMemo(() => {
		return clsx(
			"flex h-screen overflow-hidden",
			global.settings.themeLayout === ThemeLayout.Horizontal ? "flex-col" : "flex-row",
		);
	}, [global.settings.themeLayout]);

	const menu = toJS(global.menu)
	const menu_items = useMemo(() => menu[global.current_nav]?.children || [], [menu, global.current_nav])
	const show_name = global.app_info.optional?.menu?.showName || false
	const props_loading: IPropsLoading = {
		loading: global.loading,
		menu: menu_items,
		visible_menu: global.visible_menu,
		show_name: show_name
	}

	return (
		<ScrollbarStyleWrapper $themeMode={global.settings.themeMode}>
			<ProgressBar />
			<Layout className={layoutClassName}>
				<Suspense fallback={<Loading {...props_loading}></Loading>}>
					<Layout>
						<Header
							offsetTop={
								global.settings.themeLayout === ThemeLayout.Vertical ? offsetTop : undefined
							}
						/>
						<Nav />
						<Main ref={mainEl} offsetTop={offsetTop} />
					</Layout>
				</Suspense>
			</Layout>
		</ScrollbarStyleWrapper>
	);
}
export default SlashLayout;

// Move styles to a separate constant
const scrollbarStyles = {
	dark: {
		track: "#2c2c2c",
		thumb: "#6b6b6b",
		thumbHover: "#939393",
	},
	light: {
		track: "#FAFAFA",
		thumb: "#C1C1C1",
		thumbHover: "#7D7D7D",
	},
};

const ScrollbarStyleWrapper = styled.div<{ $themeMode?: ThemeMode }>`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background: ${({ $themeMode }) =>
			$themeMode === ThemeMode.Dark
				? scrollbarStyles.dark.track
				: scrollbarStyles.light.track};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${({ $themeMode }) =>
			$themeMode === ThemeMode.Dark
				? scrollbarStyles.dark.thumb
				: scrollbarStyles.light.thumb};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ $themeMode }) =>
			$themeMode === ThemeMode.Dark
				? scrollbarStyles.dark.thumbHover
				: scrollbarStyles.light.thumbHover};
  }

  .simplebar-scrollbar::before {
    background: ${({ $themeMode }) =>
			$themeMode === ThemeMode.Dark
				? scrollbarStyles.dark.thumb
				: scrollbarStyles.light.thumb};
  }

  .simplebar-scrollbar.simplebar-visible:before {
    opacity: 1;
  }
`;
