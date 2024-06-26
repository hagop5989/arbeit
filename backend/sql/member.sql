use arbeit;
# member 테이블
DROP TABLE member;
CREATE TABLE member
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    email      VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(100) NOT NULL,
    name       VARCHAR(10)  NOT NULL,
    gender     VARCHAR(10)  NOT NULL,
    birth_date DATE         NOT NULL,
    address    VARCHAR(100) NOT NULL,
    phone      VARCHAR(11)  NOT NULL,
    inserted   DATETIME     NOT NULL DEFAULT NOW()
);

# authority 테이블
DROP TABLE authority;
CREATE TABLE authority
(
    member_id INT REFERENCES member (id),
    name      VARCHAR(10) NOT NULL,
    PRIMARY KEY (member_id, name)
);

SELECT *
FROM member;
UPDATE member
SET email='1651324384.delete',
    name='탈퇴한 유저'
WHERE id = 55;
DESC member;

SELECT *
FROM authority;
