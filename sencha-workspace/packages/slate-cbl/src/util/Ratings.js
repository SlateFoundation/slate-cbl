Ext.define('Slate.cbl.util.Ratings', {
    singleton: true,

    config: {
        min: 7,
        max: 13,
        menuMin: 1,
        allowMissing: true
    },

    constructor: function(cfg) {
        this.initConfig(cfg);

        return this;
    },

    /**
     * Return array of menu rating values
     */
    getRatings: function() {
        var me = this,
            min = me.getMin(),
            max = me.getMax(),
            i = min, ratings = [];

        for (; i <= max; i++) {
            ratings.push(i);
        }

        return ratings;
    },

    /**
     * Return array of menu rating values, formatted for use in {@link Slate.cbl.widget.RatingView} CBL RatingView widget.
     */
    getScaleRatings: function() {
        var me = this,
            ratings = me.getRatings();

        if (me.getAllowMissing() === true) {
            ratings.push('M');
        }

        return ratings;
    },

    /**
     * Return array of menu rating values
     */

    getMenuRatings: function() {
        var me = this,
            menuMin = me.getMenuMin(),
            menuMax = me.getMin(),
            i = menuMin, ratings = [];

        if (menuMin === null) {
            return [];
        }

        for (; i <= menuMax; i++) {
            ratings.push(i);
        }

        return ratings;
    }
});