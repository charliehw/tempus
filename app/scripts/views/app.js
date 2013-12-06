/* global define */

define([
	'jquery',
    'underscore',
    'backbone',
    'models/activity',
    'views/activity',
    'views/history',
    'collections/activities'
], function ($, _, Backbone, ActivityModel, ActivityView, HistoryView, ActivitiesCollection) {
    'use strict';

    var AppView = Backbone.View.extend({

    	el: '#tempus-app',

    	initialize: function () {
    		this.$input = this.$('.form-control');
            this.$actions = this.$('#activity-actions');
            this.activities = ActivitiesCollection;
            this.activities.fetch();

            if (!this.activities.last().get('complete')) {
                this.currentActivity = this.activities.last();
                this.currentActivity.set('duration', Date.now() - this.currentActivity.get('duration'));
                this.viewCurrentActivity();
            }
            
            this.history = new HistoryView({
                collection: this.activities
            });
    	},

        events: {
            'submit #form-main': 'createActivity',
            'click [data-action=history]': 'showHistory'
        },

        createActivity: function () {
            var val = this.$input.val();
            if (!val) {
                this.$input.focus();
                return false;
            }

            this.currentActivity = new ActivityModel({
                task: val,
                start: Date.now(),
                day: new Date().getDay()
            });

            this.activities.add(this.currentActivity);
            this.viewCurrentActivity();

            return false;
        },

        viewCurrentActivity: function () {
            var activityView = new ActivityView({
                model: this.currentActivity
            });

            this.listenTo(this.currentActivity, 'change:complete', this.completeActivity);

            this.$actions.addClass('left');
            this.$input.val('');
        },

        completeActivity: function () {
            this.$actions.removeClass('left');
        },

        showHistory: function () {
            this.$actions.toggleClass('up');
            this.history.$el.toggleClass('up');
            this.$('[data-action=history]').toggleClass('back');
        }
    	
    });

    return AppView;
});