USE arbeit;
CREATE TABLE store
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(45)   NOT NULL,
    content  VARCHAR(1000) NOT NULL,
    address  VARCHAR(100)  NOT NULL,
    category VARCHAR(45)   NOT NULL
);



ALTER TABLE store
    ADD COLUMN member_id INT REFERENCES member (id) AFTER category;

SELECT *
FROM store;

CREATE TABLE store_file
(
    store_id INT         NOT NULL REFERENCES store (id),
    name     VARCHAR(45) NOT NULL,
    PRIMARY KEY (store_id, name)
);

SELECT *
FROM member;

CREATE TABLE category
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL

);

ALTER TABLE store
    DROP COLUMN category;

ALTER TABLE store
    ADD COLUMN category_id INT REFERENCES category (id) AFTER member_id;


INSERT INTO category (name)
VALUES ('사무직');

