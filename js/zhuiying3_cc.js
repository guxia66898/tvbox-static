// TVBox drpy 规则 · zhuiying3_cc
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `zhuiying3_cc`,
  host: `https://zhuiying3.cc`,
  homeUrl: `/vodshow/dianying-----------.html`,
  url: `/vodshow/fyclass-----------.html?page=fypage`,
  searchUrl: `/vod/search/wd/**/page/fypage.html`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `电影&电视剧&动漫&综艺`,
  class_url: `dianying&dianshiju&dongman&zongyi`,
  一级: `js:
    let cat = MY_CATE || 'dianying';
    let pg = MY_PAGE || 1;
    let url = HOST + '/vodshow/' + cat + '-----------.html';
    if (pg > 1) { url += '?page=' + pg; }
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, 'a.card').forEach(function (it) {
        let href = pdfh(it, '&&href');
        if (!href || href.indexOf('/video/') === -1) { return; }
        let pic = pdfh(it, 'img&&src') || pdfh(it, 'img&&data-src');
        arr.push({
          url: urljoin(HOST, href),
          title: pdfh(it, '.card-title&&Text'),
          desc: pdfh(it, '.card-status&&Text'),
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('zhuiying list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    let html = request(input);
    let name = '', pic = '', content = '', froms = [], urls = [];
    try {
      name = pdfh(html, 'h1&&Text') || pdfh(html, '.detail-title&&Text');
      pic = pdfh(html, '.hero-card-thumb img&&src') || pdfh(html, 'img&&src');
      content = pdfh(html, '.detail-desc&&Text') || pdfh(html, '.list-desc&&Text') || pdfh(html, '.summary&&Text');

      // 线路名 + 对应容器（data-target 指向 #ep-list-N）
      let tabs = pdfa(html, '.source-tab');
      for (let i = 0; i < tabs.length; i++) {
        let target = pdfh(tabs[i], '&&data-target');
        let fname = pdfh(tabs[i], '.tab-name&&Text') || pdfh(tabs[i], '&&Text') || ('线路' + (i + 1));
        if (!target) { continue; }
        let box = pdfa(html, '#' + target);
        if (!box.length) { continue; }
        let eps = [];
        pdfa(box[0], 'a.ep-item-square').forEach(function (a) {
          let h = pdfh(a, '&&href');
          let nm = pdfh(a, '&&data-name') || pdfh(a, '&&Text');
          if (h && h.indexOf('/play/') > -1) {
            eps.push((nm || ('第' + (eps.length + 1) + '集')) + '$' + urljoin(HOST, h));
          }
        });
        if (eps.length) { froms.push(fname); urls.push(eps.join('#')); }
      }
      // 兜底：没有 .source-tab 时，直接扫全站 /play/ 链接
      if (!urls.length) {
        let eps = [];
        pdfa(html, 'a.ep-item-square').forEach(function (a) {
          let h = pdfh(a, '&&href');
          let nm = pdfh(a, '&&data-name') || pdfh(a, '&&Text');
          if (h && h.indexOf('/play/') > -1) {
            eps.push((nm || ('第' + (eps.length + 1) + '集')) + '$' + urljoin(HOST, h));
          }
        });
        if (eps.length) { froms.push('默认'); urls.push(eps.join('#')); }
      }
    } catch(e) { log('zhuiying detail err ' + e.message); }
    VOD = {
      vod_id: input, vod_name: name, vod_pic: pic, vod_content: content,
      vod_play_from: froms.join('$$$'),
      vod_play_url: urls.join('$$$')
    };
  `,
  搜索: `js:
    // 搜索结果页结构与列表页不同：卡片是 .search-list-card，
    // 链接/标题/封面在 .list-card-thumb，备注在 .list-thumb-remark
    let key = KEY;
    let url = HOST + '/vod/search/wd/' + key + '.html';
    if (MY_PAGE && MY_PAGE > 1) { url = HOST + '/vod/search/wd/' + key + '/page/' + MY_PAGE + '.html'; }
    let html = request(url);
    let arr = [];
    try {
      pdfa(html, '.search-list-card').forEach(function (it) {
        let a = pdfh(it, '.list-card-thumb&&href');
        if (!a || a.indexOf('/video/') === -1) { return; }
        let pic = pdfh(it, '.list-card-thumb img&&src');
        arr.push({
          url: urljoin(HOST, a),
          title: pdfh(it, '.list-card-thumb&&title') || pdfh(it, '.list-title&&Text'),
          desc: pdfh(it, '.list-thumb-remark&&Text'),
          pic_url: pic.indexOf('http') === 0 ? pic : (pic ? urljoin(HOST, pic) : '')
        });
      });
    } catch(e) { log('zhuiying search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
  sniffer: 1,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
