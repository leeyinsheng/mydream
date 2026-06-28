import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const existing = await db.partner.count();
  if (existing > 0) {
    console.log("資料庫已有合作夥伴資料，跳過 seed");
    return;
  }

  const p1 = await db.partner.create({
    data: {
      id: "p1", name: "便利超商聯盟", apiEndpoint: "https://partner-api.example.com/convenience", status: "active",
      products: {
        create: [
          { id: "pr1", name: "7-Eleven 禮券 500 元", description: "全台 7-Eleven 門市通用", pointsCost: 4500, stock: -1, status: "active" },
          { id: "pr2", name: "全家禮物卡 300 元", description: "全家便利商店適用", pointsCost: 2700, stock: 50, status: "active" },
        ],
      },
    },
  });

  const p2 = await db.partner.create({
    data: {
      id: "p2", name: "影音娛樂平台", apiEndpoint: "https://partner-api.example.com/media", status: "active",
      products: {
        create: [
          { id: "pr3", name: "Netflix 標準月卡", description: "HD 畫質，可同時 2 人觀看", pointsCost: 8000, stock: 50, status: "active" },
          { id: "pr4", name: "Spotify Premium 月卡", description: "無廣告離線收聽", pointsCost: 6000, stock: 50, status: "active" },
          { id: "pr5", name: "CATCHPLAY+ 月卡", description: "台灣電影串流平台", pointsCost: 5000, stock: 50, status: "active" },
        ],
      },
    },
  });

  const p3 = await db.partner.create({
    data: {
      id: "p3", name: "遊戲平台聯盟", apiEndpoint: "https://partner-api.example.com/gaming", status: "active",
      products: {
        create: [
          { id: "pr6", name: "Steam 錢包 300 元", description: "遊戲平台儲值", pointsCost: 5500, stock: 50, status: "active" },
          { id: "pr7", name: "MyCard 點數 150 點", description: "台灣熱門遊戲通用", pointsCost: 3000, stock: 0, status: "inactive" },
        ],
      },
    },
  });

  const p4 = await db.partner.create({
    data: {
      id: "p4", name: "外送平台聯盟", apiEndpoint: null, status: "active",
      products: {
        create: [
          { id: "pr8", name: "GrabFood 150 元折價", description: "美食外送平台", pointsCost: 4000, stock: 50, status: "active" },
        ],
      },
    },
  });

  console.log(`Seed 完成：${[p1, p2, p3, p4].length} 個合作夥伴`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
