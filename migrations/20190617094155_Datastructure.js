
exports.up = function(knex, Promise) {
  return knex
        .schema
        .createTable('users',function(table) {
            table.increments( 'id' ).primary();
            table.string( 'names' ,60);
            table.string( 'email' ,60).unique();
            table.string( 'password' ,60);
            table.timestamps( true, true);
        })
};

exports.down = function(knex, Promise) {
    return knex
        .schema
        .dropTableIfExists( 'users' );
};
