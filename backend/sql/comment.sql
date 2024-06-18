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


ALTER TABLE comment
    DROP FOREIGN KEY comment_ibfk_1;

ALTER TABLE comment
    ADD CONSTRAINT comment_ibfk_1 FOREIGN KEY (board_id) REFERENCES board (id) ON DELETE CASCADE;

DROP TABLE comment;
