# TVBox 接口（纯静态 · 免服务器）

本目录是一套**完全静态**的 TVBox 接口。全部内容只有 JSON 和 JS 文件，
没有任何后端进程，**电脑关机也照常可用**。

## 订阅地址

```
https://gh-proxy.com/https://raw.githubusercontent.com/guxia66898/tvbox-static/main/config.json   # 推荐，国内可直连
https://guxia66898.github.io/tvbox-static/config.json                                           # 备选（Pages，大文件国内易断流）
```

**为什么主订阅走 gh-proxy**：电视盒子没有代理，直连 `github.io` 拉 2.6 MB 的
`lib/pg.jar` 会在 30 秒内只下到一半就断流 → 所有 `type:3` 站点报
「爬虫加载失败」。实测（绕代理，模拟盒子）：

| 通道 | 结果 |
|---|---|
| `guxia66898.github.io` 直连 | 35 秒只下到 1.34 MB / 2.68 MB ❌ |
| `gh-proxy.com` + raw | 15.9 秒完整下完 2,684,075 B ✅ |

> 本机开发环境有 `HTTP(S)_PROXY`，走代理测 github.io 一切正常 —— 那是
> **假绿**。判断真实可用性必须 `curl --noproxy '*'` 或跑
> `python tools/verify_noproxy.py`。

## 站点清单与**真实**能力（8 个）

下表是逐个实测的结果，**不虚报**。列表/搜索列的「—」表示该站不具备此能力。

| # | 站点（界面名） | 类型 | 列表 | 搜索 | 详情/选集 |
|---|---|---|---|---|---|
| 1 | 影视仓·直连 | 直连 CMS | ✅ | ✅ | 源站直供 |
| 2 | 蓝光影库 | 客户端规则 | ✅ 12 条 | ✅ 33 条 | ✅ 80 集 |
| 3 | 看看鸭 | 客户端规则 | ✅ 89 条 | ✅ 16 条 | ✅ 196 集 |
| 4 | 澳特影视 | 客户端规则 | ✅ 20 条 | ⚠️ 站点验证码 | ✅ 2 集 |
| 5 | 西瓜影视 | 客户端规则 | ✅ 24 条 | ✅ 走 `/api/suggest` | ✅ 直链 m3u8 |
| 6 | 追影 | 客户端规则 | ✅ 27 条 | ✅ 9 条 | ✅ 127 集 |
| 7 | 青空次元（番剧） | 客户端规则 | ✅ 24 条 | — **站内无搜索** | ✅ 7 集 |
| 8 | 极速追剧 | 客户端规则 | ✅ 48 条 | ⚠️ 见下 | ✅ 37 集（3 线路） |

### 三点如实说明

1. **青空次元（sorani.net）本身没有搜索功能**——站点无搜索表单、无搜索路由，
   服务端忽略一切 `?q=`/`?keyword=` 参数。因此在 config 里已置 `searchable: 0`，
   客户端不会展示搜索入口（避免"搜不到"的误判）。
2. **澳特影视（aeete.com）的搜索接口有反爬验证码**，连试多次均被拦；
   列表与详情正常。这是站点侧硬限制。
3. **极速追剧（jisuzhuiju.com）的播放地址由前端异步加载**，规则已能正确解析出
   3 条线路共 37 集的选集列表，最终播放地址依赖客户端 WebView 取流。

## 为什么不需要服务器

| 传统理解 | 实际机制 |
|---|---|
| 接口要有个程序实时抓网页 | 抓取逻辑写在 `js/*.js` 规则里，由 **TVBox 盒子自带的 JS 引擎**执行 |
| 电脑要一直开着当服务器 | 盒子直接访问影视站，中间不经过任何你的机器 |
| 接口放网上就得部署服务 | 接口只是几个文件，扔到 GitHub / 网盘 / 图床即可 |

关键点：`sites[].type = 3` 表示"客户端规则"。盒子下载 `api`（JS 引擎）和
`ext`（站点规则）两个文件后，就在本地跑规则、直接请求影视站。

## 文件结构

```
config.json            ← 订阅这个文件
lib/drpy2.min.js       ← JS 规则引擎
lib/gbk.js             ← 引擎依赖（编码转换）
lib/jsencrypt.js       ← 引擎依赖（加密）
lib/muban.js           ← 引擎依赖（模板）
lib/pg.jar             ← 规则引擎 jar（type:3 站点必需）
js/<站点>.js            ← 各站点的抓取规则
diag/*.json            ← 排障用诊断配置（对照实验，见下）
```

### spider 字段

`config.json` 顶层的 `spider` 指向 `lib/pg.jar`（带 md5 校验）：

```
"spider": "https://gh-proxy.com/https://raw.githubusercontent.com/guxia66898/tvbox-static/main/lib/pg.jar;md5;dffec63fb83a2b31b8606bd4bf6bead9"
```

**不要留空字符串**，也**不要指向 `guxia66898.github.io`**。
`type:3` 站点要靠这个 jar 执行 `js:` 规则；部分客户端（含 OK影视）遇到
空 `spider` 或指向 404 的地址时，会在「取配置」阶段就报"配置取得失败"；
而指向 Pages 的地址时，jar 能"开始下载"但**在国内会断流**，表现为
"配置读出来了、站名也在，但一进站点就报『爬虫加载失败』"。
`gh-proxy` 前缀是实测能通的通道。

### 诊断配置（diag/，排障阶梯）

线上曾出现过「`diag/` 整个目录没被推送 → 全部 404 → 客户端报配置取得失败」，
所以现在 `diag/` 由构建流程强制同步、且发布前会自检引用完整性。

| 文件 | 内容 | 用途 |
|---|---|---|
| `a-minimal.json` | 1 个直连站，无 spider | 最小可用性 |
| `b-with-spider.json` | 直连站 + 空 spider | 空 spider 对照组 |
| `c-direct-plus-js.json` | 直连站 + js 站（无 jar） | 引擎缺失对照组 |
| `e-with-jar.json` | 直连站 + spider 指向 jar | spider 写法验证 |
| `f-full-with-jar.json` | 完整 8 站（由 config 派生） | 正式可用配置 |
| `g1` ~ `g7` | 7 种 spider 通道变体 | 定位「爬虫加载失败」 |

判断：`a` 通 → 配置读取正常；`a` 通但 `c` 的 js 站不通 → 引擎/jar 问题；
`e` 通 → spider 写法没问题；`f` 通 → 直接用 `f`。

**G 系列**专治「站名显示正常、一进站点就报『爬虫加载失败』」：
`g1` 不带 spider、`g2/g3` jar 走 Pages（带/不带 md5）、
`g4` jar 走 gh-proxy（= 当前主配置）、`g5` jar 用上游 gao 的、
`g6` jar+api/ext 全走 gh-proxy、`g7` 换成 gao 的引擎+jar。
逐个导入，哪个能通就用哪个。

## 两种站点类型

**A. 直连型**（`type: 0`）—— 源站本身就是 MacCMS 接口，`api` 直接写源站地址，
连 JS 规则都不需要（注意 `api` **不能带结尾斜杠**，否则 308 重定向会导致分类为空）：

```json
{"key":"ys_cxkjg_cn","name":"影视仓·直连","type":0,
 "api":"https://ys.cxkjg.cn/api/provide/vod","searchable":1,"filterable":1}
```

**B. 客户端规则型**（`type: 3`）—— 普通网页站，靠 `ext` 里的规则文件解析：

```json
{"key":"aeete_com","name":"澳特影视","type":3,
 "api":"https://gh-proxy.com/https://raw.githubusercontent.com/guxia66898/tvbox-static/main/lib/drpy2.min.js",
 "ext":"https://gh-proxy.com/https://raw.githubusercontent.com/guxia66898/tvbox-static/main/js/aeete_com.js","searchable":1}
```

`api`/`ext` 写的是**绝对路径**且走 gh-proxy。两点都有讲究：

- **绝对路径**：相对路径（`./lib/...`）的解析基准是引擎文件自身位置，
  而客户端加载 `ext` 时用的是另一套 base，部分客户端（含 OK影视）会
  解析错位 —— 表现为站名能显示但内容全无。
- **gh-proxy**：`github.io` 在国内裸连拉文件不稳，规则站要连带下载
  49 KB 的引擎 + 三个依赖，统一走能通的通道最省事。

## 规则写法约定（写规则必读）

这些是从 `drpy2.min.js` 源码读出、并经真机验证的约定，踩过坑：

1. **没有 `$js` 这个对象**。引擎做的是
   `p.trim().startsWith("js:")` → `eval(p.replace("js:",""))`。
   写 `$js.toString(() => {...})` 会直接 `ReferenceError`，整个站点失效。
2. **`一级`/`搜索`** 用 `js:` 字符串或 5 段选择器串；**`二级`** 只认「对象」或 `js:`，
   纯字符串会落到不匹配分支。
3. **各字段独立 eval**——`一级` 里定义的 helper 函数，`二级`/`搜索` 拿不到，
   每个字段要各自写一份。
4. **列表项自身是 `<a>` 时**，取链接要用 `pdfh(it, '&&href')`，
   写 `pdfh(it, 'a&&href')` 是在 `<a>` 里再找 `<a>`，永远为空。
5. **模板字符串会吃掉正则反斜杠**，规则里尽量用字符串定位而非正则。

## 维护

规则由 `tvbox-ai-rulegen` 生成：

```bash
python tools/build_dist.py --fetch     # 重新组装（会拉取引擎；内含加载测试门禁）
bash tools/verify_all.sh               # 回归验证（每站 列表/详情/搜索 三模式）
python tools/verify_noproxy.py         # 绕代理验证线上可达性（模拟盒子！）
```

`build_dist.py` 里带三道**硬门禁**，任何一道不过都会中止发布：

1. **加载门禁** `check_loadable.js` —— 用 `vm` 逐个加载规则文件，
   任何 `ReferenceError` 或字段类型非法都会中止。
   （抓取仿真测不出加载期崩溃，这道门禁是为此补的。）
2. **依赖门禁** `ensure_jar()` —— `lib/pg.jar` 缺失或 md5 不符时
   自动重新下载；仍拿不到就中止。避免"本地看着好好的、线上 404"。
3. **自检门禁** `check_self_contained()` —— 校验 `config.json` 的
   `spider` / 各站 `api` / `ext` / `diag/*.json` 里引用的本站资源
   全部真实存在于发布包内。这道门禁直接对应本次线上事故。

> **发布后必跑 `verify_noproxy.py`。** 本机代理会让 github.io 看起来
> 一切正常，而用户的盒子没有代理 —— 只信走代理的结果会漏掉
> 「大文件断流」这类只在真实网络下才暴露的问题。
