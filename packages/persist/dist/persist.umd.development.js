(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux-persist')) :
	typeof define === 'function' && define.amd ? define(['exports', 'redux-persist'], factory) :
	(global = global || self, factory(global['@rematch/persist'] = {}, global.reduxPersist));
}(this, (function (exports, reduxPersist) { 'use strict';

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

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=persist.umd.development.js.map
