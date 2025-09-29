import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PLATFORMS } from '@/lib/platforms';
import { CURRENCIES } from '@/lib/currencies';
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B8B8', '#C1E1C1'];
export function PlatformBreakdownChart() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const currencyCode = useSubscriptionStore((state) => state.currency);
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);
  const chartData = useMemo(() => {
    const platformCosts: { [key: string]: number } = {};
    subscriptions.forEach(sub => {
      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      const platformTitle = PLATFORMS.find(p => p.name === sub.platformName)?.title || 'Other';
      if (platformCosts[platformTitle]) {
        platformCosts[platformTitle] += monthlyPrice;
      } else {
        platformCosts[platformTitle] = monthlyPrice;
      }
    });
    return Object.entries(platformCosts).map(([name, value]) => ({ name, value }));
  }, [subscriptions]);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {currency.symbol}{data.value.toFixed(2)} / month
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Platform Breakdown</CardTitle>
        <CardDescription>Your monthly spending distribution across platforms.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}