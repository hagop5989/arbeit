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



SELECT c.id, c.member_id, c.comment, c.inserted
FROM comment c
         JOIN member m ON m.id = c.member_id
WHERE board_Id = 1
ORDER BY id
;



SELECT c.id, c.member_id, c.comment, c.inserted
FROM comment c
         JOIN member m ON m.id = c.member_id
WHERE board_Id = 8
ORDER BY c.id;
