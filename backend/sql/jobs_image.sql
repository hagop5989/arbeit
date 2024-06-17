DROP TABLE jobs_image;
CREATE TABLE jobs_image
(
    jobs_id INT          NOT NULL REFERENCES jobs (id),
    name    VARCHAR(500) NOT NULL,
    PRIMARY KEY (jobs_id, name)
);
SELECT *
FROM jobs_image;