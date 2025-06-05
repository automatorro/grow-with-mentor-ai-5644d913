
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus';
import { LearningJourney } from '@/components/dashboard/LearningJourney';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        <DashboardHeader userName={user.name} />
        
        <ProgressOverview 
          completedPhases={user.completedPhases.length}
          totalPhases={3}
        />
        
        <SubscriptionStatus isPremium={user.isPremium} />
        
        <LearningJourney user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
