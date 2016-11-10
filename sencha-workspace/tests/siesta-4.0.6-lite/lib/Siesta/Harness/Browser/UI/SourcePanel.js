/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.SourcePanel', {
    extend   : 'Ext.Panel',
    alias      : 'widget.sourcepanel',

    __filled__ : false,

    autoScroll : true,
    cls        : 'test-source-ct',
    layout     : 'absolute',
    border     : false,
    bodyBorder : false,

    setSource  : function (source, linesToHighlight) {
        var sourceCtEl = this.el;

        if (!this.__filled__) {
            this.__filled__ = true;

            this.update(
                Ext.String.format('<pre class="brush: javascript;">{0}</pre>', source)
            );

            // Disable the double click handling, which removes the code coloring
            SyntaxHighlighter.defaults['quick-code'] = false;

            SyntaxHighlighter.highlight(sourceCtEl);
        }

        sourceCtEl.select('.highlighted').removeCls('highlighted');

        // Highlight rows
        Ext.Array.each(linesToHighlight, function (line) {
            sourceCtEl.select('.line.number' + line).addCls('highlighted');
        });

        if (linesToHighlight.length > 0) {
            var el = sourceCtEl.down('.highlighted');
            el && el.scrollIntoView(sourceCtEl);
        }
    },

    clear : function () {
        this.__filled__ = false;
    }
});
