# Student Task Management

## Current Tasks

- Initially presented as a single stream of all tasks for all sections
- Filtering available by section, due dates, and task status
- Task details can be opened by clicking the task in the Current Tasks list
- Once a task is completed, the task is removed from the Current Tasks list and moved to the Past Tasks (Portfolio) section

## To Do List

- Student created list of items to do
- Due dates optionally set by students
- When completed, To Do items move to the Completed Items seciton
- Clearing completed items occurs one at a time or thourgh the Clear All button

## Past Tasks

- Summary of all completed and rated tasks for a given section
- Specifies the number of skills associated with a given task and how many were rated on and below the current level for that skill

## Submitting a Task

- After opening a task, students can view all relvant information as well as add links and attachments
- When ready, students submit the task and any associated documents to a teacher for rating

## State flow

```mermaid
graph TD
    VIEW_MAIN[Dashboard View]

    NAV_USER_HASH --> |Browser-driven navigation| ROUTER
    NAV_ROUTER_HASH --> |App-driven navigation| ROUTER

    CTRL_DASH_ROUTER --> |"setStudent(...)"| VIEW_MAIN
    CTRL_DASH_ROUTER --> |"setSection(...)"| VIEW_MAIN

    VIEW_MAIN -.-> |"control: { studentchange }"| CTRL_DASH_CHANGE
    VIEW_MAIN -.-> |"control: { sectionchange }"| CTRL_DASH_CHANGE
    VIEW_MAIN -.-> |"control: { studentchange }"| CTRL_TASKS
    VIEW_MAIN -.-> |"control: { sectionchange }"| CTRL_TASKS
    VIEW_MAIN -.-> |"control: { studentchange }"| CTRL_TODOS
    VIEW_MAIN -.-> |"control: { sectionchange }"| CTRL_TODOS


    subgraph User navigates via browser
        NAV_USER_HASH>Browser Address Bar]
    end

    subgraph User navigates via UI components
        NAV_STUDENT_IN>Student Selector]
        NAV_SECTION_IN>Section Selector]
        CTRL_MAIN_NAV("
            Dashboard Controller
            <code>
                <li>onStudentSelectorSelect</li>
                <li>onStudentSelectorClear</li>
                <li>onSectionSelectorSelect</li>
                <li>onSectionSelectorClear</li>
            </code>
        ")

        NAV_STUDENT_IN -.-> |select| CTRL_MAIN_NAV
        NAV_STUDENT_IN -.-> |clear| CTRL_MAIN_NAV
        NAV_SECTION_IN -.-> |select| CTRL_MAIN_NAV
        NAV_SECTION_IN -.-> |clear| CTRL_MAIN_NAV

        CTRL_MAIN_NAV --> |"redirectTo(...)"| NAV_ROUTER_HASH
    end

    subgraph Route parameters applied to top-level view state
        NAV_ROUTER_HASH>Browser Address Bar]
        ROUTER(Ext.app.route.Router)
        CTRL_DASH_ROUTER("
            Dashboard Controller
            <code>
                <li>showDashboard(studentUsername, sectionCode)</li>
            </code>
        ")

        ROUTER --> |"routes: { ':studentUsername/:sectionCode' }"| CTRL_DASH_ROUTER
    end

    subgraph New state propagates throughout application
        CTRL_TASKS("
            Tasks Controller
            <code>
                <li>onStudentChange</li>
                <li>onSectionChange</li>
            </code>
        ")
        CTRL_TODOS("
            Todos Controller
            <code>
                <li>onStudentChange</li>
                <li>onSectionChange</li>
            </code>
        ")
        STORE_TASKS((Tasks Store))
        STORE_TODOS((Todos Store))
        VIEW_TASKS[Tasks View]
        VIEW_TODOS[Todos View]

        CTRL_TASKS --> |"setReadOnly(...)"| VIEW_TASKS
        CTRL_TASKS --> |"setStudent(...)"| STORE_TASKS
        CTRL_TASKS --> |"setSection(...)"| STORE_TASKS

        CTRL_TODOS --> |"setReadOnly(...)"| VIEW_TODOS
        CTRL_TODOS --> |"setStudent(...)"| STORE_TODOS
        CTRL_TODOS --> |"setSection(...)"| STORE_TODOS

        STORE_TASKS -.-> |data events| VIEW_TASKS
        STORE_TODOS -.-> |data events| VIEW_TODOS

        VIEW_TASKS -.-> |User Intents| CTRL_TASKS
        VIEW_TODOS -.-> |User Intents| CTRL_TODOS
    end

    subgraph New state reflected back to all navigation UI
        CTRL_DASH_CHANGE("
            Dashboard Controller
            <code>
                <li>onStudentChange</li>
                <li>onSectionChange</li>
            </code>
        ")
        NAV_STUDENT_OUT>Student Selector]
        NAV_SECTION_OUT>Section Selector]

        CTRL_DASH_CHANGE --> |"setValue(...)"| NAV_STUDENT_OUT
        CTRL_DASH_CHANGE --> |"setValue(...)"| NAV_SECTION_OUT
    end
```
