use arbeit;
create table board
(
    id        int auto_increment
        primary key,
    member_id int                                  null,
    title     varchar(100)                         null,
    content   varchar(3000)                        null,
    files     varchar(300)                         null,
    inserted  datetime default current_timestamp() not null,
    constraint board_ibfk_1
        foreign key (member_id) references member (id)
);





