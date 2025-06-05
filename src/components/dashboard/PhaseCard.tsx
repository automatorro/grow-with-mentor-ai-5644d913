
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Phase {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'completed' | 'active' | 'locked';
  isPremium: boolean;
  path: string;
}

interface PhaseCardProps {
  phase: Phase;
  isPremiumUser: boolean;
  onPhaseClick: (phase: Phase) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  isPremiumUser, 
  onPhaseClick 
}) => {
  const Icon = phase.icon;
  const isLocked = phase.status === 'locked';
  const isActive = phase.status === 'active';
  const isCompleted = phase.status === 'completed';
  const needsPremium = phase.isPremium && !isPremiumUser;

  return (
    <Card 
      className={`
        ${isCompleted ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
        ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-background' : ''}
        ${isLocked ? 'bg-muted border-border opacity-60' : ''}
        ${!isLocked && !needsPremium ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
        transition-all duration-200 rounded-xl shadow-sm hover:shadow-md
      `}
      onClick={() => !isLocked && !needsPremium && onPhaseClick(phase)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${isCompleted ? 'bg-blue-200 dark:bg-blue-800' : 
                isActive ? 'bg-blue-200 dark:bg-blue-800' : 
                'bg-muted'}
            `}>
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ) : isLocked ? (
                <Lock className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Icon className={`h-6 w-6 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                }`} />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-lg font-semibold ${
                  isLocked ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  Phase {phase.id}: {phase.title}
                </h3>
                {phase.isPremium && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Premium
                  </span>
                )}
              </div>
              <p className={`${
                isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {phase.description}
              </p>
              
              {needsPremium && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Upgrade to Premium to unlock this phase
                  </p>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {isActive && !needsPremium && (
            <Button className="bg-primary hover:bg-primary/90 ml-4">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
