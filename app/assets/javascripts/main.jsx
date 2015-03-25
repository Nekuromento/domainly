require.config({
    paths: {
        jquery: "../lib/jquery/jquery",
        react: "../lib/react/react",
        flux: "../lib/flux/flux",
        immutable: "../lib/immutable/immutable",
        EventEmitter: "../lib/EventEmitter/EventEmitter",
        d3: "../lib/d3js/d3"
    },
    packages: [
        {
            name: "react-d3",
            main: "index"
        }
    ],
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        jquery: {
            exports: "$"
        }
    }
});

require([
    "react",
    "components/Application"
], function(React, Application) {
    "use strict";

    React.render(<Application/>, document.getElementById("app"));
});
