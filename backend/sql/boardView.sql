/* 조회수 */

use arbeit;


CREATE TABLE board_view
(
    board_id  INT NOT NULL REFERENCES board (id),
    member_id INT NOT NULL REFERENCES member (id),
    PRIMARY KEY (board_id, member_id)
);

ALTER TABLE board_view
    ADD COLUMN view_count INT DEFAULT 0;

SELECT *
FROM board_view;


