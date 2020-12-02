import { Models, NamedModel, RematchBag, RematchStore } from './types';
declare const createDispatcher: <TModels extends Models<TModels> = Record<string, any>, TModel extends NamedModel<TModels, any, any> = NamedModel<Record<string, any>, any, any>>(rematch: RematchStore<TModels, {}>, bag: RematchBag<TModels, {}>, model: TModel) => void;
export default createDispatcher;
//# sourceMappingURL=dispatcher.d.ts.map