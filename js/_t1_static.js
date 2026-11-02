// 诊断 T1：纯静态，不调用 request。用于确认引擎加载 + 渲染链路是否正常。
var rule = {
  title: `T1-静态渲染`,
  host: `https://www.baidu.com`,
  homeUrl: `/`,
  url: `/`,
  searchable: 0,
  quickSearch: 0,
  filterable: 0,
  class_name: `测试`,
  class_url: `test`,
  一级: `js:
    // 不调用任何网络，直接返回固定卡片。
    // 若能在 OK影视 里看到这张卡片的标题，说明 引擎加载 + home + 分类 + 渲染 全部正常。
    VODS = [{
      url: 'https://example.com/static',
      title: '【T1】静态渲染OK',
      desc: '引擎与渲染链路正常',
      pic_url: ''
    }];
  `,
  二级: `js:
    VOD = {vod_id: input, vod_name: '【T1】静态详情', vod_pic: '', vod_content: '', vod_play_from: '默认', vod_play_url: ''};
  `,
  lazy: ``,
  play_parse: false,
}
if (typeof module !== 'undefined') { module.exports = rule; }
