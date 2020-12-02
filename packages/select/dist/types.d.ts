import { ExtractRematchStateFromModels, Models, Model, Action, RematchRootState, ModelReducers, ModelEffects, ModelEffectsCreator } from '@rematch/core';
import * as Reselect from 'reselect';
import { Store as ReduxStore, Reducer as ReduxReducer } from 'redux';
export { createSelector, createStructuredSelector } from 'reselect';
export declare type Selector<TState, TReturns, TProps = void> = TProps extends void ? (state: TState) => TReturns : (state: TState, props: TProps) => TReturns;
export declare type ExtractSelectorsFromModel<TModels extends Models<TModels> = Record<string, any>, TModel extends Model<TModels> = Model<TModels>> = TModel['selectors'] extends (...args: any[]) => infer TReturnObj ? TReturnObj : TModel['selectors'] extends Record<string, any> ? TModel['selectors'] : never;
export declare type ExtractSelectorsSignatureFromSelectorsModel<TRootState, TSelectorsConfigObject, TKey extends keyof TSelectorsConfigObject> = TSelectorsConfigObject[TKey] extends (...args: any[]) => infer TSelector ? TSelector extends (props: infer TProps) => Selector<any, infer TReturns> ? (props: TProps) => Selector<TRootState, TReturns> : TSelector extends Selector<any, infer TReturns> ? Selector<TRootState, TReturns> : TSelector extends Selector<any, infer TReturns, infer TProps> ? Selector<TRootState, TReturns, TProps> : never : never;
export interface SelectConfig<TModels extends Models<TModels> = Record<string, any>> {
    sliceState?: (state: ExtractRematchStateFromModels<TModels>, model: Model<TModels>) => Record<string, any> | undefined;
    selectorCreator?: any;
}
export declare type ModelSelectors<TModels extends Models<TModels> = Record<string, any>, TModel extends Model<TModels> = Model<TModels>> = {
    [key in keyof ExtractSelectorsFromModel<TModels, TModel>]: ExtractSelectorsSignatureFromSelectorsModel<RematchRootState<TModels>, ExtractSelectorsFromModel<TModels, TModel>, key>;
};
export declare type Slicer<TSliceState, TRootState> = (<TReturns>(resultFn: (slice: TSliceState) => TReturns) => Selector<TRootState, TReturns>) & Selector<TRootState, TSliceState>;
export interface ModelSelectorFactories<TModels extends Models<TModels> = Record<string, any>, TSliceState = any> {
    [key: string]: SelectorFactory<TModels, TSliceState> | SelectorParametricFactory<TModels, TSliceState>;
}
export declare type StoreSelectors<TModels extends Models<TModels> = Record<string, any>> = {
    [TModelKey in keyof TModels]: ModelSelectors<TModels, TModels[TModelKey]>;
};
export declare type SelectorFactory<TModels extends Models<TModels> = Record<string, any>, TSliceState = any> = <TReturns>(this: ModelSelectorFactories<TModels, TSliceState>, models: StoreSelectors<TModels>) => Selector<RematchRootState<TModels>, TReturns>;
export declare type SelectorParametricFactory<TModels extends Models<TModels> = Record<string, any>, TSliceState = any, TProps = any, TReturns = any> = (this: ModelSelectorFactories<TModels, TSliceState>, models: StoreSelectors<TModels>, props: TProps) => Selector<RematchRootState<TModels>, TReturns, TProps>;
export declare type ParameterizerSelectorFactory<TModels extends Models<TModels> = Record<string, any>, TSliceState = any, TProps = any, TReturns = any> = (this: ModelSelectorFactories<TModels, TSliceState>, models: StoreSelectors<TModels>, props: TProps) => (props: TProps) => Selector<RematchRootState<TModels>, TReturns>;
export declare type Parameterizer<TModels extends Models<TModels> = Record<string, any>, TSliceState = any> = <TProps, TReturns>(factory: SelectorParametricFactory<TModels, TSliceState, TProps, TReturns>) => ParameterizerSelectorFactory<TModels, TSliceState, TProps, TReturns>;
export declare type ModelSelectorsFactory<TModels extends Models<TModels> = Record<string, any>, TSliceState = any> = (slice: Slicer<TSliceState, RematchRootState<TModels>>, createSelector: typeof Reselect.createSelector, hasProps: Parameterizer<TModels, TSliceState>) => ModelSelectorFactories<TModels, TSliceState>;
export declare type ModelSelectorsConfig<TModels extends Models<TModels> = Record<string, any>, TSliceState = any> = ModelSelectorsFactory<TModels, TSliceState> | ModelSelectorFactories<TModels, TSliceState>;
export declare type RematchSelect<TModels extends Models<TModels>, TRootState = RematchRootState<TModels>> = (<TReturn>(mapSelectToProps: (select: RematchSelect<TModels>) => TReturn) => Reselect.OutputParametricSelector<TRootState, any, TReturn, Reselect.Selector<TRootState, Record<string, any>>> & Reselect.OutputSelector<TRootState, TReturn, Reselect.Selector<TRootState, Record<string, any>>>) & StoreSelectors<TModels>;
declare module '@rematch/core' {
    interface RematchStore<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> extends ReduxStore<RematchRootState<TModels, TExtraModels>, Action> {
        select: RematchSelect<TModels>;
    }
    interface Model<TModels extends Models<TModels> = Record<string, any>, TState = any> {
        selectors?: ModelSelectorsConfig<TModels, TState>;
    }
    interface ModelCreator {
        <RM extends Models<RM>>(): <R extends ModelReducers<S>, BR extends ReduxReducer<BS>, E extends ModelEffects<RM> | ModelEffectsCreator<RM>, SE extends ModelSelectorsConfig<RM, S>, S, BS = S>(mo: {
            name?: string;
            state: S;
            selectors?: SE;
            reducers?: R;
            baseReducer?: BR;
            effects?: E;
        }) => {
            name?: string;
            state: S;
            selectors: SE;
            reducers: R;
            baseReducer: BR;
            effects: E;
        };
    }
}
//# sourceMappingURL=types.d.ts.map