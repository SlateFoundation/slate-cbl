StartTest(function(t) {
    t.chain(
        { moveCursorTo : [10, 10] },

        function(next) {
            t.diag('Moved to 10, 10');
            t.waitFor(function () { return window.canProceedFurther }, next);
        },

        { moveCursorTo : [100, 20] },

        function(next) {
            t.diag('Moved to 100, 20');

            next();
        }
    )
});