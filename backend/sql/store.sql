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
    ADD COLUMN phone VARCHAR(45) AFTER address;

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

ALTER TABLE category
    DROP COLUMN category_icon;

ALTER TABLE category
    ADD COLUMN icon VARCHAR(45);

ALTER TABLE store
    ADD COLUMN category_id INT REFERENCES category (id) AFTER member_id;


INSERT INTO category (name)
VALUES ('기타');

SELECT *
FROM category;

CREATE TABLE store_file
(
    store_id INT          NOT NULL REFERENCES board (id),
    name     VARCHAR(500) NOT NULL,
    PRIMARY KEY (store_id, name)
);

