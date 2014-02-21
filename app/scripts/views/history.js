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
            var html = '',
                key,
                activityGroups = this.groups();

            if (this.collection.length) {
                for (key in activityGroups) {
                    if (activityGroups.hasOwnProperty(key)) {
                        if (activityGroups[key].tasks.length) {
                            html += activityGroups[key].template({
                                heading: key,
                                activities: activityGroups[key].tasks
                            });
                        }
                    }
                }

                this.$el.html(html);
            }

            if (!html) {
                this.$el.html(this.templates.empty());
            }

            return this;
        },

        groups: function () {
            return {
                'Today': {
                    tasks: this.formatSubset(this.collection.today()), // Tasks today ungrouped
                    template: this.templates.section
                },
                'Earlier This Week': {
                    tasks: this.formatGrouped(this.collection.thisWeek()),
                    template: this.templates.grouped
                },
                'Last Week': {
                    tasks: this.formatGrouped(this.collection.lastWeek()),
                    template: this.templates.grouped
                }
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
                self = this,
                sortActivityByTask = function (activity) {
                    return activity.get('task');
                },
                groupSameTasks = function (activity) {
                    data.task = activity.get('task');
                    data.occurences++;
                    data.duration += activity.get('duration');
                };

            for (var i = 0; i < 7; i++) {
                if (grouped[i]) {

                    // Group activities in a day by task name
                    grouped[i] = _.groupBy(grouped[i], sortActivityByTask);

                    for (var taskGroup in grouped[i]) {
                        if (grouped[i].hasOwnProperty(taskGroup)) {

                            // Set a useful object in place of the array of actual activities
                            data = {task: '', occurences: 0, duration: 0};

                            _.each(grouped[i][taskGroup], groupSameTasks);

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