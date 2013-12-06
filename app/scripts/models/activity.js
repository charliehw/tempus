/* global define */

define([
    'underscore',
    'backbone',
    'models/clock'
], function (_, Backbone, ClockModel) {
    'use strict';

    var ActivityModel = Backbone.Model.extend({
        defaults: {
            task: '',
            duration: 0,
            start: 0,
            complete: false 
        },

        initialize: function () {
            this.clock = new ClockModel({
                duration: this.get('duration')
            });
        }
    });

    return ActivityModel;
});