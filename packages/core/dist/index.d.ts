import { InitConfig, Models, RematchStore, ModelCreator } from './types';
export declare const init: <TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(initConfig?: InitConfig<TModels, TExtraModels> | undefined) => RematchStore<TModels, TExtraModels>;
export declare const createModel: ModelCreator;
declare const _default: {
    init: <TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(initConfig?: InitConfig<TModels, TExtraModels> | undefined) => RematchStore<TModels, TExtraModels>;
    createModel: ModelCreator;
};
export default _default;
export * from './types';
//# sourceMappingURL=index.d.ts.map