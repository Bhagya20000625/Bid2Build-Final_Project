require('dotenv').config();
const { pool } = require('./config/database');

async function analyzeDatabase() {
  try {
    console.log('🔍 ANALYZING CURRENT DATABASE STRUCTURE\n');
    console.log('='.repeat(70));

    // Get all tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`\n📊 Total Tables: ${tables.length}\n`);

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      
      // Get table structure
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      
      // Get row count
      const [countResult] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      const rowCount = countResult[0].count;
      
      // Get storage engine
      const [engineResult] = await pool.query(
        `SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [process.env.DB_NAME, tableName]
      );
      const engine = engineResult[0]?.ENGINE || 'Unknown';

      console.log(`\n📋 Table: ${tableName}`);
      console.log(`   Engine: ${engine} | Rows: ${rowCount}`);
      console.log('   Columns:');
      columns.forEach(col => {
        console.log(`     - ${col.Field}: ${col.Type}${col.Null === 'NO' ? ' NOT NULL' : ''}${col.Key ? ` [${col.Key}]` : ''}`);
      });

      // Get foreign keys
      const [foreignKeys] = await pool.query(`
        SELECT 
          CONSTRAINT_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ? 
          AND TABLE_NAME = ?
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [process.env.DB_NAME, tableName]);

      if (foreignKeys.length > 0) {
        console.log('   Foreign Keys:');
        foreignKeys.forEach(fk => {
          console.log(`     - ${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Analysis Complete!\n');

    // Check for users table specifically
    console.log('👤 USERS TABLE ANALYSIS:');
    const [users] = await pool.query('SELECT * FROM users LIMIT 1');
    if (users.length > 0) {
      console.log('   Current user columns:', Object.keys(users[0]).join(', '));
    }

    // Check if reviews-related columns/tables exist
    console.log('\n⭐ REVIEW SYSTEM CHECK:');
    const reviewsTableExists = tables.some(t => Object.values(t)[0] === 'reviews');
    console.log(`   Reviews table exists: ${reviewsTableExists ? '✅' : '❌'}`);
    
    const [userColumns] = await pool.query(`DESCRIBE users`);
    const hasProfilePicture = userColumns.some(col => col.Field === 'profile_picture');
    const hasBio = userColumns.some(col => col.Field === 'bio');
    const hasAverageRating = userColumns.some(col => col.Field === 'average_rating');
    
    console.log(`   Users.profile_picture exists: ${hasProfilePicture ? '✅' : '❌'}`);
    console.log(`   Users.bio exists: ${hasBio ? '✅' : '❌'}`);
    console.log(`   Users.average_rating exists: ${hasAverageRating ? '✅' : '❌'}`);

    // Check for portfolio table
    console.log('\n📁 PORTFOLIO SYSTEM CHECK:');
    const portfolioTableExists = tables.some(t => Object.values(t)[0] === 'portfolio_projects');
    console.log(`   Portfolio_projects table exists: ${portfolioTableExists ? '✅' : '❌'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

analyzeDatabase();
