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
    }
});