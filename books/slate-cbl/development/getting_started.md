# Getting Started with Development

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

1. Launch habitat studio

    On Linux, just run:

    ```bash
    hab studio enter
    ```

    On Mac or Windows, prefix this command with additional options to expose the development web server outside the studio:

    ```bash
    HAB_DOCKER_OPTS="-p 3901:3901" hab studio enter
    ```

Read the notes printed to your terminal at the end of the studio startup process for instructions on how to access applications in your browser and on what commands are available.

## Client-side UI application documentation

View the latest docs online at [http://slatefoundation.github.io/slate-cbl/](http://slatefoundation.github.io/slate-cbl/)

To update these docs, run `build.sh` and then `publish.sh` within `sencha-workspace/docs`

## Connecting to a server

You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.
