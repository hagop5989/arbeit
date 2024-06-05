use arbeit;


use arbeit;

DROP TABLE
    board;

CREATE TABLE board
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    title    VARCHAR(100),
    content  VARCHAR(3000),
    writer   VARCHAR(50),

    inserted DATETIME NOT NULL DEFAULT NOW()
);

SELECT *
FROM board







