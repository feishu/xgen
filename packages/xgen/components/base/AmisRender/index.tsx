import React from 'react'
import './style/index.less'
import { position, render as renderAmis, RenderOptions } from 'amis'
import { AlertComponent, ToastComponent, alert, toast } from 'amis-ui'
import { getLocale, history } from '@umijs/max'
import { amisRequest } from './request'
import { match } from 'path-to-regexp'
import { observer } from 'mobx-react-lite'


const normalizeLink = (to, location = history.location) => {
  to = to || '';
  if (to && to[0] === '#') {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === '?') {
    to = location.pathname + to;
  }
  const idx = to.indexOf('?');
  const idx2 = to.indexOf('#');
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
      ? to.substring(0, idx2)
      : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
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

const Index = ({ schema, className = '' }) => {
  const locale = getLocale()
  const localeMap = {
    'zh_CN': 'zh-CN',
    'en': 'en-US',
    'zh-CN': 'zh-CN',
    'en-US': 'en-US'
  }

  const localeValue = localeMap[locale || 'zh_CN'] || 'zh-CN'

  const props = { locale: localeValue, location: history.location }

  const options: RenderOptions = {
    enableAMISDebug: true,
    fetcher: (api) => amisRequest(api, localeValue),
    updateLocation: (location, replace) => {
      location = normalizeLink(location);
      if (location === 'goBack') {
        return history.goBack();
      } else if (
        (!/^https?\:\/\//.test(location) &&
          location ===
          history.location.pathname + history.location.search) ||
        location === history.location.href
      ) {
        // 目标地址和当前地址一样，不处理，免得重复刷新
        return;
      } else if (/^https?\:\/\//.test(location) || !history) {
        return (window.location.href = location);
      }

      history[replace ? 'replace' : 'push'](location);
    },
    copy: async (content) => {
      //todo
    },
    notify: (type: string, msg: any) => {
      const conf: any = { position: 'top-right' }
      if (typeof msg !== 'string') {
        Object.assign(conf, msg.conf)
        msg = msg?.body ?? msg.msg ?? msg.message
      }

      if (!msg?.length) {
        return
      }

      toast[type] && toast[type](msg, {
        ...conf
      })
    },
    alert,
    isCurrentUrl: (to: string, ctx: any) => {
      if (!to) {
        return false;
      }
      const pathname = history.location.pathname;
      const link = normalizeLink(to, {
        ...location,
        pathname,
        hash: ''
      });

      if (!~link.indexOf('http') && ~link.indexOf(':')) {
        let strict = ctx && ctx.strict;
        return match(link, {
          decode: decodeURIComponent,
          strict: typeof strict !== 'undefined' ? strict : true
        })(pathname);
      }

      return decodeURI(pathname) === link;
    },
  }

  return (
    <div className={className}>
      <ToastComponent key="toast" locale={localeValue} />
      <AlertComponent key="alert" locale={localeValue} />
      {renderAmis(schema, props, options)}
    </div>
  )
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()