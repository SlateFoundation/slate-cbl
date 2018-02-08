# slate-cbl

Provides extensions for Slate to implement Competency-Based Learning

See the [slate-cbl-book](https://github.com/SlateFoundation/slate-cbl-book) repository
for full end-user and contributor documentation.

## In this repository

- `sencha-workspace/packages/slate-cbl`: Sencha CMD package containing shared client-side code
- Client-side UI applications:
  - `sencha-workspace/SlateDemonstrationsTeacher`: Demonstrations dashboard for teachers
  - `sencha-workspace/SlateDemonstrationsStudent`: Demonstrations dashboard for students
  - `sencha-workspace/SlateTasksTeacher`: Tasks dashboard for teachers
  - `sencha-workspace/SlateTasksStudent`: Tasks dashboard for students
  - `sencha-workspace/SlateTasksManager`: Tasks library for all staff
- Server-side extensions for slate:
  - `event-handlers/Slate/CBL/`
  - `html-templates/cbl/`
  - `php-classes/Slate/CBL`
  - `php-migrations/Slate/CBL`
  - `site-root/cbl/`
  - `site-root/img/cbl/`

## Technologies used

- [Emergence](http://emergence.sh): Open toolkit for building and running web applications
- [Slate](http://slate.is): Foundational web application for schools
- [Sencha Ext JS 6 Classic](http://docs.sencha.com/extjs/6.2.0/): Web-based UI framework with rich components library
- Sencha CMD 6.x: Build tools for web UI applications built with Sencha Ext JS
- [Habitat](http://habitat.sh): Provides portable and isolated environments for testing and building

## Getting started with client-side UI application development

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

### Client-side UI application documentation

View the latest docs online at [http://slatefoundation.github.io/slate-cbl/](http://slatefoundation.github.io/slate-cbl/)

To update these docs, run `build.sh` and then `publish.sh` within `sencha-workspace/docs`

### Connecting to a server

You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.

## Installing to a `v2.slate.is` server

1. Copy [sample `slate-cbl.php` git config script](https://github.com/SlateFoundation/slate-cbl/blob/releases/v2/php-config/Git.config.d/slate-cbl.php) into site
1. Visit `/site-admin/sources` and initialize the `slate-cbl` source
1. Return to `/site-admin/sources/slate-cbl` and click <kbd>Sync</kbd> → <kbd>Update emergence VFS</kbd> for the `slate-cbl` layer
1. Push sencha builds to instance, logging in with a developer account when prompted: `http://cbl.projects.jarv.us/push-builds?ref=releases/v2&host=SITE_HOSTNAME`
   - Alternatively, builds may be created locally and uploaded to `sencha-build/APP_NAME/production`

## Roadmap

### Current release

- [X] Restore progress loading in SlateDemonstrationsTeacher
  - [X] Re-render on route change
  - [X] Purge references to `completion`
  - [X] review naming of `competencyStudent` objects in light of new `studentCompetency` objects
- [X] Restore opening student-skill details in SlateDemonstrationsTeacher
- [X] Update all loaders
- [X] Update tool URLs in php-config/Slate/UI/Tools.config.d/cbl.php
- [ ] Restore demonstration creation in SlateDemonstrationsTeacher
  - [X] Restore live-updating of grid
  - [X] Prevent dirty state when form isn't changed on edit
  - [X] Fix crash when saving ratings to competencies not loaded in current grid
  - [X] Implement log demo btn within skills window
  - [X] Implement override button
  - [ ] Implement edit
  - [ ] Add student selector to teacher version of skill window
  - [ ] Review required fields and server-driven enforcement in UI
  - [ ] Fix empty student columns remaining after switching cohorts
  - [ ] Fix showing "select student" text when log demo window is re-opened with existing panels
  - [ ] Fix condition where value / valueSkillsMap gets out of sync when continuing to second student
  - [ ] Audit requires and inheritance chain
- [ ] Restore task creation in SlateTasksTeacher
  - [ ] Use /bootstrap call to get server-provided task defaults like "Studio"
  - [ ] Restore live-updating of grid
  - [ ] Audit requires and inheritance chain
- [ ] Reuse windows, split default, instantiated, and per-show config like SDT.Demonstrations controller does
- [ ] Restore building/loading of SlateTasksManager
- [ ] Investigate baselines getting `NULL`d out: https://github.com/SlateFoundation/slate-fixtures/commit/74b14c13b783afed59463e90fb4770ae67f6745c


- [X] Merge Ext JS code generator upstream
  - [ ] Write forum post documenting
- [X] Merge JSON override upstream
  - [X] add HTTP header support
  - [ ] write forum post documenting $profile option
  - [ ] Add `<debug> ... </debug>`-wrapped support to emergence-apikit to report on requests in console
- [ ] Review and update exports as needed

### Next release

- [ ] Expand current content area by default when demo window opened
- [ ] Reorganize slate-cbl package
  - [ ] Merge things to slate-core-data and slate-ui-classic
  - [ ] Move widget.* fields to field.*
- [ ] Ryon: Stop components like SkillsList from picking up cbl coloring classes from the unscoped styles of unrelated components like ProgressGrid
- [ ] Merge slate-cbl-admin and repair
- [ ] Restore google drive integration
- [ ] Refactor TargetLevel -> Level and DemonstratedLevel -> Rating
- [ ] Rename "Skill" to "Standard" ?
- [ ] Remove hardcoded subtraction of 8 to go from grade to level
- [ ] Eliminate `Slate.cbl.widget.*` namespace, all classes should be `view.*` or `field.*`
- [ ] Move common store constructor->dirty=true, loadIfDirty, unload methods to lazydata package, override loadIfDirty where needed
- [ ] Move param configs from stores to proxies where both are in slate-cbl package already
- [ ] Re-implement `slate-theme` extending `theme-triton` and strip images
- [ ] Re-implement SlateDemonstrationsTeacher.view.ProgressGrid as an Aggregrid
- [ ] Create a central singleton in slate-cbl package for storing a ratingTpl template and getRatingCls function, use in all apps for student-skill-demo cells.
  - [ ] Park other global rating configuration here.
  - [ ] Create another such class for levels config.

## Best Practices

- Use `select`/`clear` events instead of `change` to monitor navigation combos for route updates -- they only fire in response to direct user input
- Ensure blank components aren't appended to paths
- Use apply->update config flow for subcomponents