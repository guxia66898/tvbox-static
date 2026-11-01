// FongMi / OK影视 QuickJS 爬虫 —— 最小验证版（带 catvod 导入）。
//
// 目的：验证 OK影视 认不认 class 继承格式。
//
// 依据：FongMi/CatVodSpider 官方示例 examples/javascript/spider.js
//   import {Spider} from "catvod";
//   export default class Demo extends Spider { init/homeContent/... }
//
// 与 TVBox 的 drpy 是两套完全不同的接口：
//   drpy:      export default {init, home, category, detail, play, search}
//   FongMi:    export default class X extends Spider { homeContent, categoryContent, ... }
//
// 零网络、零外部依赖，只验证接口格式。

import {Spider} from "catvod";

export default class MinSpider extends Spider {
  init(extend = "") {
    this.extend = extend;
  }

  homeContent(filter) {
    return {
      class: [
        {type_id: "cat1", type_name: "最小分类A"},
        {type_id: "cat2", type_name: "最小分类B"},
      ],
    };
  }

  categoryContent(tid, pg, filter, extend) {
    return {
      page: 1,
      pagecount: 1,
      limit: 20,
      total: 2,
      list: [
        {vod_id: "min_1", vod_name: "最小条目1", vod_pic: "", vod_remarks: "零依赖"},
        {vod_id: "min_2", vod_name: "最小条目2", vod_pic: "", vod_remarks: "零依赖"},
      ],
    };
  }

  detailContent(ids) {
    const id = Array.isArray(ids) ? ids[0] : ids;
    return {
      list: [{
        vod_id: id,
        vod_name: "最小详情",
        vod_pic: "",
        vod_content: "能看到这条，说明 OK影视 认 class 格式的 JS 爬虫。",
        vod_play_from: "默认",
        vod_play_url: "第1集$https://example.com/a.m3u8",
      }],
    };
  }

  searchContent(key, quick, pg = "1") {
    return {page: 1, pagecount: 1, limit: 20, total: 0, list: []};
  }

  playerContent(flag, id, vipFlags) {
    return {parse: 0, url: id};
  }
}
