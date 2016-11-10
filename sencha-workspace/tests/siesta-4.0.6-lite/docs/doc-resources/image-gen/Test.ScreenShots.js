Class('Test.ScreenShots', {

    isa : Siesta.Test.ExtJS,

    has : {},

    methods : {

        highlight : function (target, callback) {
            var el  = this.normalizeElement(target, false, true);
            var Ext = this.Ext();

            Ext.fly(el).addCls('siesta-highlighted');

            Ext.fly(el).setStyle({
                outline          : "5px solid red",
                "outline-offset" : "4px"
            });

            callback && callback()
        },

        clearHighlight : function (target, callback) {
            var Ext = this.Ext();

            if (Ext) {
                if (target && typeof target === 'function') {
                    var el  = this.normalizeElement(target);
                    Ext.fly(el).setStyle(outline);
                } else {
                    Ext.select('.siesta-highlighted').setStyle('outline');
                }
            }

            callback && callback()
        },

        spotlight : function (target, callback) {
            var el  = this.normalizeElement(target, false, true);
            var Ext = this.Ext();

            Ext.getBody().mask();
            Ext.fly(el).setStyle('z-index', 100000);
            callback && callback()
        },

        clearSpotlight : function (target, callback) {
            var Ext = this.Ext();
            var el  = this.normalizeElement(target, false, true);

            Ext.getBody().unmask();

            if (el) {
                Ext.fly(el).setStyle('z-index');
            }

            callback && callback()
        },

        speak : function(message, callback, scope) {
            if (!('SpeechSynthesisUtterance' in window)) {
                // Synthesis support. Make your web apps talk!
                throw 'speechSynthesis API not supported'
            }

            var msg = new SpeechSynthesisUtterance(message);

            if (callback) {
                msg.onend = function(e) {
                    callback.call(scope || this);
                };
            }

            msg.onboundary = function(e) {
                console.log(arguments);
            }

            speechSynthesis.speak(msg);
        }
    }
});