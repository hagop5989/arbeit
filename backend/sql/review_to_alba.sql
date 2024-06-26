DROP TABLE review_to_alba;
CREATE TABLE review_to_alba
(
    alba_id  INT REFERENCES member (id),
    boss_id  INT REFERENCES member (id),
    content  VARCHAR(100) NOT NULL,
    rating   TINYINT(1), -- 0~5 까지
    inserted DATETIME     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (alba_id, boss_id)
);
