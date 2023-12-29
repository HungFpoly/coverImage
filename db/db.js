const { Pool } = require('pg');

const pool = new Pool({
  user: 'converimagedb_user',
  host: 'dpg-cm73mlocmk4c738rih20-a.singapore-postgres.render.com',
  database: 'converimagedb',
  password: 'HP4EWDBbcQPh6NaGzvH5oxe3PvHGfFnd',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Bạn có thể cần cấu hình phù hợp với môi trường sản xuất
  },
});

module.exports = pool;
// postgres://converimagedb_user:HP4EWDBbcQPh6NaGzvH5oxe3PvHGfFnd@dpg-cm73mlocmk4c738rih20-a/converimagedb