interface CheatFeature {
  id: string;
  name: string;
  description: string;
  category: 'player' | 'vehicle' | 'visual' | 'other';
}

export const availableFeatures: CheatFeature[] = [
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

interface GenerateLuaCodeParams {
  cheatName: string;
  activationCode: string;
  selectedFeatures: string[];
  customFeatures: { name: string; code: string }[];
  menuDesign: string;
  additionalCode: string;
}

export const generateLuaCode = ({
  cheatName,
  activationCode,
  selectedFeatures,
  customFeatures,
  menuDesign,
  additionalCode,
}: GenerateLuaCodeParams): string => {
  const allFeatures = [
    ...selectedFeatures.map(id => availableFeatures.find(f => f.id === id)?.name || ''),
    ...customFeatures.map(cf => cf.name)
  ].join(', ');

  return `-- ${cheatName}
-- Активационный код: ${activationCode}
-- Функции: ${allFeatures}

local ACTIVATION_CODE = "${activationCode}"
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
local antiBanEnabled = true
local function initAntiBan()
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
        toggle${feature?.id.charAt(0).toUpperCase()}${feature?.id.slice(1).replace(/_([a-z])/g, (_: string, char: string) => char.toUpperCase())}()
    else
        btn${index}.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
        btn${index}.Text = "${feature?.name} [OFF]"
        toggle${feature?.id.charAt(0).toUpperCase()}${feature?.id.slice(1).replace(/_([a-z])/g, (_: string, char: string) => char.toUpperCase())}()
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
print("✓ Код активации: ${activationCode}")
print("✓ Функций активировано: ${selectedFeatures.length + customFeatures.length}")
`;
};
