import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AIEditorProps {
  userId: number;
}

const AIEditor = ({ userId }: AIEditorProps) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите описание скрипта',
      });
      return;
    }

    setLoading(true);
    
    const mockCode = `-- Скрипт: ${prompt}
-- Сгенерировано для Black Russia

local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

function main()
    print("Скрипт запущен: ${prompt}")
    
    if LocalPlayer.Character then
        local character = LocalPlayer.Character
        local humanoid = character:FindFirstChild("Humanoid")
        
        if humanoid then
            print("Персонаж найден, выполняется действие...")
        end
    end
end

spawn(main)

LocalPlayer.CharacterAdded:Connect(function()
    wait(1)
    main()
end)`;

    setTimeout(() => {
      setGeneratedCode(mockCode);
      toast({
        title: 'Код создан!',
        description: 'Скрипт сгенерирован по вашему описанию',
      });
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Скопировано!',
      description: 'Код скопирован в буфер обмена',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-2 border-primary/30 gamer-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Sparkles" size={24} className="text-primary" />
            AI Генератор
          </CardTitle>
          <CardDescription>
            Опишите, какой чит вы хотите создать, и ИИ напишет код
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-foreground">
              Описание скрипта
            </Label>
            <Textarea
              id="prompt"
              placeholder="Например: Создай чит который показывает количество денег у всех игроков рядом со мной"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 border-primary/30 focus:border-primary"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold h-12 gamer-glow"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Wand2" className="mr-2 h-5 w-5" />
                Сгенерировать код
              </>
            )}
          </Button>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/20">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Icon name="Lightbulb" size={16} className="text-accent" />
              Примеры запросов:
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Телепорт к любому игроку по нику</li>
              <li>• Бесконечная выносливость</li>
              <li>• Авто-фарм работ</li>
              <li>• Показать всех игроков на карте</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-secondary/30 gamer-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FileCode" size={24} className="text-secondary" />
            Результат
          </CardTitle>
          <CardDescription>
            Сгенерированный код скрипта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="generated-code" className="text-foreground">
              Код
            </Label>
            <Textarea
              id="generated-code"
              value={generatedCode}
              readOnly
              placeholder="Сгенерированный код появится здесь..."
              className="h-64 font-mono text-sm border-secondary/30 bg-card"
            />
          </div>

          {generatedCode && (
            <>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full border-secondary/50 hover:bg-secondary/20"
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Копировать код
              </Button>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Icon name="AlertCircle" size={16} className="text-accent" />
                  Как использовать:
                </h4>
                <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Скопируйте сгенерированный код</li>
                  <li>Откройте executor в игре (Synapse X / KRNL)</li>
                  <li>Вставьте код и нажмите Execute</li>
                  <li>Скрипт активируется автоматически</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIEditor;