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
Role('Siesta.Recorder.Helper.GridColumn', {

    override : {

        // Hook called before adding actions to inject 'helping' actions
        beforeAddAction : function(action) {
            this.SUPERARG(arguments);

            var target = action.getTarget();

            if ((action.action === 'click' || action.action === 'moveCursorTo') && target && typeof target.target === 'string' && target.target.match('column-header-trigger$')) {
                // Make sure we don't add extra unnecessary helper actions: scenario
                // 1. move cursor to column trigger el and wait
                // 2. This adds moveCursorTo action for the trigger el
                // 3. We inject a moveCursorTo before, targeting the grid column main element
                // 4. Click trigger el, now we should not inject any helper steps

                var prevHelperAction = this.getRecordedActions()[this.getRecordedActions().length - 2];
                var lastActionTarget = prevHelperAction && prevHelperAction.getTarget() && prevHelperAction.getTarget().target;
                var columnSelector   = target.target.replace(/column-header-trigger/, "column-header-inner");

                if (!prevHelperAction || prevHelperAction.action !== 'moveCursorTo' || lastActionTarget !== columnSelector) {
                    // Before clicking column header trigger to activate menu, inject a mouse move to the column which
                    // shows the trigger el
                    this.addAction({
                        action : 'moveCursorTo',

                        target : [{
                            type   : target.type,
                            target : columnSelector
                        }],

                        sourceEvent : action.sourceEvent
                    })
                }
            }
        }
    }
    // eof methods
});
