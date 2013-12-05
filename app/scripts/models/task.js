/* global define */

define([
    'underscore',
    'backbone'
], function(_, Backbone){
    'use strict';

    var TaskModel = Backbone.Model.extend({
        defaults: {
            title: ''
        }
    });

    return TaskModel;
});