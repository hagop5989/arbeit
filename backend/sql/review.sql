CREATE TABLE review (
                        member_id INT,
                        jobs_id INT,
                        authority VARCHAR(10), -- authority 와 trigger 로 연동
                        jobs_title VARCHAR(100),
                        content VARCHAR(100) NOT NULL,
                        rating TINYINT(1), -- 1~10까지
                        inserted DATETIME NOT NULL DEFAULT NOW(),
                        PRIMARY KEY (member_id, jobs_id),
                        FOREIGN KEY (member_id) REFERENCES member(id),
                        FOREIGN KEY (jobs_id) REFERENCES jobs(id)
);

CREATE TRIGGER set_review_authority
    BEFORE INSERT ON review
    FOR EACH ROW
BEGIN
    DECLARE member_role VARCHAR(10);
    SELECT name INTO member_role FROM authority WHERE member_id = NEW.member_id;
    SET NEW.authority = member_role;
END;
