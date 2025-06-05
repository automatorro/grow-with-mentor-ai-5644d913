
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillsManager } from '@/components/admin/SkillsManager';
import { QuestionnairesManager } from '@/components/admin/QuestionnairesManager';
import { QuestionsManager } from '@/components/admin/QuestionsManager';
import { QuestionOptionsManager } from '@/components/admin/QuestionOptionsManager';
import { Settings, Database, FileText, List, CheckSquare } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage assessment data and questionnaires</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border">
          <CardHeader>
            <CardTitle>Assessment Data Management</CardTitle>
            <CardDescription>
              Create and manage skills, questionnaires, questions, and answer options for the assessment system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="questionnaires" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Questionnaires
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Questions
                </TabsTrigger>
                <TabsTrigger value="options" className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Options
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-6">
                <SkillsManager />
              </TabsContent>

              <TabsContent value="questionnaires" className="mt-6">
                <QuestionnairesManager />
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <QuestionsManager />
              </TabsContent>

              <TabsContent value="options" className="mt-6">
                <QuestionOptionsManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
