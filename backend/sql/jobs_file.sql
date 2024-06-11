DROP TABLE jobs_file;
CREATE TABLE jobs_file
(
    jobs_id INT          NOT NULL REFERENCES jobs (id),
    name    VARCHAR(500) NOT NULL,
    PRIMARY KEY (jobs_id, name)
);
SELECT *
FROM jobs_file;