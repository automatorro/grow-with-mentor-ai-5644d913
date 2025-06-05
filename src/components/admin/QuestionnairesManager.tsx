
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

interface Skill {
  id: string;
  skill_name: string;
}

interface Questionnaire {
  id: string;
  skill_id: string;
  framework_name: string;
  description: string | null;
  created_at: string;
  skills?: { skill_name: string };
}

export const QuestionnairesManager: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    skill_id: '',
    framework_name: '',
    description: ''
  });
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestionnaires();
    fetchSkills();
  }, []);

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
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .select(`
          *,
          skills (skill_name)
        `)
        .order('framework_name');

      if (error) throw error;
      setQuestionnaires(data || []);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      toast.error('Failed to fetch questionnaires');
    }
  };

  const handleCreateQuestionnaire = async () => {
    if (!newQuestionnaire.skill_id || !newQuestionnaire.framework_name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questionnaires')
        .insert([{
          skill_id: newQuestionnaire.skill_id,
          framework_name: newQuestionnaire.framework_name.trim(),
          description: newQuestionnaire.description.trim() || null
        }]);

      if (error) throw error;
      
      setNewQuestionnaire({ skill_id: '', framework_name: '', description: '' });
      fetchQuestionnaires();
      toast.success('Questionnaire created successfully');
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      toast.error('Failed to create questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestionnaire = async () => {
    if (!editingQuestionnaire || !editingQuestionnaire.framework_name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questionnaires')
        .update({
          skill_id: editingQuestionnaire.skill_id,
          framework_name: editingQuestionnaire.framework_name.trim(),
          description: editingQuestionnaire.description?.trim() || null
        })
        .eq('id', editingQuestionnaire.id);

      if (error) throw error;
      
      setEditingQuestionnaire(null);
      fetchQuestionnaires();
      toast.success('Questionnaire updated successfully');
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      toast.error('Failed to update questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('questionnaires')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchQuestionnaires();
      toast.success('Questionnaire deleted successfully');
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      toast.error('Failed to delete questionnaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="skillSelect">Skill</Label>
              <Select value={newQuestionnaire.skill_id} onValueChange={(value) => setNewQuestionnaire({ ...newQuestionnaire, skill_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
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
            <div>
              <Label htmlFor="frameworkName">Framework Name</Label>
              <Input
                id="frameworkName"
                value={newQuestionnaire.framework_name}
                onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, framework_name: e.target.value })}
                placeholder="Enter framework name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newQuestionnaire.description}
                onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, description: e.target.value })}
                placeholder="Enter description (optional)"
              />
            </div>
            <Button onClick={handleCreateQuestionnaire} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Questionnaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="p-4 border rounded-lg">
                {editingQuestionnaire?.id === questionnaire.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Skill</Label>
                      <Select 
                        value={editingQuestionnaire.skill_id} 
                        onValueChange={(value) => setEditingQuestionnaire({ ...editingQuestionnaire, skill_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                    <div>
                      <Label>Framework Name</Label>
                      <Input
                        value={editingQuestionnaire.framework_name}
                        onChange={(e) => setEditingQuestionnaire({ ...editingQuestionnaire, framework_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editingQuestionnaire.description || ''}
                        onChange={(e) => setEditingQuestionnaire({ ...editingQuestionnaire, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateQuestionnaire} disabled={loading}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingQuestionnaire(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{questionnaire.framework_name}</h3>
                      <p className="text-sm text-professional-grey-600">
                        Skill: {questionnaire.skills?.skill_name}
                      </p>
                      {questionnaire.description && (
                        <p className="text-sm text-professional-grey-500 mt-1">{questionnaire.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingQuestionnaire(questionnaire)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {questionnaires.length === 0 && (
              <p className="text-center text-professional-grey-500 py-4">No questionnaires found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
