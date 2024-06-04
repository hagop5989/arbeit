USE arbeit;
CREATE TABLE store
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(45)   NOT NULL,
    content  VARCHAR(1000) NOT NULL,
    address  VARCHAR(100)  NOT NULL,
    category VARCHAR(45)   NOT NULL
);

SELECT *
FROM store;