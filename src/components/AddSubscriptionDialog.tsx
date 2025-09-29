import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { PLATFORMS } from '@/lib/platforms';
import { CURRENCIES } from '@/lib/currencies';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/lib/types';
const formSchema = z.object({
  platformName: z.string().min(1, { message: 'Please select a platform.' }),
  planName: z.string().min(1, { message: 'Plan name is required.' }),
  price: z.number().min(0, { message: 'Price must be a positive number.' }),
  billingCycle: z.enum(['monthly', 'yearly']),
  renewalDate: z.date(),
});
type AddSubscriptionDialogProps = {
  subscription?: Subscription;
  trigger?: React.ReactNode;
};
const defaultFormValues = {
  planName: '',
  price: 0,
  billingCycle: 'monthly' as 'monthly' | 'yearly',
  renewalDate: new Date(),
  platformName: '',
};
export function AddSubscriptionDialog({ subscription, trigger }: AddSubscriptionDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addSubscription, updateSubscription } = useSubscriptionStore();
  const currencyCode = useSubscriptionStore((state) => state.currency);
  const currency = useMemo(() => {
    return CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  }, [currencyCode]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: subscription
      ? {
          ...subscription,
          price: subscription.price,
        }
      : defaultFormValues,
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset(
        subscription
          ? { ...subscription, price: subscription.price }
          : defaultFormValues
      );
    }
  }, [isOpen, subscription, form]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (subscription) {
      updateSubscription({ ...subscription, ...values });
    } else {
      addSubscription(values);
    }
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle>
          <DialogDescription>
            {subscription ? 'Update the details of your subscription.' : 'Enter the details of your new subscription.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platformName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Premium, Standard with Ads" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        {currency.symbol}
                      </span>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="15.99"
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="renewalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Renewal Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {subscription ? 'Save Changes' : 'Add Subscription'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}