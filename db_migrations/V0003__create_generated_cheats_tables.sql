-- Создание таблицы для созданных читов пользователями
CREATE TABLE IF NOT EXISTS t_p99311420_aks_script_creator.generated_cheats (
    id SERIAL PRIMARY KEY,
    cheat_name VARCHAR(255) NOT NULL,
    activation_code VARCHAR(50) NOT NULL UNIQUE,
    lua_code TEXT NOT NULL,
    download_link TEXT NOT NULL,
    selected_features TEXT[] NOT NULL,
    custom_features_count INTEGER DEFAULT 0,
    menu_design VARCHAR(50) DEFAULT 'classic',
    created_by INTEGER REFERENCES t_p99311420_aks_script_creator.users(id),
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для отслеживания лайков/дизлайков пользователей
CREATE TABLE IF NOT EXISTS t_p99311420_aks_script_creator.cheat_votes (
    id SERIAL PRIMARY KEY,
    cheat_id INTEGER REFERENCES t_p99311420_aks_script_creator.generated_cheats(id),
    user_id INTEGER REFERENCES t_p99311420_aks_script_creator.users(id),
    vote_type VARCHAR(10) CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cheat_id, user_id)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_generated_cheats_created_by ON t_p99311420_aks_script_creator.generated_cheats(created_by);
CREATE INDEX IF NOT EXISTS idx_generated_cheats_likes ON t_p99311420_aks_script_creator.generated_cheats(likes DESC);
CREATE INDEX IF NOT EXISTS idx_generated_cheats_created_at ON t_p99311420_aks_script_creator.generated_cheats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cheat_votes_cheat_id ON t_p99311420_aks_script_creator.cheat_votes(cheat_id);
CREATE INDEX IF NOT EXISTS idx_cheat_votes_user_id ON t_p99311420_aks_script_creator.cheat_votes(user_id);
