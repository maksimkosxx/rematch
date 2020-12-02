import { enableES5, enableMapSet, produce } from 'immer';

enableES5();
enableMapSet();

function wrapReducerWithImmer(reducer) {
  return function (state, payload) {
    return typeof state === 'object' ? produce(state, function (draft) {
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

export default immerPlugin;
//# sourceMappingURL=immer.esm.js.map
