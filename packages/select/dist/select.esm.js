import { createSelector, createStructuredSelector } from 'reselect';
export { createSelector, createStructuredSelector } from 'reselect';

var makeSelect = function makeSelect() {
  function select(mapSelectToStructure, structuredSelectorCreator) {
    if (structuredSelectorCreator === void 0) {
      structuredSelectorCreator = createStructuredSelector;
    }

    var _func = function func(state, props) {
      _func = structuredSelectorCreator(mapSelectToStructure(select));
      return _func(state, props);
    };

    return function (state, props) {
      return _func(state, props);
    };
  }

  return select;
};

var makeFactoryGroup = function makeFactoryGroup() {
  var ready = false;
  var factories = new Set();
  return {
    add: function add(added) {
      if (!ready) {
        added.forEach(function (factory) {
          return factories.add(factory);
        });
      } else {
        added.forEach(function (factory) {
          return factory();
        });
      }
    },
    finish: function finish(factory) {
      factories["delete"](factory);
    },
    startBuilding: function startBuilding() {
      ready = true;
      factories.forEach(function (factory) {
        return factory();
      });
    }
  };
};

var validateConfig = function validateConfig(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (config.sliceState && typeof config.sliceState !== 'function') {
      throw new Error('select plugin config sliceState must be a function');
    }

    if (config.selectorCreator && typeof config.selectorCreator !== 'function') {
      throw new Error('select plugin config selectorCreator must be a function');
    }
  }
};

var validateSelector = function validateSelector(selectorFactories, selectorName, model) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof (selectorFactories === null || selectorFactories === void 0 ? void 0 : selectorFactories[selectorName]) !== 'function') {
      throw new Error("Selector (" + model.name + "/" + selectorName + ") must be a function");
    }
  }
};

var createSelectPlugin = function createSelectPlugin(config) {
  if (config === void 0) {
    config = {};
  }

  validateConfig(config);

  var sliceState = config.sliceState || function (state, model) {
    return state[model.name || ''];
  };

  var selectorCreator = config.selectorCreator || createSelector;

  var slice = function slice(model) {
    return function (stateOrNext) {
      if (typeof stateOrNext === 'function') {
        return selectorCreator(function (state) {
          return sliceState(state, model);
        }, stateOrNext);
      }

      return sliceState(stateOrNext, model);
    };
  };

  var hasProps = function hasProps(inner) {
    return function (models) {
      var _this = this;

      return selectorCreator(function (props) {
        return props;
      }, function (props) {
        return inner.call(_this, models, props);
      });
    };
  };

  var factoryGroup = makeFactoryGroup();
  var select = makeSelect();
  return {
    exposed: {
      select: select,
      sliceState: sliceState,
      selectorCreator: selectorCreator
    },
    onModel: function onModel(model) {
      select[model.name] = {};
      var selectorFactories = typeof model.selectors === 'function' ? model.selectors(slice(model), selectorCreator, hasProps) : model.selectors;
      factoryGroup.add(Object.keys(selectorFactories || {}).map(function (selectorName) {
        validateSelector(selectorFactories, selectorName, model);

        var factory = function factory() {
          factoryGroup.finish(factory);
          delete select[model.name][selectorName];
          select[model.name][selectorName] = selectorFactories[selectorName].call(select[model.name], select);
          return select[model.name][selectorName];
        };

        Object.defineProperty(select[model.name], selectorName, {
          configurable: true,
          get: function get() {
            return factory();
          }
        });
        return factory;
      }));
    },
    onStoreCreated: function onStoreCreated(store) {
      factoryGroup.startBuilding();
      store.select = select;
    }
  };
};

export default createSelectPlugin;
//# sourceMappingURL=select.esm.js.map
