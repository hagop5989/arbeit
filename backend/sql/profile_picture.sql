USE arbeit;

CREATE TABLE profile_picture
(
    member_id INT REFERENCES member (id),
    src       VARCHAR(1000),
    PRIMARY KEY (member_id)
);

SELECT *
FROM profile_picture;