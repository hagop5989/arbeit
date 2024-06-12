DROP TABLE resume;
# 이력서 테이블
CREATE TABLE resume
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT           NOT NULL REFERENCES member (id),
    title     VARCHAR(50)   NOT NULL,
    content   VARCHAR(3000) NOT NULL,
    is_rookie BOOLEAN       NOT NULL,
    inserted  DATETIME      NOT NULL DEFAULT NOW()
);