/* global define */

/**
 * @file router.js
 */

define([
    'backbone',
    'views/app'
], function (Backbone, AppView) {
    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            '': 'main'
        },
        
        main: function () {
            new AppView();
        }
    });

    return {
        initialize: function () {
            new Router();
            Backbone.history.start();
        }
    };

});