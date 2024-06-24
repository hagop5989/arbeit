DROP TABLE contract;
CREATE TABLE contract
(
    jobs_id    INT      NOT NULL,
    alba_id    INT      NOT NULL,
    store_id   INT      NOT NULL,
    start_date DATETIME NOT NULL,
    end_date   DATETIME NOT NULL,
    CONSTRAINT fk_jobs FOREIGN KEY (jobs_id) REFERENCES jobs (id),
    CONSTRAINT fk_alba FOREIGN KEY (alba_id) REFERENCES member (id),
    CONSTRAINT fk_boss FOREIGN KEY (store_id) REFERENCES store (id),
    PRIMARY KEY (jobs_id, alba_id, store_id)
);
