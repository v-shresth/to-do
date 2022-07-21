/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS sessionDetails (
                                       session_id uuid DEFAULT uuid_generate_v4 (),
                                       user_id INTEGER REFERENCES users(id),
                                       start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                       end_time TIMESTAMP,
                                       PRIMARY KEY (session_id));