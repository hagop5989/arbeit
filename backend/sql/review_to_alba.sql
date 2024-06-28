DROP TABLE review_to_alba;
CREATE TABLE review_to_alba
(
    alba_id  INT REFERENCES member (id),
    boss_id  INT REFERENCES member (id),
    rating   TINYINT(1), -- 0~5 까지
    inserted DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (alba_id, boss_id)
);

CREATE TABLE alba_score
(
    alba_id INT REFERENCES member (id),
    score   INT NOT NULL DEFAULT 100,
    PRIMARY KEY (alba_id)
);

SELECT *
FROM review_to_alba;

DELETE
FROM review_to_alba
WHERE alba_id = 69;