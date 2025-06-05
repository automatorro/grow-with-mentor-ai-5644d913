
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    description: 'Perfect for getting started',
    features: [
      'Access to basic learning modules',
      'Progress tracking',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    name: 'Premium',
    price: '$19.99',
    description: 'Most popular choice',
    features: [
      'All Basic features',
      'Personalized learning paths',
      'Advanced analytics',
      'Priority support',
      'Live mentoring sessions',
      'Certificate generation'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    description: 'For serious professionals',
    features: [
      'All Premium features',
      'Custom learning tracks',
      'Team management',
      'API access',
      'Dedicated support',
      'Custom integrations'
    ]
  }
];

export const SubscriptionPlans: React.FC = () => {
  const { createCheckout, subscribed, subscription_tier } = useSubscription();

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {plans.map((plan) => (
        <Card 
          key={plan.name} 
          className={`relative bg-card border-border ${
            plan.popular ? 'border-primary' : ''
          }`}
        >
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-foreground flex items-center justify-center gap-2">
              {subscription_tier === plan.name && <Star className="h-4 w-4 text-primary" />}
              {plan.name}
            </CardTitle>
            <div className="text-3xl font-bold text-foreground">{plan.price}</div>
            <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full"
              variant={subscription_tier === plan.name ? "outline" : "default"}
              onClick={() => subscription_tier === plan.name ? null : createCheckout(plan.name)}
              disabled={subscription_tier === plan.name}
            >
              {subscription_tier === plan.name ? 'Current Plan' : `Choose ${plan.name}`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
