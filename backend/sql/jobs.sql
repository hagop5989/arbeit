/* 240628 기준 */
create table jobs
(
    id                 int auto_increment primary key,
    member_id          int           not null,
    store_id           int           null,
    category_id        int           not null,
    title              varchar(100)  not null,
    content            varchar(3000) not null,
    salary             int           not null,
    deadline           datetime      not null,
    recruitment_number int           not null,
    constraint jobs_ibfk_1
        foreign key (member_id) references member (id),
    constraint jobs_ibfk_2
        foreign key (store_id) references store (id)
            on delete set null,
    constraint jobs_ibfk_3
        foreign key (category_id) references category (id)
);

create index category_id
    on jobs (category_id);

create index member_id
    on jobs (member_id);

/* store가 삭제 됐을 시 storeId null 로 세팅됨.*/