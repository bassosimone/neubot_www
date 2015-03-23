/*-
 * This file is part of Neubot.
 *
 * Neubot is free software. See AUTHORS and LICENSE for more
 * information on the copying conditions.
 */
/*jslint node: true */
"use strict";

var http = require("http");
var qrs = require("querystring");
var url = require("url");

var config = {
    "enabled": 1,
    "privacy.can_collect": 1,
    "privacy.can_publish": 1,
    "privacy.informed": 1,
    "runner.enabled": 1,
    "prefer_ipv6": 0,
    "uuid": "b1c56d4a-f83a-4842-842e-1322f6c0ecbf",
    "verbose": 0,
    "version": "4.5",
    "www.lang": "it"
};

var getNow = function () {
    var date = new Date();
    return Number((1000 * date.getTime()).toFixed(0));
};

http.createServer(function (request, response) {
    var key;
    console.info("Request Method: %s", request.method);
    console.info("Request URI: %s", request.url);
    for (key in request.headers) {
        if (request.headers.hasOwnProperty(key)) {
            console.info("Header: %s => %s", key, request.headers[key]);
        }
    }

    var body = "";

    var svr_url = url.parse(request.url);

    if (svr_url.pathname === "/api/config") {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        });
        if (request.method === "POST") {
            request.on("data", function (data) {
                body += data;
            });
            request.on("end", function () {
                var temp_config = qrs.parse(body);
                Object.keys(config).forEach(function (key) {
                    if (temp_config[key] !== undefined) {
                        config[key] = temp_config[key];
                    }
                });
                response.end("{}\n");
            });
        }
        if (request.method === "GET") {
            response.end(JSON.stringify(config));
        }
        return;
    }

    if (svr_url.pathname === "/api/state") {
        setTimeout(function () {
            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify({
                "t": getNow(),
                "events": {
                    "config": config
                }
            }));
        }, 1000);
        return;
    }

    setTimeout(function () {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        });
        response.end("{}\n");
    }, 60000);

}).listen(9774, "127.0.0.1", function () {
    console.info('Server running at http://127.0.0.1:9774/');
});
