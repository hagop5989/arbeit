DROP TABLE management;
CREATE TABLE management (
                            jobs_id           INT NOT NULL,
                            applied_member_id INT NOT NULL,
                            resume_id         INT NOT NULL,
                            is_passed         TINYINT NULL,
                            PRIMARY KEY (jobs_id, applied_member_id),
                            CONSTRAINT management_ibfk_1 FOREIGN KEY (jobs_id, applied_member_id) REFERENCES application (jobs_id, member_id),
                            CONSTRAINT management_ibfk_3 FOREIGN KEY (resume_id) REFERENCES application (resume_id)
);

CREATE INDEX applied_member_id ON management (applied_member_id);
CREATE INDEX resume_id ON management (resume_id);