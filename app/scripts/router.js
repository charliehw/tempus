/* global define */

/**
 * @file router.js
 */

define([
    'backbone', 
    'router', 
    'views/app'
], function (Backbone, Router, AppView) {
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
            var router = new Router();
            Backbone.history.start();
        }
    };

});