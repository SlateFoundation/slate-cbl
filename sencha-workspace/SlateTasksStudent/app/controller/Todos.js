/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SlateTasksStudent.controller.Todos', {
    extend: 'Ext.app.Controller',
    requires: [
    ],


    // entry points
    control: {
        'slatetasksstudent-todolist': {
            render: 'onTodosListRender'
        }
    },

    listen: {
        store: {
            '#Todos': {
                load: 'onTodosStoreLoad'
            }
        }
    },


    // controller configuration
    views: [
        'TodoList'
    ],

    stores: [
        'Todos'
    ],

    refs: {
    },


    // event handlers
    onTodosListRender: function() {
        console.log('onTodosListRender');
        this.getTodosStore().load();
    },

    onTodosStoreLoad: function(store) {
        console.log(store.getRange());
        store.each(function(rec) {
            console.log(rec.Todos().getRange());
        });
    }

    // custom controller methods

});
