use arbeit;


use arbeit;

DROP TABLE
    board;

CREATE TABLE board
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT REFERENCES member (id),
    title     VARCHAR(100),
    content   VARCHAR(3000),
    inserted  DATETIME NOT NULL DEFAULT NOW()
);

SELECT *
FROM board







