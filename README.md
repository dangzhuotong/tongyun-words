<h1 align=center>
  <img src="https://github.com/user-attachments/assets/9d626e0f-0601-4640-8981-ad66d8ac4853" alt="TypeWords" style="width: 500px;"/>
</h1>

<p align="center">
  <a href="/README.md">English</a> |
  <a href="/docs/README.es.md">Español</a> |
  <a href="/docs/README.de.md">Deutsch</a> |
  <a href="/docs/README.fr.md">Français</a> |
  <a href="/docs/README.pt.md">Português</a> |
  <a href="/docs/README.ru.md">Русский</a> |
  <a href="/docs/README.uk.md">Українська</a> |
  <a href="/docs/README.ja.md">日本語</a> |
  <a href="/docs/README.ko.md">한국인</a> |
  <a href="/docs/README.th.md">ไทย</a> |
  <a href="/docs/README.vi.md">Tiếng Việt</a> |
  <a href="/docs/README.id.md">Bahasa Indonesia</a> |
  <a href="/docs/README.zh-TW.md">繁體中文</a> |
  <a href="/docs/README.zh-CN.md">简体中文</a> 
</p>

<p align="center">
  <b>Learn English, one keystroke at a time; smarter memorization, more efficient learning - an open-source word and article practice tool</b>
</p>

<!-- tongyun: fork 说明 -->
## 关于这个 fork（tongyun-words）

基于 [TypeWords](https://github.com/zyronon/TypeWords) 的个人自用 fork，同样以 GPL-3.0 开源。在上游功能之外加了这些（改动处代码里都带 `tongyun:` 标记，方便以后合并上游）：

- **子路径部署**：支持挂在 `/words/` 下，构建命令 `NUXT_APP_BASE_URL=/words/ npx nuxt generate`。
- **智能混学**：跨词书按记忆曲线复习，再随机补新词，不分章节。
- **AI 记忆法 / AI 讲解**：单词记忆法和文章句子讲解，调同域的学习服务 `/learn/api/v1/ai/explain`。学习服务地址和令牌在「设置 → 通用设置」顶部填写，只存在本浏览器 localStorage。
- **AI 错词复习卷**（`/ai-quiz`，部署后是 `/words/ai-quiz`）：从错词本选词，调 `/learn/api/v1/ai/quiz` 生成 cloze / 选择 / 英译中，本地判分。复用同一份学习服务地址和令牌。
- **学习看板**（`/learn-board`，部署后是 `/words/learn-board`）：手机优先的只读页面，按顺序显示今天学什么（待复查在前，新点标出会不会占今天的新开名额）、待复习数和前几张卡的正面、卡点、各科统计（掌握数、各状态数、30 天保持率）、按阶段折叠的知识地图（点开一个点能看到硬前置和软前置）。
  - 复用设置里的同一份学习服务地址和令牌。没填令牌时只提示去设置，不发任何请求。
  - 只调学习服务的 GET 接口：`/subjects`、`/subjects/{id}/map`、`/next`、`/review/due`、`/progress`、`/blockers`。每块单独加载、单独报错：令牌不对提示去设置改，连不上提示「连不上学习服务」；连到没有 `/blockers` 的旧版服务（404）时显示「卡点记录即将接入」。
  - 页面是 `ssr:false` 的纯客户端页面，静态产物里没有任何学习数据。
- 本机联调、探活命令和常见错误见 [docs/tongyun-learn-integration.md](docs/tongyun-learn-integration.md)。
- 默认关闭了原作者的第三方统计脚本（开关在 `app/tongyun/config.ts`）。

### 单词学习与智能混学使用指南（Words Usage & Fictional Walkthrough）

智能混学（Smart Mix）打破传统章节刷词的机械模式，结合记忆曲线在复习旧词的同时自适应穿插新词，辅以沉浸式键盘打字与 AI 记忆法讲解。

#### 虚构学习场景：学习者 Alex 的每日词汇流
假设学习者 Alex 正在备考学术英语，词库中既有历史难词需要巩固，也有今日计划吸收的新词。

1. **自适应队列构建**
   - 进入练习时，算法根据记忆衰减度自动提取待复习词与新增词混合入队：
     - **复习词（待巩固）**：`ephemeral`（短暂的）、`pervasive`（无处不在的）
     - **新学词（今日新开）**：`resilient`（有弹性的，能迅速恢复的）
2. **跟写与盲打沉浸交互**
   - 界面呈现音标 `/ɪˈfemərəl/` 与发音提示。
   - Alex 敲击键盘跟写字母；若输入拼写错误，系统播放错误音效并在原位等待修正，避免盲目跳过。
3. **AI 助记讲解调取**
   - 遇到难以记忆的生词时，点击「AI 讲解」（调用 `/learn/api/v1/ai/explain`）：
     ```json
     {
       "kind": "word_mnemonic",
       "content": {
         "word": "ephemeral",
         "phonetic": "/ɪˈfemərəl/",
         "meanings": [{ "pos": "adj.", "cn": "短暂的；朝生暮死的" }],
         "roots": [
           { "part": "epi-", "type": "prefix", "meaning": "在...之上 / 持续" },
           { "part": "hemera", "type": "root", "meaning": "天 / 一日" },
           { "part": "-al", "type": "suffix", "meaning": "形容词后缀" }
         ],
         "mnemonic": "词根 hemera 代表「日」，epi- 表示「在...之上」，合起来指生命仅持续一天，引申为「短暂的」。",
         "examples": [
           {
             "en": "The beauty of the cherry blossoms is dazzling yet ephemeral.",
             "zh": "樱花之美令人目眩神迷，却又转瞬即逝。"
           }
         ]
       }
     }
     ```
4. **错词自动沉淀**
   - 练习中多次拼写失误的生词（如 `pervasive`），会自动记录入本地 IndexedDB 错词本，作为错词复习卷的数据源。

---

### AI 错词复习卷使用指南（AI Quiz Usage & Fictional Walkthrough）

错词复习卷（`/ai-quiz`，部署后为 `/words/ai-quiz`）直接连接本地错词本与学习服务 AI 生成接口（`POST /v1/ai/quiz`），提供完形填空、单项选择、英译中多题型测试与本地实时判分。

#### 1. 操作流转
- **选词阶段**：打开页面，系统从错词本自动加载最多 20 个候选词（默认全选，支持点选或一键反选）。
- **生成试卷**：点击「生成复习卷」，客户端携带所选词汇请求服务端生成专属题目。
- **本地判分**：纯客户端执行大小写不敏感匹配、空格清洗以及多释义（分号/逗号分隔）容错判定。

#### 2. 虚构试卷题型样例

假设 Alex 从错词本勾选了 3 个错词：`ubiquitous`、`pragmatic`、`serendipity`，生成的试卷样例如下：

##### 题型一：完形填空（Cloze）
- **题干**：`In the modern digital age, mobile phones have become ________, found in almost every corner of society.`
- **正确答案**：`ubiquitous`
- **判分逻辑**：
  - 用户输入：`Ubiquitous` 或 `ubiquitous`（大小写均可，自动 trim 头尾空格）
  - 判定结果：**正确**
  - 解析展示：`ubiquitous 意为「普遍存在的，无处不在的」，契合句中 found in almost every corner of society 的语境。`

##### 题型二：单项选择（Choice）
- **题干**：`Which of the following words best describes an approach guided by practical results rather than abstract theories?`
- **选项列表**：
  - `A. dogmatic`
  - `B. pragmatic`
  - `C. ephemeral`
  - `D. arbitrary`
- **正确答案**：`B. pragmatic`
- **判分逻辑**：
  - 用户点击选项 `B. pragmatic`
  - 判定结果：**正确**
  - 解析展示：`pragmatic 意为「务实的，注重实际的」，与句中 practical results 形成近义对应。`

##### 题型三：英译中（En to Zh）
- **题干词汇**：`serendipity`
- **标准答案**：`意外发现珍奇事物的本领；机缘巧合；偶然所得`
- **判分逻辑**：
  - 用户输入：`机缘巧合`（输入包含在服务端返回的分号/斜杠/逗号多重释义中）
  - 判定结果：**正确**（本地智能分词容错，无需一字不差完全匹配整段长义项）
  - 解析展示：`serendipity 指在无意中获得惊喜或珍贵发现的幸运巧合。`

#### 3. 结果反馈与复盘
作答完毕后，页面展示即时得分面板（例如 `3 / 3 (100%)`）。未掌握的单词可继续留在错词本中，等待下一轮智能混学或复习卷再次巩固，形成闭环。

## Project Introduction

<https://www.bilibili.com/video/BV1QwYv6eEAS>

## Online Access

<https://typewords.cc>

<img width="1920" height="1440" alt="practice words" src="/public/imgs/words.png" />
<img width="1920" height="1440" alt="practice articles" src="/public/imgs/articles.png" />

## Features

### Word Practice

- Practice modes: Follow-along / Dictation / Self-test / Spelling from memory
- Smart mode: Automatically calculates learning words based on memory curves, deepening memory through dictation
- Free mode: No restrictions, plan your own learning
- Provides phonetics, pronunciation (American/British), example sentences, phrases, synonyms, root words, etymology, error statistics, and more

### Article Memorization

- Built-in classic textbooks; you can also add or import articles with one-click translation and bilingual comparison
- Follow-along + dictation dual modes, sentence-by-sentence input with automatic pronunciation for more efficient memorization
- Supports listening while writing from memory to reinforce learning

### Favorites, Wrong Words, Mastered

- Words typed incorrectly while learning are automatically added to your wrong word book for later review
- Actively add words to mastered to automatically skip them in future sessions
- Add words to favorites for consolidation and review

### Highly Customizable

- Rich keyboard sound effects
- Customizable shortcuts
- Highly configurable settings

### Clean and Efficient

- Clean design, modern UI, ad-free
- Refreshing interface, simple operation
- No forced subscription to any platform

### Vocabulary Library

Built-in commonly used vocabulary including CET-4, CET-6, GMAT, GRE, IELTS, SAT, TOEFL, Graduate English, TEM-4, TEM-8, and more (official website only).
Designed to meet most users' vocabulary learning needs. Community contributions of additional vocabulary are welcome.

## Running the Project

#### Note: This project can run standalone with data saved locally. Manual backup is required when switching devices; this does not affect normal usage.

This project is built with `Nuxt` and requires a Node.js environment.

1. Install NodeJS, refer to the [official documentation](https://nodejs.org/en/download)
2. The project is large. It's recommended to use `git clone --depth 1 https://github.com/zyronon/TypeWords.git` to clone only the latest commit. GitHub's Download ZIP feature will not work properly.
3. In the project root directory, open a terminal and run `pnpm install` to download dependencies.
4. Run `pnpm run dev` to start the project. The default address is [`http://localhost:5567`](http://localhost:5567)
5. Open [`http://localhost:5567`](http://localhost:5567) in your browser to access the project.
6. Run `pnpm run generate` to build the project files.

## Features and Suggestions

The project is currently in early development, with new features being added continuously. If you have any suggestions or feature requests, feel free to open an `Issue`.
If you like the design philosophy of this software, please submit a `PR`. Thank you for your support!

## Contributing Guide

[Contributing Guidelines](/docs/CONTRIBUTING.md)

If you're interested in this project, we welcome your contributions and will provide as much help as possible.

Before contributing, please communicate with the developers to avoid code conflicts.

Thank you again for your contributions!


## ❤️ Support TypeWords
If TypeWords has been helpful to you, feel free to sponsor the project to support server operation and future development.  
Of course, sponsorship is not required for use—sharing the project, submitting feedback, or contributing code are also highly valuable forms of support.

<img width="300" height="390" alt="practice words" src="/public/imgs/zhifubao.png" />
<img width="300" height="390" alt="practice words" src="/public/imgs/weixin.png" />

