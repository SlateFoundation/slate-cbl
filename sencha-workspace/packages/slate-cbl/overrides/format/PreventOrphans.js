Ext.define('Slate.cbl.util.format.PreventOrphans', {
    override: 'Ext.util.Format',

    // prevent words dangling on their own lines by replacing the last space in a string with a nbsp
    preventOrphans: function(value) {
        var lastSpacePosition = value.lastIndexOf(' ');

        return value.substr(0, lastSpacePosition) + '&nbsp;' + value.substr(lastSpacePosition + 1);
    }
});