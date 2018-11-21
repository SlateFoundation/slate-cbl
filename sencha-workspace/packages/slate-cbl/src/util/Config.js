Ext.define('Slate.cbl.util.Config', {
    singleton: true,


    config: {
        levels: {
            9: {
                title: 'Year 1',
                abbreviation: 'Y1'
            },
            10: {
                title: 'Year 2',
                abbreviation: 'Y2'
            },
            11: {
                title: 'Year 3',
                abbreviation: 'Y3'
            },
            12: {
                title: 'Year 4',
                abbreviation: 'Y4'
            }
        },
        ratings: {}
    },


    constructor: function(config) {
        this.initConfig(config);

        return this;
    },

    getAvailableLevels: function() {
        return Object.keys(this.getLevels())
            .map(key => parseInt(key, 10))
            .filter(key => key != 0);
    },

    getTitleForLevel: function(level) {
        var levelConfig = this.getLevels()[level];

        if (levelConfig) {
            return levelConfig.title || levelConfig.abbreviation;
        }

        return level;
    },

    getAbbreviationForLevel: function(level) {
        var levelConfig = this.getLevels()[level];

        if (levelConfig) {
            return levelConfig.abbreviation || levelConfig.title;
        }

        return level;
    },

    getTitleForRating: function(rating) {
        var ratingConfig = this.getRatings()[rating];

        if (ratingConfig) {
            return ratingConfig.title || ratingConfig.abbreviation;
        }

        return rating == '0' ? 'M' : rating;
    },

    getAbbreviationForRating: function(rating) {
        var ratingConfig = this.getRatings()[rating];

        if (ratingConfig) {
            return ratingConfig.abbreviation || ratingConfig.title;
        }
        return rating == '0' ? 'M' : rating;
    }
});