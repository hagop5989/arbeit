/* 조회수 */

use arbeit;


CREATE TABLE board_view
(
    board_id  INT REFERENCES board (id),
    member_id INT REFERENCES member (id),
    PRIMARY KEY (board_id, member_id)
);

ALTER TABLE board_view
    ADD COLUMN view_count INT DEFAULT 0;

ALTER TABLE board_view
    DROP FOREIGN KEY board_view_ibfk_2;


SELECT *
FROM board_view;


DROP TABLE board_view;
