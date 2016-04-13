StartTest(function (t) {

    var siestaRoot = window.top.location.href.substring(0, window.top.location.href.toLowerCase().indexOf('siesta') + 7);
    var guidesRoot = siestaRoot + 'resources/docs/guides';

    t.afterEach(function() {
        t.clearHighlight();
        t.cq1('testgrid').expand()
    })

    t.it('resources/docs/guides/event_recorder/images/recorder1.png', function (t) {
        t.chain(
            { waitForViewRendered : '>>testgrid gridview' },

            function(next) {
                t.cq1('testgrid').setWidth(250);
                t.click('>> button[action=toggle-recorder]');

                var recorder = t.cq1('recorderpanel');

                recorder.store.getRootNode().appendChild([
                    { action : 'click', target : [ { target : '>> login_name' }] },
                    { action : 'type', value : 'Mike' },
                    { action : 'click', target : [ { target : '>> login_button' }] }
                ])

                t.cq1('domcontainer').collapse();

                next()
            },

            {
                screenshot : {
                    target   : '>>recorderpanel',
                    fileName : 'build/doc-images/guides/event_recorder/images/recorder1.png'
                }
            },

            {
                screenshot : {
                    target   : '>>recorderpanel toolbar',
                    fileName : 'build/doc-images/guides/event_recorder/images/pageUrlField.png'
                }
            }
        )
    })

    t.iit('resources/docs/guides/event_recorder/images/editing_target.png', function (t) {
        t.chain(
            { setUrl : siestaRoot + '/examples' },

            { waitForEvent : function() { return [t.global.harness, 'testsuiteend'] }, trigger : { dblclick : ".x-grid-cell:contains(basic_assertions)" } },

            {click : ">>button[action=toggle-recorder]" },

            function(next){

                t.global.Siesta.Recorder.Recorder.prototype.ignoreSynthetic = false;

                t.cq1('gridcolumn[text=Offset]').hide()
                t.cq1('testgrid').collapse()

                var frame = t.global.document.getElementsByTagName('iframe')[0];
                frame.contentWindow.document.body.innerHTML = '<button type="button" class="mybutton">Click Me!</button>';
                next()
            },

            { click : ">>button[action=recorder-start]" },

            { click : "iframe -> button" },

            { click : ".eventview-targetcolumn" },

            { click : ".x-grid-cell-editor", offset : ['100%-20', '50%'] },

            {
                screenshot : {
                    target   : '>>resultpanel',
                    fileName : 'build/doc-images/guides/event_recorder/images/editing_target.png'
                }
            },

            { click : "recorderpanel button => :contains(Show source)" },

            {
                screenshot : {
                    target   : '>>#codeWindow',
                    fileName : 'build/doc-images/guides/event_recorder/images/recorder_generated_code.png'
                }
            }
        );
    });
})