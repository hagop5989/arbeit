USE arbeit;
DROP TABLE scrap;
CREATE TABLE scrap
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    member_id  INT     NOT NULL REFERENCES member (id),
    jobs_id    INT     NOT NULL REFERENCES jobs (id),
    jobs_title VARCHAR(500),
    favorite   BOOLEAN NOT NULL
);

