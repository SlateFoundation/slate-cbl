describe('scrolling target with offset into view', function (t) {

    var scrollable;
    var inner;

    t.beforeEach(function() {
        document.body.innerHTML = '<div id="scrollable" style="background:#000;width:200px;height:100px;overflow:scroll">' +
        '<div id="inner" style="width:2000px;height:400px;background:#F00">INNER</div>' +
        '</div>';

        scrollable = $('#scrollable')[0];
        inner = $('#inner')[0];
    })

    t.it('Should correctly scroll into target with offset supplied', function(t) {

        t.scrollTargetIntoView(inner, [400, 200]);

        t.expect(scrollable.scrollLeft).toBe(399);
        t.expect(scrollable.scrollTop).toBe(199);

    })

    t.it('Should be able to click on target with offset supplied', function(t) {
        t.firesOnce(inner, 'click');

        t.chain(
            { waitFor : 1000 },
            { click : '#inner', offset : [400, 200] },

            function() {
                t.expect(scrollable.scrollLeft).toBe(399);
                t.expect(scrollable.scrollTop).toBe(199);
            }
        )
    })
    
});

