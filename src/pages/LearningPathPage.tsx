
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Target, 
  BookOpen, 
  Play,
  Lock,
  Star
} from 'lucide-react';

const LearningPathPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.isPremium) {
    return (
      <div className="min-h-screen bg-professional-grey-50 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <Lock className="h-16 w-16 text-professional-grey-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-professional-grey-900 mb-4">
              Premium Feature
            </h1>
            <p className="text-lg text-professional-grey-600 mb-8">
              Upgrade to Premium to access your personalized learning path.
            </p>
            <Button className="btn-growth">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const learningModules = [
    {
      id: 1,
      title: 'Strategic Thinking Fundamentals',
      description: 'Develop your ability to think strategically and see the bigger picture in your decisions.',
      duration: '45 min',
      type: 'Interactive Module',
      progress: 0,
      status: 'available'
    },
    {
      id: 2,
      title: 'Effective Delegation Techniques',
      description: 'Learn how to delegate effectively while maintaining quality and team motivation.',
      duration: '30 min',
      type: 'Video + Exercise',
      progress: 0,
      status: 'available'
    },
    {
      id: 3,
      title: 'Long-term Planning & Goal Setting',
      description: 'Master the art of creating and executing long-term strategic plans.',
      duration: '60 min',
      type: 'Workshop',
      progress: 0,
      status: 'locked'
    },
    {
      id: 4,
      title: 'Advanced Problem-Solving Frameworks',
      description: 'Apply sophisticated problem-solving methodologies to complex challenges.',
      duration: '40 min',
      type: 'Case Study',
      progress: 0,
      status: 'locked'
    }
  ];

  return (
    <div className="min-h-screen bg-professional-grey-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-growth-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-growth-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-professional-grey-900">Personalized Learning Path</h1>
              <p className="text-professional-grey-600">Phase 3: Your customized development journey</p>
            </div>
          </div>
        </div>

        {/* Learning Path Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-growth-teal-500" />
              Your Learning Journey
            </CardTitle>
            <CardDescription>
              Based on your assessment results, we've created a personalized path to develop your skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-growth-teal-600 mb-1">4</div>
                <div className="text-sm text-professional-grey-600">Learning Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-blue-600 mb-1">~3 hrs</div>
                <div className="text-sm text-professional-grey-600">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-grey-600 mb-1">0%</div>
                <div className="text-sm text-professional-grey-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Areas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Focus Areas</CardTitle>
            <CardDescription>
              Based on your assessment, we're prioritizing these skill areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-growth-teal-100 text-growth-teal-800">
                Strategic Thinking
              </Badge>
              <Badge variant="secondary" className="bg-professional-blue-100 text-professional-blue-800">
                Delegation Skills
              </Badge>
              <Badge variant="secondary" className="bg-professional-grey-100 text-professional-grey-800">
                Long-term Planning
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-professional-grey-900">Learning Modules</h2>
          
          {learningModules.map((module) => (
            <Card 
              key={module.id} 
              className={`${
                module.status === 'locked' ? 'opacity-60' : 'hover:shadow-md'
              } transition-all duration-200`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-professional-grey-900">
                        {module.title}
                      </h3>
                      {module.status === 'locked' && (
                        <Lock className="h-4 w-4 text-professional-grey-400" />
                      )}
                    </div>
                    
                    <p className="text-professional-grey-600 mb-3">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-professional-grey-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {module.type}
                      </div>
                    </div>
                    
                    {module.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6">
                    {module.status === 'available' ? (
                      <Button className="btn-growth">
                        <Play className="mr-2 h-4 w-4" />
                        Start Module
                      </Button>
                    ) : (
                      <Button disabled className="opacity-50">
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Benefits */}
        <Card className="mt-8 border-growth-teal-200 bg-growth-teal-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Star className="h-6 w-6 text-growth-teal-600 mt-1" />
              <div>
                <h3 className="font-semibold text-growth-teal-900 mb-2">
                  You're on the Premium Plan!
                </h3>
                <p className="text-growth-teal-700 mb-3">
                  Enjoy unlimited access to all learning modules, advanced analytics, and priority support.
                </p>
                <Button variant="outline" onClick={() => navigate('/account')}>
                  Manage Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningPathPage;
