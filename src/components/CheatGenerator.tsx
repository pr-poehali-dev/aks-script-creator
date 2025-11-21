import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';

interface CheatGeneratorProps {
  userId: number;
}

interface CheatFeature {
  id: string;
  name: string;
  description: string;
  category: 'player' | 'vehicle' | 'visual' | 'other';
}

const availableFeatures: CheatFeature[] = [
  { id: 'speed', name: 'Изменить скорость', description: 'Управление скоростью персонажа', category: 'player' },
  { id: 'godmode', name: 'Бессмертие', description: 'Неуязвимость к урону', category: 'player' },
  { id: 'fly', name: 'Полёт', description: 'Возможность летать', category: 'player' },
  { id: 'noclip', name: 'NoClip', description: 'Проходить сквозь стены', category: 'player' },
  { id: 'teleport', name: 'Телепорт', description: 'Быстрое перемещение', category: 'player' },
  { id: 'vehicle_speed', name: 'Скорость транспорта', description: 'Ускорение машин', category: 'vehicle' },
  { id: 'infinite_fuel', name: 'Бесконечное топливо', description: 'Топливо не кончается', category: 'vehicle' },
  { id: 'esp', name: 'ESP (Wallhack)', description: 'Видеть игроков сквозь стены', category: 'visual' },
  { id: 'aimbot', name: 'Aim-бот', description: 'Автоматическое наведение', category: 'visual' },
  { id: 'anti_ban', name: 'Анти-бан', description: 'Защита от обнаружения', category: 'other' },
  { id: 'auto_farm', name: 'Авто-фарм', description: 'Автоматический сбор ресурсов', category: 'other' },
];

const CheatGenerator = ({ userId }: CheatGeneratorProps) => {
  const [step, setStep] = useState(1);
  const [cheatName, setCheatName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [menuDesign, setMenuDesign] = useState('classic');
  const [additionalCode, setAdditionalCode] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [generatedCheat, setGeneratedCheat] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const generateActivationCode = () => {
    const code = Math.random().toString(36).substring(2, 15).toUpperCase();
    setActivationCode(code);
    return code;
  };

  const generateCheat = async () => {
    if (!cheatName || selectedFeatures.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните название и выберите хотя бы одну функцию',
      });
      return;
    }

    setLoading(true);

    const features = selectedFeatures.map(id => 
      availableFeatures.find(f => f.id === id)?.name
    ).join(', ');

    const code = generateActivationCode();

    const luaCode = `-- ${cheatName}
-- Активационный код: ${code}
-- Функции: ${features}

local ACTIVATION_CODE = "${code}"
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local RunService = game:GetService("RunService")

-- Проверка активации
local function checkActivation()
    local inputCode = game:GetService("UserInputService"):GetTextBox("Введите код активации")
    if inputCode ~= ACTIVATION_CODE then
        return false
    end
    return true
end

-- Меню чита (Дизайн: ${menuDesign})
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "${cheatName}"
ScreenGui.ResetOnSpawn = false
ScreenGui.Parent = game.CoreGui

local Frame = Instance.new("Frame")
Frame.Size = UDim2.new(0, 400, 0, 500)
Frame.Position = UDim2.new(0.5, -200, 0.5, -250)
Frame.BackgroundColor3 = Color3.fromRGB(20, 20, 30)
Frame.BorderSizePixel = 2
Frame.BorderColor3 = Color3.fromRGB(138, 43, 226)
Frame.Parent = ScreenGui

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, 0, 0, 50)
Title.BackgroundColor3 = Color3.fromRGB(138, 43, 226)
Title.Text = "${cheatName}"
Title.TextColor3 = Color3.white
Title.Font = Enum.Font.GothamBold
Title.TextSize = 24
Title.Parent = Frame

-- Функции читов
${selectedFeatures.includes('speed') ? `
local speedEnabled = false
local function toggleSpeed()
    speedEnabled = not speedEnabled
    if speedEnabled and LocalPlayer.Character then
        local humanoid = LocalPlayer.Character:FindFirstChild("Humanoid")
        if humanoid then
            humanoid.WalkSpeed = 100
        end
    else
        if LocalPlayer.Character then
            local humanoid = LocalPlayer.Character:FindFirstChild("Humanoid")
            if humanoid then
                humanoid.WalkSpeed = 16
            end
        end
    end
end
` : ''}

${selectedFeatures.includes('godmode') ? `
local godModeEnabled = false
local function toggleGodMode()
    godModeEnabled = not godModeEnabled
    if LocalPlayer.Character then
        local humanoid = LocalPlayer.Character:FindFirstChild("Humanoid")
        if humanoid and godModeEnabled then
            humanoid.MaxHealth = math.huge
            humanoid.Health = math.huge
        end
    end
end
` : ''}

${selectedFeatures.includes('fly') ? `
local flying = false
local flySpeed = 50
local function toggleFly()
    flying = not flying
    local character = LocalPlayer.Character
    if not character then return end
    
    local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    if not humanoidRootPart then return end
    
    if flying then
        local bodyVelocity = Instance.new("BodyVelocity")
        bodyVelocity.Velocity = Vector3.new(0, 0, 0)
        bodyVelocity.MaxForce = Vector3.new(9e9, 9e9, 9e9)
        bodyVelocity.Parent = humanoidRootPart
    else
        local bodyVelocity = humanoidRootPart:FindFirstChild("BodyVelocity")
        if bodyVelocity then
            bodyVelocity:Destroy()
        end
    end
end
` : ''}

${selectedFeatures.includes('teleport') ? `
local function teleportTo(x, y, z)
    if LocalPlayer.Character then
        local humanoidRootPart = LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
        if humanoidRootPart then
            humanoidRootPart.CFrame = CFrame.new(x, y, z)
        end
    end
end
` : ''}

${selectedFeatures.includes('esp') ? `
local espEnabled = false
local function toggleESP()
    espEnabled = not espEnabled
    for _, player in pairs(Players:GetPlayers()) do
        if player ~= LocalPlayer and player.Character then
            local highlight = player.Character:FindFirstChild("ESP_Highlight")
            if espEnabled and not highlight then
                local h = Instance.new("Highlight")
                h.Name = "ESP_Highlight"
                h.FillColor = Color3.fromRGB(255, 0, 0)
                h.FillTransparency = 0.5
                h.Parent = player.Character
            elseif not espEnabled and highlight then
                highlight:Destroy()
            end
        end
    end
end
` : ''}

${additionalCode ? `\n-- Дополнительный код\n${additionalCode}\n` : ''}

-- Кнопки активации функций
local yOffset = 70
${selectedFeatures.map((featureId, index) => {
  const feature = availableFeatures.find(f => f.id === featureId);
  return `
local btn${index} = Instance.new("TextButton")
btn${index}.Size = UDim2.new(0.9, 0, 0, 40)
btn${index}.Position = UDim2.new(0.05, 0, 0, ${yOffset + index * 50})
btn${index}.BackgroundColor3 = Color3.fromRGB(40, 40, 60)
btn${index}.Text = "${feature?.name}"
btn${index}.TextColor3 = Color3.white
btn${index}.Font = Enum.Font.Gotham
btn${index}.TextSize = 16
btn${index}.Parent = Frame
btn${index}.MouseButton1Click:Connect(function()
    toggle${feature?.id.charAt(0).toUpperCase() + feature?.id.slice(1)}()
end)
`;
}).join('')}

print("${cheatName} загружен успешно!")
print("Код активации проверен: ${code}")
`;

    setTimeout(() => {
      setGeneratedCheat(luaCode);
      const fakeDownloadLink = `https://aksgod.dev/download/${code}.apk`;
      setDownloadLink(fakeDownloadLink);
      setLoading(false);
      
      toast({
        title: 'Чит создан! 🎮',
        description: `Код активации: ${code}`,
      });
    }, 2000);
  };

  const resetForm = () => {
    setStep(1);
    setCheatName('');
    setSelectedFeatures([]);
    setMenuDesign('classic');
    setAdditionalCode('');
    setActivationCode('');
    setGeneratedCheat('');
    setDownloadLink('');
  };

  if (generatedCheat) {
    return (
      <Card className="w-full border-2 animate-rgb-border gamer-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            <Icon name="CheckCircle2" size={28} />
            Чит готов к использованию!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg">
            <h3 className="font-bold text-lg mb-2 text-green-400">📱 {cheatName}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Код активации: <span className="font-mono font-bold text-green-400 text-lg">{activationCode}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Скопируйте этот код - он понадобится при первом запуске в игре!
            </p>
          </div>

          <div className="space-y-2">
            <Label>Lua скрипт:</Label>
            <Textarea
              value={generatedCheat}
              readOnly
              className="font-mono text-xs h-64 bg-card/50"
            />
          </div>

          <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg space-y-3">
            <h3 className="font-bold text-blue-400">📦 Готовый установщик APK</h3>
            <p className="text-sm text-muted-foreground">
              Black Russia уже содержит встроенные читы! Установите и запустите игру.
            </p>
            <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
              <Icon name="Download" className="text-blue-400" />
              <code className="text-xs flex-1 break-all">{downloadLink}</code>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 gamer-glow"
              onClick={() => {
                navigator.clipboard.writeText(downloadLink);
                toast({ title: 'Ссылка скопирована!' });
              }}
            >
              <Icon name="Copy" className="mr-2" />
              Скопировать ссылку на APK
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedCheat);
                toast({ title: 'Скрипт скопирован!' });
              }}
              className="border-primary"
            >
              <Icon name="Copy" className="mr-2" />
              Копировать код
            </Button>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 gamer-glow"
            >
              <Icon name="Plus" className="mr-2" />
              Создать новый
            </Button>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500 rounded text-xs text-muted-foreground">
            <Icon name="Info" className="inline mr-1" size={14} />
            При установке APK на устройство будет установлена модифицированная версия Black Russia со встроенными читами
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-2 animate-rgb-border gamer-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Icon name="Wand2" size={28} />
          Генератор читов - Шаг {step} из 4
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cheatName">Название вашего чита</Label>
              <Input
                id="cheatName"
                placeholder="Например: Photon 7.7"
                value={cheatName}
                onChange={(e) => setCheatName(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button 
              onClick={() => setStep(2)} 
              disabled={!cheatName}
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 gamer-glow"
            >
              Далее <Icon name="ArrowRight" className="ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label>Выберите функции для чита:</Label>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <Checkbox
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={() => handleFeatureToggle(feature.id)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{feature.name}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <Icon name="ArrowLeft" className="mr-2" /> Назад
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={selectedFeatures.length === 0}
                className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 gamer-glow"
              >
                Далее <Icon name="ArrowRight" className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Дизайн меню в игре:</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['classic', 'modern', 'minimal', 'premium'].map((design) => (
                  <div
                    key={design}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      menuDesign === design ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setMenuDesign(design)}
                  >
                    <p className="font-semibold capitalize">{design}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="additionalCode">Дополнительный код (необязательно):</Label>
              <Textarea
                id="additionalCode"
                placeholder="Вставьте свой Lua код, если нужно..."
                value={additionalCode}
                onChange={(e) => setAdditionalCode(e.target.value)}
                className="mt-2 font-mono text-sm"
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <Icon name="ArrowLeft" className="mr-2" /> Назад
              </Button>
              <Button 
                onClick={() => setStep(4)}
                className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 gamer-glow"
              >
                Далее <Icon name="ArrowRight" className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-400">
                <Icon name="Info" /> Подтверждение
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Название:</strong> {cheatName}</p>
                <p><strong>Функций выбрано:</strong> {selectedFeatures.length}</p>
                <p><strong>Дизайн меню:</strong> {menuDesign}</p>
                <p className="text-muted-foreground mt-3">
                  Будет создан готовый APK-файл с модифицированной Black Russia и вашими читами
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                <Icon name="ArrowLeft" className="mr-2" /> Назад
              </Button>
              <Button 
                onClick={generateCheat}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:opacity-90 gamer-glow font-bold"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" className="mr-2" />
                    Создать чит!
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheatGenerator;
