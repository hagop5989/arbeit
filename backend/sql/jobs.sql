DROP TABLE jobs;
# 최신 DB 기준 240613
create table jobs
(
    id                 int auto_increment primary key,
    member_id          int           not null,
    store_id           int           not null,
    category_id        int           not null,
    title              varchar(100)  not null,
    content            varchar(3000) not null,
    salary             int           not null,
    deadline           datetime      not null,
    recruitment_number int           not null,
    constraint jobs_ibfk_1
        foreign key (member_id) references member (id),
    constraint jobs_ibfk_2
        foreign key (store_id) references store (id),
    constraint jobs_ibfk_3
        foreign key (category_id) references category (id)
);
SELECT *
FROM jobs;


SELECT *
FROM jobs_file;
