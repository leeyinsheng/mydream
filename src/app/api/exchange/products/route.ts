import { NextResponse } from "next/server";
import { getProducts } from "@/lib/exchange";

const MOCK_PRODUCTS = [
  { id: "p1", name: "7-Eleven 禮券 500 元", description: "全台 7-Eleven 門市通用", pointsCost: 4500, imageIcon: "🎫", stock: -1, status: "active", partner: { name: "便利超商聯盟" } },
  { id: "p2", name: "全家禮物卡 300 元", description: "全家便利商店適用", pointsCost: 2700, imageIcon: "☕", stock: 8, status: "active", partner: { name: "便利超商聯盟" } },
  { id: "p3", name: "Netflix 標準月卡", description: "支援 HD 畫質，可同時 2 人觀看", pointsCost: 8000, imageIcon: "🎬", stock: 15, status: "active", partner: { name: "影音娛樂平台" } },
  { id: "p4", name: "Spotify Premium 月卡", description: "無廣告離線收聽", pointsCost: 6000, imageIcon: "🎵", stock: 20, status: "active", partner: { name: "影音娛樂平台" } },
  { id: "p5", name: "Line Points 100 點", description: "LINE Pay 消費可抵用", pointsCost: 3500, imageIcon: "💬", stock: 50, status: "active", partner: { name: "通訊平台聯盟" } },
  { id: "p6", name: "博客來電子禮券 200 元", description: "全站圖書適用", pointsCost: 1800, imageIcon: "📚", stock: 3, status: "active", partner: { name: "電商平台聯盟" } },
  { id: "p7", name: "GrabFood 150 元折價", description: "東南亞美食外送平台", pointsCost: 4000, imageIcon: "🍜", stock: 25, status: "active", partner: { name: "外送平台聯盟" } },
  { id: "p8", name: "Steam 錢包 300 元", description: "Steam 遊戲平台儲值", pointsCost: 5500, imageIcon: "🎮", stock: 12, status: "active", partner: { name: "遊戲平台聯盟" } },
  { id: "p9", name: "MyCard 點數 150 點", description: "台灣熱門遊戲通用點數", pointsCost: 3000, imageIcon: "🎯", stock: 0, status: "active", partner: { name: "遊戲平台聯盟" } },
  { id: "p10", name: "CATCHPLAY+ 月卡", description: "台灣電影線上串流平台", pointsCost: 5000, imageIcon: "🎥", stock: 10, status: "active", partner: { name: "影音娛樂平台" } },
];

export async function GET() {
  try {
    const products = await getProducts();
    if (products.length > 0) return NextResponse.json(products);
  } catch { /* DB not available, use mock */ }
  return NextResponse.json(MOCK_PRODUCTS);
}

