import { useMemo, useEffect, useState } from "react";
import { useNavigate, useRouteProps, useOutlet } from "@umijs/max";

export function useRouter() {
	const navigate = useNavigate();

	const router = useMemo(
		() => ({
			back: () => navigate(-1),
			forward: () => navigate(1),
			reload: () => window.location.reload(),
			push: (href: string) => navigate(href),
			replace: (href: string) => navigate(href, { replace: true }),
		}),
		[navigate],
	);

	return router;
}


/**
 * 返回当前路由Meta信息
 */
export function useCurrentRouteMeta() {
	return useRouteProps();
	// const { push } = useRouter();

	// // 获取路由组件实例
	// const children = useOutlet();

	// // 获取所有匹配的路由
	// const matchs = useMatches();

	// // 获取拍平后的路由菜单
	// const flattenedRoutes = useFlattenedRoutes();

	// const [currentRouteMeta, setCurrentRouteMeta] = useState<any>();

	// // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	// 获取当前匹配的路由
	// 	const lastRoute = matchs.at(-1);
	// 	if (!lastRoute) return;

	// 	const { pathname, params } = lastRoute;
	// 	const matchedRouteMeta = flattenedRoutes.find((item) => {
	// 		const replacedKey = replaceDynamicParams(item.key, params);
	// 		return replacedKey === pathname || `${replacedKey}/` === pathname;
	// 	});

	// 	if (matchedRouteMeta) {
	// 		matchedRouteMeta.outlet = children;
	// 		if (!isEmpty(params)) {
	// 			matchedRouteMeta.params = params;
	// 		}
	// 		setCurrentRouteMeta({ ...matchedRouteMeta });
	// 	} else {
	// 		push(HOMEPAGE);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [matchs]);

	// return currentRouteMeta;
}
