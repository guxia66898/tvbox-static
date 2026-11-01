// TVBox drpy 规则 · kankanya_me
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `kankanya_me（看看鸭）`,
  host: `https://www.kankanya.me`,
  homeUrl: `/`,
  url: `/type/fyclass-fypage.html`,
  searchUrl: `/search/**-------------.html`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `电影&剧集&综艺&动漫&短剧`,
  class_url: `dianying&juji&zongyi&dongman&duanju`,
  一级: `js:
    const STATIC = 'PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN';
    const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function b64encode(str) {
      let out = '', i = 0;
      while (i < str.length) {
        const c1 = str.charCodeAt(i++) & 0xff;
        const c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        const c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        out += B64[c1 >> 2];
        out += B64[((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4)];
        out += isNaN(c2) ? '=' : B64[((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6)];
        out += isNaN(c3) ? '=' : B64[c3 & 63];
      }
      return out;
    }
    function kkEncrypt(s) {
      let enc = '';
      for (let i = 0; i < s.length; i++) {
        const n0 = STATIC.indexOf(s[i]);
        const code = n0 === -1 ? s[i] : STATIC[(n0 + 3) % 62];
        enc += STATIC[parseInt(Math.random() * 62, 10)]
             + code
             + STATIC[parseInt(Math.random() * 62, 10)];
      }
      return b64encode(enc);
    }
    function kkToken(html) {
      // 用字符串定位取 token：避开「模板字符串会吃掉正则反斜杠」的坑
      const key = 'encrypt("';
      let i = html.indexOf(key);
      if (i === -1) { return ''; }
      i += key.length;
      let j = html.indexOf('"', i);
      if (j === -1) { return ''; }
      return html.substring(i, j);
    }
    function kkPass(html, pageUrl) {
      const tk = kkToken(html);
      if (!tk) { return false; }
      const body = 'value=' + encodeURIComponent(kkEncrypt(pageUrl))
                 + '&token=' + encodeURIComponent(kkEncrypt(tk));
      post(HOST + '/robot.php', {
        body: body,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      });
      return true;
    }
    function kkGet(url) {
      let html = request(url);
      if (html.indexOf('人机验证') === -1) { return html; }
      // 命中验证页：POST /robot.php 过验证。引擎内部保持 cookie 会话，
      // 过完后换一个 URL 重取（同 URL 会命中引擎自己的缓存）。
      kkPass(html, url);
      return request(url + (url.indexOf('?') > -1 ? '&' : '?') + 'kk=' + Date.now());
    }
    let path = MY_CATE || 'dianying';
    let pg = MY_PAGE || 1;
    let url = HOST + '/type/' + path + '-' + pg + '.html';
    let html = kkGet(url);
    let arr = [];
    try {
      let items = pdfa(html, '.module-poster-item');
      items.forEach(function (it) {
        let pic = pdfh(it, 'img&&data-original') || pdfh(it, 'img&&src');
        let t = pdfh(it, 'img&&title') || pdfh(it, '.module-poster-item-title&&Text');
        let remark = pdfh(it, '.module-item-note&&Text');
        let href = pdfh(it, '&&href') || pdfh(it, '.module-poster-item-info a&&href');
        if (!href || href.indexOf('/detail/') === -1) { return; }
        if (pic && pic.indexOf('load.gif') > -1) { pic = ''; }
        arr.push({
          url: urljoin(HOST, href),
          title: t,
          desc: remark,
          pic_url: pic
        });
      });
    } catch(e) { log('kankanya list err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    const STATIC = 'PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN';
    const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function b64encode(str) {
      let out = '', i = 0;
      while (i < str.length) {
        const c1 = str.charCodeAt(i++) & 0xff;
        const c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        const c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        out += B64[c1 >> 2];
        out += B64[((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4)];
        out += isNaN(c2) ? '=' : B64[((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6)];
        out += isNaN(c3) ? '=' : B64[c3 & 63];
      }
      return out;
    }
    function kkEncrypt(s) {
      let enc = '';
      for (let i = 0; i < s.length; i++) {
        const n0 = STATIC.indexOf(s[i]);
        const code = n0 === -1 ? s[i] : STATIC[(n0 + 3) % 62];
        enc += STATIC[parseInt(Math.random() * 62, 10)]
             + code
             + STATIC[parseInt(Math.random() * 62, 10)];
      }
      return b64encode(enc);
    }
    function kkToken(html) {
      // 用字符串定位取 token：避开「模板字符串会吃掉正则反斜杠」的坑
      const key = 'encrypt("';
      let i = html.indexOf(key);
      if (i === -1) { return ''; }
      i += key.length;
      let j = html.indexOf('"', i);
      if (j === -1) { return ''; }
      return html.substring(i, j);
    }
    function kkPass(html, pageUrl) {
      const tk = kkToken(html);
      if (!tk) { return false; }
      const body = 'value=' + encodeURIComponent(kkEncrypt(pageUrl))
                 + '&token=' + encodeURIComponent(kkEncrypt(tk));
      post(HOST + '/robot.php', {
        body: body,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      });
      return true;
    }
    function kkGet(url) {
      let html = request(url);
      if (html.indexOf('人机验证') === -1) { return html; }
      // 命中验证页：POST /robot.php 过验证。引擎内部保持 cookie 会话，
      // 过完后换一个 URL 重取（同 URL 会命中引擎自己的缓存）。
      kkPass(html, url);
      return request(url + (url.indexOf('?') > -1 ? '&' : '?') + 'kk=' + Date.now());
    }
    let html = kkGet(input);
    let name = '', pic = '', content = '', from = '', eps = [];
    try {
      name = pdfh(html, '.module-info-heading h1&&Text') || pdfh(html, 'h1&&Text');
      pic = pdfh(html, '.module-info-poster img&&data-original')
         || pdfh(html, '.module-info-poster img&&src');
      if (pic && pic.indexOf('load.gif') > -1) { pic = ''; }
      content = pdfh(html, '.module-info-introduction-content&&Text')
             || pdfh(html, '.module-info-introduction&&Text');
      let links = pdfa(html, 'a.module-play-list-link');
      if (!links.length) { links = pdfa(html, '.module-play-list a'); }
      let groups = {};
      links.forEach(function (a) {
        let t = pdfh(a, '&&Text');
        let h = pdfh(a, '&&href');
        if (!h || h.indexOf('/play/') === -1) { return; }
        eps.push(t + '$' + urljoin(HOST, h));
      });
      from = '看看鸭';
    } catch(e) { log('kankanya detail err ' + e.message); }
    VOD = {
      vod_id: input,
      vod_name: name,
      vod_pic: pic,
      vod_content: content,
      vod_play_from: from,
      vod_play_url: eps.join('#')
    };
  `,
  搜索: `js:
    const STATIC = 'PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN';
    const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function b64encode(str) {
      let out = '', i = 0;
      while (i < str.length) {
        const c1 = str.charCodeAt(i++) & 0xff;
        const c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        const c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
        out += B64[c1 >> 2];
        out += B64[((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4)];
        out += isNaN(c2) ? '=' : B64[((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6)];
        out += isNaN(c3) ? '=' : B64[c3 & 63];
      }
      return out;
    }
    function kkEncrypt(s) {
      let enc = '';
      for (let i = 0; i < s.length; i++) {
        const n0 = STATIC.indexOf(s[i]);
        const code = n0 === -1 ? s[i] : STATIC[(n0 + 3) % 62];
        enc += STATIC[parseInt(Math.random() * 62, 10)]
             + code
             + STATIC[parseInt(Math.random() * 62, 10)];
      }
      return b64encode(enc);
    }
    function kkToken(html) {
      // 用字符串定位取 token：避开「模板字符串会吃掉正则反斜杠」的坑
      const key = 'encrypt("';
      let i = html.indexOf(key);
      if (i === -1) { return ''; }
      i += key.length;
      let j = html.indexOf('"', i);
      if (j === -1) { return ''; }
      return html.substring(i, j);
    }
    function kkPass(html, pageUrl) {
      const tk = kkToken(html);
      if (!tk) { return false; }
      const body = 'value=' + encodeURIComponent(kkEncrypt(pageUrl))
                 + '&token=' + encodeURIComponent(kkEncrypt(tk));
      post(HOST + '/robot.php', {
        body: body,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      });
      return true;
    }
    function kkGet(url) {
      let html = request(url);
      if (html.indexOf('人机验证') === -1) { return html; }
      // 命中验证页：POST /robot.php 过验证。引擎内部保持 cookie 会话，
      // 过完后换一个 URL 重取（同 URL 会命中引擎自己的缓存）。
      kkPass(html, url);
      return request(url + (url.indexOf('?') > -1 ? '&' : '?') + 'kk=' + Date.now());
    }
    let url = HOST + '/search/' + KEY + '-------------.html';
    let html = kkGet(url);
    let arr = [];
    try {
      let items = pdfa(html, '.module-card-item');
      items.forEach(function (it) {
        let pic = pdfh(it, 'img&&data-original') || pdfh(it, 'img&&src');
        let t = pdfh(it, '.module-card-item-title&&Text') || pdfh(it, 'img&&alt');
        let remark = pdfh(it, '.module-item-note&&Text');
        let href = pdfh(it, '.module-card-item-title a&&href')
                || pdfh(it, '.module-card-item-poster&&href')
                || pdfh(it, 'a&&href');
        if (!href || href.indexOf('/detail/') === -1) { return; }
        if (pic && pic.indexOf('load.gif') > -1) { pic = ''; }
        arr.push({
          url: urljoin(HOST, href),
          title: t,
          desc: remark,
          pic_url: pic
        });
      });
    } catch(e) { log('kankanya search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
  sniffer: 1,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
