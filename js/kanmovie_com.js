// TVBox drpy 规则 · kanmovie_com
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `kanmovie_com`,
  host: `https://www.kanmovie.com`,
  homeUrl: `/movies`,
  url: `/movies?page=fypage`,
  searchUrl: `/api/suggest?q=**&limit=10`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `电影&电视剧&动漫&综艺`,
  class_url: `movies&tv-series&anime&variety-shows`,
  一级: `js:
    let url = HOST + '/movies';
    if (MY_PAGE && MY_PAGE > 1) { url += '?page=' + MY_PAGE; }
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'li').forEach(function (it) {
        let href = pdfh(it, 'a&&href');
        if (!href || href.indexOf('/detail/') === -1) { return; }
        let t = pdfh(it, 'strong&&Text') || pdfh(it, 'a&&title');
        let pic = pdfh(it, 'img&&src');
        let remark = pdfh(it, '.remarks&&Text') || pdfh(it, 'span&&Text');
        arr.push({
          url: urljoin(HOST, href),
          title: t,
          desc: remark,
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('kanmovie list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    // kanmovie 是 Vue SPA：详情页 HTML 里没有播放数据。
    // 但它有服务端接口 /api/detail-snapshot?id={apiId}，直接返回 playFrom/playUrl。
    // input 形如 https://www.kanmovie.com/detail/jszyapi.com~156501
    let vid = input.split('/detail/').pop();
    let url = HOST + '/api/detail-snapshot?id=' + encodeURIComponent(vid);
    let raw = request(url);
    let v = {vod_id: input, vod_name: '', vod_pic: '', vod_content: '',
             vod_play_from: '默认', vod_play_url: ''};
    try {
      let j = JSON.parse(raw);
      let d = j.video || {};
      v.vod_name = d.name || '';
      v.vod_pic = d.pic || d.picThumb || '';
      v.vod_content = [d.typeName, d.area, d.year, d.remarks].filter(function (x) { return x; }).join(' · ');
      v.vod_play_from = d.playFrom || '默认';
      // playUrl 形如 "正片$https://x.m3u8#第2集$https://y.m3u8"
      v.vod_play_url = d.playUrl || '';
    } catch(e) { log('kanmovie detail err ' + e.message); }
    VOD = v;
  `,
  搜索: `js:
    // 站内 /vodsearch/** 已 404；搜索靠服务端接口 /api/suggest?q=&limit=（limit 上限 10）
    let url = HOST + '/api/suggest?q=' + encodeURIComponent(KEY) + '&limit=10';
    let raw = request(url);
    let arr = [];
    try {
      let j = JSON.parse(raw);
      (j.list || []).forEach(function (it) {
        if (!it.apiId) { return; }
        arr.push({
          url: HOST + '/detail/' + it.apiId,
          title: it.name || '',
          desc: it.remarks || '',
          pic_url: it.pic || it.picThumb || ''
        });
      });
    } catch(e) { log('kanmovie search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
