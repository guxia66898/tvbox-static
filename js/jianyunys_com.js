// TVBox drpy 规则 · jianyunys_com
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `jianyunys_com（极速追剧）`,
  host: `https://jisuzhuiju.com`,
  homeUrl: `/`,
  url: `/type/fyclass-fypage.html`,
  searchUrl: `/search?keyword=**`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `电视剧&电影&动漫&综艺`,
  class_url: `dianshiju&dianying&dongman&zongyi`,
  一级: `js:
    let cat = MY_CATE || 'dianying';
    let pg = MY_PAGE || 1;
    let url = HOST + '/type/' + cat + '.html';
    if (pg > 1) { url = HOST + '/type/' + cat + '-' + pg + '.html'; }
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'a.text-decoration-none').forEach(function (it) {
        let href = pdfh(it, '&&href');
        if (!href || href.indexOf('/detail/') === -1) { return; }
        let pic = pdfh(it, 'img&&src') || pdfh(it, 'img&&data-src');
        arr.push({
          url: urljoin(HOST, href),
          title: pdfh(it, '.vod-title&&Text'),
          desc: pdfh(it, '.vod-subtitle&&Text'),
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('jisuzhuiju list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    let html = request(input);
    let name = '', pic = '', content = '', froms = [], urls = [];
    try {
      // 1) JSON-LD 里的结构化信息（最省事、最稳）
      let ld = html.split('application/ld+json');
      if (ld.length > 1) {
        let seg = ld[1];
        let s = seg.indexOf('{');
        let e = seg.lastIndexOf('}');
        if (s > -1 && e > s) {
          try {
            let meta = JSON.parse(seg.substring(s, e + 1));
            let nodes = meta['@graph'] || [meta];
            for (let i = 0; i < nodes.length; i++) {
              let nd = nodes[i];
              if (nd['@type'] === 'TVSeries' || nd['@type'] === 'Movie') {
                name = nd.name || name;
                pic = nd.image || pic;
                content = nd.description || content;
              }
            }
          } catch (e2) { /* JSON-LD 解析失败则用下面的 DOM 兜底 */ }
        }
      }
      // 2) 兜底：从 DOM 取
      if (!name) { name = pdfh(html, 'h1&&Text') || pdfh(html, '.detail-title&&Text'); }
      if (!pic) { pic = pdfh(html, 'img&&src'); }
      if (!content) { content = pdfh(html, '.detail-desc&&Text') || pdfh(html, '.detail-content&&Text'); }

      // 3) 线路名 + 各自的选集，按顺序配对
      let tabs = pdfa(html, 'button.source-tab');
      let panels = pdfa(html, '.source-panel');
      for (let i = 0; i < panels.length; i++) {
        let eps = [];
        pdfa(panels[i], 'a.episode-btn').forEach(function (a) {
          let h = pdfh(a, '&&href');
          let t = pdfh(a, '&&Text');
          if (h && h.indexOf('/vodplay/') > -1) {
            eps.push((t || ('第' + (eps.length + 1) + '集')) + '$' + urljoin(HOST, h));
          }
        });
        if (!eps.length) { continue; }
        let fname = tabs[i] ? pdfh(tabs[i], '&&Text') : ('线路' + (i + 1));
        froms.push(fname || ('线路' + (i + 1)));
        urls.push(eps.join('#'));
      }
    } catch(e) { log('jisuzhuiju detail err ' + e.message); }
    VOD = {
      vod_id: input, vod_name: name, vod_pic: pic, vod_content: content,
      vod_play_from: froms.join('$$$'),
      vod_play_url: urls.join('$$$')
    };
  `,
  搜索: `js:
    let url = HOST + '/search?keyword=' + encodeURIComponent(KEY);
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'a.text-decoration-none').forEach(function (it) {
        let href = pdfh(it, '&&href');
        if (!href || href.indexOf('/detail/') === -1) { return; }
        let pic = pdfh(it, 'img&&src') || pdfh(it, 'img&&data-src');
        arr.push({
          url: urljoin(HOST, href),
          title: pdfh(it, '.vod-title&&Text'),
          desc: pdfh(it, '.vod-subtitle&&Text'),
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('jisuzhuiju search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
  sniffer: 1,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
