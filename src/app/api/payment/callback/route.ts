export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "success";

  return new Response(
    `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>付款結果 - FinPulse</title>
<style>
  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
  .card { background: white; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 360px; width: 90%; }
  .icon { font-size: 48px; margin-bottom: 12px; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  p { color: #64748b; font-size: 14px; margin: 0 0 24px; }
  a { display: inline-block; background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">${status === "success" ? "✅" : "❌"}</div>
  <h1>${status === "success" ? "付款成功" : "付款失敗"}</h1>
  <p>${status === "success" ? "充值點數已加入您的錢包" : "付款未完成，請重新嘗試"}</p>
  <a href="/wallet">返回錢包</a>
</div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
