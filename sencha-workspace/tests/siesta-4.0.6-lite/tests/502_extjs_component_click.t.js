describe('Testing Ext5', function (t) {

    t.beforeEach(function() {
        document.body.innerHTML = '';
    })

    t.it('Should be possible to click a button', function(t) {
        var button      = new Ext.button.Button({
            text        : 'Button',
            renderTo    : document.body  
        })
        
        t.firesOk(button, 'click', 1, "1 click event is fired")
        
        t.chain(
            { moveCursorTo : [ 0, 50 ] },
            { moveCursorTo : button },
            function (next) {
                t.hasCls(button.getEl(), 'x-btn-over', "Button is hightlighted")
                
                next()
            },
            { click : button }
        )
    })

    t.it('Component click with offset', function (t) {

        new Ext.Component({
            foo      : 'bar',
            width    : 100,
            height   : 100,
            renderTo : document.body,
            style    : 'background:#777',
            html     : '<div style="background:#aaa;position:absolute;top:20px;left:20px;width:60px;height:60px;"></div>'
        })

        t.chain(
            { click : '>>[foo=bar]', offset : ['100%', 50] },

            function () {
                t.isDeeply(t.currentPosition, [99, 50])
            }
        )
    })

});
