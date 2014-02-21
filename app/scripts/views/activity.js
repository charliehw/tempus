/* global define */

define([
    'underscore',
    'backbone',
    'views/clock'
], function (_, Backbone, ClockView) {
    'use strict';

    var ActivityView = Backbone.View.extend({

        el: '#current-activity',
        
        template: _.template($('#activity-template').html()),

        initialize: function () {
            this.createClock();
            this.render();
        },

        events: {
            'click .btn': 'complete'
        },

        render: function () {
            this.$el.html(this.template({
                task: this.model.get('task')
            }));
            this.$el.prepend(this.clock.el);
            return this;
        },

        createClock: function () {
            this.clock = new ClockView({
                model: this.model.clock
            });
        },

        complete: function () {
            var self = this;
            this.model.set('duration', Date.now() - this.model.get('start'));
            this.model.set('complete', true);
            setTimeout(function () {
                self.remove();
            }, 800);
        },

        remove: function () {
            this.clock.model.pause();
            this.clock.remove();
            this.stopListening();
            this.$el.empty();
            return this;
        }

    });

    return ActivityView;
});