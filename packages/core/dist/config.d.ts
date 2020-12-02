import { InitConfig, Config, Models } from './types';
export default function createConfig<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(initConfig: InitConfig<TModels, TExtraModels>): Config<TModels, TExtraModels>;
//# sourceMappingURL=config.d.ts.map