// 诊断 T2：调用 request 抓取百度首页，把返回长度写进标题。
// 用于确认宿主的 req() 抓取在 OK影视 里到底有没有返回数据。
var rule = {
  title: `T2-请求百度`,
  host: `https://www.baidu.com`,
  homeUrl: `/`,
  url: `/`,
  searchable: 0,
  quickSearch: 0,
  filterable: 0,
  class_name: `测试`,
  class_url: `test`,
  一级: `js:
    let title = '【T2】';
    try {
      let h = request('https://www.baidu.com');
      if (h === undefined || h === null) { title += 'req返回undefined/null'; }
      else if (h === '') { title += 'req返回空字符串'; }
      else { title += 'req返回长度=' + h.length; }
    } catch (e) {
      title += 'req抛异常:' + (e && e.message ? e.message : e);
    }
    VODS = [{url: 'https://example.com/t2', title: title, desc: '看标题判断 req 是否正常', pic_url: ''}];
  `,
  二级: `js:
    VOD = {vod_id: input, vod_name: '【T2】', vod_pic: '', vod_content: '', vod_play_from: '默认', vod_play_url: ''};
  `,
  lazy: ``,
  play_parse: false,
}
if (typeof module !== 'undefined') { module.exports = rule; }
