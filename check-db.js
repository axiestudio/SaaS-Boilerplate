const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log('No DATABASE_URL found');
  process.exit(1);
}

const client = postgres(connectionString);

async function checkChatInterfaces() {
  try {
    const result = await client`SELECT id, name, slug, api_endpoint FROM chat_interface ORDER BY created_at DESC LIMIT 5`;
    console.log('Recent chat interfaces:');
    result.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Slug: ${row.slug}, API: ${row.api_endpoint}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkChatInterfaces();
