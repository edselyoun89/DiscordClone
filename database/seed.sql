USE chat_app;

-- Добавляем тестовых пользователей
-- Пароли закодированы с использованием bcrypt
INSERT INTO users (username, password, status) VALUES
('Alice', '$2a$10$KXqR/NtA.nUJeTb04N9EXu9EuLp4jORxQOqpkpxf8kVTo3d8i5F76', 'online'), -- пароль: password123
('Bob', '$2a$10$RjG6Yy7mtYZJowcSNdMFf.OM8jD5u.kQFxi4M7sweDQGKrSngBjx2', 'offline'), -- пароль: mysecurepass
('Charlie', '$2a$10$g8/2PqUmmO59lyBuoGhMkOKmK7uCHx08hz9uXJYYbGRMx.yAs1FBO', 'busy'); -- пароль: secretpass

-- Добавляем тестовые каналы (текстовые и голосовые)
INSERT INTO channels (name, type) VALUES
('general', 'text'),       -- Общий чат
('gaming', 'text'),        -- Чат для геймеров
('voice-lounge', 'voice'), -- Голосовая комната
('music-room', 'voice');   -- Музыкальная комната

-- Добавляем тестовые сообщения
INSERT INTO messages (channel_id, user_id, message, sent_at) VALUES
(1, 1, 'Всем привет в общем чате!', NOW()),       -- Сообщение от Alice
(1, 2, 'Привет, как дела?', NOW()),               -- Сообщение от Bob
(2, 3, 'Кто играет в CS:GO?', NOW()),             -- Сообщение от Charlie
(2, 1, 'Я! Давай заходи.', NOW());                -- Ответ Alice

-- Добавляем тестовые звонки
INSERT INTO calls (caller_id, receiver_id, status, started_at, ended_at) VALUES
(1, 2, 'accepted', '2025-01-29 12:00:00', '2025-01-29 12:15:00'), -- Alice звонила Bob, звонок принят
(2, 3, 'rejected', '2025-01-29 13:00:00', NULL),                  -- Bob звонил Charlie, звонок отклонён
(3, 1, 'calling', '2025-01-29 14:00:00', NULL);                   -- Charlie звонил Alice, звонок в процессе
