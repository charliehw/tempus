/* global define */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ClockView = Backbone.View.extend({

        className: 'clock-canvas',

        tagName: 'canvas',
        
        initialize: function () {
            this.el.width = 50;
            this.el.height = 50;
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            var time = this.model.getTime(),
                w = this.el.width,
                r = w/2,
                context = this.el.getContext('2d');

            context.clearRect(0, 0, w, w);

            this.drawSector(context, r, time.seconds/60, 'rgba(255, 0, 0, 0.3)');
            this.drawSector(context, r, time.minutes/60, 'rgba(0, 255, 0, 0.3)');
            this.drawSector(context, r, time.hours/24, 'rgba(0, 0, 255, 0.3)');
            this.$el.addClass('show');
        },

        drawSector: function (context, r, factor, color) {
            context.beginPath();
            context.moveTo(r, r);
            context.arc(r, r, r, factor * (2*Math.PI), 0, true);
            context.lineTo(r, r);
            context.closePath();
            context.fillStyle = color;
            context.fill();
        }

    });

    return ClockView;
});