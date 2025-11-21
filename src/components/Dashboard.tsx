import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ScriptsLibrary from '@/components/ScriptsLibrary';
import CheatGenerator from '@/components/CheatGenerator';
import AdminPanel from '@/components/AdminPanel';

interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('scripts');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50 gamer-glow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center gamer-glow">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AKSGOD
              </h1>
              <p className="text-sm text-muted-foreground">Black Russia Scripts</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-foreground">{user.username}</p>
              {user.is_admin && (
                <span className="text-xs text-accent font-bold">ADMIN</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-primary/50 hover:bg-primary/20"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-primary/30 gamer-glow">
            <TabsTrigger
              value="scripts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
            >
              <Icon name="FileCode" size={18} className="mr-2" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger
              value="ai-editor"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              <Icon name="Wand2" size={18} className="mr-2" />
              Генератор читов
            </TabsTrigger>
            {user.is_admin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white"
              >
                <Icon name="Settings" size={18} className="mr-2" />
                Админ
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="scripts" className="space-y-4">
            <ScriptsLibrary userId={user.id} />
          </TabsContent>

          <TabsContent value="ai-editor" className="space-y-4">
            <CheatGenerator userId={user.id} />
          </TabsContent>

          {user.is_admin && (
            <TabsContent value="admin" className="space-y-4">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;