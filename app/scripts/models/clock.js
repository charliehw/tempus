/* global define */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ClockModel = Backbone.Model.extend({
        
    	defaults: {
            duration: 0
        },

        initialize: function () {
            this.record();
        },

        getTime: function () {
            var d = this.get('duration'),
                hours = Math.floor(d / 3600),
                minutes = Math.floor((d - (hours * 3600)) / 60),
                seconds = d - (hours * 3600) - (minutes * 60);

            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        },

        record: function () {
            var clock = this;
            this.interval = window.setInterval(function () {
                clock.set('duration', clock.get('duration') + 1);
            }, 1000);
            return this;
        },

        pause: function () {
            window.clearInterval(this.interval);
            return this;
        }

    });

    return ClockModel;
});