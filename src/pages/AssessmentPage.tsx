
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  skill_name: string;
}

interface Question {
  id: string;
  question_text: string;
  question_order: number;
  options: QuestionOption[];
}

interface QuestionOption {
  id: string;
  option_letter: string;
  option_text: string;
}

interface Questionnaire {
  id: string;
  framework_name: string;
  description: string;
}

const AssessmentPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const { updateUserPhase } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (selectedSkillId) {
      fetchQuestions(selectedSkillId);
    } else {
      setQuestions([]);
      setQuestionnaire(null);
      setAnswers({});
    }
  }, [selectedSkillId]);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('skill_name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    }
  };

  const fetchQuestions = async (skillId: string) => {
    setLoadingQuestions(true);
    try {
      // First get the questionnaire for this skill
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('skill_id', skillId)
        .single();

      if (questionnaireError) throw questionnaireError;
      setQuestionnaire(questionnaireData);

      // Then get questions with their options
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          question_order,
          question_options (
            id,
            option_letter,
            option_text
          )
        `)
        .eq('questionnaire_id', questionnaireData.id)
        .order('question_order');

      if (questionsError) throw questionsError;

      const formattedQuestions = questionsData.map(q => ({
        ...q,
        options: q.question_options || []
      }));

      setQuestions(formattedQuestions);
      setAnswers({});
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load assessment questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkillId || !questionnaire) {
      toast.error('Please select a skill to assess.');
      return;
    }

    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    
    try {
      const selectedSkill = skills.find(s => s.id === selectedSkillId);
      
      // Prepare the assessment data
      const assessmentData = {
        skill_id: selectedSkillId,
        skill_name: selectedSkill?.skill_name,
        framework_name: questionnaire.framework_name,
        responses: questions.map(q => ({
          question_text: q.question_text,
          selected_answer: answers[q.id],
          question_order: q.question_order
        }))
      };

      // Call the process-assessment edge function
      const { data, error } = await supabase.functions.invoke('process-assessment', {
        body: assessmentData
      });

      if (error) throw error;
      
      // Store assessment results
      localStorage.setItem('assessmentData', JSON.stringify({
        ...assessmentData,
        results: data,
        timestamp: new Date().toISOString()
      }));
      
      // Update user phase
      updateUserPhase(2);
      
      toast.success('Assessment completed! Analyzing your responses...');
      navigate('/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
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
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI-Powered Assessment</h1>
              <p className="text-muted-foreground">Phase 1 of your professional development journey</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border">
          <CardHeader>
            <CardTitle>Skill Assessment</CardTitle>
            <CardDescription>
              Choose a skill you'd like to develop and complete the questionnaire. 
              Our AI will analyze your responses to provide personalized insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Skill Selection */}
              <div className="space-y-2">
                <Label htmlFor="skill">Choose a skill to assess:</Label>
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill to focus on" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.skill_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Questionnaire */}
              {selectedSkillId && questionnaire && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">
                      {questionnaire.framework_name}
                    </h3>
                    {questionnaire.description && (
                      <p className="text-muted-foreground">
                        {questionnaire.description}
                      </p>
                    )}
                  </div>

                  {loadingQuestions ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading questions...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <div key={question.id} className="space-y-3">
                          <Label className="text-base font-medium">
                            {index + 1}. {question.question_text}
                          </Label>
                          <RadioGroup
                            value={answers[question.id] || ''}
                            onValueChange={(value) => handleAnswerChange(question.id, value)}
                          >
                            {question.options.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={option.option_letter} 
                                  id={`${question.id}-${option.option_letter}`} 
                                />
                                <Label 
                                  htmlFor={`${question.id}-${option.option_letter}`}
                                  className="cursor-pointer"
                                >
                                  {option.option_letter}. {option.option_text}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              {questions.length > 0 && (
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="btn-modern-primary px-8"
                    disabled={loading || loadingQuestions || Object.keys(answers).length !== questions.length}
                  >
                    {loading ? (
                      'Analyzing...'
                    ) : (
                      <>
                        Submit for Analysis <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Assessment Tips */}
        <Card className="mt-6 border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Tips for a Better Assessment</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Answer honestly based on your typical behavior
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Choose the option that best describes you most of the time
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                There are no right or wrong answers - focus on self-reflection
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                Take your time to consider each question carefully
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentPage;
