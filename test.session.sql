
-- @block
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    passwd VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    sport VARCHAR(255) NOT NULL
);


CREATE DATABASE users;

USE users;


-- @block
INSERT INTO users (username, passwd, email, phoneNumber, age, sport)
VALUES (
    'lorppi',
    'sipuli609',
    'lorppi@coachcoach.com',
    '0445091101',
    '22',
    'football'
);

-- @block
SELECT username, id FROM Users

WHERE age = '22'

ORDER BY id ASC
LIMIT 100;

-- @block
SELECT passwd FROM Users
WHERE username = 'lorppi'
;