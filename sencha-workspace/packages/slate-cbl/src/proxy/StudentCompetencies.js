Ext.define('Slate.cbl.proxy.StudentCompetencies', {
    extend: 'Slate.proxy.Records',
    alias: 'proxy.slate-cbl-studentcompetencies',


    config: {
        url: '/cbl/student-competencies',
        timeout: 120000
    }
});