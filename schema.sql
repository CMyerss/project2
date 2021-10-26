USE champions;
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