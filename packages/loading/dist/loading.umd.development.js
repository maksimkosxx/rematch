(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['@rematch/loading'] = {}));
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

  var createLoadingAction = function createLoadingAction(converter, i, cntState) {
    return function (state, payload) {
      var _extends2, _extends3, _extends4;

      var _ref = payload || {
        name: '',
        action: ''
      },
          name = _ref.name,
          action = _ref.action;

      cntState.global += i;
      cntState.models[name] += i;
      cntState.effects[name][action] += i;
      return _extends({}, state, {
        global: converter(cntState.global),
        models: _extends({}, state.models, (_extends2 = {}, _extends2[name] = converter(cntState.models[name]), _extends2)),
        effects: _extends({}, state.effects, (_extends4 = {}, _extends4[name] = _extends({}, state.effects[name], (_extends3 = {}, _extends3[action] = converter(cntState.effects[name][action]), _extends3)), _extends4))
      });
    };
  };

  var validateConfig = function validateConfig(config) {
    {
      if (config.name && typeof config.name !== 'string') {
        throw new Error('loading plugin config name must be a string');
      }

      if (config.asNumber && typeof config.asNumber !== 'boolean') {
        throw new Error('loading plugin config asNumber must be a boolean');
      }

      if (config.whitelist && !Array.isArray(config.whitelist)) {
        throw new Error('loading plugin config whitelist must be an array of strings');
      }

      if (config.blacklist && !Array.isArray(config.blacklist)) {
        throw new Error('loading plugin config blacklist must be an array of strings');
      }

      if (config.whitelist && config.blacklist) {
        throw new Error('loading plugin config cannot have both a whitelist & a blacklist');
      }
    }
  };

  var index = (function (config) {
    if (config === void 0) {
      config = {};
    }

    validateConfig(config);
    var loadingModelName = config.name || 'loading';
    var cntState = {
      global: 0,
      models: {},
      effects: {}
    };
    var isAsNumber = config.asNumber === true;
    var loadingInitialState = {
      global: 0,
      models: {},
      effects: {}
    };
    var converter = isAsNumber ? function (cnt) {
      return cnt;
    } : function (cnt) {
      return cnt > 0;
    };
    var loading = {
      name: loadingModelName,
      reducers: {
        hide: createLoadingAction(converter, -1, cntState),
        show: createLoadingAction(converter, 1, cntState)
      },
      state: loadingInitialState
    };
    var initialLoadingValue = converter(0);
    loadingInitialState.global = initialLoadingValue;
    return {
      config: {
        models: {
          loading: loading
        }
      },
      onModel: function onModel(_ref2, rematch) {
        var name = _ref2.name;

        if (name === loadingModelName) {
          return;
        }

        cntState.models[name] = 0;
        cntState.effects[name] = {};
        loadingInitialState.models[name] = initialLoadingValue;
        loadingInitialState.effects[name] = {};
        var modelActions = rematch.dispatch[name];
        Object.keys(modelActions).forEach(function (action) {
          if (!rematch.dispatch[name][action].isEffect) {
            return;
          }

          cntState.effects[name][action] = 0;
          loadingInitialState.effects[name][action] = initialLoadingValue;
          var actionType = name + "/" + action;

          if (config.whitelist && !config.whitelist.includes(actionType)) {
            return;
          }

          if (config.blacklist && config.blacklist.includes(actionType)) {
            return;
          }

          var origEffect = rematch.dispatch[name][action];

          var effectWrapper = function effectWrapper() {
            try {
              rematch.dispatch[loadingModelName].show({
                name: name,
                action: action
              });
              var effectResult = origEffect.apply(void 0, arguments);

              if (effectResult === null || effectResult === void 0 ? void 0 : effectResult.then) {
                effectResult.then(function (r) {
                  rematch.dispatch[loadingModelName].hide({
                    name: name,
                    action: action
                  });
                  return r;
                })["catch"](function (err) {
                  rematch.dispatch[loadingModelName].hide({
                    name: name,
                    action: action
                  });
                  throw err;
                });
              } else {
                rematch.dispatch[loadingModelName].hide({
                  name: name,
                  action: action
                });
              }

              return effectResult;
            } catch (error) {
              rematch.dispatch[loadingModelName].hide({
                name: name,
                action: action
              });
              throw error;
            }
          };

          effectWrapper.isEffect = true;
          rematch.dispatch[name][action] = effectWrapper;
        });
      }
    };
  });

  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=loading.umd.development.js.map
