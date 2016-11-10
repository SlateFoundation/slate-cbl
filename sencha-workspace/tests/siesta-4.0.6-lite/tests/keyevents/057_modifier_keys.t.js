describe('Should not type any chars when Cmd/Ctrl are pressed', function (t) {
    document.body.innerHTML = '<input type="text" id="foo"/>';

    var isMac = Siesta.Recorder.Recorder.prototype.parseOS(navigator.platform) === 'MacOS';

    t.chain(
        { click : '#foo' },

        isMac ? { type : '[CMD]C', options : { metaKey : true } } :
                { type : 'C', options : { ctrlKey : true } },

        function() {
            t.expect($('#foo').val()).toBe('');
        }
    )
});