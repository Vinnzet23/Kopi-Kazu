-- User & Permission Configuration for MySQL
-- Kopi Kazu POS v2.4

-- Create user if not exists and grant privileges
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'g4v1n1sh4m';
GRANT ALL PRIVILEGES ON db_kopi_kazu.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

