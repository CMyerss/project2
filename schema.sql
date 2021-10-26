DROP TABLE IF EXISTS champions;

-- League of Legends champions: id- unique id, name- name of champion, type- champion type, role- main lane, desc- description of champion.
CREATE TABLE champions (
    id SERIAL PRIMARY KEY,
    c_name TEXT,
    c_type TEXT,
    c_role TEXT,
    c_desc TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO champions(c_name, c_type, c_role, c_desc) VALUES ("Aatrox", "Fighter", "Top", "A moderately difficult character.")
INSERT INTO champions(c_name, c_type, c_role, c_desc) VALUES ("Jayce", "Fighter", "Top", "A moderately difficult character.")
INSERT INTO champions(c_name, c_type, c_role, c_desc) VALUES ("Tahm Kench", "Support", "Any", "An easily played character.")