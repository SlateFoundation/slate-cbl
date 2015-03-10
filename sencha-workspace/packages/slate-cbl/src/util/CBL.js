/*jslint browser: true ,undef: true *//*global Ext*/
Ext.define('Slate.cbl.util.CBL', {
    singleton : true,
    config : {},
    
    constructor : function(config) {
        this.initConfig(config);
    },
    
    sortDemonstrations: function sortDemonstrations(demonstrations, limit) {
        'use strict';
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

        // Define functions outside of loops
        function sortByNewest(a, b) {
            // Newest first
            return a.Demonstrated > b.Demonstrated ? -1 : a.Demonstrated < b.Demonstrated ? 1 : 0;
        }
        
        function sortByOldest(a, b) {
            // Oldest first
            return a.Demonstrated > b.Demonstrated ? 1 : a.Demonstrated < b.Demonstrated ? -1 : 0;
        }
        
        // Separate demonstrations by level
        for (x = 0; len > x; x++) {
            demo = demonstrations[x];
            sortedDemonstrations[demo.Level] = sortedDemonstrations[demo.Level] || [];
            sortedDemonstrations[demo.Level].push(demo);
        }
        
        // Sort the levels of demonstrations observed from greatest to least
        levelsSorted = Object.keys(sortedDemonstrations).sort(function (a, b) {
            a = parseInt(a, 10);
            b = parseInt(b, 10);
            return a > b ? -1 : a < b ? 1 : 0;
        });
        
        // Loop over demonstrations starting with the highest levels
        levelLoop:
        for (x = 0, len = levelsSorted.length; len > x; x++) {       
            // Sort demonstrations for x-level by date (newest first)
            demos = sortedDemonstrations[levelsSorted[x]].sort(sortByNewest);
    
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
        displayDemonstrations.sort(sortByOldest).forEach(function(demo) {
            if (demo.Level > 0) {
                scored.push(demo);
            } else {
                missed.push(demo);
            }
        });
        
        // Scored demonstrations go on the left, missed demonstrations go on the right
        return scored.concat(missed);
    }
});