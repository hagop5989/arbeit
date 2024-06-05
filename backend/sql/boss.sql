USE arbeit;

SELECT *
FROM boss;

DESC boss;

ALTER TABLE boss
    MODIFY COLUMN email VARCHAR(45) NOT NULL UNIQUE;

DELETE
FROM boss
WHERE email = 's@s';

DROP TABLE alba_posts;


CREATE TABLE alba_posts
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(100)  NOT NULL,
    content    VARCHAR(3000) NOT NULL,
    store_name VARCHAR(45)   NOT NULL,
    store_id   INT,
    boss_id    INT           NOT NULL REFERENCES boss (id)
);

