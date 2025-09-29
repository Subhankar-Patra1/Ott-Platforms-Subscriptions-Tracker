import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMonth, subMonths, format } from 'date-fns';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CURRENCIES } from '@/lib/currencies';
export function SpendingChart() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const currencyCode = useSubscriptionStore((state) => state.currency);
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);
  const chartData = useMemo(() => {
    const now = new Date();
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(now, 11 - i);
      return {
        name: format(date, 'MMM'),
        total: 0,
      };
    });
    subscriptions.forEach(sub => {
      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      const renewalMonth = getMonth(sub.renewalDate);
      // For simplicity, we'll assume active subscriptions contribute to every month's total.
      // A more complex logic could check for subscription start/end dates.
      for (let i = 0; i < 12; i++) {
        monthlyTotals[i].total += monthlyPrice;
      }
    });
    return monthlyTotals;
  }, [subscriptions]);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
              <span className="font-bold text-foreground">
                {currency.symbol}{payload[0].value.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your estimated monthly spending over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currency.symbol}${value}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}