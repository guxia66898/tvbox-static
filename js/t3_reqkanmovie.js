// 诊断 T3：调用 request 抓取真实站点 kanmovie（我现有规则用的源站），把返回长度写进标题。
// 若 T2 正常但 T3 异常/为空，说明是 具体站点被墙/反爬，而非 req 整体失效。
var rule = {
  title: `T3-请求西瓜影视`,
  host: `https://www.kanmovie.com`,
  homeUrl: `/movies`,
  url: `/movies`,
  searchable: 0,
  quickSearch: 0,
  filterable: 0,
  class_name: `测试`,
  class_url: `test`,
  一级: `js:
    let title = '【T3】';
    try {
      let h = request(HOST + '/movies');
      if (h === undefined || h === null) { title += 'req返回undefined/null'; }
      else if (h === '') { title += 'req返回空字符串'; }
      else { title += 'req返回长度=' + h.length; }
    } catch (e) {
      title += 'req抛异常:' + (e && e.message ? e.message : e);
    }
    VODS = [{url: 'https://example.com/t3', title: title, desc: '看标题判断真实站点能否抓到', pic_url: ''}];
  `,
  二级: `js:
    VOD = {vod_id: input, vod_name: '【T3】', vod_pic: '', vod_content: '', vod_play_from: '默认', vod_play_url: ''};
  `,
  lazy: ``,
  play_parse: false,
}
if (typeof module !== 'undefined') { module.exports = rule; }
