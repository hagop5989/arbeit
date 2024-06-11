DROP TABLE resume;
# 240610 ver.
CREATE TABLE resume
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    member_id       INT           NOT NULL REFERENCES member (id),
    title           VARCHAR(45)   NOT NULL,
    content         VARCHAR(3000) NOT NULL,
    birth_date      DATETIME      NOT NULL,
    is_rookie       BOOLEAN       NOT NULL,
    address1        VARCHAR(30)   NOT NULL,
    address2        VARCHAR(10)   NOT NULL,
    email           VARCHAR(30)   NOT NULL,
    phone           VARCHAR(30)   NOT NULL,
    preferred_pay   INT           NOT NULL,
    work_day_type   VARCHAR(30)   NOT NULL,
    work_shift_type VARCHAR(30)   NOT NULL,
    deadline        DATETIME      NOT NULL,
    preferred_job   VARCHAR(30)   NOT NULL,
    files           VARCHAR(1000)
);

# 변경
ALTER TABLE resume
    ADD inserted DATETIME NOT NULL DEFAULT NOW();
ALTER TABLE resume
    ADD gender VARCHAR(10) NOT NULL;
ALTER TABLE resume
    CHANGE is_rookie rookie BOOLEAN NOT NULL;

SELECT *
FROM resume;

SELECT *
FROM member;

DELETE
FROM resume