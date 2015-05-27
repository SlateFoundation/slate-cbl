/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext*/
Ext.define('Slate.cbl.Util', function() {

    function _sortNewestDemonstrationFirstFn(a, b) {
        return a.Demonstrated > b.Demonstrated ? -1 : a.Demonstrated < b.Demonstrated ? 1 : 0;
    }

    function _sortOldestDemonstrationFirstFn(a, b) {
        return a.Demonstrated > b.Demonstrated ? 1 : a.Demonstrated < b.Demonstrated ? -1 : 0;
    }

    function _sortGreatestLevelFirstFn(a, b) {
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        return a > b ? -1 : a < b ? 1 : 0;
    }

    return {
        singleton : true,

        padArray: function(array, length, value, prefix) {
            array = array || [];

            while (array.length < length) {
                array[prefix ? 'unshift' : 'push'](typeof value == 'undefined' ? {} : value);
            }

            return array;
        },

        sortDemonstrations: function sortDemonstrations(demonstrations, limit) {
            demonstrations = Ext.isArray(demonstrations) ? demonstrations : [];
            
            var len = demonstrations.length,
                x = 0,
                i = 0,
                demo,
                sortedDemonstrations = {},
                levelsSorted,
                demos,
                demosLen,
                displayDemonstrations = [],
                scored = [],
                missed = [];

            // If no limit is specified, sort all demonstrations
            limit = isNaN(limit) ? len : limit;

            // Separate demonstrations by level
            for (x = 0; len > x; x++) {
                demo = demonstrations[x];
                
                // skip placeholder blocks
                if (demo !== true) {
                    sortedDemonstrations[demo.DemonstratedLevel] = sortedDemonstrations[demo.DemonstratedLevel] || [];
                    sortedDemonstrations[demo.DemonstratedLevel].push(demo);
                }
            }
            
            // Sort the levels of demonstrations observed from greatest to least
            levelsSorted = Object.keys(sortedDemonstrations).sort(_sortGreatestLevelFirstFn);
            
            // Loop over demonstrations starting with the highest levels
            levelLoop:
            for (x = 0, len = levelsSorted.length; len > x; x++) {       
                // Sort demonstrations for x-level by date (newest first)
                demos = sortedDemonstrations[levelsSorted[x]].sort(_sortNewestDemonstrationFirstFn);
        
                // Get limit-number of demonstrations
                for (i = 0, demosLen = demos.length; demosLen > i; i++) {
                    displayDemonstrations.push(demos[i]);
                    if (--limit === 0) {
                        // Break out early
                        break levelLoop;
                    }
                }
            }
            
            // Split up scored and missed demonstrations while keeping order by date (oldest first)
            displayDemonstrations.sort(_sortOldestDemonstrationFirstFn);

            for (x = 0, len = displayDemonstrations.length; x < len; x++) {
                demo = displayDemonstrations[x];
                if (demo.DemonstratedLevel > 0) {
                    scored.push(demo);
                } else {
                    missed.push(demo);
                }
            }
            
            // Scored demonstrations go on the left, missed demonstrations go on the right
            return scored.concat(missed);
        },

        /**
         * @protected
         * Synchronizes the heights of two sets of table rows by setting the height of both to the max of the two
         * 
         * @param {Ext.dom.CompositeElement/Ext.dom.CompositeElementLite} table1Rows
         * @param {Ext.dom.CompositeElement/Ext.dom.CompositeElementLite} table2Rows
         */
        syncRowHeights: function(table1Rows, table2Rows) {

            Ext.batchLayouts(function() {
                var table1RowHeights = [],
                    table2RowHeights = [],
                    rowCount, rowIndex, maxHeight;
        
                rowCount = table1Rows.getCount();
        
                if (table2Rows.getCount() != rowCount) {
                    Ext.Logger.warn('tables\' row counts don\'t match');
                }
        
                // read all the row height in batch first for both tables
                for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    table1RowHeights.push(table1Rows.item(rowIndex).getHeight());
                    table2RowHeights.push(table2Rows.item(rowIndex).getHeight());
                }
        
                // write all the max row heights
                for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    maxHeight = Math.max(table1RowHeights[rowIndex], table2RowHeights[rowIndex]);
                    table1Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
                    table2Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
                }
            });

        }
    };
});