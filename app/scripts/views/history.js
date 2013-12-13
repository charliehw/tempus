/* global define */

define([
	'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    'use strict';

    var HistoryView = Backbone.View.extend({

    	el: '#activity-history',

        templates: {
            empty: _.template($('#history-empty-template').html()),
            section: _.template($('#history-section-template').html()),
            grouped: _.template($('#history-grouped-template').html())
        },

    	initialize: function () {
            this.listenTo(this.collection, 'change add', this.render);
    		this.render();
    	},

        render: function () {
            if (this.collection.length < 1) {
                this.$el.html(this.templates.empty());
            } else {
                var html = '',
                    activityGroups = this.groups();

                if (activityGroups.today.length > 0) {  
                    html += this.templates.section({
                        heading: 'Today',
                        activities: this.formatSubset(activityGroups.today)
                    })
                }

                if (activityGroups.thisWeek.length > 0) {
                    html += this.templates.grouped({
                        heading: 'Earlier This Week',
                        days: this.formatGrouped(activityGroups.thisWeek)
                    });
                }

                if (activityGroups.lastWeek.length > 0) {
                    html += this.templates.grouped({
                        heading: 'Last Week',
                        activities: this.formatGrouped(activityGroups.lastWeek)
                    });
                }

                this.$el.html(html);
            }
        },

        groups: function () {
            return {
                today: this.collection.today(),
                thisWeek: this.collection.thisWeek(),
                lastWeek: this.collection.lastWeek()
            };
        },

        formatSubset: function (group) {
            var self = this;
            group = group.reverse();
            return _.map(group, function (activity) {
                var time = new Date(activity.get('start'));
                return {
                    task: activity.get('task'),
                    start: ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2),
                    duration: activity.get('complete') ? self.getTime(activity.get('duration')) : 'In Progress'
                };
            });
        },

        formatGrouped: function (group) {
            // Group activities by day
            var grouped = _.groupBy(group, function (activity) {
                    return activity.get('day');
                }),
                data,
                self = this;

            for (var i = 0; i < 7; i++) {
                if (grouped[i]) {

                    // Group activities in a day by task name
                    grouped[i] = _.groupBy(grouped[i], function (activity) {
                        return activity.get('task');
                    });

                    for (var taskGroup in grouped[i]) {
                        if (grouped[i].hasOwnProperty(taskGroup)) {

                            // Set a useful object in place of the array of actual activities
                            data = {task: '', occurences: 0, duration: 0};

                            _.each(grouped[i][taskGroup], function (activity) {
                                data.task = activity.get('task');
                                data.occurences++;
                                data.duration += activity.get('duration');
                            });

                            data.duration = self.getTime(data.duration);

                            grouped[i][taskGroup] = data;
                            
                        }
                    }

                }
            }

            return grouped;
        },

        getTime: function (duration) {
            var d = duration / 1000,
                hours = Math.floor(d / 3600),
                minutes = Math.floor((d - (hours * 3600)) / 60);

            hours = hours > 0 ? hours + 'h' : '';
            minutes = minutes > 0 ? minutes + 'm' : '';

            if (!hours && !minutes) {
                return 'Less than one minute';
            } else {
                return hours + minutes;
            }
        }
    	
    });

    return HistoryView;
});