/* global require */

require.config({
    paths: {
        jquery: '../lib/jquery/jquery',
        underscore: '../lib/underscore-amd/underscore',
        backbone: '../lib/backbone/backbone',
        localStorage: '../lib/backbone.localStorage/backbone.localStorage'
    },
    shim: {
        'backbone': {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        }
    }
});

require([
    'app'
], function (app) {
    'use strict';
    
    app.initialize();
});
