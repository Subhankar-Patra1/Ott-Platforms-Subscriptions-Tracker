import { motion } from 'framer-motion';
import { LineChart, PieChart as PieChartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SpendingChart } from './SpendingChart';
import { PlatformBreakdownChart } from './PlatformBreakdownChart';
export function AnalyticsDashboard() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  if (subscriptions.length === 0) {
    return null; // Don't render the dashboard if there are no subscriptions
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-semibold font-display text-foreground text-center">
        Spending Insights
      </h2>
      <Tabs defaultValue="spending-trend" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending-trend">
            <LineChart className="mr-2 h-4 w-4" />
            Spending Trend
          </TabsTrigger>
          <TabsTrigger value="platform-breakdown">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Platform Breakdown
          </TabsTrigger>
        </TabsList>
        <TabsContent value="spending-trend" className="mt-4">
          <SpendingChart />
        </TabsContent>
        <TabsContent value="platform-breakdown" className="mt-4">
          <PlatformBreakdownChart />
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}