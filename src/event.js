
var Event = function () {
    var listen, obj, one, remove, trigger, __this;
    obj = {};
    __this = this;
    Event.obj = require && require('../setting').debug ? obj : {} || {}; //only for test

    
    listen = function (key, eventfn) {
        var stack, _ref;
        stack = ( _ref = obj[key] ) != null ? _ref : obj[key] = [];
        return stack.push(eventfn);
    };
    
    one = function (key, eventfn) {
        remove(key);
        return listen(key, eventfn);
    };
    remove = function (key) {
        var _ref;
        return ( _ref = obj[key] ) != null ? _ref.length = 0 : void 0;
    };
   
    trigger = function () {
        var fn, stack, _i, _len, _ref, key;
        key = Array.prototype.shift.call(arguments);
        stack = ( _ref = obj[key] ) != null ? _ref : obj[key] = [];
        for (_i = 0, _len = stack.length; _i < _len; _i++) {
            fn = stack[_i];
            if (fn.apply(__this, arguments) === false) {
                return false;
            }
        }
    };
    return {
        listen: listen,
        one: one,
        remove: remove,
        trigger: trigger
    }
};
module.exports = Event;

