"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai"; // 
import { addTransaction } from "./actions";

//  初始化 DeepSeek 
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

export async function createTransactionFromText(input: string) {
  "use server";
  try {
    // 2. 使用 generateText (纯文本模式)
    // 这样就不会发送导致报错的 response_format 参数
    const { text } = await generateText({
      model: deepseek.chat("deepseek-chat"),
      // 3. 在 Prompt 里强行要求它输出 JSON
      system: `你是一个专业的财务助手。请将用户的自然语言描述转化为标准的 JSON 格式。
      规则：
      1. 返回且仅返回一个 JSON 对象，不要包含 Markdown 格式（如 \`\`\`json）。
      2. 必须包含两个字段：
         - "label" (string): 简短说明。
         - "amount" (number): 金额。支出必须转为负数，收入为正数。
      3. 如果无法识别，label 填 "未知"，amount 填 0。`,
      prompt: `用户输入：${input}`,
    });
    // 4. 手动清洗和解析 JSON
    // 有时候 AI 会忍不住加 Markdown 代码块，我们把它删掉
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const object = JSON.parse(cleanJson);

    // 5. 存入数据库
    const formData = new FormData();
    formData.append("label", object.label);
    formData.append("amount", object.amount.toString());

    await addTransaction(formData);

    return { success: true, message: `已自动记账：${object.label} (${object.amount})` };
  
  } catch (error) {
    console.error("AI 处理失败:", error);
    return { success: false, message: "AI 犯迷糊了，请重试" };
  }
}