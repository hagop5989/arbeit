USE arbeit;

# 가게 테이블
CREATE TABLE store
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    name           VARCHAR(45)   NOT NULL,
    content        VARCHAR(3000) NOT NULL,
    address        VARCHAR(200)  NOT NULL,
    detail_address VARCHAR(200)  NOT NULL,
    phone          VARCHAR(45)   NOT NULL,
    inserted       DATETIME      NOT NULL DEFAULT NOW(),
    member_id      INT REFERENCES member (id),
    category_id    INT REFERENCES category (id)
);
SELECT *
FROM store;
# 가게 이미지
CREATE TABLE store_images
(
    store_id INT REFERENCES store (id),
    name     VARCHAR(200) NOT NULL,
    PRIMARY KEY (store_id, name)
);
SELECT *
FROM store_images;

# 카테고리
CREATE TABLE category
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL UNIQUE,
    icon VARCHAR(45) NOT NULL
);
SELECT *
FROM category;
