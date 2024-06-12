USE arbeit;

DROP TABLE
    comment;

CREATE TABLE comment
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    board_id  INT REFERENCES board (id),
    member_id INT          NOT NULL REFERENCES member (id),
    comment   VARCHAR(300) NOT NULL,
    inserted  DATETIME DEFAULT NOW()
);

SELECT *
FROM comment;



