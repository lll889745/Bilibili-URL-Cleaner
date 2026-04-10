# Bilibili URL Cleaner

清除B站链接中的追踪参数。

## 这是什么

B站的视频链接经常带一长串的追踪参数，比如：

https://www.bilibili.com/video/BV0000000000/?spm_id_from=000.000.recommend_more_video.0&trackid=web_related_0.router-related-0000000-aaaaa.0000000000000.000&vd_source=a0aa0000a0a00000000000aa00aaa000

`spm_id_from`会记录用户从哪个页面的哪个位置点进来；同一批推荐的视频会带同一个`trackid`；`vd_source`则会视频的来源渠道。这些参数不仅对用户毫无益处，还会白白泄露隐私。

浏览器常见的URL清理扩展一般都基于webRequest/declarativeNetRequest，只能拦截导航、跳转、新标签页这种真实的网络请求。但B站的推荐流是前端SPA路由跳转，URL是通过`history.pushState`写进地址栏的，而且在已登录的情况下，页面JS还会主动往地址栏注入`vd_source`。所以这个脚本应运而生。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展。如果你使用Chrome 138及以上版本，还需要打开它的“允许用户脚本”开关。

2. 点击安装[此处](https://raw.githubusercontent.com/lll889745/Bilibili-URL-Cleaner/main/bilibili-url-cleaner.user.js)安装脚本。

## 自定义

如果想要添加新的追踪参数，把新参数名加到脚本的`DIRTY_PARAMS`数组里保存即可。

## 常见问题

**Q: 装完脚本没生效？**
A: 依次检查：（1）Tampermonkey是否启用；（2）脚本开关是否打开；（3）Chrome 138+是否开启了"允许用户脚本"。

**Q: 复制的链接还是带参数？**
A: 如果是从地址栏复制，确认地址栏本身是否已经清理；如果是从分享按钮复制，那是B站分享面板生成的链接，不经过脚本。

**Q: 会影响视频播放或登录吗？**
A: 不会，脚本只删除追踪用的参数。

## License

[MIT](./LICENSE)
