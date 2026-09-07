# 观势

一个基于《易经》卦象的结构化思考工具。

它不把《易经》做成简单的算命答案机，而是把卦象理解为关于“时、位、势、变”的观察系统：

- 静态：用户当下所处的状态、位置、关系和局面。
- 动态：局势下一步可能如何变化，以及用户更适合采取什么行动姿态。

## 当前真源

正式产品入口是 React/Vinext 版本：

- 页面：`app/page.tsx`
- 共享卦象核心：`lib/iching.js`
- LLM 适配与回退：`lib/llm.js`
- 同源 API：`app/api/interpret/route.ts`

根目录的 `index.html`、`script.js`、`styles.css` 是 legacy 静态兼容版本，不再作为功能真源。它已经改为复用共享起卦核心，并移除了 `innerHTML` 拼接。

## 已包含

- 完整 64 卦基础库
- 三枚铜钱起卦，6/7/8/9 概率为 1/8、3/8、3/8、1/8
- 本卦、变卦、变爻事实校验
- 问题场景识别和三次澄清
- 本地历史记录，默认保存在当前浏览器
- 同源 `/api/interpret` 服务端解读接口
- GLM、DeepSeek、Kimi 统一 Provider Adapter
- 默认仅本地解读；联网模式明确披露第三方数据处理
- 服务端 provider 白名单、请求体限制、IP 与全局分钟/每日额度
- 模型失败、本地模板回退和高风险安全分支
- 模型输出的卦名与变爻明显矛盾检查

## 问题与卦象如何对应

用户输入的问题不会决定卦象。卦象由程序使用三枚铜钱规则生成，以保留仪式感和不确定性。

用户问题用于识别语境，例如项目、关系、事业或情绪。系统会用这个语境调整解读角度和行动建议。

简单说：问题提供语境，卦象提供时位，模型只负责解释。

## 文档

- `IMPLEMENTATION_PLAN.md`
- `API_CONTRACT.md`
- `.env.example`
- `DEPLOYMENT.md`

## Commands

```bash
npm install
npm run dev
npm test
npm run build
```

Node version should be 22.13 or newer for the Vinext/Sites runtime.
