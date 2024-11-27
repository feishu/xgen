import React from 'react'
import './style/index.less'
import {render as renderAmis, RenderOptions} from 'amis'
import {AlertComponent} from 'amis-ui'
import {message} from 'antd'
import { getLocale, history, useSearchParams } from '@umijs/max'
import {amisRequest} from './request'
import * as qs from 'qs';

const Index = ({schema, className = ''}: { schema: Record<string, any>, className?: string }) => {
    const locale = getLocale()
    const localeMap = {
        'zh_CN': 'zh-CN',
        'en': 'en-US',
        'zh-CN': 'zh-CN',
        'en-US': 'en-US'
    }

    const localeValue = localeMap[locale as keyof typeof localeMap || 'zh_CN'] || 'zh-CN'
    const props = {locale: localeValue, location: history.location}
    const [params] = useSearchParams()

    const normalizeLink = (to:string) => {
        if (/^\/api\//.test(to)) {
            return to;
        }
        to = to || '';
        const location = history.location;
        if (to && to[0] === '#') {
            to = location.pathname + location.search + to;
        } else if (to && to[0] === '?') {
            to = location.pathname + to;
        }
        const idx = to.indexOf('?');
        const idx2 = to.indexOf('#');
        let pathname =  ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to;
        let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
        let hash = ~idx2 ? to.substring(idx2) : '';
        if (!pathname) {
            pathname = location.pathname;
        }else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
            let relativeBase = location.pathname;
            const paths = relativeBase.split('/');
            paths.pop();
            let m;
            while ((m = /^\.\.?\//.exec(pathname))) {
                if (m[0] === '../') {
                    paths.pop();
                }
                pathname = pathname.substring(m[0].length);
            }
            pathname = paths.concat(pathname).join('/');
        }
        return pathname + search + hash;
    }

    const options: RenderOptions = {
        enableAMISDebug: params.get('debug') === 'true',
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
             isCurrentUrl: (to:string) => {
                const link = normalizeLink(to);
                const location = history.location;
                let pathname = link;
                let search = '';
                const idx = link.indexOf('?');
                if (~idx) {
                    pathname = link.substring(0, idx);
                    search = link.substring(idx);
                }
                if (search) {
                    if (pathname !== location.pathname || !location.search) {
                        return false;
                    }
                    const query = qs.parse(search.substring(1));
                    const currentQuery = qs.parse(location.search.substring(1));
                    return Object.keys(query).every(key => query[key] === currentQuery[key]);
                } else if (pathname === location.pathname) {
                    return true;
                }
                return false;
            },
        // isCurrentUrl: (url: string) => history.location.pathname + history.location.search === url,
    }

    return (
        <>
            <AlertComponent key="alert" locale={localeValue}/>
            {renderAmis(schema, props, options)}
        </>
    )
}

export default window.$app.memo(Index)