define(["immutable"], function(immutable) {
    "use strict";

    function shallowImmutableEqual(objA, objB) {
        if (immutable.is(objA, objB)) {
            return true;
        }

        if (objA === objB) {
            return true;
        }

        if (!objA || !objB) {
            return false;
        }

        if (typeof objA !== 'object' || typeof objB !== 'object') {
            return false;
        }

        var key;
        // Test for A's keys different from B.
        for (key in objA) {
            if (objA.hasOwnProperty(key) &&
                (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
                return false;
            }
        }
        // Test for B's keys missing from A.
        for (key in objB) {
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    var ImmutableRenderMixin = {
        shouldComponentUpdate: function(nextProps, nextState) {
            return !shallowImmutableEqual(this.props, nextProps) ||
                   !shallowImmutableEqual(this.state, nextState);
        }
    };

    return {
        ImmutableRenderMixin: ImmutableRenderMixin
    };
});
