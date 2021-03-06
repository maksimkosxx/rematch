import * as Redux from 'redux';
import { Action, NamedModel, RematchBag, Models, RematchRootState } from './types';
export default function createReduxStore<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}, RootState = RematchRootState<TModels, TExtraModels>>(bag: RematchBag<TModels, TExtraModels>): Redux.Store<RootState>;
export declare function createModelReducer<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}, TState extends NamedModel<TModels>['state'] = any>(bag: RematchBag<TModels, TExtraModels>, model: NamedModel<TModels>): void;
export declare function createRootReducer<TRootState, TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(bag: RematchBag<TModels, TExtraModels>): Redux.Reducer<TRootState, Action>;
//# sourceMappingURL=reduxStore.d.ts.map