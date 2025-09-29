import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Subscription } from '@/lib/types';
import { PLATFORMS } from '@/lib/platforms';
import { CURRENCIES } from '@/lib/currencies';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
interface SubscriptionCardProps {
  subscription: Subscription;
}
export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);
  const currencyCode = useSubscriptionStore((state) => state.currency);
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);
  const platform = PLATFORMS.find((p) => p.name === subscription.platformName);
  const handleDelete = () => {
    deleteSubscription(subscription.id);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card
        className="relative flex flex-col h-full bg-card border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-muted">
            {platform && (
              <div
                className="w-8 h-8 text-foreground"
                dangerouslySetInnerHTML={{ __html: platform.logo }}
              />
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-xl font-bold font-display text-foreground">
              {platform?.title || subscription.platformName}
            </CardTitle>
            <CardDescription className="text-muted-foreground">{subscription.planName}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-4xl font-bold text-primary">
            {currency.symbol}{subscription.price.toFixed(2)}
            <span className="text-base font-medium text-muted-foreground">
              /{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Renews on</span>
          <span className="font-semibold text-foreground">
            {format(subscription.renewalDate, 'MMM d, yyyy')}
          </span>
        </CardFooter>
        <div className="px-6 pb-4 text-xs text-muted-foreground/70">
          Renews {formatDistanceToNow(subscription.renewalDate, { addSuffix: true })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex items-center gap-2"
        >
          <AddSubscriptionDialog
            subscription={subscription}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your subscription
                  for {platform?.title || subscription.platformName}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </Card>
    </motion.div>
  );
}