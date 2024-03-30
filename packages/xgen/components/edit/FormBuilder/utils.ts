import axios from 'axios'
import { Field, Layout, Presets, Remote, Setting, Type } from './types'

export const GetSetting = async (setting?: Remote | Setting): Promise<Setting> => {
	if (setting && 'api' in setting) {
		setting = setting as Remote
		const api = setting.api
		const params = { ...setting.params }
		try {
			const res = await axios.get<any, Setting>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(setting as Setting)
}

export const GetPresets = async (presets?: Remote | Presets): Promise<Presets> => {
	// Typeof Remote
	if (presets && 'api' in presets) {
		presets = presets as Remote
		const api = presets.api
		const params = { ...presets.params }
		try {
			const res = await axios.get<any, Presets>(api, { params })
			return Promise.resolve(res)
		} catch (err) {
			console.error('[GetSetting] remote search error', err)
			return Promise.reject(err)
		}
	}
	return Promise.resolve(presets as Presets)
}

export const TypeMappping = (setting: Setting): Record<string, Type> => {
	const mapping: Record<string, Type> = {}
	setting.types?.forEach((type) => {
		if (type.props) {
			type.props.forEach((prop) => {
				prop.columns.forEach((column) => {
					if (setting.fields?.[column.name]) {
						column.component = setting.fields[column.name]
					}
				})
			})
		}
		mapping[type.name] = type
	})
	return mapping
}

export const ValueToLayout = (
	value?: Field[],
	defaultValue?: Field[]
): { layout: Layout[]; mapping: Record<string, Field> } => {
	if (Array.isArray(value)) {
		return _valueToLayout(value)
	}

	if (Array.isArray(defaultValue)) {
		return _valueToLayout(defaultValue)
	}

	return { layout: [], mapping: {} }
}

export const UpdatePosition = (mapping: Record<string, Field>, layout: Layout[]): Record<string, Field> => {
	const newMapping: Record<string, Field> = {}
	layout.forEach((item) => {
		const field = mapping[item.i]
		if (!field) return false

		field.x = item.x
		field.y = item.y
		field.width = item.w
		newMapping[item.i] = field
	})
	return newMapping
}

const generateID = (): string => {
	const timestamp: number = new Date().getTime()
	const random: number = Math.floor(Math.random() * 10000)
	const uniqueId: string = `${timestamp}${random}`
	return uniqueId
}

const _valueToLayout = (value?: Field[]): { layout: Layout[]; mapping: Record<string, Field> } => {
	if (!Array.isArray(value)) {
		return { layout: [], mapping: {} }
	}
	const mapping: Record<string, Field> = {}
	const layout: Layout[] = []

	let cols = 0
	let y = 0
	value.map((item, index) => {
		if (!item) return false
		const key = generateID()
		mapping[key] = item
		if (item.x === undefined) {
			item.x = cols
		}
		if (item.y === undefined) {
			item.y = y
		}

		cols = cols + (item.width || 4)
		if (cols >= 12) {
			cols = 0
			y = y + 1
		}

		layout.push({
			i: key,
			x: item.x || 0,
			y: item.y || 0,
			w: item.width || 4,
			h: 1,
			resizeHandles: ['w', 'e']
		})
	})
	return { layout, mapping }
}
