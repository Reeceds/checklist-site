##### Scripts

`npm run dev`:

-   Runs the 'ts-node src/index.ts' command which runs the project using the TypeScript files without compiling them JavaScript files, good for development.

`npm run build`:

-   Runs the 'tsc' command which compiles the TypeScript files into JavaScript files and stores them in the 'dist' folder. 'dist' is the specified value of "outDir" in the 'tsconfig.json' file. Used to build the project ready for production.

`npm start`:

-   Runs 'node dist/index.js' which wuns the project using the compiled index.js JavaScript file output from the build command.

##### Docker

# Commands

`docker compose up -d mysql`:

-   Create/start docker MySQL container witht this command.
-   Run this command in the same directory as the 'docker-compose.yml' file.
-   If no container exists then this creates one, if one already exists but has been stopped, then this starts it.
-   The "mysql" part of the command refers to the service set in the 'docker-compose.yml' file i.e.
    services:
    mysql: ✅ (this line)
    image: mysql:8.0

`docker compose down -v`

-   stops/removes all containers created by 'docker compose up' and deletes the database data.
-   Run this command in the same directory as the 'docker-compose.yml' file.

##### MySQL - MySQL VSCode extension db connection

# Add new connection

-   Host: 127.0.0.1 for API running locally, "mysql" for API running in Docker.
-   Port: 3307 or 'MYSQL_PORT' value set in 'docker-compose.yml' / '.env'.
-   Username: MySQL account username.
-   Password: 'MYSQL_PASSWORD' value set in 'docker-compose.yml' / '.env'.
-   Database: 'MYSQL_DATABASE' value set in 'docker-compose.yml' / '.env'.
