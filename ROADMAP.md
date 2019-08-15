# Code Roadmap

## Best Practices

- Use `select`/`clear` events instead of `change` to monitor navigation combos for route updates -- they only fire in response to direct user input
- Ensure blank components aren't appended to paths
- Use apply->update config flow for subcomponents

## Current release

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
  - [X] Implement edit
  - [X] Implement delete
  - [X] Ensure that when editing a demonstration to remove all skill ratings within a given competency, that competency is updated via affected
  - [X] Fix empty student columns remaining after switching cohorts
  - [X] Audit requires and inheritance chain
  - [X] Purge old classes
  - [ ] Update skill window after demonstration save (#433)
    - Handle overrides too -- monitor StudentCompetency store for updates?
  - [ ] When editing a demonstration, current level is shown behind raters rather than rated level-s (#434)
  - [ ] Add student selector to teacher version of skill window (#427)
  - [ ] Review required fields and server-driven enforcement in UI (#435)
  - [ ] Fix showing "select student" text when log demo window is re-opened with existing panels (#438)
  - [ ] Fix condition where value / valueSkillsMap gets out of sync when continuing to second student (#439)
  - [ ] Improve confirmation text when deleting an override (#436)
  - [ ] Show placeholder when no cells are enrolled (#437)
- [ ] Restore task creation in SlateTasksTeacher
  - [X] Use /bootstrap call to get server-provided task defaults like "Studio"
  - [X] Fully reset assignees/skills via model load when re-opening create form
  - [X] Implement task cloning via clonable option of data fields
  - [X] Warn before overwriting dirty form with cloned data
  - [X] Restore live-updating of grid
  - [X] Update grid correctly when new task has a parent task that may or may not have already had child tasks
  - [ ] Audit requires and inheritance chain
  - [ ] Review old tasks controller for any unimplemented workflows and stash/tag
- [ ] Reuse windows, split default/instantiated/per-show config like SDT.Demonstrations controller does (#441)
- [ ] Restore building/loading of SlateTasksManager (#440)

- [ ] Investigate baselines getting `NULL`d out: https://github.com/SlateFoundation/slate-fixtures/commit/74b14c13b783afed59463e90fb4770ae67f6745c

- [X] Merge Ext JS code generator upstream
  - [ ] Write forum post documenting
- [X] Merge JSON override upstream
  - [X] add HTTP header support
  - [ ] write forum post documenting $profile option
  - [ ] Add `<debug> ... </debug>`-wrapped support to emergence-apikit to report on requests in console
- [ ] Review and update exports as needed
- [ ] Review TODO notes and comments; fix things or turn into issues
- [ ] Purge sass folders

- [X] Fix error message when saving null DemonstrationLevel
- [X] Don't save null demonstration level when removing a rating, exclude from list
- [X] Need to add added skills to value array so they can be saved without being rated
- [X] Need a way to remove disabled raters
- [ ] Warn if trying to close demo or task form with unsaved changes
- [X] Update student header links between apps
- [~] Improve changes detection on complex models with writable dynamic fields
  - Already done for Attachments and DemonstrationSkills
- [ ] Move saveWindow code to local member like openWindow code as in STS.Tasks controller
- [~] Move action button state management into form class
  - Already done for StudentTaskForm

## Next release

- [ ] Audit reflows
  - use loglayouts/breakonlayouts from DeveloperTools controller
- [ ] Create and apply checklist for reviewing:
  - Controllers
  - Views
  - Stores
  - Models
  - Fields
- [ ] Rename TaskStatus field to Status
- [ ] Change re-submitted and re-assigned to resubmitted and reassigned
- [ ] Handle editing overrides better
- [ ] Expand current content area by default when demo window opened
- [ ] Reorganize slate-cbl package
  - [ ] Merge things to slate-core-data and slate-ui-classic
  - [ ] Move widget.* fields to field.*
- [ ] Ryon: Stop components like SkillsList from picking up cbl coloring classes from the unscoped styles of unrelated components like ProgressGrid
- [ ] Merge slate-cbl-admin and repair
- [ ] Restore google drive integration
- [ ] Refactor TargetLevel -> Level and DemonstratedLevel -> Rating
- [ ] Remove hardcoded subtraction of 8 to go from grade to level
- [ ] Eliminate `Slate.cbl.widget.*` namespace, all classes should be `view.*` or `field.*`
- [ ] Move common store constructor->dirty=true, loadIfDirty, unload methods to lazydata package, override loadIfDirty where needed
- [ ] Move param configs from stores to proxies where both are in slate-cbl package already
- [ ] Re-implement `slate-theme` extending `theme-triton` and strip images
- [ ] Re-implement SlateDemonstrationsTeacher.view.ProgressGrid as an Aggregrid
- [ ] Create a central singleton in slate-cbl package for storing a ratingTpl template and getRatingCls function, use in all apps for student-skill-demo cells.
  - [ ] Park other global rating configuration here.
  - [X] Create another such class for levels config.
- [ ] Rename TaskStatus column to Status
- [X] Migrate all local _getRequested* methods to standard RecordsRequestHandler methods
- [ ] Upgrade package format for `slate-cbl` to purge `.sencha` tree
