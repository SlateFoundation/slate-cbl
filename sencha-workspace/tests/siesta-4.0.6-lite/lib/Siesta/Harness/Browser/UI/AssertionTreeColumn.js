/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.AssertionTreeColumn', {

    extend : 'Ext.tree.Column',
    alias  : 'widget.assertiontreecolumn',

    imgWithOffsetText : '<img src="{1}" class="{0}" style="left:{2}px" />',
    tdCls             : 'tr-tree-column',
    resultTpl         : null,
    dataIndex         : 'folderStatus',
    menuDisabled      : true,
    sortable          : false,
    width             : 500,
    descriptionTpl : '<span class="assertion-text">{text}</span>',

    initComponent : function () {

        this.descriptionTpl = this.descriptionTpl instanceof Ext.XTemplate ? this.descriptionTpl : new Ext.XTemplate(this.descriptionTpl);

        Ext.apply(this, {
            scope     : this
        });

        this.callParent(arguments);
    },

    renderer      : function (value, metaData, record, rowIndex, colIndex, store) {
        var retVal = '';
        var result = record.data.result;
        var annotation = result.annotation;

        if (result instanceof Siesta.Result.Summary) {
            return record.data.result.description.join('<br>');
        }

        retVal = this.descriptionTpl.apply({
            text : Ext.String.htmlEncode(result.isWarning ? 'WARN: ' + result.description : result.description)
        });

        if (annotation) {
            retVal += '<pre title="' + annotation.replace(/"/g, "'") + '" style="margin-left:' + record.data.depth * 16 + 'px" class="tr-assert-row-annontation">' + Ext.String.htmlEncode(annotation) + '</pre>';
        }

        return retVal;
    },

    // HACK OVERRIDE
    treeRenderer : function (value, metaData, record) {
        var result = record.getResult()

        if (result instanceof Siesta.Result.Assertion) {
            if (result.isWaitFor)
                record.data.iconCls = result.completed ? 'fa-clock-o' : 'fa-spinner fa-spin'
            else if (result.isException)
                record.data.iconCls = 'fa-flag';
            else
                record.data.iconCls = result.passed ? 'fa-check' : 'fa-bug'
        } else if (result instanceof Siesta.Result.SubTest) {
            if( record.get('folderStatus') === 'working') {
                record.data.iconCls = 'fa-spinner fa-spin';
            } else {
                record.data.iconCls = '';
            }
        }

        return this.callParent(arguments);
    }
});
