// Switch to the todo-app database
use('todo-app');

// Show all collections
print('\nCollections:');
show collections;

// Show all users
print('\nUsers:');
db.users.find().pretty();

// Show all task lists
print('\nTask Lists:');
db.tasklists.find().pretty();
