import { Models, Plugin } from '@rematch/core';
import { SelectConfig } from './types';
declare const createSelectPlugin: <TModels extends Models<TModels>, TExtraModels extends Models<TModels> = Record<string, any>>(config?: SelectConfig<TModels>) => Plugin<TModels, TExtraModels, Partial<TExtraModels>>;
export default createSelectPlugin;
export * from './types';
//# sourceMappingURL=index.d.ts.map