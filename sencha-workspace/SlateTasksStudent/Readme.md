# SlateTasksStudent

## Getting started with development

- `sencha app build development`
- `sencha app refresh`

## Application Lifecycles

### State flow

```mermaid
graph TD
    NAV_HASH_IN>Browser URL]
    NAV_SELECTORS_IN>Selection Menus]
    NAV_HASH_OUT>Browser URL]
    NAV_SELECTORS_OUT>Selection Menus]

    CONTROLLER_MAIN_IN(Dashboard Controller)
    CONTROLLER_MAIN_OUT(Dashboard Controller)
    CONTROLLER_TASKS(Tasks Controller)
    CONTROLLER_TODOS(Todos Controller)

    STORE_TASKS((Tasks Store))
    STORE_TODOS((Todos Store))

    VIEW_MAIN[Dashboard View]
    VIEW_TASKS[Tasks View]
    VIEW_TODOS[Todos View]

    subgraph User Navigation
        NAV_HASH_IN -.-> |Browser Navigation| CONTROLLER_MAIN_IN
        NAV_SELECTORS_IN -.-> |User Intents| CONTROLLER_MAIN_IN
    end

    subgraph State transition
        CONTROLLER_MAIN_IN --> |"setStudent()"| VIEW_MAIN
        CONTROLLER_MAIN_IN --> |"setSection()"| VIEW_MAIN
    end

    subgraph State propagation
        VIEW_MAIN -.-> |studentchange| CONTROLLER_MAIN_OUT
        VIEW_MAIN -.-> |sectionchange| CONTROLLER_MAIN_OUT
        VIEW_MAIN -.-> |studentchange| CONTROLLER_TASKS
        VIEW_MAIN -.-> |sectionchange| CONTROLLER_TASKS
        VIEW_MAIN -.-> |sectionchange| CONTROLLER_TODOS
        VIEW_MAIN -.-> |sectionchange| CONTROLLER_TODOS

        CONTROLLER_MAIN_OUT --> |"redirectTo(...)"| NAV_HASH_OUT
        CONTROLLER_MAIN_OUT --> |"setValue(...)"| NAV_SELECTORS_OUT

        CONTROLLER_TASKS --> |"setReadOnly(...)"| VIEW_TASKS
        CONTROLLER_TASKS --> |"setStudent(...)"| STORE_TASKS
        CONTROLLER_TASKS --> |"setSection(...)"| STORE_TASKS

        CONTROLLER_TODOS --> |"setReadOnly(...)"| VIEW_TODOS
        CONTROLLER_TODOS --> |"setStudent(...)"| STORE_TODOS
        CONTROLLER_TODOS --> |"setSection(...)"| STORE_TODOS

        STORE_TASKS -.-> |data events| VIEW_TASKS
        STORE_TODOS -.-> |data events| VIEW_TODOS

        VIEW_TASKS -.-> |User Intents| CONTROLLER_TASKS
        VIEW_TODOS -.-> |User Intents| CONTROLLER_TODOS
    end
```


## TODO

- [ ] Review and optimized task detail methods and views
- [ ] Refactor task/todo models and eliminate use of associations in favor of top-level fields so that views can monitor store events for changes and controllers never call `view.refresh()` manually after changes