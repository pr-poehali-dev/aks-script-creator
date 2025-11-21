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
      <header className="border-b-4 border-transparent bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-pink-900/50 backdrop-blur-sm sticky top-0 z-50 animate-glow-pulse">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg flex items-center justify-center animate-rgb-border border-2 shadow-lg shadow-purple-500/50">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
                AKSGOD
              </h1>
              <p className="text-sm bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Black Russia Scripts</p>
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
              className="border-2 border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white transition-all"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-pink-900/30 border-2 border-purple-500/50 animate-glow-pulse">
            <TabsTrigger
              value="scripts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50"
            >
              <Icon name="FileCode" size={18} className="mr-2" />
              Библиотека
            </TabsTrigger>
            <TabsTrigger
              value="ai-editor"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50"
            >
              <Icon name="Wand2" size={18} className="mr-2" />
              Генератор читов
            </TabsTrigger>
            {user.is_admin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/50"
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