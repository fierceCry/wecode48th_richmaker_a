-- migrate:up
CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT,
	ci CHAR(66) NOT NULL UNIQUE,
	grouping_id INTEGER NULL,     
	user_name VARCHAR(20) NOT NULL,
	phone_number VARCHAR(15) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,  
	profile_image VARCHAR(500) NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- migrate:down
DROP TABLE users;