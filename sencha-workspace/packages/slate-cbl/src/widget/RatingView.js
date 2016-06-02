Ext.define('Slate.cbl.widget.RatingView', {
    extend: 'Ext.Component',
    xtype: 'slate-ratingview',
    requires: [],

    componentCls: 'slate-ratingview',

    data: {
        competencies: [
            {
                code: 'ELA.2',
                desc: 'Reading Informational Texts',
                skills: [
                    {
                        code: 'ELA.2.HS.1',
                        desc: 'Cite evidence',
                        level: 9,
                        rating: 10
                    },
                    {
                        code: 'ELA.2.HS.3',
                        desc: 'Analyze developments',
                        level: 9
                    }
                ]
            },
            {
                code: 'ELA.3',
                desc: 'Writing Evidence-Based Arguments',
                skills: [
                    {
                        code: 'ELA.3.HS.2',
                        desc: 'Use evidence to develop claims and counterclaims',
                        level: 9
                    }
                ]
            }
        ]
    },

    tpl: [
        '<ul class="slate-ratingview-competencies">',
            '<tpl for="competencies">',
                '<li class="slate-ratingview-competency">',
                    '<h4 class="slate-ratingview-competency-title">{code}<tpl if="code &amp;&amp; desc"> – </tpl>{desc}</h4>',
                    '<ul class="slate-ratingview-skills">',
                        '<tpl for="skills">',
                            '<li class="slate-ratingview-skill">',
                                '<header class="slate-ratingview-skill-header">',
                                    '<button class="slate-ratingview-remove"><i class="fa fa-times-circle"></i></button>',
                                    '<h5 class="slate-ratingview-skill-title">{code}<tpl if="code &amp;&amp; desc"> – </tpl>{desc}</h5>',
                                '</header>',
                                '<ol class="slate-ratingview-ratings">',
                                    '<li class="slate-ratingview-rating slate-ratingview-rating-null" data-rating="null"><span class="slate-ratingview-rating-label">N/A</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="7"><span class="slate-ratingview-rating-label">7</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="8"><span class="slate-ratingview-rating-label">8</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="9"><span class="slate-ratingview-rating-label">9</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="10"><span class="slate-ratingview-rating-label">10</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="11"><span class="slate-ratingview-rating-label">11</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="12"><span class="slate-ratingview-rating-label">12</span></li>',
                                    '<li class="slate-ratingview-rating" data-rating="M"><span class="slate-ratingview-rating-label">M</span></li>',
                                '</ol>',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</li>',
            '</tpl>',
        '</ul>'
    ]
});