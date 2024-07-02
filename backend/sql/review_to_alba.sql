create table review_to_alba
(
    alba_id  int                                  not null,
    boss_id  int                                  not null,
    rating   tinyint(1)                           null,
    inserted datetime default current_timestamp() not null,
    jobs_id  int                                  not null,
    primary key (alba_id, boss_id, jobs_id),
    constraint review_to_alba_ibfk_1
        foreign key (jobs_id) references jobs (id)
);

create index boss_id
    on review_to_alba (boss_id);

create index jobs_id
    on review_to_alba (jobs_id);

