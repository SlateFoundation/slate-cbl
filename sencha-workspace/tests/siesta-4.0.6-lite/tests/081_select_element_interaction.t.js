StartTest(function (t) {

    document.body.innerHTML = '<select id="sel">' +
    ' <option value="volvo">Volvo</option>' +
    ' <option value="saab">Saab</option>' +
    ' <option value="mercedes">Mercedes</option>' +
    ' <option value="audi" disabled="true">Audi</option>' +
    '</select> '

    t.firesOnce('#sel', 'change');

    t.chain(
        { click : '#sel' },
        { click : '#sel [value=mercedes]' },

        function(next) {

            t.hasValue('#sel', 'mercedes');
            next()
        },

        { click : '#sel [value=audi]' },

        function(next) {

            t.hasValue('#sel', 'mercedes');
            next()
        }
    );
})