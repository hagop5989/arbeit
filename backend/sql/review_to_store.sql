create table review_to_store
(
    alba_id  int                                  not null,
    store_id int                                  not null,
    content  varchar(100)                         not null,
    rating   tinyint(1)                           null, /* 0~5 까지*/
    inserted datetime default current_timestamp() not null,
    primary key (alba_id, store_id),
    constraint review_to_store_ibfk_1
        foreign key (alba_id) references member (id),
    constraint review_to_store_ibfk_2
        foreign key (store_id) references store (id)
);

create index store_id
    on review_to_store (store_id);

