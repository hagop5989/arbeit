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

ALTER TABLE contract
    ADD CONSTRAINT contract_ibfk_1 FOREIGN KEY (boss_id) REFERENCES member (id) ON DELETE SET NULL;
ALTER TABLE contract
    ADD CONSTRAINT contract_ibfk_2 FOREIGN KEY (alba_id) REFERENCES application (member_id) ON DELETE SET NULL;
ALTER TABLE contract
    ADD CONSTRAINT contract_ibfk_3 FOREIGN KEY (jobs_id) REFERENCES application (jobs_id) ON DELETE SET NULL;