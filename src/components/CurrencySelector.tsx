import { useSubscriptionStore } from '@/store/subscriptionStore';
import { CURRENCIES } from '@/lib/currencies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export function CurrencySelector() {
  const currency = useSubscriptionStore((state) => state.currency);
  const setCurrency = useSubscriptionStore((state) => state.setCurrency);
  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-[180px] bg-card border-border">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.code} - {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}