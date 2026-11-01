// K-静态自检规则 —— 诊断专用，**完全不需要联网**。
//
// 用途：把"JS 引擎能否运行"和"站点能否抓取"两件事拆开。
//   · 这个站点能列出「静态条目1/2」→ 引擎跑起来了，问题在网络或规则逻辑
//   · 这个站点也报「爬虫加载失败」→ 卡在引擎/规则文件的加载环节，
//     与目标影视站无关
//
// 里面没有任何 request() 调用，纯内存返回。
var rule = {
  title: 'K-静态自检',
  host: 'https://example.com',
  class_name: '自检',
  class_url: 'selfcheck',

  一级: `js:
    VODS = [
      {url: 'https://example.com/1', title: '静态条目1', desc: '无需联网', pic_url: ''},
      {url: 'https://example.com/2', title: '静态条目2', desc: '无需联网', pic_url: ''}
    ];
  `,

  二级: `js:
    VOD = {
      vod_id: input,
      vod_name: '静态详情',
      vod_pic: '',
      vod_content: '能走到这一步说明 JS 引擎工作正常，问题不在引擎。',
      vod_play_from: '默认',
      vod_play_url: '第1集$https://example.com/a.m3u8'
    };
  `,

  搜索: `js:
    VODS = [
      {url: 'https://example.com/s1', title: '静态搜索结果', desc: '无需联网', pic_url: ''}
    ];
  `
};
