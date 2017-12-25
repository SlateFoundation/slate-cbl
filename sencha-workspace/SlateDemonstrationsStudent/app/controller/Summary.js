Ext.define('SlateDemonstrationsStudent.controller.Summary', {
    extend: 'Ext.app.Controller',


    // controller configuration
    stores: [
        'StudentCompetencies'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-student-dashboard',
        competenciesSummary: 'slate-demonstrations-student-competenciessummary'
    },


    // entry points
    listen: {
        store: {
            '#StudentCompetencies': {
                beforeload: 'onStudentCompetenciesStoreBeforeLoad',
                load: 'onStudentCompetenciesStoreLoad'
            }
        }
    },

    control: {
        dashboardCt: {
            loadedcontentareachange: 'onLoadedContentAreaChange'
        }
    },


    // event handlers
    onStudentCompetenciesStoreBeforeLoad: function(store) {
        this.getCompetenciesSummary().setLoading('Loading content area: '+store.getContentArea());
    },

    onStudentCompetenciesStoreLoad: function(store, studentCompetencies, success) {
        if (!success) {
            return;
        }

        // eslint-disable-next-line vars-on-top
        var competenciesSummary = this.getCompetenciesSummary(),
            minLevel = Infinity,
            totalRequired = 0,
            totalMissed = 0,
            totalComplete = 0,
            averageValues = [],
            growthValues = [],
            studentCompetenciesLength = studentCompetencies.length,
            studentCompetencyIndex = 0,
            studentCompetency, lowestStudentCompetency, average, growth;


        for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
            studentCompetency = studentCompetencies[studentCompetencyIndex];

            // only use completions for lowest incomplete level for aggregate figures
            lowestStudentCompetency = studentCompetency.get('lowest');

            if (lowestStudentCompetency === false) {
                // this completion isn't at the lowest level but one at that level isn't available
                continue;
            } else if (lowestStudentCompetency) {
                // switch to lowest-level completion
                studentCompetency = lowestStudentCompetency;
            }

            minLevel = Math.min(minLevel, studentCompetency.get('Level'));
            totalRequired += studentCompetency.get('demonstrationsRequired');
            totalMissed += studentCompetency.get('demonstrationsMissed');
            totalComplete += studentCompetency.get('demonstrationsComplete');

            growth = studentCompetency.get('growth');
            if (growth) {
                growthValues.push(growth);
            }

            average = studentCompetency.get('demonstrationsAverage');
            if (average) {
                averageValues.push(average);
            }
        }


        competenciesSummary.setConfig({
            level: minLevel,
            percentComplete: 100 * totalComplete / totalRequired,
            percentMissed: 100 * totalMissed / totalRequired,
            missed: totalMissed,
            average: Ext.Array.sum(averageValues) / averageValues.length,
            growth: Ext.Array.sum(growthValues) / growthValues.length
        });

        competenciesSummary.setLoading(false);
    },

    onLoadedContentAreaChange: function(dashboardCt, contentArea) {
        this.getCompetenciesSummary().setContentAreaTitle(contentArea.get('Title'));
    }
});