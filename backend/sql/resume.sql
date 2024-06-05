DROP TABLE resume;
CREATE TABLE resume
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT           NOT NULL REFERENCES member (id),
    title     VARCHAR(45)   NOT NULL,
    content   VARCHAR(3000) NOT NULL,
    files     VARCHAR(1000)
);