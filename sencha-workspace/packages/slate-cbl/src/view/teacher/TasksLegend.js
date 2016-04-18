/*
        // TODO make more dynamic?
        '<div class="slate-studentsgrid-legend">',
            '<span class="cbl-legend-title">Legend</span>',
            '<ul class="cbl-legend-items">',
                '<tpl for="this.legendItems">',
                    '<li class="cbl-legend-item cbl-status-{cls} <tpl if="needsRated">cbl-status-needs-rated</tpl>">',
                        '<span class="cbl-legend-swatch"></span>',
                        '<span class="cbl-legend-label">{title}</span>',
                    '</li>',
                '</tpl>',
            '</ul>',
        '</div>',
        {
            legendItems: [
                {
                    cls: 'not-assigned',
                    title: 'Not Assigned'
                },
                {
                    cls: 'due',
                    title: 'Due'
                },
                {
                    cls: 'due',
                    needsRated: true,
                    title: 'Needs Rated'
                },
                {
                    cls: 'completed',
                    title: 'Completed'
                },
                {
                    cls: 'revision-assigned',
                    title: 'Revision Assigned'
                },
                {
                    cls: 'revision-assigned',
                    needsRated: true,
                    title: 'Revision, Needs Rated'
                },
                {
                    cls: 'past-due',
                    title: 'Past Due'
                },
                {
                    cls: 'past-due',
                    needsRated: true,
                    title: 'Late, Needs Rated'
                },
            ]
        },
*/
