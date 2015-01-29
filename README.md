# myCal
A REST API to manage calendar events.
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
  - start: a time in hh:mm format (on a 24-hour clock).
  - end: a time in hh:mm format (on a 24-hour clock).
  - date: a date in mm-dd-yyyy format.
  - location: a location (less than 100 characters).
- example: `curl --data "start=08:00"`
