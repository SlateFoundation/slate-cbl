StartTest(function (t) {


    t.it('Should resolve target correctly when calling mousedown high level API method', function (t) {
        var panel = new Ext.Panel({
            id       : 'pnl',
            renderTo : document.body,
            height   : 200,
            width    : 200,
            html     : '<div id="div" style="width:100%;height:100%;background:#000"></div>'
        })

        t.firesOnce('#div', 'mousedown')

        t.chain(
            { mousedown : '#pnl' },

            function() {
                panel.destroy();
            }
        )
    });

    t.it('Should support async mouseDown call', function (t) {

        var div = document.createElement('div');
        div.id = 'div'
        $(div).css('width', '30px');
        $(div).css('height','30px');
        $(div).css('background','#0F0');

        setTimeout(function () {
            document.body.appendChild(div);
        }, 200)

        t.firesOnce(div, 'mousedown');

        t.chain(
            { mouseDown : '#div' }
        )
    });

    t.it('Should NOT trigger focus event on mousedown on div without tabIndex', function (t) {

        document.body.innerHTML = '<div id="div" style="width:20px;height:20px;background:#000"></div>'

        t.wontFire('#div', 'focus');

        t.chain(
            { mouseDown : '#div' }
        )
    });

    t.it('Should trigger focus event on mousedown if el has tabIndex', function (t) {

        document.body.innerHTML = '<div tabIndex="-1" id="div" style="width:20px;height:20px;background:#000"></div>'

        t.firesOnce('#div', 'focus');

        t.chain(
            { mousedown : '#div', by : [10,10] }
        )
    });

    t.it('Should trigger focus event on drag', function (t) {

        document.body.innerHTML = '<div id="div" tabIndex="-1" style="width:20px;height:20px;background:#000"></div>'

        t.firesOnce('#div', 'focus');

        t.chain(
            { drag : '#div', by : [10,10] }
        )
    });


    // TODO handle area element clicks (never regarded as the top element in the DOM)
    t.xit('Should trigger focus event on AREA el', function (t) {

        document.body.innerHTML = '<img src="../resources/images/logo.png" width="110" height="25" usemap="#logo">'

        document.body.innerHTML += '<map name="logo"><area shape="rect" coords="0,0,60,25" href="foo" alt="a"><area shape="rect" coords="61,0,120,25" href="bar" alt="b"></map>'

        t.firesOnce('area', 'focus');

        document.querySelector('area').addEventListener('focus', function() {
            debugger;
        })

        t.chain(
            { mousedown : 'area', by : [10,10] }
        )
    });

    t.it('Should not trigger focus event on mousedown if el has disabled attribute', function (t) {

        document.body.innerHTML = '<input type="text" id="div" disabled="true" style="width:20px;height:20px;background:#000"/>'

        t.wontFire('#div', 'focus');

        t.chain(
            { mousedown : '#div', by : [10,10] }
        )
    });

    t.it('Click should not trigger scroll on any parent elements', function (t) {

        document.body.innerHTML = '<div id="cont" style="width:100px;height:400px;background:#333;overflow:scroll"><div style="width:80px;height:1000px;background:#888;"><div tabIndex="-1" id="div" style="width:50px;height:150px;background:#444"></div></div></div>'

        var scrolledContainer = document.getElementById('cont');

        scrolledContainer.scrollTop = 100;

        t.waitFor(500, function(){
            t.firesOnce('#div', 'mousedown');
            t.firesOnce('#div', 'focus');

            // TODO remove this if there's a nice fix available
            // t.wontFire('#cont', 'scroll');

            t.mouseDown('#div', {}, [30, 140])

            t.expect(scrolledContainer.scrollTop).toBe(100);
        })
    });

});
