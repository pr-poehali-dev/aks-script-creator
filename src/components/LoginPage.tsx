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
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-600/20 via-yellow-600/20 to-orange-600/20 animate-float"></div>
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-4 animate-rgb-border bg-gradient-to-br from-orange-900/40 via-red-900/40 to-yellow-900/40 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center animate-float shadow-lg shadow-orange-500/50 border-2 border-white/20">
              <Icon name="Shield" size={40} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
            AKSGOD
          </CardTitle>
          <CardDescription className="text-lg bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent font-semibold">
            Платформа для создания читов Black Russia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-orange-300 font-semibold">Никнейм</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите никнейм"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 border-orange-500/50 focus:border-red-500 bg-black/40 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-yellow-300 font-semibold">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-yellow-500/50 focus:border-orange-500 bg-black/40 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 via-red-600 via-yellow-600 to-orange-600 bg-[length:200%_auto] hover:bg-[position:100%] animate-rainbow text-white font-bold text-lg h-12 shadow-lg shadow-orange-500/50"
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

          <div className="mt-6 p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-lg">
            <a
              href="https://t.me/+afaQ_EoCmp5kMmQy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-orange-300 hover:text-orange-200 transition-colors"
            >
              <Icon name="MessageCircle" size={20} />
              <span className="font-semibold">Купить аккаунт в Telegram</span>
              <Icon name="ExternalLink" size={16} />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;