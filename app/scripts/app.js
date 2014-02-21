/* global define */

define([
	'backbone',
	'router'
], function (Backbone, Router) {
    'use strict';

    function initialize() {
        Router.initialize();
    }

    return {
        initialize: initialize
    };
});