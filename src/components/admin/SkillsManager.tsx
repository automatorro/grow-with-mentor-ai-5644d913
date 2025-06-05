
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  id: string;
  skill_name: string;
  created_at: string;
}

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      toast.error('Failed to fetch skills');
    }
  };

  const handleCreateSkill = async () => {
    if (!newSkillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('skills')
        .insert([{ skill_name: newSkillName.trim() }]);

      if (error) throw error;
      
      setNewSkillName('');
      fetchSkills();
      toast.success('Skill created successfully');
    } catch (error) {
      console.error('Error creating skill:', error);
      toast.error('Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill || !editingSkill.skill_name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('skills')
        .update({ skill_name: editingSkill.skill_name.trim() })
        .eq('id', editingSkill.id);

      if (error) throw error;
      
      setEditingSkill(null);
      fetchSkills();
      toast.success('Skill updated successfully');
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchSkills();
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Enter skill name"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateSkill} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                {editingSkill?.id === skill.id ? (
                  <div className="flex-1 flex gap-4">
                    <Input
                      value={editingSkill.skill_name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, skill_name: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateSkill} disabled={loading}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{skill.skill_name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSkill(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSkill(skill.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-center text-professional-grey-500 py-4">No skills found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
