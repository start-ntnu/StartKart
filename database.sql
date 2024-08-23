create table Users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pfp VARCHAR(255) NOT NULL,

    'character' VARCHAR(255),
    nickname VARCHAR(255),
    elo INT DEFAULT 1000,
    wins INT DEFAULT 0,
    plays INT DEFAULT 0,
    redbull INT DEFAULT 0
)

create table Games (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES(Users)
)

create table Statchanges (
    gameID INT NOT NULL,
    userID INT NOT NULL,
    elo INT,
    redbull INT,
    position TINYINT,
    CONSTRAINT PK_Statchanges PRIMARY KEY (gameID, userID)
)