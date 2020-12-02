(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('immer')) :
	typeof define === 'function' && define.amd ? define(['exports', 'immer'], factory) :
	(global = global || self, factory(global['@rematch/immer'] = {}, global.immer));
}(this, (function (exports, immer) { 'use strict';

	immer.enableES5();
	immer.enableMapSet();

	function wrapReducerWithImmer(reducer) {
	  return function (state, payload) {
	    return typeof state === 'object' ? immer.produce(state, function (draft) {
	      var next = reducer(draft, payload);
	      if (typeof next === 'object') return next;
	      return undefined;
	    }) : reducer(state, payload);
	  };
	}

	var immerPlugin = function immerPlugin(config) {
	  return {
	    onReducer: function onReducer(reducer, model) {
	      if (!config || !config.whitelist && !config.blacklist || config.whitelist && model in config.whitelist || config.blacklist && !(model in config.blacklist)) {
	        return wrapReducerWithImmer(reducer);
	      }

	      return undefined;
	    }
	  };
	};

	exports.default = immerPlugin;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=immer.umd.development.js.map
