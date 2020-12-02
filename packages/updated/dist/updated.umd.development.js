(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['@rematch/updated'] = {}));
}(this, (function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var updatedPlugin = function updatedPlugin(config) {
    if (config === void 0) {
      config = {};
    }

    var updatedModelName = config.name || 'updated';
    var updated = {
      name: updatedModelName,
      state: {},
      reducers: {
        onUpdate: function onUpdate(state, payload) {
          var _extends2, _extends3;

          return _extends({}, state, (_extends3 = {}, _extends3[payload.name] = _extends({}, state[payload.name], (_extends2 = {}, _extends2[payload.action] = config.dateCreator ? config.dateCreator() : new Date(), _extends2)), _extends3));
        }
      }
    };
    var avoidModels = [].concat(config.blacklist || [], [updatedModelName]);
    return {
      config: {
        models: {
          updated: updated
        }
      },
      onModel: function onModel(_ref, rematch) {
        var name = _ref.name;

        if (avoidModels.includes(name)) {
          return;
        }

        var modelActions = rematch.dispatch[name];
        updated.state[name] = {};

        var _loop = function _loop() {
          var action = _Object$keys[_i];

          if (rematch.dispatch[name][action].isEffect) {
            var originalDispatcher = rematch.dispatch[name][action];

            rematch.dispatch[name][action] = function () {
              var effectResult = originalDispatcher.apply(void 0, arguments);

              if (effectResult === null || effectResult === void 0 ? void 0 : effectResult.then) {
                effectResult.then(function (result) {
                  rematch.dispatch[updatedModelName].onUpdate({
                    name: name,
                    action: action
                  });
                  return result;
                });
              } else {
                rematch.dispatch[updatedModelName].onUpdate({
                  name: name,
                  action: action
                });
              }

              return effectResult;
            };
          }
        };

        for (var _i = 0, _Object$keys = Object.keys(modelActions); _i < _Object$keys.length; _i++) {
          _loop();
        }
      }
    };
  };

  exports.default = updatedPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=updated.umd.development.js.map
