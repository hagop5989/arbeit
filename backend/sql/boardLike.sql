/*좋아요 */

use arbeit;


CREATE TABLE board_like
(
    board_id  INT NOT NULL REFERENCES board (id),
    member_id INT NOT NULL REFERENCES member (id),
    PRIMARY KEY (board_id, member_id)
);

SELECT *
FROM board_like;


