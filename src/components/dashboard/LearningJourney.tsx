
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhaseCard } from './PhaseCard';
import { Brain, Target, TrendingUp } from 'lucide-react';

interface User {
  completedPhases: number[];
  currentPhase: number;
  isPremium: boolean;
}

interface LearningJourneyProps {
  user: User;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({ user }) => {
  const navigate = useNavigate();

  const phases = [
    {
      id: 1,
      title: 'AI-Powered Assessment',
      description: 'Take our comprehensive assessment to identify your unique strengths and growth areas.',
      icon: Brain,
      status: user?.completedPhases.includes(1) ? 'completed' : user?.currentPhase === 1 ? 'active' : 'locked',
      isPremium: false,
      path: '/assessment'
    },
    {
      id: 2,
      title: 'Assessment Results',
      description: 'Review your personalized results and insights from the AI analysis.',
      icon: Target,
      status: user?.completedPhases.includes(2) ? 'completed' : 
              user?.completedPhases.includes(1) && user?.currentPhase === 2 ? 'active' : 'locked',
      isPremium: false,
      path: '/results'
    },
    {
      id: 3,
      title: 'Personalized Learning Path',
      description: 'Get your customized learning journey tailored to your specific needs and goals.',
      icon: TrendingUp,
      status: user?.completedPhases.includes(3) ? 'completed' : 
              user?.completedPhases.includes(2) && user?.currentPhase === 3 ? 'active' : 'locked',
      isPremium: true,
      path: '/learning-path'
    }
  ] as const;

  const handlePhaseClick = (phase: any) => {
    if (phase.status === 'locked') return;
    
    if (phase.isPremium && !user?.isPremium) {
      // Show upgrade prompt
      return;
    }
    
    if (phase.status === 'active') {
      navigate(phase.path);
    }
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold text-foreground">Your Learning Journey</h2>
      
      {phases.map((phase) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          isPremiumUser={user?.isPremium || false}
          onPhaseClick={handlePhaseClick}
        />
      ))}
    </div>
  );
};
