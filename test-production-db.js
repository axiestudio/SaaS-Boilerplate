const { Client } = require('pg');

async function testProductionDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to production database');

    // Check current chat interfaces
    const result = await client.query(`
      SELECT id, slug, name, is_active, created_at 
      FROM chat_interface 
      ORDER BY created_at DESC;
    `);
    
    console.log(`\n📊 Found ${result.rows.length} chat interfaces in production:`);
    result.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ID: ${row.id}, Slug: "${row.slug}", Name: "${row.name}", Active: ${row.is_active}`);
    });

    // If no interfaces exist, create a test one
    if (result.rows.length === 0) {
      console.log('\n🔧 Creating test chat interface "gregre"...');
      
      const insertResult = await client.query(`
        INSERT INTO chat_interface (
          owner_id, slug, name, api_endpoint, api_key, brand_name, 
          logo_url, primary_color, secondary_color, welcome_message, 
          placeholder_text, is_active, font_family, text_color, 
          bot_message_color, user_message_color
        ) VALUES (
          'user_test', 'gregre', 'afwgre', 'https://api.example.com/chat', 
          'test-api-key', 'gregre', '', '#3B82F6', '#F3F4F6', 
          'Hello! How can I help you today?', 'Type your message...', 
          true, 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '#1F2937', '#F9FAFB', '#3B82F6'
        ) RETURNING id, slug, name;
      `);
      
      console.log('✅ Created test chat interface:', insertResult.rows[0]);
    }

    await client.end();
    console.log('\n🎉 Production database test completed!');
  } catch (error) {
    console.error('❌ Production database test failed:', error);
    process.exit(1);
  }
}

testProductionDB();
