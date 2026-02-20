require('dotenv').config();
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runPortfolioMigration() {
  let connection;
  
  try {
    console.log('🚀 Starting Portfolio Table Migration...\n');
    console.log('='.repeat(70));

    // Get connection
    connection = await pool.getConnection();

    // Read SQL file
    const sqlPath = path.join(__dirname, 'migrations', 'create_portfolio_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL file loaded successfully');
    console.log('📊 Executing migration...\n');

    // Remove comments and split by semicolon
    const cleanSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        if (statement.toLowerCase().includes('select') && statement.toLowerCase().includes('status')) {
          const [result] = await connection.query(statement);
          console.log(`✅ ${result[0]?.status || 'Query executed'}`);
        } else {
          await connection.query(statement);
          if (statement.toLowerCase().includes('drop table')) {
            console.log('✅ Dropped existing table (if existed)');
          } else if (statement.toLowerCase().includes('create table')) {
            console.log('✅ Created portfolio_projects table');
          } else if (statement.toLowerCase().includes('alter table')) {
            console.log('✅ Added table comment');
          }
        }
      } catch (err) {
        // Ignore "table doesn't exist" errors on DROP
        if (err.code !== 'ER_BAD_TABLE_ERROR') {
          throw err;
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!\n');

    // Verify table creation
    console.log('🔍 Verifying table structure...\n');

    const [columns] = await connection.query('DESCRIBE portfolio_projects');
    console.log('📋 Portfolio Projects Table Columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}${col.Null === 'NO' ? ' NOT NULL' : ''}${col.Key ? ` [${col.Key}]` : ''}`);
    });

    // Check indexes
    const [indexes] = await connection.query('SHOW INDEX FROM portfolio_projects');
    const indexNames = [...new Set(indexes.map(idx => idx.Key_name))];
    console.log(`\n🔑 Indexes created: ${indexNames.length}`);
    indexNames.forEach(name => {
      console.log(`   - ${name}`);
    });

    // Check foreign keys
    const [foreignKeys] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'portfolio_projects'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [process.env.DB_NAME]);

    console.log(`\n🔗 Foreign Keys: ${foreignKeys.length}`);
    foreignKeys.forEach(fk => {
      console.log(`   - ${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
    });

    // Count total tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📊 Total database tables: ${tables.length}`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ All checks passed! Portfolio system is ready!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

runPortfolioMigration();
