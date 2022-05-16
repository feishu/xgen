import * as echarts from 'echarts/core'
import { useLayoutEffect } from 'react'
import store from 'store2'

import { tooltip } from '@/components/chart/theme/common'
import light_theme from '@/components/chart/theme/light'

import type { RefObject } from 'react'
import type { BarSeriesOption } from 'echarts/charts'
import type {
	AriaComponentOption,
	TooltipComponentOption,
	LegendComponentOption,
	TitleComponentOption
} from 'echarts/components'

type Option = echarts.ComposeOption<
	| BarSeriesOption
	| AriaComponentOption
	| TooltipComponentOption
	| LegendComponentOption
	| TitleComponentOption
>

export interface IProps {
	name: string
	height: number
	data: Array<any>
	x_key: string
	tooltip: TooltipComponentOption
	legend: LegendComponentOption
	series: Array<any>
	hide_label: boolean
}

export default (ref: RefObject<HTMLDivElement>, props: IProps) => {
	useLayoutEffect(() => {
		if (!ref.current) return
		if (!props.data) return

		const series: Array<BarSeriesOption> = []
		const is_dark = store.get('xgen-theme') === 'dark'

		props.series.map((item) => {
			series.push({
				...item,
				data: props.data.reduce((total, it) => {
					total.push({ value: it[item.name], name: it[props.x_key] })

					return total
				}, [])
			})
		})

		const chart = echarts.init(ref.current, is_dark ? 'dark' : light_theme)

		const option: Option = {
			tooltip: is_dark ? tooltip : {},
			backgroundColor: 'transparent',
			title: props.hide_label
				? {
						left: 'left',
						text: props.name,
						textStyle: {
							color: '#aaaab3',
							fontSize: 14,
							fontWeight: 500
						}
				  }
				: undefined,
			aria: {
				decal: { show: true }
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				top: 'middle',
				itemWidth: 15,
				itemHeight: 9,
				textStyle: {
					fontSize: 12
				},
				...props.legend
			},
			series
		}

		chart.setOption(option)
	}, [ref.current, props])
}
