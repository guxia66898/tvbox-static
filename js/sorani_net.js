// TVBox drpy 规则 · sorani_net
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `sorani_net`,
  host: `https://www.sorani.net`,
  homeUrl: `/anime/explore`,
  url: `/anime/explore?page=fypage`,
  searchUrl: `/anime/explore`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `番剧`,
  class_url: `explore`,
  一级: `js:
    let url = HOST + '/anime/explore';
    if (MY_PAGE && MY_PAGE > 1) { url += '?page=' + MY_PAGE; }
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'a.block').forEach(function (it) {
        let href = pdfh(it, '&&href');
        if (!href || href.indexOf('/anime/') === -1) { return; }
        let pic = pdfh(it, 'img&&src') || pdfh(it, 'img&&data-src');
        arr.push({
          url: urljoin(HOST, href),
          title: pdfh(it, 'img&&alt') || pdfh(it, '&&Text'),
          desc: '',
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('sorani list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    let html = request(input);
    let name = '', pic = '', content = '', eps = [];
    try {
      name = pdfh(html, 'h1&&Text');
      pic = pdfh(html, 'img&&src');
      content = pdfh(html, '.summary&&Text') || pdfh(html, '.description&&Text');
      pdfa(html, 'a').forEach(function (a) {
        let h = pdfh(a, '&&href');
        let t = pdfh(a, '&&Text');
        if (h && h.indexOf('/episode/') > -1) { eps.push((t || '播放') + '$' + urljoin(HOST, h)); }
      });
    } catch(e) { log('sorani detail err ' + e.message); }
    VOD = {
      vod_id: input, vod_name: name, vod_pic: pic, vod_content: content,
      vod_play_from: '默认', vod_play_url: eps.join('#')
    };
  `,
  搜索: `js:
    let url = HOST + '/search?q=' + encodeURIComponent(KEY);
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'a.block').forEach(function (it) {
        let href = pdfh(it, '&&href');
        if (!href || href.indexOf('/anime/') === -1) { return; }
        let pic = pdfh(it, 'img&&src') || pdfh(it, 'img&&data-src');
        arr.push({
          url: urljoin(HOST, href),
          title: pdfh(it, 'img&&alt') || pdfh(it, '&&Text'),
          desc: '',
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('sorani search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
