use arbeit;
create table board
(
    id        int auto_increment
        primary key,
    member_id int                                  null,
    title     varchar(100)                         null,
    content   varchar(3000)                        null,
    inserted  datetime default current_timestamp() not null,
    constraint board_ibfk_1
        foreign key (member_id) references member (id)
);


SELECT *
FROM board;



CREATE TABLE board_images
(
    board_id INT REFERENCES board (id),
    name     VARCHAR(200) NOT NULL,
    PRIMARY KEY (board_id, name)
);

SELECT *
FROM board_images;



DROP TABLE board;
DROP TABLE board_images;
