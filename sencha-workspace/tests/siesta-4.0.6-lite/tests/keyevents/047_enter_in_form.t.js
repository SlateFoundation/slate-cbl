StartTest(function (t) {
    //
    function prevent(event) {
        event.preventDefault();
        event.returnValue = false;
    }

    t.testBrowser(function (t) {
        document.body.innerHTML = '<form id="formWithOneInput" method="post"><input id="txt" type="text"></form>' +
        '<form id="formWithTwoInputs" method="post"><input id="txt2" type="text"><input id="txt3" type="text"></form>' +
        '<form id="formWithSubmit" method="post"><input id="txt4" type="text"><input id="txt5" type="text"><input type="submit" value="Submit"></form>'+
        '<form id="formPrevented" method="post"><input id="txt6" type="text"><input type="submit" value="Submit"></form>';

        var formWithOneInput    = document.getElementById('formWithOneInput');
        var formWithTwoInputs   = document.getElementById('formWithTwoInputs');
        var formWithSubmit      = document.getElementById('formWithSubmit');
        var formPrevented       = document.getElementById('formPrevented');

        formWithOneInput.onsubmit = formWithSubmit.onsubmit = function() { return false; };

        document.getElementById('txt6').addEventListener('keypress', function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                event.returnValue = false;
            }
        });

        t.firesOnce(formWithOneInput,   'submit', 'Expect a form to be posted on ENTER press if only containing one text field')
        t.firesOnce(formWithSubmit,     'submit', 'Expect a form NOT to be posted on ENTER press if containing more than one text field')
        t.wontFire(formWithTwoInputs,   'submit', 'Expect a form to be posted on ENTER press if containing submit field')
        t.wontFire(formPrevented,       'submit', 'Expect a form NOT to be posted on ENTER press if event is prevented')

        document.getElementById('formWithOneInput').addEventListener('submit', prevent);
        document.getElementById('formWithSubmit').addEventListener('submit', prevent);

        t.chain(
            {
                type : 'A[ENTER]',
                target : '#txt'
            },
            {
                type : 'A[ENTER]',
                target : '#txt2'
            },
            {
                type : 'A[ENTER]',
                target : '#txt4'
            },
            {
                type : 'A[ENTER]',
                target : '#txt6'
            },
            second
        )
    });

    function second() {
        t.testJQuery(function (t) {
            // testing click
            document.body.innerHTML += '<form id="fo2" method="post"><input id="txt7" type="text"></form>';
            var called;

            $('#fo2').bind('submit', function () {
                called = true;
                return false;
            });

            t.chain(
                {
                    action : 'type',
                    target : '#txt7',
                    text   : 'Woo[ENTER]'
                },
                function () {
                    t.ok(called, 'Form submit detected ok with jQuery');
                }
            )
        });
    }


});

