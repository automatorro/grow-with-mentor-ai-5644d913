
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

interface Question {
  id: string;
  question_text: string;
  questionnaires: { framework_name: string; skills: { skill_name: string } };
}

interface QuestionOption {
  id: string;
  question_id: string;
  option_letter: string;
  option_text: string;
  created_at: string;
  questions?: { question_text: string; questionnaires: { framework_name: string; skills: { skill_name: string } } };
}

export const QuestionOptionsManager: React.FC = () => {
  const [questionOptions, setQuestionOptions] = useState<QuestionOption[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newOption, setNewOption] = useState({
    question_id: '',
    option_letter: '',
    option_text: ''
  });
  const [editingOption, setEditingOption] = useState<QuestionOption | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestionOptions();
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          questionnaires (
            framework_name,
            skills (skill_name)
          )
        `)
        .order('question_text');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchQuestionOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('question_options')
        .select(`
          *,
          questions (
            question_text,
            questionnaires (
              framework_name,
              skills (skill_name)
            )
          )
        `)
        .order('question_id')
        .order('option_letter');

      if (error) throw error;
      setQuestionOptions(data || []);
    } catch (error) {
      console.error('Error fetching question options:', error);
      toast.error('Failed to fetch question options');
    }
  };

  const handleCreateOption = async () => {
    if (!newOption.question_id || !newOption.option_letter.trim() || !newOption.option_text.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('question_options')
        .insert([{
          question_id: newOption.question_id,
          option_letter: newOption.option_letter.trim().toUpperCase(),
          option_text: newOption.option_text.trim()
        }]);

      if (error) throw error;
      
      setNewOption({ question_id: '', option_letter: '', option_text: '' });
      fetchQuestionOptions();
      toast.success('Option created successfully');
    } catch (error) {
      console.error('Error creating option:', error);
      toast.error('Failed to create option');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOption = async () => {
    if (!editingOption || !editingOption.option_letter.trim() || !editingOption.option_text.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('question_options')
        .update({
          question_id: editingOption.question_id,
          option_letter: editingOption.option_letter.trim().toUpperCase(),
          option_text: editingOption.option_text.trim()
        })
        .eq('id', editingOption.id);

      if (error) throw error;
      
      setEditingOption(null);
      fetchQuestionOptions();
      toast.success('Option updated successfully');
    } catch (error) {
      console.error('Error updating option:', error);
      toast.error('Failed to update option');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (!confirm('Are you sure you want to delete this option?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('question_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchQuestionOptions();
      toast.success('Option deleted successfully');
    } catch (error) {
      console.error('Error deleting option:', error);
      toast.error('Failed to delete option');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Option</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionSelect">Question</Label>
              <Select value={newOption.question_id} onValueChange={(value) => setNewOption({ ...newOption, question_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {questions.map((question) => (
                    <SelectItem key={question.id} value={question.id}>
                      {question.questionnaires.framework_name}: {question.question_text.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="optionLetter">Option Letter</Label>
              <Input
                id="optionLetter"
                value={newOption.option_letter}
                onChange={(e) => setNewOption({ ...newOption, option_letter: e.target.value })}
                placeholder="A, B, C, etc."
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="optionText">Option Text</Label>
              <Textarea
                id="optionText"
                value={newOption.option_text}
                onChange={(e) => setNewOption({ ...newOption, option_text: e.target.value })}
                placeholder="Enter option text"
              />
            </div>
            <Button onClick={handleCreateOption} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questionOptions.map((option) => (
              <div key={option.id} className="p-4 border rounded-lg">
                {editingOption?.id === option.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Select 
                        value={editingOption.question_id} 
                        onValueChange={(value) => setEditingOption({ ...editingOption, question_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questions.map((question) => (
                            <SelectItem key={question.id} value={question.id}>
                              {question.questionnaires.framework_name}: {question.question_text.substring(0, 50)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Option Letter</Label>
                      <Input
                        value={editingOption.option_letter}
                        onChange={(e) => setEditingOption({ ...editingOption, option_letter: e.target.value })}
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label>Option Text</Label>
                      <Textarea
                        value={editingOption.option_text}
                        onChange={(e) => setEditingOption({ ...editingOption, option_text: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateOption} disabled={loading}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingOption(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-professional-blue-100 text-professional-blue-800 px-2 py-1 rounded font-mono">
                          {option.option_letter}
                        </span>
                        <span className="text-xs bg-professional-grey-100 text-professional-grey-800 px-2 py-1 rounded">
                          {option.questions?.questionnaires.framework_name}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{option.option_text}</p>
                      <p className="text-xs text-professional-grey-500">
                        Question: {option.questions?.question_text.substring(0, 60)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingOption(option)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOption(option.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {questionOptions.length === 0 && (
              <p className="text-center text-professional-grey-500 py-4">No options found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
