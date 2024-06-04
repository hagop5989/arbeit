use arbeit;

DROP TABLE alba;

CREATE TABLE alba
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    email    VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name     VARCHAR(10)  NOT NULL,
    address  VARCHAR(100) NOT NULL,
    phone    VARCHAR(11)  NOT NULL,
    inserted DATETIME     NOT NULL DEFAULT NOW()
);

SELECT *
FROM alba;
SELECT *
FROM boss;

DESC alba;
show tables;