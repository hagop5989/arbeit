DROP TABLE application;
CREATE TABLE application
(
    jobs_id   INT REFERENCES jobs (id),
    member_id INT REFERENCES member (id),
    resume_id INT REFERENCES resume (id),
    title     VARCHAR(100)  NOT NULL,
    comment   VARCHAR(1500) NOT NULL,
    is_passed TINYINT(1),
    inserted  DATETIME      NOT NULL DEFAULT NOW(),
    PRIMARY KEY (jobs_id, member_id)
);

SELECT *
FROM application;

SELECT a.*,j.title AS jobsTitle
FROM application a
         JOIN jobs j ON a.jobs_id = j.id
WHERE a.member_id =