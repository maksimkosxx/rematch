import { persistReducer, persistStore } from 'redux-persist';

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
        return persistReducer(reducerConfig, reducer);
      }

      return undefined;
    },
    onRootReducer: function onRootReducer(rootReducer) {
      return persistReducer(persistConfig, rootReducer);
    },
    onStoreCreated: function onStoreCreated(store) {
      persistor = persistStore(store, persistStoreConfig, callback);
    }
  };
};

export default persistPlugin;
export { getPersistor };
//# sourceMappingURL=persist.esm.js.map
