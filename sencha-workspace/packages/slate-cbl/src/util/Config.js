Ext.define('Slate.cbl.util.Config', {
    singleton: true,


    config: {
        levels: {
            9: {
                title: 'Y1'
            },
            10: {
                title: 'Y2'
            },
            11: {
                title: 'Y3'
            },
            12: {
                title: 'Y4'
            }
        }
    },


    constructor: function(config) {
        this.initConfig(config);

        return this;
    }
});