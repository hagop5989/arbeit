CREATE TABLE contract
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    boss_id    INT REFERENCES member (id),
    alba_id    INT REFERENCES application (member_id),
    jobs_id    INT REFERENCES application (jobs_id),
    start_date DATE,
    end_date   DATE
);

DESC contract;
SELECT *
FROM contract;

DELETE
FROM contract
WHERE alba_id = 69;