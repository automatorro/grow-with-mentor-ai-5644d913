
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Questionnaire {
  id: string;
  framework_name: string;
  skills: { skill_name: string };
}

interface Question {
  id: string;
  questionnaire_id: string;
  question_text: string;
  question_order: number;
  created_at: string;
  questionnaires?: { framework_name: string; skills: { skill_name: string } };
}

export const QuestionsManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    questionnaire_id: '',
    question_text: '',
    question_order: 1
  });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .select(`
          id,
          framework_name,
          skills (skill_name)
        `)
        .order('framework_name');

      if (error) throw error;
      setQuestionnaires(data || []);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          questionnaires (
            framework_name,
            skills (skill_name)
          )
        `)
        .order('questionnaire_id')
        .order('question_order');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.questionnaire_id || !newQuestion.question_text.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          questionnaire_id: newQuestion.questionnaire_id,
          question_text: newQuestion.question_text.trim(),
          question_order: newQuestion.question_order
        }]);

      if (error) throw error;
      
      setNewQuestion({ questionnaire_id: '', question_text: '', question_order: 1 });
      fetchQuestions();
      toast.success('Question created successfully');
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editingQuestion.question_text.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          questionnaire_id: editingQuestion.questionnaire_id,
          question_text: editingQuestion.question_text.trim(),
          question_order: editingQuestion.question_order
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;
      
      setEditingQuestion(null);
      fetchQuestions();
      toast.success('Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchQuestions();
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionnaireSelect">Questionnaire</Label>
              <Select value={newQuestion.questionnaire_id} onValueChange={(value) => setNewQuestion({ ...newQuestion, questionnaire_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a questionnaire" />
                </SelectTrigger>
                <SelectContent>
                  {questionnaires.map((questionnaire) => (
                    <SelectItem key={questionnaire.id} value={questionnaire.id}>
                      {questionnaire.framework_name} ({questionnaire.skills.skill_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="questionText">Question Text</Label>
              <Textarea
                id="questionText"
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                placeholder="Enter question text"
              />
            </div>
            <div>
              <Label htmlFor="questionOrder">Question Order</Label>
              <Input
                id="questionOrder"
                type="number"
                value={newQuestion.question_order}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_order: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <Button onClick={handleCreateQuestion} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg">
                {editingQuestion?.id === question.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Questionnaire</Label>
                      <Select 
                        value={editingQuestion.questionnaire_id} 
                        onValueChange={(value) => setEditingQuestion({ ...editingQuestion, questionnaire_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionnaires.map((questionnaire) => (
                            <SelectItem key={questionnaire.id} value={questionnaire.id}>
                              {questionnaire.framework_name} ({questionnaire.skills.skill_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Question Text</Label>
                      <Textarea
                        value={editingQuestion.question_text}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Question Order</Label>
                      <Input
                        type="number"
                        value={editingQuestion.question_order}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, question_order: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateQuestion} disabled={loading}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-professional-blue-100 text-professional-blue-800 px-2 py-1 rounded">
                          Order: {question.question_order}
                        </span>
                        <span className="text-xs bg-professional-grey-100 text-professional-grey-800 px-2 py-1 rounded">
                          {question.questionnaires?.framework_name}
                        </span>
                      </div>
                      <p className="text-sm">{question.question_text}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {questions.length === 0 && (
              <p className="text-center text-professional-grey-500 py-4">No questions found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
