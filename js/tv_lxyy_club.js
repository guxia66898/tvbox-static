// TVBox drpy 规则 · tv_lxyy_club
// 由 tvbox-ai-rulegen 生成，纯静态，无需服务端
var rule = {
  title: `tv_lxyy_club`,
  host: `https://tv.lxyy.club`,
  homeUrl: `/`,
  url: `/api/proxy.php?action=list&type=fyclass&page=fypage`,
  searchUrl: `/api/proxy.php?action=search&wd=**&page=fypage`,
  searchable: 1,
  quickSearch: 1,
  filterable: 0,
  class_name: `国产剧&喜剧片&动漫&动作片&悬疑片`,
  class_url: `国产剧&喜剧片&动漫&动作片&悬疑片`,
  推荐: `js:
    let html = request(HOST + '/api/proxy.php?action=home');
    let arr = [];
    try {
      let j = JSON.parse(html);
      let cats = j.categories || {};
      Object.keys(cats).forEach(function (k) {
        (cats[k] || []).forEach(function (it) {
          arr.push({
            url: k + '@@' + it.source + '@@' + it.id,
            title: it.name,
            desc: it.remarks || '',
            pic_url: it.pic || ''
          });
        });
      });
    } catch(e) { log('lxyy home err ' + e.message); }
    VODS = arr;
  `,
  一级: `js:
    let tok = post(HOST + '/api/playback-session.php', {body:''});
    let csrf = '';
    try { csrf = JSON.parse(tok).csrf || ''; } catch(e) { csrf = ''; }
    if (!csrf) {
      // 退路：字符串定位，不用正则（避免模板字符串吃掉反斜杠）
      let key = '"csrf":"';
      let i = tok.indexOf(key);
      if (i > -1) { i += key.length; let j = tok.indexOf('"', i); if (j > -1) { csrf = tok.substring(i, j); } }
    }
    let html = request(HOST + '/api/proxy.php?action=home', {headers: {'X-CSRF-Token': csrf}});
    let arr = [];
    try {
      let j = JSON.parse(html);
      let cats = j.categories || {};
      let want = MY_CATE || '';
      Object.keys(cats).forEach(function (k) {
        if (want && k !== want) { return; }
        (cats[k] || []).forEach(function (it) {
          arr.push({
            url: k + '@@' + (it.source || '') + '@@' + it.id,
            title: it.name,
            desc: it.remarks || '',
            pic_url: it.pic || ''
          });
        });
      });
    } catch(e) { log('lxyy cate err ' + e.message); }
    VODS = arr;
  `,
  二级: `js:
    let parts = String(input).split('@@');
    let src = parts.length > 2 ? parts[1] : '';
    let vid = parts.length > 2 ? parts[2] : parts[parts.length - 1];
    let tok = post(HOST + '/api/playback-session.php', {body:''});
    let csrf = '';
    try { csrf = JSON.parse(tok).csrf || ''; } catch(e) { csrf = ''; }
    if (!csrf) {
      // 退路：字符串定位，不用正则（避免模板字符串吃掉反斜杠）
      let key = '"csrf":"';
      let i = tok.indexOf(key);
      if (i > -1) { i += key.length; let j = tok.indexOf('"', i); if (j > -1) { csrf = tok.substring(i, j); } }
    }
    let url = HOST + '/api/proxy.php?action=detail&id=' + vid + '&source=' + src;
    let html = request(url, {headers: {'X-CSRF-Token': csrf}});
    let name = '', pic = '', content = '', from = '', playurl = '';
    try {
      let j = JSON.parse(html);
      let g = (j.details || [])[0] || {};
      name = g.name || '';
      pic = g.pic || '';
      content = g.content || '';
      let eps = [];
      let groups = g.episodes || [];
      if (groups.length && groups[0].episodes) {
        groups.forEach(function (t) {
          (t.episodes || []).forEach(function (e) {
            eps.push(e.name + '$' + e.url);
          });
        });
        from = '默认';
      } else {
        groups.forEach(function (e) { eps.push(e.name + '$' + e.url); });
        from = '默认';
      }
      playurl = eps.join('#');
    } catch(e) { log('lxyy detail err ' + e.message); }
    VOD = {
      vod_id: vid,
      vod_name: name,
      vod_pic: pic,
      vod_content: content,
      vod_play_from: from,
      vod_play_url: playurl
    };
  `,
  搜索: `js:
    let tok = post(HOST + '/api/playback-session.php', {body:''});
    let csrf = '';
    try { csrf = JSON.parse(tok).csrf || ''; } catch(e) { csrf = ''; }
    if (!csrf) {
      // 退路：字符串定位，不用正则（避免模板字符串吃掉反斜杠）
      let key = '"csrf":"';
      let i = tok.indexOf(key);
      if (i > -1) { i += key.length; let j = tok.indexOf('"', i); if (j > -1) { csrf = tok.substring(i, j); } }
    }
    let url = HOST + '/api/proxy.php?action=search&wd=' + encodeURIComponent(KEY);
    if (MY_PAGE && MY_PAGE > 1) { url += '&page=' + MY_PAGE; }
    let html = request(url, {headers: {'X-CSRF-Token': csrf}});
    let arr = [];
    try {
      let j = JSON.parse(html);
      (j.results || []).forEach(function (it) {
        arr.push({
          url: (it.source || '') + '@@' + it.id,
          title: it.name,
          desc: (it.source_name ? it.source_name + ' ' : '') + (it.remarks || ''),
          pic_url: it.pic || ''
        });
      });
    } catch(e) { log('lxyy search err ' + e.message); }
    VODS = arr;
  `,
  lazy: ``,
  play_parse: true,
  sniffer: 1,
}

/* 兼容不同壳子的导出约定 */
if (typeof module !== 'undefined') { module.exports = rule; }
