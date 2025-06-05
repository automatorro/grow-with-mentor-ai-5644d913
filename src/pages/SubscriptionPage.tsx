
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { subscribed, subscription_tier, subscription_end, checkSubscription, loading } = useSubscription();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
              <p className="text-muted-foreground">Choose the perfect plan for your learning journey</p>
            </div>
            <Button 
              variant="outline" 
              onClick={checkSubscription}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Current Subscription Status */}
        {subscribed && (
          <Card className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">Current Subscription</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                You are currently subscribed to the {subscription_tier} plan
                {subscription_end && ` until ${formatDate(subscription_end)}`}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Subscription Plans */}
        <SubscriptionPlans />

        {/* Features Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Why Upgrade?</CardTitle>
            <CardDescription className="text-muted-foreground">
              Unlock your full potential with premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personalized Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Get custom learning paths tailored to your goals and skill level
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track your progress with detailed insights and performance metrics
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help when you need it with our priority support team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
