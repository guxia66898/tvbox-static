// FongMi / OK影视 QuickJS 爬虫 —— 最小验证版（**不导入 catvod**）。
//
// 与 fm_class_spider.js 的唯一区别：不写 `import {Spider} from "catvod"`，
// 也不 extends Spider，直接导出一个普通 class。
//
// 用途：如果带 import 的版本挂、但这个能跑，说明客户端的 catvod 模块
// 不可用（版本较老），那就要改用这个写法。

export default class MinPlainSpider {
  init(extend = "") {
    this.extend = extend;
  }

  homeContent(filter) {
    return {
      class: [
        {type_id: "cat1", type_name: "纯类分类A"},
        {type_id: "cat2", type_name: "纯类分类B"},
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
        {vod_id: "p_1", vod_name: "纯类条目1", vod_pic: "", vod_remarks: "不依赖catvod"},
        {vod_id: "p_2", vod_name: "纯类条目2", vod_pic: "", vod_remarks: "不依赖catvod"},
      ],
    };
  }

  detailContent(ids) {
    const id = Array.isArray(ids) ? ids[0] : ids;
    return {
      list: [{
        vod_id: id,
        vod_name: "纯类详情",
        vod_pic: "",
        vod_content: "能看到这条，说明不需要 catvod 模块也能跑 class 爬虫。",
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
