import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Subscription } from '@/lib/types';
interface SubscriptionState {
  subscriptions: Subscription[];
  currency: string;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
  setCurrency: (currency: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}
export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscriptions: [],
      currency: 'USD', // Default currency
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      addSubscription: (subscription) =>
        set((state) => ({
          subscriptions: [
            ...state.subscriptions,
            {
              ...subscription,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      updateSubscription: (subscription) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === subscription.id ? subscription : s
          ),
        })),
      deleteSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        })),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'streamline-subscriptions',
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === 'renewalDate' || key === 'createdAt') {
            return new Date(value as string);
          }
          return value;
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);