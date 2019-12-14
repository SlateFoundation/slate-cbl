/**
 * TODO: move to slate-cbl-gdrive plugin
 */
Ext.define('Slate.cbl.field.attachments.GoogleDriveFile', {
    extend: 'Slate.cbl.field.attachments.Link',
    xtype: 'slate-cbl-attachments-googledrivefile',


    editTpl: '<span></span>',
    removeTpl: '<span></span>',

    applyValueToConfig: function({ File: driveFile }) {
        return Ext.apply(this.callParent(arguments), {
            url: `https://drive.google.com/open?id=${driveFile && driveFile.DriveID}`
        });
    },

    inheritableStatics: {
        recordClass: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',

        buildButtonConfig: function() {
            return false;
        }
    }
});