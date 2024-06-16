# Requirements

To build a movie ticket booking system(with the givend database(movies.db)). This system will allow users to book tickets for movies and administrators to perform a few basic management tasks.

## Migration requirements

- Create Screenings table
  - screening_time, number of tickets, number of tickets left
- Create Tickets table
- Manage relationships between tables
  - screening.id - movie.id(one to one)
  - tickets.id > screening.id(many to one)
  - tickets.id > user.id(many to one)

## API requirements

- screenings
  - POST : /screenings
    - body : timestamp, allocated number of tickets
  - GET : /screenings
    - get a list of screenings available for booking with movie data for each screening
- movies
  - GET : /movies?id=1,2,3
- tickets
  - GET : /tickets?userId=100
  - POST : /tickets
    - body: user id, screening id

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
