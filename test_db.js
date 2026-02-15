const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres:PtaFAnFsOcC1BUW2@db.dukfttwekqagemljtzly.supabase.co:5432/postgres",
});
client.connect()
  .then(() => {
    console.log('Connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    process.exit(1);
  });
