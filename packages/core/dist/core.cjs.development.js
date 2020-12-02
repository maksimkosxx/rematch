'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Redux = require('redux');

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

function createReduxStore(bag) {
  for (var _iterator = _createForOfIteratorHelperLoose(bag.models), _step; !(_step = _iterator()).done;) {
    var model = _step.value;
    createModelReducer(bag, model);
  }

  var rootReducer = createRootReducer(bag);
  var middlewares = Redux.applyMiddleware.apply(Redux, bag.reduxConfig.middlewares);
  var enhancers = composeEnhancersWithDevtools(bag.reduxConfig.devtoolOptions).apply(void 0, bag.reduxConfig.enhancers.concat([middlewares]));
  var createStore = bag.reduxConfig.createStore || Redux.createStore;
  var bagInitialState = bag.reduxConfig.initialState;
  var initialState = bagInitialState === undefined ? {} : bagInitialState;
  return createStore(rootReducer, initialState, enhancers);
}
function createModelReducer(bag, model) {
  var modelReducers = {};

  for (var _i = 0, _Object$keys = Object.keys(model.reducers); _i < _Object$keys.length; _i++) {
    var reducerKey = _Object$keys[_i];
    var actionName = isAlreadyActionName(reducerKey) ? reducerKey : model.name + "/" + reducerKey;
    modelReducers[actionName] = model.reducers[reducerKey];
  }

  var combinedReducer = function combinedReducer(state, action) {
    if (state === void 0) {
      state = model.state;
    }

    if (action.type in modelReducers) {
      return modelReducers[action.type](state, action.payload);
    }

    return state;
  };

  var modelBaseReducer = model.baseReducer;
  var reducer = !modelBaseReducer ? combinedReducer : function (state, action) {
    if (state === void 0) {
      state = model.state;
    }

    return combinedReducer(modelBaseReducer(state, action), action);
  };
  bag.forEachPlugin('onReducer', function (onReducer) {
    reducer = onReducer(reducer, model.name, bag) || reducer;
  });
  bag.reduxConfig.reducers[model.name] = reducer;
}
function createRootReducer(bag) {
  var rootReducers = bag.reduxConfig.rootReducers;
  var mergedReducers = mergeReducers(bag.reduxConfig);
  var rootReducer = mergedReducers;

  if (rootReducers && Object.keys(rootReducers).length) {
    rootReducer = function rootReducer(state, action) {
      var actionRootReducer = rootReducers[action.type];

      if (actionRootReducer) {
        return mergedReducers(actionRootReducer(state, action), action);
      }

      return mergedReducers(state, action);
    };
  }

  bag.forEachPlugin('onRootReducer', function (onRootReducer) {
    rootReducer = onRootReducer(rootReducer, bag) || rootReducer;
  });
  return rootReducer;
}

function mergeReducers(reduxConfig) {
  var combineReducers = reduxConfig.combineReducers || Redux.combineReducers;

  if (!Object.keys(reduxConfig.reducers).length) {
    return function (state) {
      return state;
    };
  }

  return combineReducers(reduxConfig.reducers);
}

function composeEnhancersWithDevtools(devtoolOptions) {
  if (devtoolOptions === void 0) {
    devtoolOptions = {};
  }

  var _devtoolOptions = devtoolOptions,
      disabled = _devtoolOptions.disabled,
      options = _objectWithoutPropertiesLoose(_devtoolOptions, ["disabled"]);

  return !disabled && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options) : Redux.compose;
}

function isAlreadyActionName(reducerKey) {
  return reducerKey.indexOf('/') > -1;
}

var isObject = function isObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};
var ifDefinedIsFunction = function ifDefinedIsFunction(func) {
  return !func || typeof func === 'function';
};

var validate = function validate(runValidations) {
  {
    var validations = runValidations();
    var errors = [];

    for (var _iterator = _createForOfIteratorHelperLoose(validations), _step; !(_step = _iterator()).done;) {
      var validation = _step.value;
      var isInvalid = validation[0];
      var errorMessage = validation[1];

      if (isInvalid) {
        errors.push(errorMessage);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
};

var validateConfig = function validateConfig(config) {
  validate(function () {
    return [[!Array.isArray(config.plugins), 'init config.plugins must be an array'], [!isObject(config.models), 'init config.models must be an object'], [!isObject(config.redux.reducers), 'init config.redux.reducers must be an object'], [!Array.isArray(config.redux.middlewares), 'init config.redux.middlewares must be an array'], [!Array.isArray(config.redux.enhancers), 'init config.redux.enhancers must be an array of functions'], [!ifDefinedIsFunction(config.redux.combineReducers), 'init config.redux.combineReducers must be a function'], [!ifDefinedIsFunction(config.redux.createStore), 'init config.redux.createStore must be a function']];
  });
};
var validateModel = function validateModel(model) {
  validate(function () {
    return [[!model, 'model config is required'], [typeof model.name !== 'string', 'model "name" [string] is required'], [model.state === undefined && model.baseReducer === undefined, 'model "state" is required'], [!ifDefinedIsFunction(model.baseReducer), 'model "baseReducer" must be a function']];
  });
};
var validatePlugin = function validatePlugin(plugin) {
  validate(function () {
    return [[!ifDefinedIsFunction(plugin.onStoreCreated), 'Plugin onStoreCreated must be a function'], [!ifDefinedIsFunction(plugin.onModel), 'Plugin onModel must be a function'], [!ifDefinedIsFunction(plugin.onReducer), 'Plugin onReducer must be a function'], [!ifDefinedIsFunction(plugin.onRootReducer), 'Plugin onRootReducer must be a function'], [!ifDefinedIsFunction(plugin.createMiddleware), 'Plugin createMiddleware must be a function']];
  });
};
var validateModelReducer = function validateModelReducer(modelName, reducers, reducerName) {
  validate(function () {
    return [[!!reducerName.match(/\/.+\//), "Invalid reducer name (" + modelName + "/" + reducerName + ")"], [typeof reducers[reducerName] !== 'function', "Invalid reducer (" + modelName + "/" + reducerName + "). Must be a function"]];
  });
};
var validateModelEffect = function validateModelEffect(modelName, effects, effectName) {
  validate(function () {
    return [[!!effectName.match(/\//), "Invalid effect name (" + modelName + "/" + effectName + ")"], [typeof effects[effectName] !== 'function', "Invalid effect (" + modelName + "/" + effectName + "). Must be a function"]];
  });
};

var createActionDispatcher = function createActionDispatcher(rematch, modelName, actionName, isEffect) {
  return Object.assign(function (payload) {
    var action = {
      type: modelName + "/" + actionName
    };

    if (typeof payload !== 'undefined') {
      action.payload = payload;
    }

    return rematch.dispatch(action);
  }, {
    isEffect: isEffect
  });
};

var createDispatcher = function createDispatcher(rematch, bag, model) {
  var modelDispatcher = rematch.dispatch[model.name];

  for (var _i = 0, _Object$keys = Object.keys(model.reducers); _i < _Object$keys.length; _i++) {
    var reducerName = _Object$keys[_i];
    validateModelReducer(model.name, model.reducers, reducerName);
    modelDispatcher[reducerName] = createActionDispatcher(rematch, model.name, reducerName, false);
  }

  var effects = {};

  if (model.effects) {
    effects = typeof model.effects === 'function' ? model.effects(rematch.dispatch) : model.effects;
  }

  for (var _i2 = 0, _Object$keys2 = Object.keys(effects); _i2 < _Object$keys2.length; _i2++) {
    var effectName = _Object$keys2[_i2];
    validateModelEffect(model.name, effects, effectName);
    bag.effects[model.name + "/" + effectName] = effects[effectName].bind(modelDispatcher);
    modelDispatcher[effectName] = createActionDispatcher(rematch, model.name, effectName, true);
  }
};

function createRematchBag(config) {
  return {
    models: createNamedModels(config.models),
    reduxConfig: config.redux,
    forEachPlugin: function forEachPlugin(method, fn) {
      for (var _iterator = _createForOfIteratorHelperLoose(config.plugins), _step; !(_step = _iterator()).done;) {
        var plugin = _step.value;

        if (plugin[method]) {
          fn(plugin[method]);
        }
      }
    },
    effects: {}
  };
}

function createNamedModels(models) {
  return Object.keys(models).map(function (modelName) {
    var model = createNamedModel(modelName, models[modelName]);
    validateModel(model);
    return model;
  });
}

function createNamedModel(name, model) {
  return _extends({
    name: name,
    reducers: {}
  }, model);
}

function createRematchStore(config) {
  var bag = createRematchBag(config);
  bag.reduxConfig.middlewares.push(createEffectsMiddleware(bag));
  bag.forEachPlugin('createMiddleware', function (createMiddleware) {
    bag.reduxConfig.middlewares.push(createMiddleware(bag));
  });
  var reduxStore = createReduxStore(bag);

  var rematchStore = _extends({}, reduxStore, {
    name: config.name,
    addModel: function addModel(model) {
      validateModel(model);
      createModelReducer(bag, model);
      prepareModel(this, bag, model);
      this.replaceReducer(createRootReducer(bag));
      reduxStore.dispatch({
        type: '@@redux/REPLACE'
      });
    }
  });

  addExposed(rematchStore, config.plugins);
  rematchStore.addModel.bind(rematchStore);

  for (var _iterator = _createForOfIteratorHelperLoose(bag.models), _step; !(_step = _iterator()).done;) {
    var model = _step.value;
    prepareModel(rematchStore, bag, model);
  }

  bag.forEachPlugin('onStoreCreated', function (onStoreCreated) {
    rematchStore = onStoreCreated(rematchStore, bag) || rematchStore;
  });
  return rematchStore;
}

function createEffectsMiddleware(bag) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (action.type in bag.effects) {
          next(action);
          return bag.effects[action.type](action.payload, store.getState());
        }

        return next(action);
      };
    };
  };
}

function prepareModel(rematchStore, bag, model) {
  var modelDispatcher = {};
  rematchStore.dispatch["" + model.name] = modelDispatcher;
  createDispatcher(rematchStore, bag, model);
  bag.forEachPlugin('onModel', function (onModel) {
    onModel(model, rematchStore);
  });
}

function addExposed(store, plugins) {
  for (var _iterator2 = _createForOfIteratorHelperLoose(plugins), _step2; !(_step2 = _iterator2()).done;) {
    var plugin = _step2.value;

    if (plugin.exposed) {
      var _loop = function _loop() {
        var key = _Object$keys[_i];
        var exposedItem = plugin.exposed[key];
        var isExposedFunction = typeof exposedItem === 'function';
        store[key] = isExposedFunction ? function () {
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          return exposedItem.apply(void 0, [store].concat(params));
        } : Object.create(plugin.exposed[key]);
      };

      for (var _i = 0, _Object$keys = Object.keys(plugin.exposed); _i < _Object$keys.length; _i++) {
        _loop();
      }
    }
  }
}

var count = 0;
function createConfig(initConfig) {
  var _initConfig$name, _initConfig$redux$dev, _initConfig$redux;

  var storeName = (_initConfig$name = initConfig.name) !== null && _initConfig$name !== void 0 ? _initConfig$name : "Rematch Store " + count;
  count += 1;
  var config = {
    name: storeName,
    models: initConfig.models || {},
    plugins: initConfig.plugins || [],
    redux: _extends({
      reducers: {},
      rootReducers: {},
      enhancers: [],
      middlewares: []
    }, initConfig.redux, {
      devtoolOptions: _extends({
        name: storeName
      }, (_initConfig$redux$dev = (_initConfig$redux = initConfig.redux) === null || _initConfig$redux === void 0 ? void 0 : _initConfig$redux.devtoolOptions) !== null && _initConfig$redux$dev !== void 0 ? _initConfig$redux$dev : {})
    })
  };
  validateConfig(config);

  for (var _iterator = _createForOfIteratorHelperLoose(config.plugins), _step; !(_step = _iterator()).done;) {
    var plugin = _step.value;

    if (plugin.config) {
      config.models = merge(config.models, plugin.config.models);

      if (plugin.config.redux) {
        config.redux.initialState = merge(config.redux.initialState, plugin.config.redux.initialState);
        config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers);
        config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers);
        config.redux.enhancers = [].concat(config.redux.enhancers, plugin.config.redux.enhancers || []);
        config.redux.middlewares = [].concat(config.redux.middlewares, plugin.config.redux.middlewares || []);
        config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers;
        config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore;
      }
    }

    validatePlugin(plugin);
  }

  return config;
}

function merge(original, extra) {
  return extra ? _extends({}, extra, original) : original;
}

var init = function init(initConfig) {
  var config = createConfig(initConfig || {});
  return createRematchStore(config);
};
var createModel = function createModel() {
  return function (mo) {
    var _mo$reducers = mo.reducers,
        reducers = _mo$reducers === void 0 ? {} : _mo$reducers,
        _mo$effects = mo.effects,
        effects = _mo$effects === void 0 ? {} : _mo$effects;
    return _extends({}, mo, {
      reducers: reducers,
      effects: effects
    });
  };
};
var index = {
  init: init,
  createModel: createModel
};

exports.createModel = createModel;
exports.default = index;
exports.init = init;
//# sourceMappingURL=core.cjs.development.js.map
