import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Package, Circle } from "lucide-react";

const PARTNERS = [
  { id: "p1", name: "便利超商聯盟", api: "https://partner-api.example.com/convenience", status: "active", date: "2026-01-15", products: [
    { name: "7-Eleven 禮券 500 元", points: 4500 }, { name: "全家禮物卡 300 元", points: 2700 },
  ]},
  { id: "p2", name: "影音娛樂平台", api: "https://partner-api.example.com/media", status: "active", date: "2026-02-01", products: [
    { name: "Netflix 標準月卡", points: 8000 }, { name: "Spotify Premium 月卡", points: 6000 }, { name: "CATCHPLAY+ 月卡", points: 5000 },
  ]},
  { id: "p3", name: "遊戲平台聯盟", api: "https://partner-api.example.com/gaming", status: "active", date: "2026-03-10", products: [
    { name: "Steam 錢包 300 元", points: 5500 }, { name: "MyCard 點數 150 點", points: 3000 },
  ]},
  { id: "p4", name: "外送平台聯盟", api: "（無 API）", status: "active", date: "2026-04-20", products: [
    { name: "GrabFood 150 元折價", points: 4000 },
  ]},
  { id: "p5", name: "通訊平台聯盟", api: "https://partner-api.example.com/comm", status: "pending", date: "2026-05-01", products: [
    { name: "Line Points 100 點", points: 3500 },
  ]},
];

export default function PartnerAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">合作夥伴管理</h1>

      <div className="grid grid-cols-1 gap-3">
        {PARTNERS.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{p.api}</p>
                  </div>
                </div>
                <Circle className={`h-3 w-3 ${p.status === "active" ? "fill-green-500 text-green-500" : "fill-amber-500 text-amber-500"}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Package className="h-3 w-3" /> {p.products.length} 個商品
              </div>
              <div className="space-y-2">
                {p.products.map((pr, i) => (
                  <div key={i} className="flex justify-between text-sm border rounded p-2">
                    <span>{pr.name}</span>
                    <span className="font-mono text-primary font-semibold">{pr.points.toLocaleString()} 點</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
