import en_US from "antd/es/locale/en_US";
import zh_CN from "antd/es/locale/zh_CN";

import { Dropdown } from "antd";

import { getLocale, setLocale } from '@umijs/max'

import { IconButton, SvgIcon } from "../Icon";

import type { MenuProps } from "antd";
import type { Locale as AntdLocal } from "antd/es/locale";

import { LocalEnum } from "@/types/enum";

type Locale = keyof typeof LocalEnum;
type Language = {
	locale: keyof typeof LocalEnum;
	icon: string;
	label: string;
	antdLocal: AntdLocal;
};

const LANGUAGE_MAP: Record<Locale, Language> = {
	[LocalEnum.zh_CN]: {
		locale: LocalEnum.zh_CN,
		label: "Chinese",
		icon: "ic-locale_zh_CN",
		antdLocal: zh_CN,
	},
	[LocalEnum.en_US]: {
		locale: LocalEnum.en_US,
		label: "English",
		icon: "ic-locale_en_US",
		antdLocal: en_US,
	},
};

/**
 * Locale Picker
 */
export default function LocalePicker() {
	const locale = getLocale();

	const localeList: MenuProps["items"] = Object.values(LANGUAGE_MAP).map(
		(item) => {
			return {
				key: item.locale,
				label: item.label,
				icon: <SvgIcon icon={item.icon} size="20" className="rounded-md" />,
			};
		},
	);

	return (
		<Dropdown
			placement="bottomRight"
			trigger={["click"]}
			menu={{ items: localeList, onClick: (e) => setLocale(e.key as Locale) }}
		>
			<IconButton className="h-10 w-10 hover:scale-105">
				<SvgIcon
					icon={`ic-locale_${locale}`}
					size="24"
					className="rounded-md"
				/>
			</IconButton>
		</Dropdown>
	);
}
