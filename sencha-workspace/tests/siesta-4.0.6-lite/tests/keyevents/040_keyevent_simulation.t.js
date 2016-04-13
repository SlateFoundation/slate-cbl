StartTest(function (t) {

    var keys = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        box = new Ext.form.TextField({
            width           : 400,
            enableKeyEvents : true,
            renderTo        : Ext.getBody()
        }),
        numberField = new Ext.form.NumberField({
            width           : 100,
            enableKeyEvents : true,
            renderTo        : Ext.getBody(),
            value           : 0
        }),
        datePicker = new Ext.picker.Date({
            renderTo : Ext.getBody(),
            value    : new Date(2011, 9, 5)
        }),
        rawLink = Ext.getBody().createChild({
            tag      : 'a',
            html     : 'testing link',
            href     : '#',
            tabIndex : 1
        });

    rawLink.on('click', function (e, t) {
        e.stopEvent();
    });

    function getDateCellFocusEl() {
        return datePicker.el.down('.' + datePicker.selectedCls + ' a');
    }

    t.testExtJS({
        // The date picker needs a few ms to alter focus to the each new date cell
        actionDelay : 100
    }, function (t) {

        t.it('Should fire click when hitting ENTER on a link', function (t) {
            // only verify the number of click events if touch events are not enabled
            // if they are - Ext seems to ignore the 2nd DOM level `click` event
            if (!(Ext.supports.TouchEvents || Ext.supports.MSPointerEvents || Ext.supports.PointerEvents)) 
                t.willFireNTimes(rawLink, 'click', 2, 'Anchor tag');

            t.chain(
                { action : 'click', target : rawLink },

                { action : 'type', target : rawLink, text : '[ENTER]' }
            )
        })

        t.it('Should fire keydown, keypress, keyup for all keys', function (t) {
            var nbrKeys = keys.length;

            t.willFireNTimes(box, 'keydown', nbrKeys)
            t.willFireNTimes(box, 'keyup', nbrKeys)
            t.willFireNTimes(box, 'keypress', nbrKeys)

            t.chain(
                { action : 'type', target : box, text : keys }
            );
        });

        t.it('Should handle UP, DOWN on a NumberField', function (t) {
            numberField.setValue(0);

            t.willFireNTimes(numberField, 'specialkey', 4, 'NumberField specialkey');

            t.chain(
                { click : numberField },

                { type : "[UP][UP][DOWN][UP]", target : numberField },

                function() {
                    t.expect(numberField.getValue()).toBe(2)
                }
            );
        });

        t.it('Should handle LEFT, RIGHT etc on a DatePicker', function (t) {
            t.willFireNTimes(datePicker, 'select', 2, 'DatePicker select');

            t.chain(
                { click : '.' + datePicker.selectedCls },

                // Two steps to the right, then Enter to select
                { type : '[RIGHT][RIGHT][LEFT][RIGHT][ENTER]' },

                function () {
                    t.fieldHasValue(box, keys, "Correctly simulated normal character keys");

                    t.fieldHasValue(numberField, 2, "Correctly simulated up/down arrow keys");

                    t.fieldHasValue(datePicker, new Date(2011, 9, 7), "Correctly simulated LEFT/RIGHT/ENTER arrow keys");
                }
            );
        });

        t.it('Should handle a focus change on "keydown" event', function (t) {
            var field = new Ext.form.TextField({
                enableKeyEvents : true,
                renderTo        : Ext.getBody()
            });

            var field2 = new Ext.form.TextField({
                enableKeyEvents : true,
                renderTo        : Ext.getBody()
            });

            field.on('keydown', function() { field2.focus(); })

            t.chain(
                { click : field },

                // Two steps to the right, then Enter to select
                { type : 'abc' },

                function () {
                    t.fieldHasValue(field2, 'abc');
                }
            );
        });

        t.it('Should fire all type of key/input events', function (t) {

            var supportsTextEvent = (function() {
                var event;

                try {
                    event = doc.createEvent('TextEvent');
                } catch(e) {}
                return !!(event && event.initTextEvent);
            })();

            document.body.innerHTML = '<input id="inp" type="text"/>';
            var field = document.getElementById('inp');

            t.firesOnce(field, 'keydown');
            t.firesOnce(field, 'keypress');
            t.firesOnce(field, 'keyup');
            t.firesAtLeastNTimes(field, 'input', 1); // 2 in chrome

            // DOM "value" property should be set at the point when 'input' is fired
            Ext.fly(field).on('input', function() {
                t.expect(field.value).toBe('a');
            })

            if (supportsTextEvent) {
                t.firesOnce(field, $.browser.webkit ? 'textInput' : 'textinput');
            }

            t.chain(
                // Two steps to the right, then Enter to select
                { type : 'a', target : field },

                function () {
                    t.expect(field.value).toBe('a');
                }
            );
        });
    });
});
