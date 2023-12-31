-- migrate:up
CREATE TABLE groupings (
	id INTEGER NOT NULL AUTO_INCREMENT,
	member_count INTEGER NOT NULL DEFAULT 2,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE groupings;