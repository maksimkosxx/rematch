import { Plugin, Models } from '@rematch/core';
import { PersistConfig, Persistor, PersistorOptions } from 'redux-persist';
export declare const getPersistor: () => Persistor;
export declare type NestedPersist<M extends Models<M>> = {
    [modelKey in keyof M]?: PersistConfig<M[modelKey]['state']>;
};
declare const persistPlugin: <S, TModels extends Models<TModels>, TExtraModels extends Models<TModels> = {}>(persistConfig: PersistConfig<S, any, any, any>, nestedPersistConfig?: NestedPersist<TModels>, persistStoreConfig?: PersistorOptions | undefined, callback?: (() => void) | undefined) => Plugin<TModels, TExtraModels, Partial<TExtraModels>>;
export default persistPlugin;
//# sourceMappingURL=index.d.ts.map