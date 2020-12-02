import { Config, Models, RematchStore } from './types';
export default function createRematchStore<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(config: Config<TModels, TExtraModels>): RematchStore<TModels, TExtraModels>;
//# sourceMappingURL=rematchStore.d.ts.map