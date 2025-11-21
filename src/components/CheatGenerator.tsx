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
  const [customFeatures, setCustomFeatures] = useState<{ name: string; code: string }[]>([]);
  const [customFeatureName, setCustomFeatureName] = useState('');
  const [customFeatureCode, setCustomFeatureCode] = useState('');
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

  const addCustomFeature = () => {
    if (!customFeatureName || !customFeatureCode) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите название и код функции',
      });
      return;
    }

    setCustomFeatures(prev => [...prev, { name: customFeatureName, code: customFeatureCode }]);
    setCustomFeatureName('');
    setCustomFeatureCode('');
    toast({
      title: 'Успешно',
      description: `Функция "${customFeatureName}" добавлена`,
    });
  };

  const removeCustomFeature = (index: number) => {
    setCustomFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const generateActivationCode = () => {
    const code = Math.random().toString(36).substring(2, 15).toUpperCase();
    setActivationCode(code);
    return code;
  };

  const generateCheat = () => {
    if (!cheatName || (selectedFeatures.length === 0 && customFeatures.length === 0)) {
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

    const allFeatures = [...selectedFeatures.map(id => availableFeatures.find(f => f.id === id)?.name || ''), ...customFeatures.map(cf => cf.name)].join(', ');

    const code = generateActivationCode();

    const luaCode = `-- ${cheatName}
-- Активационный код: ${code}
-- Функции: ${allFeatures}

local ACTIVATION_CODE = "${code}"
local activated = false

-- Проверка активации
local function checkActivation(inputCode)
    if inputCode == ACTIVATION_CODE then
        activated = true
        return true
    end
    return false
end

-- Меню чита (Дизайн: ${menuDesign})
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "${cheatName}"
ScreenGui.ResetOnSpawn = false
ScreenGui.Parent = game.CoreGui

local Frame = Instance.new("Frame")
Frame.Size = UDim2.new(0, 400, 0, 600)
Frame.Position = UDim2.new(0.5, -200, 0.5, -300)
Frame.BackgroundColor3 = Color3.fromRGB(15, 15, 25)
Frame.BorderSizePixel = 3
Frame.BorderColor3 = Color3.fromRGB(147, 51, 234)
Frame.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 12)
UICorner.Parent = Frame

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, 0, 0, 60)
Title.BackgroundColor3 = Color3.fromRGB(147, 51, 234)
Title.Text = "${cheatName}"
Title.TextColor3 = Color3.white
Title.Font = Enum.Font.GothamBold
Title.TextSize = 26
Title.Parent = Frame

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 12)
TitleCorner.Parent = Title

local StatusLabel = Instance.new("TextLabel")
StatusLabel.Size = UDim2.new(0.9, 0, 0, 30)
StatusLabel.Position = UDim2.new(0.05, 0, 0, 70)
StatusLabel.BackgroundTransparency = 1
StatusLabel.Text = "Статус: Активирован ✓"
StatusLabel.TextColor3 = Color3.fromRGB(0, 255, 100)
StatusLabel.Font = Enum.Font.Gotham
StatusLabel.TextSize = 14
StatusLabel.Parent = Frame

-- Функции читов
${selectedFeatures.includes('speed') ? `
local speedEnabled = false
local originalSpeed = 16
local function toggleSpeed()
    speedEnabled = not speedEnabled
    local player = game.Players.LocalPlayer
    if player and player.Character then
        local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            if speedEnabled then
                originalSpeed = humanoid.WalkSpeed
                humanoid.WalkSpeed = 100
            else
                humanoid.WalkSpeed = originalSpeed
            end
        end
    end
end
` : ''}

${selectedFeatures.includes('godmode') ? `
local godModeEnabled = false
local connection = nil
local function toggleGodMode()
    godModeEnabled = not godModeEnabled
    local player = game.Players.LocalPlayer
    if godModeEnabled then
        if player and player.Character then
            local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
            if humanoid then
                humanoid.MaxHealth = math.huge
                humanoid.Health = math.huge
            end
        end
        connection = player.CharacterAdded:Connect(function(character)
            local humanoid = character:WaitForChild("Humanoid")
            humanoid.MaxHealth = math.huge
            humanoid.Health = math.huge
        end)
    else
        if connection then
            connection:Disconnect()
            connection = nil
        end
        if player and player.Character then
            local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
            if humanoid then
                humanoid.MaxHealth = 100
                humanoid.Health = 100
            end
        end
    end
end
` : ''}

${selectedFeatures.includes('fly') ? `
local flying = false
local flySpeed = 50
local bodyVelocity = nil
local bodyGyro = nil

local function toggleFly()
    flying = not flying
    local player = game.Players.LocalPlayer
    local character = player and player.Character
    if not character then return end
    
    local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    if not humanoidRootPart then return end
    
    if flying then
        bodyVelocity = Instance.new("BodyVelocity")
        bodyVelocity.Velocity = Vector3.new(0, 0, 0)
        bodyVelocity.MaxForce = Vector3.new(9e9, 9e9, 9e9)
        bodyVelocity.Parent = humanoidRootPart
        
        bodyGyro = Instance.new("BodyGyro")
        bodyGyro.MaxTorque = Vector3.new(9e9, 9e9, 9e9)
        bodyGyro.P = 3000
        bodyGyro.Parent = humanoidRootPart
    else
        if bodyVelocity then bodyVelocity:Destroy() end
        if bodyGyro then bodyGyro:Destroy() end
    end
end
` : ''}

${selectedFeatures.includes('noclip') ? `
local noclipEnabled = false
local noclipConnection = nil
local function toggleNoclip()
    noclipEnabled = not noclipEnabled
    local player = game.Players.LocalPlayer
    if noclipEnabled then
        noclipConnection = game:GetService("RunService").Stepped:Connect(function()
            if player.Character then
                for _, part in pairs(player.Character:GetDescendants()) do
                    if part:IsA("BasePart") then
                        part.CanCollide = false
                    end
                end
            end
        end)
    else
        if noclipConnection then
            noclipConnection:Disconnect()
            noclipConnection = nil
        end
    end
end
` : ''}

${selectedFeatures.includes('teleport') ? `
local function teleportTo(x, y, z)
    local player = game.Players.LocalPlayer
    if player and player.Character then
        local humanoidRootPart = player.Character:FindFirstChild("HumanoidRootPart")
        if humanoidRootPart then
            humanoidRootPart.CFrame = CFrame.new(x, y, z)
        end
    end
end
` : ''}

${selectedFeatures.includes('vehicle_speed') ? `
local vehicleSpeedEnabled = false
local function toggleVehicleSpeed()
    vehicleSpeedEnabled = not vehicleSpeedEnabled
    local player = game.Players.LocalPlayer
    if player and player.Character then
        local vehicle = player.Character:FindFirstChildOfClass("VehicleSeat")
        if vehicle and vehicleSpeedEnabled then
            vehicle.MaxSpeed = 200
        elseif vehicle then
            vehicle.MaxSpeed = 50
        end
    end
end
` : ''}

${selectedFeatures.includes('infinite_fuel') ? `
local infiniteFuelEnabled = false
local fuelConnection = nil
local function toggleInfiniteFuel()
    infiniteFuelEnabled = not infiniteFuelEnabled
    if infiniteFuelEnabled then
        fuelConnection = game:GetService("RunService").Heartbeat:Connect(function()
            local player = game.Players.LocalPlayer
            if player and player.Character then
                for _, v in pairs(player.Character:GetDescendants()) do
                    if v:IsA("NumberValue") and v.Name == "Fuel" then
                        v.Value = 100
                    end
                end
            end
        end)
    else
        if fuelConnection then
            fuelConnection:Disconnect()
            fuelConnection = nil
        end
    end
end
` : ''}

${selectedFeatures.includes('esp') ? `
local espEnabled = false
local espConnections = {}
local function toggleESP()
    espEnabled = not espEnabled
    if espEnabled then
        for _, player in pairs(game.Players:GetPlayers()) do
            if player ~= game.Players.LocalPlayer and player.Character then
                local highlight = Instance.new("Highlight")
                highlight.Name = "ESP_Highlight"
                highlight.FillColor = Color3.fromRGB(255, 0, 255)
                highlight.FillTransparency = 0.5
                highlight.OutlineColor = Color3.fromRGB(0, 255, 255)
                highlight.OutlineTransparency = 0
                highlight.Parent = player.Character
            end
        end
    else
        for _, player in pairs(game.Players:GetPlayers()) do
            if player.Character then
                local highlight = player.Character:FindFirstChild("ESP_Highlight")
                if highlight then
                    highlight:Destroy()
                end
            end
        end
    end
end
` : ''}

${selectedFeatures.includes('aimbot') ? `
local aimbotEnabled = false
local function toggleAimbot()
    aimbotEnabled = not aimbotEnabled
    -- Базовая реализация aimbot
    if aimbotEnabled then
        local camera = workspace.CurrentCamera
        local player = game.Players.LocalPlayer
        game:GetService("RunService").RenderStepped:Connect(function()
            if aimbotEnabled then
                local closestPlayer = nil
                local shortestDistance = math.huge
                for _, v in pairs(game.Players:GetPlayers()) do
                    if v ~= player and v.Character and v.Character:FindFirstChild("Head") then
                        local distance = (v.Character.Head.Position - camera.CFrame.Position).Magnitude
                        if distance < shortestDistance then
                            closestPlayer = v
                            shortestDistance = distance
                        end
                    end
                end
                if closestPlayer and closestPlayer.Character then
                    camera.CFrame = CFrame.new(camera.CFrame.Position, closestPlayer.Character.Head.Position)
                end
            end
        end)
    end
end
` : ''}

${selectedFeatures.includes('anti_ban') ? `
-- Анти-бан система
local antiBanEnabled = true
local function initAntiBan()
    -- Отключаем обнаружение читов
    local mt = getrawmetatable(game)
    local oldNamecall = mt.__namecall
    setreadonly(mt, false)
    mt.__namecall = function(self, ...)
        local method = getnamecallmethod()
        if method == "FireServer" or method == "InvokeServer" then
            if tostring(self):find("Anti") or tostring(self):find("Ban") then
                return wait(9e9)
            end
        end
        return oldNamecall(self, ...)
    end
    setreadonly(mt, true)
end
if antiBanEnabled then
    initAntiBan()
end
` : ''}

${selectedFeatures.includes('auto_farm') ? `
local autoFarmEnabled = false
local farmConnection = nil
local function toggleAutoFarm()
    autoFarmEnabled = not autoFarmEnabled
    if autoFarmEnabled then
        farmConnection = game:GetService("RunService").Heartbeat:Connect(function()
            -- Автосбор ресурсов
            for _, v in pairs(workspace:GetDescendants()) do
                if v:IsA("ProximityPrompt") and v.ObjectText:find("Collect") then
                    fireproximityprompt(v)
                end
            end
        end)
    else
        if farmConnection then
            farmConnection:Disconnect()
            farmConnection = nil
        end
    end
end
` : ''}

${customFeatures.map(cf => `
-- Кастомная функция: ${cf.name}
${cf.code}
`).join('\n')}

${additionalCode ? `\n-- Дополнительный код\n${additionalCode}\n` : ''}

-- UI Кнопки
local ScrollingFrame = Instance.new("ScrollingFrame")
ScrollingFrame.Size = UDim2.new(0.9, 0, 0, 480)
ScrollingFrame.Position = UDim2.new(0.05, 0, 0, 110)
ScrollingFrame.BackgroundTransparency = 1
ScrollingFrame.ScrollBarThickness = 6
ScrollingFrame.Parent = Frame

local yOffset = 0
${selectedFeatures.map((featureId, index) => {
  const feature = availableFeatures.find(f => f.id === featureId);
  return `
local btn${index} = Instance.new("TextButton")
btn${index}.Size = UDim2.new(1, -10, 0, 45)
btn${index}.Position = UDim2.new(0, 0, 0, ${yOffset + index * 55})
btn${index}.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
btn${index}.Text = "${feature?.name} [OFF]"
btn${index}.TextColor3 = Color3.white
btn${index}.Font = Enum.Font.GothamBold
btn${index}.TextSize = 16
btn${index}.Parent = ScrollingFrame

local btn${index}Corner = Instance.new("UICorner")
btn${index}Corner.CornerRadius = UDim.new(0, 8)
btn${index}Corner.Parent = btn${index}

local btn${index}Active = false
btn${index}.MouseButton1Click:Connect(function()
    btn${index}Active = not btn${index}Active
    if btn${index}Active then
        btn${index}.BackgroundColor3 = Color3.fromRGB(147, 51, 234)
        btn${index}.Text = "${feature?.name} [ON]"
        toggle${feature?.id.charAt(0).toUpperCase()}${feature?.id.slice(1).replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())}()
    else
        btn${index}.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
        btn${index}.Text = "${feature?.name} [OFF]"
        toggle${feature?.id.charAt(0).toUpperCase()}${feature?.id.slice(1).replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())}()
    end
end)
`;
}).join('')}

${customFeatures.map((cf, index) => {
  const btnIndex = selectedFeatures.length + index;
  return `
local customBtn${index} = Instance.new("TextButton")
customBtn${index}.Size = UDim2.new(1, -10, 0, 45)
customBtn${index}.Position = UDim2.new(0, 0, 0, ${yOffset + btnIndex * 55})
customBtn${index}.BackgroundColor3 = Color3.fromRGB(0, 200, 255)
customBtn${index}.Text = "${cf.name} [CUSTOM]"
customBtn${index}.TextColor3 = Color3.white
customBtn${index}.Font = Enum.Font.GothamBold
customBtn${index}.TextSize = 16
customBtn${index}.Parent = ScrollingFrame

local customBtn${index}Corner = Instance.new("UICorner")
customBtn${index}Corner.CornerRadius = UDim.new(0, 8)
customBtn${index}Corner.Parent = customBtn${index}
`;
}).join('')}

ScrollingFrame.CanvasSize = UDim2.new(0, 0, 0, ${(selectedFeatures.length + customFeatures.length) * 55 + 10})

print("✓ ${cheatName} успешно загружен!")
print("✓ Код активации: ${code}")
print("✓ Функций активировано: ${selectedFeatures.length + customFeatures.length}")
`;

    setGeneratedCheat(luaCode);
    const fakeDownloadLink = `https://aksgod.dev/download/${code}.apk`;
    setDownloadLink(fakeDownloadLink);
    
    setLoading(false);
    setStep(5);
    
    toast({
      title: 'Чит создан!',
      description: `Активационный код: ${code}`,
    });
  };

  const nextStep = () => {
    if (step === 1 && !cheatName) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Введите название чита',
      });
      return;
    }
    if (step === 2 && selectedFeatures.length === 0 && customFeatures.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Выберите хотя бы одну функцию',
      });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const resetGenerator = () => {
    setStep(1);
    setCheatName('');
    setSelectedFeatures([]);
    setCustomFeatures([]);
    setMenuDesign('classic');
    setAdditionalCode('');
    setActivationCode('');
    setGeneratedCheat('');
    setDownloadLink('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 border-2 border-purple-500/50 animate-glow-pulse">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-rainbow">
            🎮 ИИ Генератор Читов
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-[length:200%_auto] animate-rainbow'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cheatName" className="text-lg text-purple-300">
                  1️⃣ Название чита
                </Label>
                <Input
                  id="cheatName"
                  value={cheatName}
                  onChange={(e) => setCheatName(e.target.value)}
                  placeholder="Например: MegaCheat v2.0"
                  className="mt-2 bg-black/40 border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <Button onClick={nextStep} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Далее <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label className="text-lg text-blue-300">2️⃣ Выберите функции</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {availableFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFeatures.includes(feature.id)
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500'
                        : 'bg-black/30 border-gray-700 hover:border-purple-500/50'
                    }`}
                    onClick={() => handleFeatureToggle(feature.id)}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={selectedFeatures.includes(feature.id)}
                        className="mt-1"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{feature.name}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border-2 border-cyan-500/50 rounded-lg">
                <Label className="text-lg text-cyan-300 mb-3 block">➕ Добавить свою функцию</Label>
                <div className="space-y-3">
                  <Input
                    value={customFeatureName}
                    onChange={(e) => setCustomFeatureName(e.target.value)}
                    placeholder="Название функции (например: Авто-стрельба)"
                    className="bg-black/40 border-cyan-500/50 text-white"
                  />
                  <Textarea
                    value={customFeatureCode}
                    onChange={(e) => setCustomFeatureCode(e.target.value)}
                    placeholder="Lua код функции..."
                    rows={4}
                    className="bg-black/40 border-cyan-500/50 text-white font-mono"
                  />
                  <Button
                    onClick={addCustomFeature}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                  >
                    <Icon name="Plus" className="mr-2" size={18} />
                    Добавить функцию
                  </Button>
                </div>

                {customFeatures.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm text-cyan-300">Добавленные функции:</Label>
                    {customFeatures.map((cf, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/40 rounded border border-cyan-500/30">
                        <span className="text-white text-sm">{cf.name}</span>
                        <Button
                          onClick={() => removeCustomFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={prevStep} variant="outline" className="flex-1 border-purple-500/50">
                  <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
                </Button>
                <Button onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700">
                  Далее <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label className="text-lg text-pink-300">3️⃣ Выберите дизайн меню</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['classic', 'modern', 'neon'].map((design) => (
                  <div
                    key={design}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      menuDesign === design
                        ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-500'
                        : 'bg-black/30 border-gray-700 hover:border-pink-500/50'
                    }`}
                    onClick={() => setMenuDesign(design)}
                  >
                    <h4 className="font-semibold text-white capitalize">{design}</h4>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={prevStep} variant="outline" className="flex-1 border-pink-500/50">
                  <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
                </Button>
                <Button onClick={nextStep} className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  Далее <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label htmlFor="additionalCode" className="text-lg text-yellow-300">
                4️⃣ Дополнительный код (опционально)
              </Label>
              <Textarea
                id="additionalCode"
                value={additionalCode}
                onChange={(e) => setAdditionalCode(e.target.value)}
                placeholder="Вставьте свой Lua код..."
                rows={8}
                className="bg-black/40 border-yellow-500/50 text-white font-mono"
              />
              <div className="flex gap-3">
                <Button onClick={prevStep} variant="outline" className="flex-1 border-yellow-500/50">
                  <Icon name="ArrowLeft" className="mr-2" size={20} /> Назад
                </Button>
                <Button
                  onClick={generateCheat}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" className="mr-2" size={20} />
                      Создать чит
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-lg">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  ✅ Чит успешно создан!
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded">
                    <span className="text-white">Активационный код:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-green-400 font-bold text-lg">{activationCode}</code>
                      <Button
                        onClick={() => copyToClipboard(activationCode)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Icon name="Copy" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-lg text-purple-300">Lua скрипт:</Label>
                <div className="relative">
                  <Textarea
                    value={generatedCheat}
                    readOnly
                    rows={12}
                    className="bg-black/60 border-purple-500/50 text-green-400 font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedCheat)}
                    size="sm"
                    className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="Copy" size={16} className="mr-1" />
                    Копировать
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">📦 Готовый APK установщик</h4>
                <div className="flex items-center gap-2">
                  <Input
                    value={downloadLink}
                    readOnly
                    className="bg-black/40 border-blue-500/50 text-white"
                  />
                  <Button
                    onClick={() => copyToClipboard(downloadLink)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="Copy" size={18} />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Модифицированная Black Russia со встроенными читами
                </p>
              </div>

              <Button onClick={resetGenerator} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700">
                <Icon name="RefreshCw" className="mr-2" size={20} />
                Создать новый чит
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheatGenerator;
