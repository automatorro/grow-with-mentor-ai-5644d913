
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionStatusProps {
  isPremium: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ isPremium }) => {
  const { subscribed, subscription_tier, subscription_end, createCheckout, openCustomerPortal, loading } = useSubscription();

  // Use actual subscription data if available, otherwise fall back to prop
  const isActuallyPremium = subscribed || isPremium;
  const actualTier = subscription_tier || (isPremium ? 'Premium' : 'Free');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="mb-8 bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActuallyPremium ? 'bg-primary' : 'bg-blue-500'
            }`}>
              {isActuallyPremium ? (
                <Star className="h-5 w-5 text-white" />
              ) : (
                <Clock className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {isActuallyPremium ? `${actualTier} Member` : 'Free Member'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isActuallyPremium 
                  ? `Enjoy unlimited access to all features${subscription_end ? ` until ${formatDate(subscription_end)}` : ''}` 
                  : 'Upgrade to unlock personalized learning paths'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isActuallyPremium ? (
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => createCheckout('Premium')}
                disabled={loading}
              >
                Upgrade to Premium
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={openCustomerPortal}
                disabled={loading}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
