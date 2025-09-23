const { Client } = require('pg');

async function fixDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add the missing columns
    const alterQueries = [
      `ALTER TABLE chat_interface ADD COLUMN IF NOT EXISTS font_family text DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' NOT NULL;`,
      `ALTER TABLE chat_interface ADD COLUMN IF NOT EXISTS text_color text DEFAULT '#1F2937' NOT NULL;`,
      `ALTER TABLE chat_interface ADD COLUMN IF NOT EXISTS bot_message_color text DEFAULT '#F9FAFB' NOT NULL;`,
      `ALTER TABLE chat_interface ADD COLUMN IF NOT EXISTS user_message_color text DEFAULT '#3B82F6' NOT NULL;`
    ];

    for (const query of alterQueries) {
      try {
        await client.query(query);
        console.log('✅ Added column:', query.split('ADD COLUMN IF NOT EXISTS ')[1].split(' ')[0]);
      } catch (error) {
        console.log('⚠️  Column might already exist:', error.message);
      }
    }

    // Test the table structure
    const result = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'chat_interface' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Current table structure:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'none'})`);
    });

    await client.end();
    console.log('\n🎉 Database fix completed!');
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    process.exit(1);
  }
}

fixDatabase();
