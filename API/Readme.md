##### Scripts

`npm run dev`:

-   Runs the 'ts-node src/index.ts' command which runs the project using the TypeScript files without compiling them JavaScript files, good for development.

`npm run build`:

-   Runs the 'tsc' command which compiles the TypeScript files into JavaScript files and stores them in the 'dist' folder. 'dist' is the specified value of "outDir" in the 'tsconfig.json' file. Used to build the project ready for production.

`npm start`:

-   Runs 'node dist/index.js' which wuns the project using the compiled index.js JavaScript file output from the build command.

##### Docker

# Commands

`docker compose up --watch` (use for hotreload on edit)
`docker compose up -d` (create/start docker container without process persisting in terminal)
`docker compose up` (docker process persisting in terminal)

-   Create/start docker container with this command.
-   Run this command in the same directory as the 'docker-compose.yml' file.
-   If no container exists then this creates one, if one already exists but has been stopped, then this starts it.

`docker compose down` (stops all containers created by 'docker compose up' but keeps the data from e.g. database.)
`docker compose down -v` (-v deletes the database data)
`docker compose down --volumes --remove-orphans` (removes all volumes associated with the container)

-   Run this command in the same directory as the 'docker-compose.yml' file.

##### Postgres - Database VSCode extension db connection

# Add new connection

-   Host: 127.0.0.1
-   Port: 3307 or 'POSTGRES_PORT' value set in 'docker-compose.yml' / '.env'.
-   Username: 'POSTGRES_USER' value set in 'docker-compose.yml' / '.env'.
-   Password: 'POSTGRES_PASSWORD' value set in 'docker-compose.yml' / '.env'.
-   Database: 'POSTGRES_DATABASE' value set in 'docker-compose.yml' / '.env'.
