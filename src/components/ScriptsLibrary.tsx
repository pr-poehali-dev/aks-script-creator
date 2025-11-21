import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Script {
  id: number;
  title: string;
  description: string;
  code: string;
  instructions: string;
  category: string;
  created_at: string;
}

interface ScriptsLibraryProps {
  userId: number;
}

const ScriptsLibrary = ({ userId }: ScriptsLibraryProps) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/83679d96-3e7c-40dd-9e3f-5c5ea2c48190');
      const data = await response.json();
      setScripts(data.scripts || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить скрипты',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Код скрипта скопирован в буфер обмена',
    });
  };

  const categoryColors: Record<string, string> = {
    'Визуализация': 'bg-gradient-to-r from-purple-600 to-blue-600',
    'Экономика': 'bg-gradient-to-r from-blue-600 to-cyan-600',
    'Передвижение': 'bg-gradient-to-r from-pink-600 to-purple-600',
    'Боевая система': 'bg-gradient-to-r from-red-600 to-orange-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scripts.map((script) => (
          <Card
            key={script.id}
            className="border-2 border-purple-500/30 hover:border-blue-500 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 transition-all cursor-pointer hover:animate-glow-pulse group hover:shadow-xl hover:shadow-purple-500/30"
            onClick={() => setSelectedScript(script)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                  {script.title}
                </CardTitle>
                <Badge className={`${categoryColors[script.category] || 'bg-muted'} text-white shrink-0`}>
                  {script.category}
                </Badge>
              </div>
              <CardDescription className="text-sm mt-2">
                {script.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-2 border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScript(script);
                }}
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Открыть скрипт
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedScript} onOpenChange={() => setSelectedScript(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-purple-500/50 animate-glow-pulse bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-pink-900/40 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
              {selectedScript?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedScript?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedScript && (
            <div className="space-y-6 mt-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-300">
                    <Icon name="Code" size={20} className="text-purple-400" />
                    Код скрипта
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(selectedScript.code)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Копировать
                  </Button>
                </div>
                <Textarea
                  value={selectedScript.code}
                  readOnly
                  className="font-mono text-sm h-64 bg-black/60 border-2 border-purple-500/50 text-green-400"
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-blue-300">
                  <Icon name="BookOpen" size={20} className="text-blue-400" />
                  Инструкция по активации
                </h3>
                <div className="bg-black/60 p-4 rounded-lg border-2 border-blue-500/50">
                  <p className="whitespace-pre-line text-sm text-gray-300">{selectedScript.instructions}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge className={`${categoryColors[selectedScript.category] || 'bg-gradient-to-r from-gray-600 to-gray-700'} text-white shadow-lg`}>
                  {selectedScript.category}
                </Badge>
                <Badge variant="outline" className="border-2 border-pink-500/50 text-pink-400">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  {new Date(selectedScript.created_at).toLocaleDateString('ru-RU')}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScriptsLibrary;