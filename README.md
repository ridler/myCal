# myCal
A REST service to manage calendar events.

## User Guide
### Setup
Use `npm install` to aquire dependencies.
Run `npm start` to start the application.

### Testing
Run `NODE_ENV=test npm start` to start the server.
Then run `node_modules/mocha/bin/mocha` to run the tests`

## API
### POST
#### `/api/1.0/users/new` - Create a new user.
- data: username = a string of two or more characters.
- example: `curl --data "username=beyonce" http://localhost:3000/api/1.0/users/new`
- response: a JSON status indicator like `{"status":<type>}` with the following types:
  - *success*: your new user was successfully created.
  - *tryAgain*: your username has been taken.  Try a different one.
  - *badRequest*: your username is too short or not a good username.
  - *error*: there was an internal error in the application or database.  Sorry.

### `/api/1.0/:user/event` - Create a new event.
- data:
  - name: a string to name the event (less than 50 characters).
  - start: a time in hh:mm format (on a 24-hour clock).
  - end: a time in hh:mm format (on a 24-hour clock).
  - date: a date in mm-dd-yyyy format.
  - location: a location (less than 100 characters).
- example: `curl --data "start=08:00&end=15:00&location=ECCR200&date=01-30-2014&name=Surfboard" http://localhost:3000/api/1.0/beyonce/event`
- response: a JSON status indicator like `{"status":<type>}` with the following types:
  - *success*: the event was successfully created.
  - *bad<Data>Format*: the <data> type you provided does not meet the above criteria for <data>.
  - *badUsername*: the user does not exist.
  - *error*: there was an internal error in the application or database.  Sorry.

### GET
#### `/api/1.0/users` - Get a list of all users.
This endpoint simply returns a list of all the users in JSON format.

#### `/api/1.0/:user/events` - Get a list of a user's events.
This endpoint simply returns a list of all the events for the given user in JSON format.

### PUT
#### `/api/1.0/user/edit` - Edit a user's username
- data: newname = a new username (two or more characters).


### DELETE
#### `/api/1.0/user/remove` - Delete a user
This endpoint will delete a user, but not their events.
