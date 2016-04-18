StartTest(function (t) {

    t.it('Monkey test should handle a page redirect, when there is no BODY el for a while', function (t) {

        document.body.innerHTML = '<div class="foo">hello</div>';

        var html = document.body.parentNode;
        var bd = document.body;

        document.body.onclick = function() {
            html.removeChild(bd);
            
            var async   = t.beginAsync()

            setTimeout(function() {
                html.appendChild(bd);
                
                t.endAsync(async)
            }, 800)
        };

        t.monkeyTest(document.body, 10, function() {
            html.appendChild(bd);
            
            document.body.onclick = null
        });
    }, 90000);

    t.it('Monkey should be able to type', function (t) {

        t.randomBetween = function() { return 4; };

        document.body.innerHTML = '<input type="text" id="text"/>';

        t.chain(
            { monkeyTest : '#text', nbrInteractions : 2 },

            function() {
                var input = document.getElementById('text');

                t.isGreater(input.value.length, 9, 'Should find text by good monkeys')
            }
        )
    }, 90000);
});
