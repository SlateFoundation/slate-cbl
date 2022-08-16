# Task Manager (Task Library) webapp

## Code layout

- `php-classes/`
    - `Slate/`
        - `CBL/`
            - `Tasks/`
                - `TasksRequestHandler.php`: Request handler for XHR requests made from task manager UI
                - `Task.php`: Active record object that represents Tasks and implements CRUD operations and sorting
- `sencha-workspace/`
    - `SlateTasksManager`
        - `app`
            - `controller`
                - `Tasks.js` : The Tasks controller manages the Task Library UI and implements methods that allow user to browse, create, and edit tasks
            - `store`
                - `Tasks.js` : The Tasks store serves a repository for task data retreived from the server.
            - `view`
                - `Viewport.js` :  A simple frame for the taskmanager app that allows it to fit correctly into the Slate frame.
                - `Viewport.scss` : CSS classes that specify the positioning of the app and the Slate omni bar.
                - `TaskManager.js`: A frame that fits in the Viewport and specifies a border layout for the app header, task grid and details pane.
                - `TaskManager.scss` : A single css class that prevents clipping of the icon on refresh button on the bottom toolbar
                - `AppHeader.js` : The app header contains the "Task Library" title and the add/modify/delete buttons
                - `TaskDetails.js` : The side panel that shows the details of tasks selected in the task grid.
                - `TaskDetails.css` : CSS classes that affect the positioning and style of the details pane within the task manager layout
                - `TaskGrid.js` : The Task grid that displays tasks and allows for sorting, filtering and paging.
    - `packages/`
        - `slate-cbl/`
            - `src`
                - `view`
                    - `tasks`
                        - `TaskForm` : Shareable form for the creating and editing of tasks.

## UI Layout

```
---------------------------------------------
|                                           |
|   App Header                              |
|                                           |
|-------------------------------------------
|                          |                |
|                          |                |
|   Task Grid              |  Task Details  |
|                          |                |
|                          |                |
---------------------------------------------
```

## Running live changes

The frontend Sencha application needs to be built at least once with the Sencha CMD build tool to scaffold/update a set of loader files. After that, you can just edit files the working tree and reload the browser. The two exceptions where you need to build again are changing the list of packages or changing the list of override files.

Before the frontend application can be built to run from live changes, you'll need to ensure all submodules are initialized:

```bash
git submodule update --init
```

To build the frontend application use the shortcut studio command

```bash
build-tasks-manager
```

Once built, the live-editable version of the app can be accessed via the static web server that the studio runs on port `{{ studio.static_port }}`. The backend host must be provided to the apps via the `?apiHost` query parameter. Any remote backend with CORS enabled will work, or you can use the local backend:

[`localhost:{{ studio.static_port }}/SlateTasksManager/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateTasksManager/?apiHost=localhost:{{ studio.web_port }})

## Working with breakpoints

By default, the Sencha framework will automatically append random cache buster values to every loaded `.js` source. This helps ensures that your latest code always runs, but will also prevent any breakpoints you set from persisting across reloads.

With the **Disable cache** option of the network inspector activated, you can disable this built-in cache buster by appending `&cache=1` to the current page's query string.

## Connecting to remote server

You can connect to any remote instance that has CORS enabled by appending a query parameter in the format `?apiHost=https://slate.example.org` when loading the page. A session token may be provided via another query string in the format `&apiToken=abcdef1234567890`
