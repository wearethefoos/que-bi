import { Pool } from "pg";

const pgPool = () => {
  return new Pool({
    connectionString:
      process.env.READ_DATABASE_URL || "read_database_url_not_set",
    ssl: { rejectUnauthorized: false },
  });
};

export default pgPool;
