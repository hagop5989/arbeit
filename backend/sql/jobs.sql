DROP TABLE jobs;
# 최신 DB 기준
create table jobs
(
    id                 int auto_increment primary key,
    member_id          int                                  not null,
    store_id           int                                  not null,
    category_id        int                                  not null,
    title              varchar(100)                         not null,
    content            varchar(3000)                        not null,
    salary             int                                  not null,
    deadline           datetime                             not null,
    recruitment_number int                                  not null,
    store_name         varchar(45)                          not null,
    inserted           datetime default current_timestamp() not null,
    start_time         time                                 not null,
    end_time           time                                 not null,
    marker_name        varchar(30)                          not null,
    y                  double                               not null,
    x                  double                               not null,
    constraint jobs_ibfk_1
        foreign key (member_id) references member (id),
    constraint jobs_ibfk_2
        foreign key (store_id) references store (id),
    constraint jobs_ibfk_3
        foreign key (category_id) references category (id)
);