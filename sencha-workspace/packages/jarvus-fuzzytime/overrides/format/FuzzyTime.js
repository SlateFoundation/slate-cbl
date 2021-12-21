/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true */
/* global Ext */
Ext.define('Jarvus.util.format.FuzzyTime', {
    override: 'Ext.util.Format',

    timeUnits: {
        second: 'second',
        minute: 'minute',
        hour: 'hour',
        day: 'day',
        month: 'month',
        year: 'year'
    },

    timeUnitAbbreviations: {
        second: 's',
        minute: 'm',
        hour: 'h',
        day: 'd',
        month: 'mo',
        year: 'yr'
    },

    fuzzyTime: function(date, abbreviate) {
        if (!date) {
            return '';
        }

        var milliseconds = Math.max(0, Date.now() - date.getTime());

        return this.fuzzyDuration(milliseconds, abbreviate);
    },

    fuzzyDuration: function(milliseconds, abbreviate) {
        var msPerMinute = 60 * 1000,
            msPerHour = msPerMinute * 60,
            msPerDay = msPerHour * 24,
            msPerMonth = msPerDay * 30,
            msPerYear = msPerDay * 365,
            qty, unit;

        if (!milliseconds) {
            return '';
        }

        if (milliseconds < msPerMinute) {
            qty = Math.round(milliseconds / 1000);
            unit = 'second';
        } else if (milliseconds < msPerHour) {
            qty = Math.round(milliseconds / msPerMinute);
            unit = 'minute';
        } else if (milliseconds < msPerDay) {
            qty = Math.round(milliseconds / msPerHour);
            unit = 'hour';
        } else if (milliseconds < msPerMonth) {
            qty = Math.round(milliseconds / msPerDay);
            unit = 'day';
        } else if (milliseconds < msPerYear) {
            qty = Math.round(milliseconds / msPerMonth);
            unit = 'month';
        } else {
            qty = Math.round(milliseconds / msPerYear);
            unit = 'year';
        }

        if (abbreviate) {
            return qty + this.timeUnitAbbreviations[unit];
        }

        return qty + ' ' + this.timeUnits[unit] + (qty == 1 ? '' : 's');
    }
});
