
exports.seed = function(knex, Promise) {

  var rows = [
    {
      names: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '$2y$12$qegVDSAFqFv0RN6.idKn1eJBg/qQEg6XqWSoUSlwvPwLu1MLH13Se'
    },
    {
      names: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      password: '$2y$12$uvvodsw8toB.7KKd3vFX9.nk7xg1AyNi1RCDeiRPuFYFWTDzkJVl'
    }
  ];
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(rows).into('users');
    });
};
