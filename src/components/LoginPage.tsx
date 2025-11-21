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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-float"></div>
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-2 animate-rgb-border gamer-glow">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center animate-float gamer-glow">
              <Icon name="Shield" size={40} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AKSGOD
          </CardTitle>
          <CardDescription className="text-lg">
            Платформа для создания читов Black Russia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Никнейм</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите никнейм"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-primary/50 focus:border-primary bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/50 focus:border-primary bg-card"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold text-lg h-12 gamer-glow"
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
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Демо аккаунт:</p>
            <p className="text-primary font-medium">AKS / 11122233</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;