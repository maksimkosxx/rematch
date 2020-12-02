'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var reduxPersist = require('redux-persist');

var persistor;
var getPersistor = function getPersistor() {
  return persistor;
};

var persistPlugin = function persistPlugin(persistConfig, nestedPersistConfig, persistStoreConfig, callback) {
  if (nestedPersistConfig === void 0) {
    nestedPersistConfig = {};
  }

  if (!persistConfig) {
    throw new Error('persist plugin is missing config object');
  }

  return {
    onReducer: function onReducer(reducer, modelName) {
      var reducerConfig = nestedPersistConfig[modelName];

      if (reducerConfig) {
        return reduxPersist.persistReducer(reducerConfig, reducer);
      }

      return undefined;
    },
    onRootReducer: function onRootReducer(rootReducer) {
      return reduxPersist.persistReducer(persistConfig, rootReducer);
    },
    onStoreCreated: function onStoreCreated(store) {
      persistor = reduxPersist.persistStore(store, persistStoreConfig, callback);
    }
  };
};

exports.default = persistPlugin;
exports.getPersistor = getPersistor;
//# sourceMappingURL=persist.cjs.development.js.map
