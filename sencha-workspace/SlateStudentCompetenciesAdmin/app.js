/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'SlateStudentCompetenciesAdmin.Application',

    name: 'SlateStudentCompetenciesAdmin',

    requires: [
        // This will automatically load all classes in the SlateStudentCompetenciesAdmin namespace
        // so that application classes do not need to require each other.
        'SlateStudentCompetenciesAdmin.*'
    ],

    // The name of the initial view to create.
    mainView: 'SlateStudentCompetenciesAdmin.view.main.Main'
});
