import { Form, Radio, Input, Select, Tag as AntTag } from 'antd'
import type { FormInstance } from 'antd'
import { getLocale } from '@umijs/max'
import { useEffect, useState } from 'react'
import styles from '../index.less'
import useAIChat from '@/layouts/components/Neo/hooks/useAIChat'
import { useGlobal } from '@/context/app'

const { TextArea } = Input
const { Option } = Select

// 默认标签列表，实际应用中应该从 API 获取
const defaultTags = [
	'coding',
	'writing',
	'analysis',
	'research',
	'translation',
	'data',
	'creative',
	'education',
	'productivity'
]

interface GeneralProps {
	form: FormInstance
}

export default function General({ form }: GeneralProps) {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const readonly = Form.useWatch('readonly', form)
	const [tags, setTags] = useState<string[]>([])
	const [inputVisible, setInputVisible] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const { getAssistantTags } = useAIChat({})
	const global = useGlobal()
	const { connectors } = global

	// 从 API 获取标签列表
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await getAssistantTags()
				if (Array.isArray(response)) {
					setTags(response)
				}
			} catch (error) {
				console.error('Failed to fetch tags:', error)
				// 如果 API 调用失败，使用默认标签
				setTags([
					'coding',
					'writing',
					'analysis',
					'research',
					'translation',
					'data',
					'creative',
					'education',
					'productivity'
				])
			}
		}
		fetchTags()
	}, [])

	const handleClose = (removedTag: string) => {
		if (readonly) return
		const currentTags = form.getFieldValue('tags')
		const newTags = Array.isArray(currentTags) ? currentTags.filter((tag: string) => tag !== removedTag) : []
		form.setFieldValue('tags', newTags)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleInputConfirm = () => {
		if (readonly) return
		const currentTags = form.getFieldValue('tags')
		if (inputValue && Array.isArray(currentTags) && !currentTags.includes(inputValue)) {
			form.setFieldValue('tags', [...currentTags, inputValue])
		} else if (inputValue) {
			form.setFieldValue('tags', [inputValue])
		}
		setInputVisible(false)
		setInputValue('')
	}

	const showInput = () => {
		if (readonly) return
		setInputVisible(true)
	}

	const handleTagClick = (tag: string) => {
		if (readonly) return
		const currentTags = form.getFieldValue('tags')
		if (!Array.isArray(currentTags)) {
			form.setFieldValue('tags', [tag])
			return
		}
		if (currentTags.includes(tag)) return
		form.setFieldValue('tags', [...currentTags, tag])
	}

	return (
		<Form
			form={form}
			layout='vertical'
			className={styles.form}
			requiredMark={false}
			prefixCls='xgen'
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			disabled={readonly}
		>
			<Form.Item
				name='name'
				label={is_cn ? '助手名称' : 'Assistant Name'}
				rules={[{ required: true, message: is_cn ? '请输入助手名称' : 'Please input assistant name' }]}
			>
				<Input placeholder={is_cn ? '输入一个描述性名称' : 'Enter a descriptive name'} />
			</Form.Item>

			<Form.Item name='tags' label={is_cn ? '标签' : 'Tags'}>
				<div className={styles.tagsContainer}>
					<div className={styles.selectedTags}>
						{(() => {
							const formTags = form.getFieldValue('tags')
							return Array.isArray(formTags)
								? formTags.map((tag: string) => (
										<AntTag
											key={tag}
											closable={!readonly}
											onClose={() => handleClose(tag)}
											className={styles.tagItem}
										>
											{tag}
										</AntTag>
								  ))
								: null
						})()}
						{!readonly && !inputVisible && (
							<AntTag onClick={showInput} className={styles.tagPlus}>
								+ {is_cn ? '新标签' : 'New Tag'}
							</AntTag>
						)}
						{inputVisible && (
							<Input
								type='text'
								size='small'
								className={styles.tagInput}
								value={inputValue}
								onChange={handleInputChange}
								onBlur={handleInputConfirm}
								onPressEnter={handleInputConfirm}
								autoFocus
							/>
						)}
					</div>
					<div className={styles.tagSuggestions}>
						<div className={styles.suggestionsTitle}>
							{is_cn ? '推荐标签' : 'Suggested Tags'}:
						</div>
						<div className={styles.suggestionsList}>
							{tags.map((tag) => (
								<AntTag
									key={tag}
									onClick={() => handleTagClick(tag)}
									className={styles.suggestionTag}
								>
									{tag}
								</AntTag>
							))}
						</div>
					</div>
				</div>
			</Form.Item>

			<Form.Item
				name='description'
				label={is_cn ? '描述' : 'Description'}
				rules={[{ required: true, message: is_cn ? '请输入描述' : 'Please input description' }]}
			>
				<TextArea
					autoSize={{ minRows: 4, maxRows: 6 }}
					placeholder={
						is_cn
							? '描述这个助手能做什么以及如何帮助用户...'
							: 'Describe what this assistant can do and how it can help users...'
					}
				/>
			</Form.Item>

			<Form.Item
				name='connector'
				label={is_cn ? 'AI 连接器' : 'AI Connector'}
				rules={[{ required: true, message: is_cn ? '请选择AI连接器' : 'Please select AI connector' }]}
			>
				<Select
					placeholder={
						is_cn
							? '选择为此助手提供支持的AI连接器'
							: 'Select the AI connector to power this assistant'
					}
					showSearch
					filterOption={(input, option) =>
						(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
					}
				>
					{Object.keys(connectors?.mapping || {}).map((key) => (
						<Option key={key} value={key}>
							{connectors.mapping[key]}
						</Option>
					))}
				</Select>
			</Form.Item>

			<div className='radio-group-container'>
				<Form.Item label={is_cn ? '自动化' : 'Automation'} name='automated' initialValue={true}>
					<Radio.Group>
						<Radio value={true}>{is_cn ? '启用' : 'Enable'}</Radio>
						<Radio value={false}>{is_cn ? '禁用' : 'Disable'}</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item label={is_cn ? '提及' : 'Mentions'} name='mentionable' initialValue={true}>
					<Radio.Group>
						<Radio value={true}>{is_cn ? '允许' : 'Allow'}</Radio>
						<Radio value={false}>{is_cn ? '不允许' : 'Disallow'}</Radio>
					</Radio.Group>
				</Form.Item>
			</div>

			{/* Hidden fields for built_in and readonly */}
			<Form.Item name='built_in' hidden>
				<Input type='hidden' />
			</Form.Item>

			<Form.Item name='readonly' hidden>
				<Input type='hidden' />
			</Form.Item>
		</Form>
	)
}
