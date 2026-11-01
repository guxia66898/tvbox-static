// TVBox drpy 规则 · aeete_com
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `aeete_com`,
  host: `https://www.aeete.com`,
  homeUrl: `/Movie/index.html`,
  url: `/Movie/index.html`,
  searchUrl: `/auete4so.php?searchword=**`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `电影&电视剧&综艺&动漫`,
  class_url: `Movie&Tv&Zy&Dm`,
  一级: `js:
    let path = MY_CATE || 'Movie';
    let pg = MY_PAGE || 1;
    let page = (pg <= 1) ? '' : String(pg);
    let url = HOST + '/' + path + '/index' + page + '.html';
    let html = request(url);
    let arr = [];
    try {
      let items = pdfa(html, 'ul.threadlist li');
      items.forEach(function (it) {
        let pic = pdfh(it, 'img&&src');
        let t = pdfh(it, 'img&&title');
        if (!t) { t = pdfh(it, 'img&&alt'); }
        let remark = pdfh(it, 'span.hdtag&&Text');
        let href = pdfh(it, 'a&&href');
        if (!href) { return; }
        arr.push({
          url: urljoin(HOST, href),
          title: t,
          desc: remark,
          pic_url: pic.indexOf('http') === 0 ? pic : urljoin(HOST, pic)
        });
      });
    } catch(e) { log('aeete list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    let html = request(input);
    let name = '', pic = '', content = '', eps = [];
    try {
      name = pdfh(html, 'h1&&Text');
      pic = pdfh(html, '.detail-pic img&&src');
      content = pdfh(html, '.detail-content&&Text') || pdfh(html, '.vod_content&&Text');
      let links = pdfa(html, '#play_list a');
      if (!links.length) { links = pdfa(html, '.play_list a'); }
      if (!links.length) {
        links = pdfa(html, 'a[href*="play-"]');
      }
      links.forEach(function (a) {
        let t = pdfh(a, '&&Text');
        let h = pdfh(a, '&&href');
        if (h && h.indexOf('play-') > -1) {
          eps.push(t + '$' + urljoin(input, h));
        }
      });
    } catch(e) { log('aeete detail err ' + e.message); }
    VOD = {
      vod_id: input,
      vod_name: name,
      vod_pic: pic.indexOf('http') === 0 ? pic : urljoin(HOST, pic),
      vod_content: content,
      vod_play_from: '默认',
      vod_play_url: eps.join('#')
    };
  `,
  搜索: `js:
    let url = HOST + '/auete4so.php?searchword=' + encodeURIComponent(KEY);
    let html = request(url);
    let arr = [];
    try {
      let items = pdfa(html, 'ul.threadlist li');
      items.forEach(function (it) {
        let pic = pdfh(it, 'img&&src');
        let t = pdfh(it, 'img&&title') || pdfh(it, 'img&&alt');
        let href = pdfh(it, 'a&&href');
        if (!href) { return; }
        arr.push({
          url: urljoin(HOST, href),
          title: t,
          desc: pdfh(it, 'span.hdtag&&Text'),
          pic_url: pic.indexOf('http') === 0 ? pic : urljoin(HOST, pic)
        });
      });
    } catch(e) { log('aeete search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
