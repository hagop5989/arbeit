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
    files     VARCHAR(300),
    inserted  DATETIME NOT NULL DEFAULT NOW()
);

SELECT *
FROM board;

USE arbeit;
DESC board;

# board_like 만들기
CREATE TABLE board_like
(
    board_id  INT NOT NULL REFERENCES board (id),
    member_id INT NOT NULL REFERENCES member (id),
    PRIMARY KEY (board_id, member_id)
);

SELECT *
FROM board_like;





