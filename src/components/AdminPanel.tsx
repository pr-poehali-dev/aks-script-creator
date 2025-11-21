import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const AdminPanel = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните все поля',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/562446ff-a06e-4eef-9f49-fb5da5e69cf8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Пользователь создан!',
          description: `Аккаунт ${newUsername} успешно создан`,
        });
        setNewUsername('');
        setNewPassword('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: data.error || 'Не удалось создать пользователя',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-4 border-pink-500/50 animate-glow-pulse bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
            <Icon name="Shield" size={24} className="text-pink-500" />
            Панель администратора
          </CardTitle>
          <CardDescription className="text-purple-300">
            Управление пользователями системы AKSGOD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-4 rounded-lg border-2 border-pink-500/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-pink-300">
                <Icon name="UserPlus" size={20} className="text-pink-400" />
                Создать нового пользователя
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username" className="text-purple-300 font-semibold">
                    Никнейм
                  </Label>
                  <Input
                    id="new-username"
                    type="text"
                    placeholder="Введите никнейм"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border-2 border-pink-500/50 focus:border-purple-500 bg-black/40 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-pink-300 font-semibold">
                    Пароль
                  </Label>
                  <Input
                    id="new-password"
                    type="text"
                    placeholder="Введите пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-2 border-purple-500/50 focus:border-pink-500 bg-black/40 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold h-12 shadow-lg shadow-pink-500/50"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Icon name="UserPlus" className="mr-2 h-5 w-5" />
                      Создать пользователя
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border-2 border-purple-500/50">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-purple-300">
                <Icon name="Info" size={16} className="text-purple-400" />
                Информация:
              </h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Новые пользователи создаются с обычными правами</li>
                <li>• Вы не можете заходить под созданными аккаунтами</li>
                <li>• Пользователи получат доступ к библиотеке и AI редактору</li>
                <li>• Админские права есть только у вашего аккаунта</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;