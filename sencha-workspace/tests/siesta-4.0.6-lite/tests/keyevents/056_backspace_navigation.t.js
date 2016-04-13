describe('Should navigate to previous page on BACKSPACE key', function (t) {

    if (window.top.$.browser.safari) return;

    t.chain(
        { setUrl : 'basic2.html' },

        {
            waitFor : function () {
                return t.global.location.href.match('basic2.html');
            }
        },

        { click : '.bar' },

        { waitFor : 500 },

        { type : '[BACKSPACE]', target : 'body' },

        {
            waitFor : function () {
                return t.global.location.href.match('basic1.html');
            }
        },

        { waitFor : 500 },

        { type : '[BACKSPACE]', target : 'body', options : { shiftKey : true } },

        {
            waitFor : function () {
                return t.global.location.href.match('basic2.html');
            }
        },
        function (next) {
            t.like(t.global.location.href, 'basic2.html')
        }
    )
});