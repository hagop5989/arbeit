DROP TABLE jobs;
CREATE TABLE jobs
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(100)  NOT NULL,
    content    VARCHAR(3000) NOT NULL,
    store_name VARCHAR(45)   NOT NULL,
    store_id   INT,
    boss_id    INT           NOT NULL REFERENCES member (id),
    inserted   DATETIME      NOT NULL DEFAULT NOW()
);
# todo :  REFERENCES member (id) 추가하기. 지금 없음.

SELECT *
FROM jobs;


# 게시글 여러개 입력.
INSERT INTO jobs
    (title, content, store_name, store_id, boss_id)
SELECT title, content, store_name, store_id, boss_id
FROM jobs;

ALTER TABLE jobs
    ADD COLUMN inserted DATETIME NOT NULL DEFAULT NOW();

DELETE
FROM jobs
WHERE id BETWEEN 200 AND 887;

# jobs boss_id 컬럼 이름 변경 (member_id)
ALTER TABLE jobs
    CHANGE COLUMN boss_id member_id INT NOT NULL;

DESC jobs;

ALTER TABLE jobs
    ADD CONSTRAINT fk_member
        FOREIGN KEY (member_id)
            REFERENCES member (id);


