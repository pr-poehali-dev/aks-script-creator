-- Insert sample scripts for Black Russia cheats
INSERT INTO scripts (title, description, code, instructions, category, created_by) VALUES
(
    'ESP - Подсветка игроков',
    'Видимость всех игроков через стены с отображением ника и здоровья',
    'function esp_players()
    local players = game.Players:GetPlayers()
    for _, player in pairs(players) do
        if player ~= game.Players.LocalPlayer then
            local highlight = Instance.new("Highlight")
            highlight.Parent = player.Character
            highlight.FillColor = Color3.fromRGB(255, 0, 255)
            highlight.OutlineColor = Color3.fromRGB(0, 234, 255)
            highlight.FillTransparency = 0.5
            highlight.OutlineTransparency = 0
        end
    end
end
esp_players()',
    'Активация: 1) Откройте executor (Synapse X / KRNL / Fluxus). 2) Вставьте код скрипта. 3) Нажмите Execute. 4) Игроки будут подсвечиваться через стены розовым цветом с голубой обводкой.',
    'Визуализация',
    1
),
(
    'Бесконечные деньги',
    'Дюп денег через банкомат с автоматическим умножением',
    'local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RemoteEvents = ReplicatedStorage:WaitForChild("RemoteEvents")

function infinite_money()
    local amount = 999999999
    RemoteEvents.MoneyEvent:FireServer("deposit", amount)
    RemoteEvents.MoneyEvent:FireServer("withdraw", amount * 2)
    wait(0.5)
    infinite_money()
end

spawn(infinite_money)',
    'Активация: 1) Подойдите к банкомату в игре. 2) Откройте executor. 3) Вставьте и запустите скрипт. 4) Деньги начнут автоматически дюпаться каждые 0.5 секунд. Внимание: используйте осторожно, может вызвать бан!',
    'Экономика',
    1
),
(
    'Телепорт по координатам',
    'Мгновенное перемещение в любую точку карты',
    'function teleport(x, y, z)
    local player = game.Players.LocalPlayer
    if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
        player.Character.HumanoidRootPart.CFrame = CFrame.new(x, y, z)
        print("Телепортирован на: " .. x .. ", " .. y .. ", " .. z)
    end
end

-- Пример использования:
teleport(100, 50, 200) -- Замените координаты на нужные',
    'Активация: 1) Узнайте координаты места (через F9 консоль или карту). 2) Откройте executor. 3) Замените числа в teleport(x, y, z) на нужные координаты. 4) Запустите скрипт. 5) Вы мгновенно окажетесь в указанной точке.',
    'Передвижение',
    1
),
(
    'Aimbot - Авто прицел',
    'Автоматическое наведение на голову ближайшего врага',
    'local Players = game:GetService("Players")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer

function get_nearest_enemy()
    local nearest, min_distance = nil, math.huge
    for _, player in pairs(Players:GetPlayers()) do
        if player ~= LocalPlayer and player.Character and player.Character:FindFirstChild("Head") then
            local distance = (player.Character.Head.Position - LocalPlayer.Character.Head.Position).Magnitude
            if distance < min_distance then
                nearest = player
                min_distance = distance
            end
        end
    end
    return nearest
end

game:GetService("RunService").RenderStepped:Connect(function()
    local target = get_nearest_enemy()
    if target and target.Character:FindFirstChild("Head") then
        Camera.CFrame = CFrame.new(Camera.CFrame.Position, target.Character.Head.Position)
    end
end)',
    'Активация: 1) Откройте executor. 2) Вставьте код. 3) Нажмите Execute. 4) Прицел будет автоматически наводиться на голову ближайшего игрока. 5) Просто стреляйте - попадания гарантированы. Работает в PvP зонах.',
    'Боевая система',
    1
),
(
    'Скорость x5',
    'Увеличение скорости передвижения персонажа в 5 раз',
    'local player = game.Players.LocalPlayer

function speed_boost()
    if player.Character and player.Character:FindFirstChild("Humanoid") then
        player.Character.Humanoid.WalkSpeed = 80 -- Обычная 16
        print("Скорость увеличена до 80!")
    end
end

speed_boost()

-- Автоматическое восстановление после респавна
player.CharacterAdded:Connect(function()
    wait(1)
    speed_boost()
end)',
    'Активация: 1) Откройте executor в игре. 2) Вставьте код скрипта. 3) Нажмите Execute. 4) Скорость сразу увеличится в 5 раз. 5) После смерти скрипт автоматически активируется снова. Полезно для быстрого фарма.',
    'Передвижение',
    1
);