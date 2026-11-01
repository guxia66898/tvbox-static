// 最小 JS 爬虫 —— 诊断专用。
//
// 目的：**零 import、零外部依赖、零网络**，只实现 TVBox 的爬虫接口。
// 用它把「客户端到底能不能跑 JS 爬虫」和「我们的 drpy 引擎有没有问题」
// 彻底分开：
//
//   · 这个站点能列出「最小爬虫A/B」→ 客户端 JS 爬虫机制正常，
//     问题在我们的 drpy2.min.js（import 解析 / assets:// 依赖）
//   · 这个站点也报「爬虫加载失败」→ 客户端对 JS 爬虫另有约束
//     （比如只认 jar 内置类、或要求特定文件后缀），与我们的规则无关
//
// 注意：这里故意**不用** drpy 的任何约定（没有 rule 对象、没有 js: 前缀），
// 就是 TVBox 原生的接口形式。

function init(ext) {
  return true;
}

function home(filter) {
  return JSON.stringify({
    class: [
      { type_id: '1', type_name: '最小爬虫A' },
      { type_id: '2', type_name: '最小爬虫B' }
    ],
    list: []
  });
}

function homeVod(params) {
  return JSON.stringify({ list: [] });
}

function category(tid, pg, filter, extend) {
  return JSON.stringify({
    page: 1,
    pagecount: 1,
    limit: 20,
    total: 2,
    list: [
      { vod_id: 'min_1', vod_name: '最小条目1', vod_pic: '', vod_remarks: '零依赖' },
      { vod_id: 'min_2', vod_name: '最小条目2', vod_pic: '', vod_remarks: '零依赖' }
    ]
  });
}

function detail(vod_url) {
  return JSON.stringify({
    list: [{
      vod_id: vod_url,
      vod_name: '最小详情',
      vod_pic: '',
      vod_content: '能到这一步说明客户端可以跑 JS 爬虫。',
      vod_play_from: '默认',
      vod_play_url: '第1集$https://example.com/a.m3u8'
    }]
  });
}

function play(flag, id, flags) {
  return JSON.stringify({ parse: 0, url: id });
}

function search(wd, quick, pg) {
  return JSON.stringify({ list: [] });
}

function proxy(params) {
  return [200, 'text/plain', ''];
}

function sniffer() {
  return false;
}

function isVideo(url) {
  return false;
}

// TVBox 的 JS 爬虫约定：导出这些函数
export default {
  init: init,
  home: home,
  homeVod: homeVod,
  category: category,
  detail: detail,
  play: play,
  search: search,
  proxy: proxy,
  sniffer: sniffer,
  isVideo: isVideo
};
