-- Remove any existing database and user.
DROP DATABASE IF EXISTS champions;
DROP USER IF EXISTS champions_user@localhost;

-- Create champions database and user. Ensure Unicode is fully supported.
CREATE DATABASE champions CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER champions_user@localhost IDENTIFIED WITH mysql_native_password BY 'champions';
GRANT ALL PRIVILEGES ON champions.* TO champions_user@localhost;