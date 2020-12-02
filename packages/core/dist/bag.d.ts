import { Config, Models, RematchBag } from './types';
export default function createRematchBag<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(config: Config<TModels, TExtraModels>): RematchBag<TModels, TExtraModels>;
//# sourceMappingURL=bag.d.ts.map