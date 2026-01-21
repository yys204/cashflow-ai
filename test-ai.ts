// test-ai.ts
import dotenv from 'dotenv'
// 加载 .env
dotenv.config()

async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY
  // 注意：手动指定不带 /v1 的 base url 来测试，看是不是路径问题
  const baseUrl = "https://api.deepseek.com/chat/completions"

  console.log('📡 正在尝试直连 DeepSeek...')
  console.log(`🔗 目标地址: ${baseUrl}`)
  console.log(`🔑 Key 长度: ${apiKey?.length || 0}`)

  try {
    const start = Date.now()
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: "你好，你是谁？" }
        ],
        stream: false
      }),
    })

    const data = await response.json()
    const end = Date.now()
    
    console.log(`✅ 连接成功！耗时: ${end - start}ms`)
    console.log('📝 回复:', data.choices?.[0]?.message?.content || data)
    
  } catch (error) {
    console.error('❌ 连接失败:', error)
  }
}

main()