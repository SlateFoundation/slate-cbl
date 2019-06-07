# Getting Started with Development

## Launch local development studio

1. Install habitat

    ```bash
    curl -s https://raw.githubusercontent.com/habitat-sh/habitat/master/components/hab/install.sh | sudo bash
    ```

1. Set up habitat

    When prompted, enter `slate` as your default origin and choose yes to generate a key

    ```bash
    hab setup
    ```

1. Clone `slate-cbl` repository and all submodules

    ```bash
    git clone --recursive -b develop git@github.com:SlateFoundation/slate-cbl.git
    ```

1. Change into cloned `slate-cbl` directory

    ```bash
    cd ./slate-cbl
    ```

1. Ensure repository and all submodules are initialized and up-to-date

    ```bash
    ./pull
    ```

1. Launch Habitat studio

    If you're working in *Visual Studio Code*, just run the task `studio:launch` to open a configured and persistent studio. Otherwise you'll need to launch a Habitat studio manually from a terminal.

    On Linux, just run:

    ```bash
    hab studio enter
    ```

    On Mac or Windows, prefix this command with additional options to expose the development web server outside the studio:

    ```bash
    HAB_DOCKER_OPTS="-p 7080:7080 -p 7081:7081 -p 3306:3306" hab studio enter
    ```

    Review the notes printed to your terminal at the end of the studio startup process for a list of all available studio commands.

## Bootstrap and develop backend

1. Start environment services

    Use the studio command `start-all` to launch the http server (nginx), the application runtime (php-fpm), and a local mysql server:

    ```bash
    start-all
    ```

    At this point, you should be able to open [localhost:7080](http://localhost:7080) and see the error message `Page not found`.

1. Build environment

    To build the entire environment and load it, use the studio command `update-site`:

    ```bash
    update-site
    ```

    At this point, [localhost:7080](http://localhost:7080) should display the current build of the site

1. Load fixture data into site database (optional)

    ```bash
    # clone fixture branch into git-ignored .data/ directory
    git clone -b cbl/competencies https://github.com/SlateFoundation/slate-fixtures.git .data/fixtures

    # load all .sql files from fixture
    cat .data/fixtures/*.sql | load-sql -
    ```

    The standard fixture data includes the following users, all with passwords matching their usernames:

    - `system`
    - `admin`
    - `teacher`
    - `student`
    - `teacher2`
    - `student2`

1. Enable user registration form (optional)

    ```bash
    # write class configuring enabling registration
    mkdir -p php-config/Emergence/People
    echo '<?php Emergence\People\RegistrationRequestHandler::$enableRegistration = true;' > php-config/Emergence/People/RegistrationRequestHandler.config.php

    # rebuild environment
    update-site
    ```

    After visiting [`/register`](http://localhost:7080/register) and creating a new user account, you can use the studio command `promote-user` to upgrade the user account you just registered to the highest access level:

    ```bash
    promote-user <myuser>
    ```

After editing code in the working tree, run the studio command `update-site` to rebuild and update the environment. A `watch-site` command is also available to automatically rebuild and update the environment as changes are made to the working tree.

## Bootstrap and develop frontend apps

Each frontend Sencha application needs to be built at least once with the Sencha CMD build tool to scaffold/update a set of loader files. After that, you can just edit files the working tree and reload the browser. The two exceptions where you need to build again are changing the list of packages or changing the list of override files.

There is a shortcut studio command for building each frontend application:

- `build-enroll-admin`
- `build-demos-teacher`
- `build-demos-student`
- `build-tasks-manager`
- `build-tasks-teacher`
- `build-tasks-student`

Once built, the live-editable version of each app can be accessed via the static web server that the studio runs on port `7081`. The backend host must be provided to the apps via the `?apiHost` query parameter. Any remote backend with CORS enabled will work, or you can use the local backend:

- [`localhost:7081/SlateStudentCompetenciesAdmin/?apiHost=localhost:7080`](http://localhost:7081/SlateStudentCompetenciesAdmin/?apiHost=localhost:7080)
- [`localhost:7081/SlateDemonstrationsTeacher/?apiHost=localhost:7080`](http://localhost:7081/SlateDemonstrationsTeacher/?apiHost=localhost:7080)
- [`localhost:7081/SlateDemonstrationsStudent/?apiHost=localhost:7080`](http://localhost:7081/SlateDemonstrationsStudent/?apiHost=localhost:7080)
- [`localhost:7081/SlateTasksManager/?apiHost=localhost:7080`](http://localhost:7081/SlateTasksManager/?apiHost=localhost:7080)
- [`localhost:7081/SlateTasksTeacher/?apiHost=localhost:7080`](http://localhost:7081/SlateTasksTeacher/?apiHost=localhost:7080)
- [`localhost:7081/SlateTasksStudent/?apiHost=localhost:7080`](http://localhost:7081/SlateTasksStudent/?apiHost=localhost:7080)

## Client-side UI application documentation

View the latest docs online at [http://slatefoundation.github.io/slate-cbl/](http://slatefoundation.github.io/slate-cbl/)

To update these docs, run `build.sh` and then `publish.sh` within `sencha-workspace/docs`

## Connecting to a server

You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.

## Running tests

[Cypress](https://www.cypress.io/) is used to provide browser-level full-stack testing. The `package.json` file at the root of the repository specifies the dependencies for running the test suite and all the configuration/tests for Cypress are container in the `cypress/` tree at the root of the repository.

To get started, from the root of the repository:

```bash
# install development tooling locally
npm install

# launch cypress app
npm run cypress:open
```
