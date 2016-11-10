/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.ExtJS

 Ext JS specific recorder implementation

 */
Class('Siesta.Recorder.ExtJS', {
    isa     : Siesta.Recorder.Recorder,

    does : [
        Siesta.Recorder.Helper.GridColumn
    ],

    has : {
        extractorClass          : Siesta.Recorder.TargetExtractor.ExtJS,
        _moveCursorToSelectors   : function() {
            return ['.x-menu-item'];
        }
    },

    methods : {
        initialize : function () {
            this.SUPERARG(arguments)
        },

        onStart : function() {
            var me              = this,
                window          = me.window,
                body            = window.document.body;

            this.SUPERARG(arguments)

            body.addEventListener('mouseover', this.onMouseOver, true);
        },

        onStop : function() {
            var me              = this,
                window          = me.window,
                body            = window.document.body;

            this.SUPERARG(arguments)

            body.removeEventListener('mouseover', this.onMouseOver, true);
        },

        addMoveCursorAction : function(event, recordOffsets) {
            // If something is being dragged and we're hovering over the drag target, choose moveCursorTo with coordinate
            if (event.target && this.closest(event.target, '[class*=-dd-drag-proxy]', 5)) {
                this.addAction({
                    action          : 'moveCursorTo',

                    target          : [{
                        type        : 'xy',
                        target      : [ event.x, event.y ]
                    }],

                    sourceEvent     : event,
                    options         : event.options
                })
            } else {
                this.SUPERARG(arguments)
            }
        }
    }
    // eof methods
});
