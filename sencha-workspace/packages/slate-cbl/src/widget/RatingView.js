Ext.define('Slate.cbl.widget.RatingView', {
    extend: 'Ext.Component',
    xtype: 'slate-ratingview',
    requires: [],

    componentCls: 'slate-ratingview',

    data: {
        ratings: [ 7, 8, 9, 10, 11, 12, 'M' ],
        competencies: [
            {
                Code: 'ELA.2',
                Descriptor: 'Reading Informational Texts',
                Skills: [
                    {
                        Code: 'ELA.2.HS.1',
                        Descriptor: 'Cite evidence',
                        level: 9,
                        rating: 10
                    },
                    {
                        Code: 'ELA.2.HS.3',
                        Descriptor: 'Analyze developments',
                        level: 11
                    }
                ]
            },
            {
                Code: 'ELA.3',
                Descriptor: 'Writing Evidence-Based Arguments',
                Skills: [
                    {
                        Code: 'ELA.3.HS.2',
                        Descriptor: 'Use evidence to develop claims and counterclaims',
                        level: 9,
                        rating: 8
                    }
                ]
            }
        ]
    },

    tpl: [
        '{% this.ratings = values.ratings %}',

        '<ul class="slate-ratingview-competencies">',
            '<tpl for="competencies">',
                '<li class="slate-ratingview-competency">',
                    '<h4 class="slate-ratingview-competency-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h4>',
                    '<ul class="slate-ratingview-skills">',
                        '<tpl for="Skills">',
                            '<li class="slate-ratingview-skill slate-ratingview-skill-level-{level}">',
                                '<header class="slate-ratingview-skill-header">',
                                    '<button class="slate-ratingview-remove"><i class="fa fa-times-circle"></i></button>',
                                    '<h5 class="slate-ratingview-skill-title">{Code}<tpl if="Code &amp;&amp; Descriptor"> – </tpl>{Descriptor}</h5>',
                                '</header>',
                                '<ol class="slate-ratingview-ratings">',
                                    '<li class="slate-ratingview-rating slate-ratingview-rating-null <tpl if="values.rating == null">is-selected</tpl>" data-rating="null">',
                                        '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                            '<span class="slate-ratingview-rating-label">N/A</span>',
                                        '</div>',
                                    '</li>',
                                    '<tpl for="this.ratings">', // access template-scoped variable declared at top
                                        '<li class="slate-ratingview-rating <tpl if="values == parent.rating">is-selected</tpl>" data-rating="{.}">',
                                            '<div class="slate-ratingview-rating-bubble" tabindex="0">',
                                                '<span class="slate-ratingview-rating-label">{.}</span>',
                                            '</div>',
                                        '</li>',
                                    '</tpl>',
                                '</ol>',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</li>',
            '</tpl>',
        '</ul>'
    ]
});
