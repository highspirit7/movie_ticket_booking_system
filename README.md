# Requirements

To build a movie ticket booking system(with the givend database(movies.db)). This system will allow users to book tickets for movies and administrators to perform a few basic management tasks.

## Migration requirements

- Create Screenings table
  - screening_time, number of tickets, number of tickets left
- Create Tickets table
- Manage relationships between tables
  - screenings.movie_id - movies.id(many to one)
  - tickets.screening_id > screenings.id(many to one)

## API requirements

- screenings
  - POST : /screenings
    - body : timestamp, allocated number of tickets
  - GET : /screenings
    - get a list of screenings available for booking with movie data for each screening
- movies
  - GET : /movies?id=1,2,3
- tickets
  - GET : /tickets
  - POST : /tickets
    - body: screening id

## Technical requirements

1. You will be provided with an initial starting template. You are free to add more packages.
2. User and administrator inputs should be validated.
3. **Database schema changes must be done using migrations**. You can adapt the provided database schema to match your needs by adding more tables or changing the existing ones.
4. Application code should have unit and integration tests. Shoot for 80% - 95% test coverage.
5. Commits should follow the Conventional Commits standard. Commit early, commit often.

# Command Line Interface

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

Can create migration file with teh following command(Need to enter the name of file as an argument):

```bash
npm run migrate:create
```

Can migrate one step down from the current status by running the command as below:

```bash
npm run migrate:onestepdown
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run gen:types
```
