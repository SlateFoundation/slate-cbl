Ext.define('SlateDemonstrationsTeacher.view.AppHeaderController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.util.History'
    ],

    alias: 'controller.slate-demonstrations-teacher-appheader',

    listen: {
        component: {
            '#studentsSelect': {
                select: 'onStudentSelect'
            },
            '#contentAreaSelect': {
                select: 'onContentAreaSelect'
            }
        }
    },

    onStudentSelect: function(combo, studentGroup) {
        this.redirectTo('student-group='+window.escape(studentGroup.getIdentifier()), false, true);
    },

    onContentAreaSelect: function(combo, contentArea) {
        this.redirectTo('contentarea='+window.escape(contentArea.get('Code')), false, true);
    },

    redirectTo: function(url, force, append) {
        var route = null,
            splitParams = [], params = {},
            i = 0,
            key;

        if (append === true) {
            splitParams = Ext.util.History.getToken().split('&');
            for (; i < splitParams.length; i++) {
                if (splitParams[i].split('=', 1)[0]) {
                    params[splitParams[i].split('=', 1)] = splitParams[i].indexOf('=') > -1 ? splitParams[i].substring(splitParams[i].indexOf('=') + 1) : '';
                }
            }

            splitParams = url.split('&');
            for (i = 0; i < splitParams.length; i++) {
                if (splitParams[i].split('=', 1)[0]) {
                    params[splitParams[i].split('=', 1)] = splitParams[i].indexOf('=') > -1 ? splitParams[i].substring(splitParams[i].indexOf('=') + 1) : '';
                }
            }

            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    if (route === null) {
                        route = key + '=' + params[key];
                    } else {
                        route += '&' + key + '=' + params[key];
                    }
                }
            }
            return this.callParent([route, force]);
        }

        return this.callParent(arguments);
    }
});