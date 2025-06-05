
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const { session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    if (!session?.access_token) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (tier: string = 'Premium') => {
    if (!session?.access_token) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { tier }
      });
      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      checkSubscription();
    }
  }, [session?.access_token]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
