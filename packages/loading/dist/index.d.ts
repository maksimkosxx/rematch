import { ExtractRematchDispatchersFromEffects, Plugin, Models, Reducer, NamedModel } from '@rematch/core';
export interface LoadingConfig {
    name?: string;
    whitelist?: string[];
    blacklist?: string[];
    asNumber?: boolean;
}
interface LoadingState<TModels extends Models<TModels>, AsNumber extends boolean = false> {
    global: AsNumber extends true ? number : boolean;
    models: {
        [modelName in keyof TModels]: AsNumber extends true ? number : boolean;
    };
    effects: {
        [modelName in keyof TModels]: {
            [effectName in keyof ExtractRematchDispatchersFromEffects<TModels[modelName]['effects'], TModels>]: AsNumber extends true ? number : boolean;
        };
    };
}
interface LoadingModel<TModels extends Models<TModels>, AsNumber extends boolean = false> extends NamedModel<TModels, LoadingState<TModels, AsNumber>> {
    reducers: {
        hide: Reducer<LoadingState<TModels, AsNumber>>;
        show: Reducer<LoadingState<TModels, AsNumber>>;
    };
}
export interface ExtraModelsFromLoading<TModels extends Models<TModels>> extends Models<TModels> {
    loading: LoadingModel<TModels>;
}
declare const _default: <TModels extends Models<TModels>, TExtraModels extends Models<TModels> = {}>(config?: LoadingConfig) => Plugin<TModels, TExtraModels, ExtraModelsFromLoading<TModels>>;
export default _default;
//# sourceMappingURL=index.d.ts.map