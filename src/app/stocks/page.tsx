import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChartView } from "./StockChartView";

export const dynamic = "force-dynamic";

export default function StocksPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">股市</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="text-base">台積電 (2330.TW)</CardTitle></CardHeader>
          <CardContent><StockChartView /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">個股資訊</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">市值</span><span>23.5 兆</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">本益比</span><span>24.5</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">殖利率</span><span>1.8%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">開盤</span><span>950</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">最高</span><span>965</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">最低</span><span>948</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">昨收</span><span>945</span></div>
          </CardContent>
        </Card>
      </div>
      <div className="h-20 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
