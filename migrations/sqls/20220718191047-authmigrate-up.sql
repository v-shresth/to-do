/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     user_name TEXT NOT NULL,
                                     email TEXT NOT NULL,
                                     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                     updated_at TIMESTAMP WITH TIME ZONE  ,
                                     archived_at TIMESTAMP WITH TIME ZONE

) ;

-- ALTER TABLE IF EXISTS work ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id),
--    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE ,
--    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE ;add