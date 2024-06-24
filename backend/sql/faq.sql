USE arbeit;

CREATE TABLE Wfaq
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(1500) NOT NULL,
    answer   VARCHAR(1500) NOT NULL
);

CREATE TABLE Bfaq
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(1500) NOT NULL,
    answer   VARCHAR(1500) NOT NULL
);

INSERT INTO Wfaq (question, answer)
VALUES ('212', '312');

