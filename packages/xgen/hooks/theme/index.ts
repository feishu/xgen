export { useThemeToken } from "./use-theme-token";
export { useResponsive } from "./use-reponsive";
type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

export const replaceDynamicParams = (
	menuKey: string,
	params: Params<string>,
) => {
	let replacedPathName = menuKey;

	// 解析路由路径中的参数名称
	const paramNames = menuKey.match(/:\w+/g);

	if (paramNames) {
		for (const paramName of paramNames) {
			// 去掉冒号，获取参数名称
			const paramKey = paramName.slice(1);
			if (!params[paramKey]) continue;

			replacedPathName = replacedPathName.replace(paramName, params[paramKey]);
		}
	}

	return replacedPathName;
};
