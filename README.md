## App versions

Angular CLI: 19.0.0
Node: 22.17.1
Package Manager: npm 10.9.2

## Deployment notes

-   Client: Run `ng build` and delpoy as static site to Render.com
-   API: Dockerized and deployed as docker container to Render.com (After committing and pushing any changes to GitHub, this should cause auto redeploy to in render).
-   Postgres: Hosted using Supabase.com

#### When pulling the GitHub repo and running this on a different machine, add these files

-   '.env' file will need to be added to the projects root directory:
    checklist-site/
    └─ .env

-   'ssl' folder containing files 'localhost-key.pem' & 'localhost.pem' will need to be added to the root of the 'API' directory:
    checklist-site/
    ├─ API/
    │ ├─ ssl/
    │ │ └─ localhost-key.pem
    │ │ └─ localhost.pem

#### Run the full application container in Docker with hot reload (DEV MODE)

-   Run `docker compose up --watch`. (This uses 'docker-compose.override.yml' which is made for DEV)

#### Run the full application container in Docker (PROD MODE)

-   Run `docker compose up` Starts containers using the existing images (already built on your machine) or builds them if they do not exist. (This uses 'docker-compose.yml' which is made for PROD)
-   Run `docker compose up --build` Forces a rebuild of all images before starting the containers. (This uses 'docker-compose.yml' which is made for PROD)

#### Stop the full application container in Docker

-   Run `docker compose down` (This removes the contaieners for a clean start but keeps and database data).
-   Run `docker compose down --volumes` (This removes the contaieners and resets all data including database).
-   OR Run `docker compose down --volumes --remove-orphans` (This does the same as the above and also removes any leftover containers).

#### Run API/Client locally in Dev mode and the Postgres database in docker

-   Start the docker databse container or create it by running `docker compose up -d postgres`.
-   Switch the .env variable `NODE_ENV=production` to `NODE_ENV=development`.
-   Switch the .env variable `POSTGRES_HOST=postgres` to `POSTGRES_HOST=127.0.0.1`.
-   Run the command `npm run dev` in the API directory to start the API server.
-   Run the command `ng serve` in the Client directory to start the API server.

## Technical applications

-   @Output() and EventEmitter which allows a reusable child component to submit and input value and retrieve this on the parent component
-   Toastr service to display alerts when e.g. data is sumitted successfully or alert an error.
-   EventTriggerService. This allows one component to trigger an action in a different unrelated (none parent/child) component.
-   Google OAuth (authentication).
-   JWT interceptor for access/refresh tokens.
-   CanComponentDeactivate routeguard which is triggered when a user attempts to navigate to a different route without saving checklist item changes. Includes files: can-component-deactivate.interface.ts, pending-changes.guard.ts, app.routes.ts, checklist-page.component.ts
