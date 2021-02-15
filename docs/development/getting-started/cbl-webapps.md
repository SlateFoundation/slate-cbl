# CBL webapps

Each frontend Sencha application needs to be built at least once with the Sencha CMD build tool to scaffold/update a set of loader files. After that, you can just edit files the working tree and reload the browser. The two exceptions where you need to build again are changing the list of packages or changing the list of override files.

There is a shortcut studio command for building each frontend application:

- `build-enroll-admin`
- `build-demos-teacher`
- `build-demos-student`
- `build-tasks-manager`
- `build-tasks-teacher`
- `build-tasks-student`

Once built, the live-editable version of each app can be accessed via the static web server that the studio runs on port `{{ studio.static_port }}`. The backend host must be provided to the apps via the `?apiHost` query parameter. Any remote backend with CORS enabled will work, or you can use the local backend:

- [`localhost:{{ studio.static_port }}/SlateStudentCompetenciesAdmin/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateStudentCompetenciesAdmin/?apiHost=localhost:{{ studio.web_port }})
- [`localhost:{{ studio.static_port }}/SlateDemonstrationsTeacher/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateDemonstrationsTeacher/?apiHost=localhost:{{ studio.web_port }})
- [`localhost:{{ studio.static_port }}/SlateDemonstrationsStudent/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateDemonstrationsStudent/?apiHost=localhost:{{ studio.web_port }})
- [`localhost:{{ studio.static_port }}/SlateTasksManager/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateTasksManager/?apiHost=localhost:{{ studio.web_port }})
- [`localhost:{{ studio.static_port }}/SlateTasksTeacher/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateTasksTeacher/?apiHost=localhost:{{ studio.web_port }})
- [`localhost:{{ studio.static_port }}/SlateTasksStudent/?apiHost=localhost:{{ studio.web_port }}`](http://localhost:{{ studio.static_port }}/SlateTasksStudent/?apiHost=localhost:{{ studio.web_port }})

## Connecting to a server

You can connect to any remote slate-cbl instance that has CORS enabled by appending the query parameter `apiHost` when loading the page. If the remote instance requires HTTPS, append `apiSSL=1` as well.
