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
            this.storeElements();
            this.activities = ActivitiesCollection;
            this.activities.fetch();

            this.populateSuggestions();

            this.fetchCurrentActivity(); // If the last activity from storage is incomplete, create a view for it       
            
            this.history = new HistoryView({
                collection: this.activities
            });
    	},

        events: {
            'submit #form-main': 'createActivity',
            'click [data-action=history]': 'showHistory',
            'click [data-action=options]': 'showOptions',
            'click .activity-suggestions li': 'activateSuggestion'
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

        fetchCurrentActivity: function () {
            if (this.activities.length) {
                if (!this.activities.last().get('complete')) {
                    this.currentActivity = this.activities.last();
                    this.currentActivity.set('duration', Date.now() - this.currentActivity.get('start'));
                    this.viewCurrentActivity();
                }
            }  
        },

        completeActivity: function () {
            this.$actions.removeClass('left');
            this.populateSuggestions();
        },

        showHistory: function () {
            this.$actions.toggleClass('up');
            this.history.$el.toggleClass('up');
            this.$('[data-action=history]').toggleClass('back');
        },

        showOptions: function () {
            this.$options.toggleClass('show');
        },

        storeElements: function () {
            this.$input = this.$('.form-control');
            this.$actions = this.$('#activity-actions');
            this.$options = this.$('#options');
            this.$suggestions = this.$('.activity-suggestions');
        },

        populateSuggestions: function () {

        },

        activateSuggestion: function (e) {
            var task = $(e.target).text();
            this.$input.val(task);
            this.$('#form-main').submit();
        }
    	
    });

    return AppView;
});