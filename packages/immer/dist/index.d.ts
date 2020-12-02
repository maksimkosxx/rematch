import { Plugin, Models } from '@rematch/core';
export declare type ImmerPluginConfig = {
    whitelist?: string[];
    blacklist?: string[];
};
declare const immerPlugin: <TModels extends Models<TModels>, TExtraModels extends Models<TModels> = {}>(config?: ImmerPluginConfig | undefined) => Plugin<TModels, TExtraModels, Partial<TExtraModels>>;
export default immerPlugin;
//# sourceMappingURL=index.d.ts.map