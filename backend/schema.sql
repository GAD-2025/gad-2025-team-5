CREATE DATABASE IF NOT EXISTS gad_team_5;

USE gad_team_5;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 장르 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 사용자와 장르의 관계를 저장하는 중간 테이블
CREATE TABLE IF NOT EXISTS user_interests (
    user_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- 초기 장르 데이터 삽입 (필요에 따라 추가)
INSERT IGNORE INTO genres (name) VALUES
('소설'), ('시/에세이'), ('인문'), ('사회과학'), ('역사/문화'),
('종교'), ('정치/사회'), ('예술/대중문화'), ('과학'), ('기술/공학'),
('컴퓨터/IT'), ('자기계발'), ('경제/경영'), ('가정/육아'), ('건강/취미');

CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    genres JSON,
    books JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);