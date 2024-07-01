/* 조회수 */

use arbeit;


CREATE TABLE board_view
(
    id        int auto_increment primary key,
    board_id  INT NOT NULL REFERENCES board (id),
    member_id INT NOT NULL REFERENCES member (id)
);

ALTER TABLE board_view
    ADD COLUMN view_count INT DEFAULT 0;

ALTER TABLE board_view
    DROP FOREIGN KEY board_view_ibfk_2;


SELECT *
FROM board_view;


DROP TABLE board_view;
