const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

/**
 * Migration runner script for Bid2Build admin system
 * Runs SQL migration files in the migrations directory
 * 
 * Usage: node scripts/runMigrations.js
 */

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');

    // List of migration files to run in order
    const migrations = [
      'create_admin_tables.sql',
      'update_users_for_admin.sql'
    ];

    for (const migrationFile of migrations) {
      const filePath = path.join(__dirname, '..', 'migrations', migrationFile);
      
      console.log(`📄 Running migration: ${migrationFile}`);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Migration file not found: ${migrationFile}`);
        continue;
      }

      // Read the SQL file
      const sql = fs.readFileSync(filePath, 'utf8');

      // Split SQL by semicolons and filter out empty statements
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const [result] = await pool.execute(statement);
            if (result && result.length > 0 && result[0].message) {
              console.log(`   ✅ ${result[0].message}`);
            }
          } catch (error) {
            // Ignore "table already exists" errors
            if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
                error.code === 'ER_DUP_FIELDNAME' ||
                error.message.includes('Duplicate column name')) {
              console.log(`   ⚠️  Already exists: ${error.message}`);
            } else {
              throw error;
            }
          }
        }
      }

      console.log(`   ✅ Migration completed: ${migrationFile}`);
    }

    console.log('🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

// Run the migrations
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migration script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };