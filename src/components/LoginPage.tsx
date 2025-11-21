import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/1d624d9b-64b3-4f4f-afe0-07e073aad6c1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.user.username}!`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка входа',
          description: data.error || 'Неверный логин или пароль',
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 via-pink-600/20 to-yellow-600/20 animate-float"></div>
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-4 animate-rgb-border bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-lg flex items-center justify-center animate-float shadow-lg shadow-purple-500/50 border-2 border-white/20">
              <Icon name="Shield" size={40} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
            AKSGOD
          </CardTitle>
          <CardDescription className="text-lg bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-semibold">
            Платформа для создания читов Black Russia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-300 font-semibold">Никнейм</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите никнейм"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 border-purple-500/50 focus:border-blue-500 bg-black/40 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-300 font-semibold">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-blue-500/50 focus:border-pink-500 bg-black/40 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 via-pink-600 to-purple-600 bg-[length:200%_auto] hover:bg-[position:100%] animate-rainbow text-white font-bold text-lg h-12 shadow-lg shadow-purple-500/50"
              disabled={loading}
            >
              {loading ? (
                <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Icon name="LogIn" className="mr-2 h-5 w-5" />
              )}
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;