
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Star,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentData {
  skill: string;
  response: string;
  timestamp: string;
}

const ResultsPage: React.FC = () => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, updateUserPhase } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('assessmentData');
    if (data) {
      setAssessmentData(JSON.parse(data));
    } else {
      navigate('/assessment');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const skillLabels: Record<string, string> = {
    communication: 'Communication',
    leadership: 'Leadership',
    teamwork: 'Teamwork',
    'problem-solving': 'Problem Solving',
    'time-management': 'Time Management',
    'emotional-intelligence': 'Emotional Intelligence',
    adaptability: 'Adaptability',
    'conflict-resolution': 'Conflict Resolution'
  };

  // Simulated AI analysis results
  const analysisResults = {
    overallScore: 75,
    strengths: [
      'Clear problem identification',
      'Structured approach to challenges',
      'Good stakeholder communication'
    ],
    growthAreas: [
      'Strategic thinking development',
      'Delegation skills',
      'Long-term planning'
    ],
    insights: [
      'Your response demonstrates strong analytical thinking and attention to detail.',
      'You show good awareness of team dynamics and stakeholder needs.',
      'There\'s opportunity to develop more strategic, big-picture thinking.',
      'Consider focusing on delegation and empowerment of team members.'
    ]
  };

  const handleContinue = () => {
    updateUserPhase(3);
    if (user?.isPremium) {
      navigate('/learning-path');
    } else {
      // Show upgrade prompt
      toast.info('Upgrade to Premium to access your personalized learning path!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-growth-teal-500"></div>
      </div>
    );
  }

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
              <Target className="h-6 w-6 text-growth-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-professional-grey-900">Assessment Results</h1>
              <p className="text-professional-grey-600">Phase 2: Your AI-powered analysis is ready</p>
            </div>
          </div>
        </div>

        {/* Assessment Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Overview</CardTitle>
            <CardDescription>
              Your {skillLabels[assessmentData?.skill || '']} assessment completed on{' '}
              {assessmentData ? new Date(assessmentData.timestamp).toLocaleDateString() : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Skill Assessment Score</span>
                  <span className="text-sm font-medium">{analysisResults.overallScore}/100</span>
                </div>
                <Progress value={analysisResults.overallScore} className="h-3" />
              </div>
              <p className="text-professional-grey-600">
                Based on your response, our AI has identified key strengths and growth opportunities 
                to help accelerate your professional development.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-growth-teal-500" />
              Your Strengths
            </CardTitle>
            <CardDescription>
              Key areas where you demonstrated proficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysisResults.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-growth-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-professional-grey-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-professional-blue-500" />
              Growth Opportunities
            </CardTitle>
            <CardDescription>
              Areas with the highest potential for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysisResults.growthAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-professional-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-professional-grey-700">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-professional-blue-500" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Detailed analysis of your response and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysisResults.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-professional-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-professional-grey-700">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Ready to create your personalized learning path?
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.isPremium ? (
              <div className="space-y-4">
                <p className="text-professional-grey-700">
                  Great news! As a Premium member, you can now access your personalized learning path 
                  based on these assessment results.
                </p>
                <Button onClick={handleContinue} className="btn-growth">
                  Create Learning Path <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-professional-blue-50 rounded-lg border border-professional-blue-200">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-professional-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-professional-blue-900 mb-2">
                        Unlock Your Personalized Learning Path
                      </h4>
                      <p className="text-professional-blue-700 mb-3">
                        Upgrade to Premium to get your customized learning journey with:
                      </p>
                      <ul className="text-sm text-professional-blue-700 space-y-1 mb-4">
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Tailored learning modules based on your assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Interactive exercises and practice scenarios
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Progress tracking and advanced analytics
                        </li>
                      </ul>
                      <Button className="btn-growth">
                        Upgrade to Premium - $29/month
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
