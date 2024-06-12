USE arbeit;

# 가게 테이블
create table store
(
    id          int auto_increment
        primary key,
    name        varchar(45)   not null,
    content     varchar(1000) not null,
    address     varchar(100)  not null,
    phone       varchar(45)   null,
    member_id   int           null,
    category_id int           null,
    cate_name   varchar(45)   null,
    constraint store_ibfk_1
        foreign key (member_id) references member (id),
    constraint store_ibfk_2
        foreign key (category_id) references category (id),
    constraint store_ibfk_3
        foreign key (cate_name) references category (name)
);

# 가게 이미지
create table store_file
(
    store_id int         not null,
    name     varchar(45) not null,
    primary key (store_id, name),
    constraint store_file_ibfk_1
        foreign key (store_id) references store (id)
);

# 카테고리
create table category
(
    id   int auto_increment
        primary key,
    name varchar(45) not null,
    icon varchar(45) not null,
    constraint name
        unique (name)
);
