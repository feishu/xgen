
import { Link } from '@umijs/max'
import { useThemeToken } from "@/hooks/theme";

import { Iconify } from "../Icon";

interface Props {
	size?: number | string;
}
function Logo({ size = 50 }: Props) {
	const { colorPrimary } = useThemeToken();

	return (
		<Link to="/">
			<Iconify icon="solar:code-square-bold" color={colorPrimary} size={size} />
		</Link>
	);
}

export default Logo;
