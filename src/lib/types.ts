export interface Platform {
  name: string;
  title: string;
  logo: string; // SVG string
}
export interface Subscription {
  id: string;
  platformName: string;
  planName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: Date;
  createdAt: Date;
}
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}