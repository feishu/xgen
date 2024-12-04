import React from 'react'
// import './style/index.less'
import {render as renderAmis, RenderOptions} from 'amis'
import {AlertComponent} from 'amis-ui'
import {message} from 'antd'
import { getLocale, history } from '@umijs/max'
import {amisRequest} from './request'

const Index = ({schema, className = ''}) => {
    const locale = getLocale()
    const localeMap = {
        'zh_CN': 'zh-CN',
        'en': 'en-US',
        'zh-CN': 'zh-CN',
        'en-US': 'en-US'
    }

    const localeValue = localeMap[locale || 'zh_CN'] || 'zh-CN'

    const props = {locale: localeValue, location: history.location}

    const options: RenderOptions = {
        enableAMISDebug: true,
        fetcher: ({url, method, data}) => amisRequest(url, method, data),
        updateLocation: (location, replace) => {
            replace || history.push(location)
        },
        copy: async (content) => {
            //todo
        },
        notify: (type: string, msg: any, conf: any) => {
            if (typeof msg !== 'string') {
                msg = conf?.body
            }

            if (!msg?.length) {
                return
            }

            

            let handle = () => message.open({
                content: msg,
                type: (['info', 'success', 'error', 'warning', 'loading'].includes(type) ? type : 'info') as any,
                duration: (conf?.timeout || 3000) / 1000,
            })

            handle()
        },
        isCurrentUrl: (url: string) => history.location.pathname + history.location.search === url,
    }

    return (
        <div className={className}>
            <AlertComponent key="alert" locale={localeValue}/>
            {renderAmis(schema, props, options)}
        </div>
    )
}

export default window.$app.memo(Index)