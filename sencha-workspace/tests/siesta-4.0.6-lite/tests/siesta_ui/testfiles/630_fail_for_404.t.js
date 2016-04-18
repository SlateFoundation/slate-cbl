StartTest(function(t) {
    // Should trigger a fail
    document.body.innerHTML = '<img id="img"/>'

    var img     = document.getElementById('img');

    t.waitForEvent(img, 'error')

    img.src     = "foo.png"
});