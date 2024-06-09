CREATE TABLE resume_file(
    resume_id INT NOT NULL REFERENCES resume(id),
    name VARCHAR(500) NOT NULL ,
    PRIMARY KEY (resume_id, name)
);
SELECT * FROM resume_file;