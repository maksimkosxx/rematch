import { ExtractRematchDispatchersFromEffects, Models, Plugin, Model } from '@rematch/core';
export interface UpdatedConfig<T = Date> {
    name?: string;
    blacklist?: string[];
    dateCreator?(): T;
}
declare type UpdatedState<TModels extends Models<TModels>, T = Date> = {
    [modelName in keyof TModels]: {
        [effectName in keyof ExtractRematchDispatchersFromEffects<TModels[modelName]['effects'], TModels>]: T;
    };
};
interface UpdatedModel<TModels extends Models<TModels>, T = Date> extends Model<TModels, UpdatedState<TModels, T>> {
    reducers: {
        onUpdate(state: UpdatedState<TModels, T>, payload: {
            name: string;
            action: string;
        }): UpdatedState<TModels, T>;
    };
}
export interface ExtraModelsFromUpdated<TModels extends Models<TModels>, T = Date> extends Models<TModels> {
    updated: UpdatedModel<TModels, T>;
}
declare const updatedPlugin: <TModels extends Models<TModels>, TExtraModels extends Models<TModels> = {}, T = Date>(config?: UpdatedConfig<T>) => Plugin<TModels, TExtraModels, ExtraModelsFromUpdated<TModels, T>>;
export default updatedPlugin;
//# sourceMappingURL=index.d.ts.map