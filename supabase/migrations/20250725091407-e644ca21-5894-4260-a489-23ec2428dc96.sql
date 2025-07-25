-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Enable pg_cron extension as well (often needed together with pg_net)
CREATE EXTENSION IF NOT EXISTS pg_cron;