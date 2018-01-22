Ext.define('Slate.cbl.Util', function() {

    function _sortNewestDemonstrationFirstFn(a, b) {
        return a.Demonstrated > b.Demonstrated ? -1 : a.Demonstrated < b.Demonstrated ? 1 : 0;
    }

    function _sortOldestDemonstrationFirstFn(a, b) {
        if (a.Demonstrated > b.Demonstrated) {
            return 1;
        } else if (a.Demonstrated < b.Demonstrated) {
            return -1;
        }

        return a.ID > b.ID ? 1 : -1;
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
        }
    };
});