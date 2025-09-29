import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, CalendarDays, Tv, PlusCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog';
import { CurrencySelector } from '@/components/CurrencySelector';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCIES } from '@/lib/currencies';
function SummaryCard({ icon: Icon, title, value, isLoading }: { icon: React.ElementType; title: string; value: string; isLoading: boolean }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
export function HomePage() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const hasHydrated = useSubscriptionStore((state) => state.hasHydrated);
  const currencyCode = useSubscriptionStore((state) => state.currency);
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);
  const { monthlyCost, yearlyCost } = useMemo(() => {
    let monthly = 0;
    let yearly = 0;
    subscriptions.forEach((sub) => {
      if (sub.billingCycle === 'monthly') {
        monthly += sub.price;
        yearly += sub.price * 12;
      } else {
        yearly += sub.price;
        monthly += sub.price / 12;
      }
    });
    return { monthlyCost: monthly, yearlyCost: yearly };
  }, [subscriptions]);
  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
  }, [subscriptions]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-12">
          <header className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold font-display text-center text-foreground"
            >
              Streamline
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground text-center max-w-2xl mx-auto"
            >
              Your personal dashboard to track all OTT subscriptions, costs, and renewal dates in one place.
            </motion.p>
          </header>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard icon={DollarSign} title="Total Monthly Cost" value={`${currency.symbol}${monthlyCost.toFixed(2)}`} isLoading={!hasHydrated} />
              <SummaryCard icon={CalendarDays} title="Total Annual Cost" value={`${currency.symbol}${yearlyCost.toFixed(2)}`} isLoading={!hasHydrated} />
              <SummaryCard icon={Tv} title="Active Subscriptions" value={subscriptions.length.toString()} isLoading={!hasHydrated} />
            </div>
          </motion.section>
          <AnalyticsDashboard />
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold font-display text-foreground">Your Subscriptions</h2>
                <CurrencySelector />
              </div>
              <AddSubscriptionDialog />
            </div>
            {hasHydrated && subscriptions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-center py-16 px-8 border-2 border-dashed border-border rounded-lg"
              >
                <div className="inline-block p-4 bg-muted rounded-full mb-4">
                  <Tv className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No subscriptions yet</h3>
                <p className="text-muted-foreground mt-2 mb-4">Click 'Add Subscription' to get started.</p>
                <AddSubscriptionDialog trigger={
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Subscription
                  </Button>
                } />
              </motion.div>
            )}
            {!hasHydrated && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4 p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-grow">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {hasHydrated && subscriptions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {sortedSubscriptions.map((sub) => (
                    <SubscriptionCard key={sub.id} subscription={sub} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="text-center py-8 text-muted-foreground text-sm">
        <p>Built with ❤�� by Subhankar</p>
      </footer>
    </div>
  );
}