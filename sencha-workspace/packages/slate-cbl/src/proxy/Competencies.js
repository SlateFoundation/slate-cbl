Ext.define('Slate.cbl.proxy.Competencies', {
    extend: 'Slate.proxy.Records',
    alias: 'proxy.slate-cbl-competencies',


    config: {
        url: '/cbl/competencies',
        include: ['totalDemonstrationsRequired']
    }
});