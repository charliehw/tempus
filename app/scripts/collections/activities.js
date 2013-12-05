/* global define */

define([
    'underscore',
    'backbone',
    'localStorage',
    'models/activity'
], function (_, Backbone, Storage, Activity) {
    'use strict';

    var ActivitiesCollection = Backbone.Collection.extend({
        
    	model: Activity,

    	localStorage: new Storage('activities'),

        initialize: function () {
            this.on('change add', this.save);
        },

        today: function () {
            var startOfToday = this.getTodayDate();

            return this.filter(function (activity) {
                return activity.get('start') >= startOfToday.getTime();
            });
        },

        thisWeek: function () {
            var today = this.getTodayDate(),
                monday = this.getMondayDate(today);                

            return this.filter(function (activity) {
                var start = activity.get('start');
                return start >= monday.getTime() && start < today.getTime();
            });
        },

        lastWeek: function () {
            var monday = this.getMondayDate(),
                lastMonday = new Date(monday);
            lastMonday.setDate(lastMonday.getDate() - 7);

            return this.filter(function (activity) {
                var start = activity.get('start');
                return start >= lastMonday.getTime() && start < monday.getTime();
            });
        },

        getTodayDate: function () {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        },

        getMondayDate: function (today) {
            var monday = new Date(today || this.getTodayDate());
            monday.setDate(monday.getDate() - monday.getDay() + 1);
            return monday;
        },

        save: function () {
            this.each(function (activity) {
                activity.save();
            });
        },

        comparator: 'start'

    });

    return new ActivitiesCollection();
});