import { NextResponse } from "next/server";
import { getPartners } from "@/lib/exchange";
import { requireAdmin } from "@/lib/auth-utils";

const MOCK_PARTNERS = [
  { id: "p1", name: "便利超商聯盟", apiEndpoint: "https://partner-api.example.com/convenience", status: "active", createdAt: "2026-01-15T00:00:00.000Z", products: [
    { id: "pr1", name: "7-Eleven 禮券 500 元", pointsCost: 4500, status: "active" },
    { id: "pr2", name: "全家禮物卡 300 元", pointsCost: 2700, status: "active" },
  ]},
  { id: "p2", name: "影音娛樂平台", apiEndpoint: "https://partner-api.example.com/media", status: "active", createdAt: "2026-02-01T00:00:00.000Z", products: [
    { id: "pr3", name: "Netflix 標準月卡", pointsCost: 8000, status: "active" },
    { id: "pr4", name: "Spotify Premium 月卡", pointsCost: 6000, status: "active" },
    { id: "pr5", name: "CATCHPLAY+ 月卡", pointsCost: 5000, status: "active" },
  ]},
  { id: "p3", name: "遊戲平台聯盟", apiEndpoint: "https://partner-api.example.com/gaming", status: "active", createdAt: "2026-03-10T00:00:00.000Z", products: [
    { id: "pr6", name: "Steam 錢包 300 元", pointsCost: 5500, status: "active" },
    { id: "pr7", name: "MyCard 點數 150 點", pointsCost: 3000, status: "inactive" },
  ]},
  { id: "p4", name: "外送平台聯盟", apiEndpoint: null, status: "active", createdAt: "2026-04-20T00:00:00.000Z", products: [
    { id: "pr8", name: "GrabFood 150 元折價", pointsCost: 4000, status: "active" },
  ]},
];

export async function GET() {
  const adminError = await requireAdmin();
  if (adminError) return adminError;
  try {
    const partners = await getPartners();
    if (partners.length > 0) return NextResponse.json(partners);
  } catch { /* DB not available, use mock */ }
  return NextResponse.json(MOCK_PARTNERS);
}

