import { Action as ReduxAction, Reducer as ReduxReducer, Dispatch as ReduxDispatch, ReducersMapObject, Middleware, StoreEnhancer, StoreCreator, Store as ReduxStore } from 'redux';
export interface Action<TPayload = any> extends ReduxAction<string> {
    payload?: TPayload;
}
export declare type Reducer<TState = any> = (state: TState, payload?: Action['payload']) => TState;
export interface Models<TModels extends Models<TModels> = Record<string, any>> {
    [key: string]: Model<TModels>;
}
export interface NamedModel<TModels extends Models<TModels> = Record<string, any>, TState = any, TBaseState = TState> extends Model<TModels, TState, TBaseState> {
    name: string;
    reducers: ModelReducers<TState>;
}
export interface Model<TModels extends Models<TModels> = Record<string, any>, TState = any, TBaseState = TState> {
    name?: string;
    state: TState;
    reducers?: ModelReducers<TState>;
    baseReducer?: ReduxReducer<TBaseState>;
    effects?: ModelEffects<TModels> | ModelEffectsCreator<TModels>;
}
export declare type ModelReducers<TState = any> = {
    [key: string]: Reducer<TState>;
};
export interface ModelEffects<TModels extends Models<TModels> = Record<string, any>> {
    [key: string]: ModelEffect<TModels>;
}
export declare type ModelEffect<TModels extends Models<TModels> = Record<string, any>> = (payload: Action['payload'], rootState: RematchRootState<TModels>) => any;
export declare type ModelEffectsCreator<TModels extends Models<TModels> = Record<string, any>> = (dispatch: RematchDispatch<TModels>) => ModelEffects<TModels>;
export interface PluginConfig<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}, TExposedModels = Partial<TExtraModels>> {
    models?: TExposedModels;
    redux?: InitConfigRedux;
}
export interface Plugin<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}, TExposedModels = Partial<TExtraModels>> extends PluginHooks<TModels, TExtraModels> {
    config?: PluginConfig<TModels, TExtraModels, TExposedModels>;
    exposed?: PluginExposed;
}
export interface PluginHooks<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> {
    onStoreCreated?: StoreCreatedHook<TModels, TExtraModels>;
    onModel?: ModelHook<TModels, TExtraModels>;
    onReducer?: ReducerHook<TModels, TExtraModels>;
    onRootReducer?: RootReducerHook<TModels, TExtraModels>;
    createMiddleware?: MiddlewareCreator<TModels>;
}
export declare type ModelHook<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = (model: NamedModel<TModels>, rematch: RematchStore<TModels, TExtraModels>) => void;
export declare type ReducerHook<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = (reducer: ReduxReducer, modelName: string, rematch: RematchBag<TModels, TExtraModels>) => ReduxReducer | void;
export declare type RootReducerHook<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = (reducer: ReduxReducer, rematch: RematchBag<TModels, TExtraModels>) => ReduxReducer | void;
export declare type StoreCreatedHook<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = (store: RematchStore<TModels, TExtraModels>, rematch: RematchBag<TModels, TExtraModels>) => RematchStore<TModels, TExtraModels> | void;
export declare type MiddlewareCreator<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = (rematch: RematchBag<TModels, TExtraModels>) => Middleware;
export declare type ObjectNotAFunction = {
    [k: string]: any;
} & ({
    bind?: never;
} | {
    call?: never;
});
export declare type PluginExposed = {
    [key: string]: ExposedFunction | ObjectNotAFunction;
};
export declare type ExposedFunction = (rematch: RematchStore<any>, ...args: any) => any;
export interface RematchBag<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> {
    models: NamedModel<TModels>[];
    reduxConfig: ConfigRedux;
    forEachPlugin: <Hook extends keyof PluginHooks<TModels, TExtraModels>>(method: Hook, fn: (content: NonNullable<PluginHooks<TModels, TExtraModels>[Hook]>) => void) => void;
    effects: ModelEffects<TModels>;
}
export interface InitConfig<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> {
    name?: string;
    models?: TModels;
    plugins?: Plugin<TModels, TExtraModels>[];
    redux?: InitConfigRedux;
}
export interface Config<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> extends InitConfig<TModels, TExtraModels> {
    name: string;
    models: TModels;
    plugins: Plugin<TModels, TExtraModels>[];
    redux: ConfigRedux;
}
export interface InitConfigRedux<TRootState = any> {
    initialState?: TRootState;
    reducers?: ModelReducers<TRootState>;
    enhancers?: StoreEnhancer[];
    middlewares?: Middleware[];
    rootReducers?: ReducersMapObject<TRootState, Action>;
    combineReducers?: (reducers: ReducersMapObject<TRootState, Action>) => ReduxReducer<TRootState>;
    createStore?: StoreCreator;
    devtoolOptions?: DevtoolOptions;
}
export interface ConfigRedux<TRootState = any> extends InitConfigRedux<TRootState> {
    reducers: ModelReducers<TRootState>;
    enhancers: StoreEnhancer[];
    middlewares: Middleware[];
    rootReducers: ReducersMapObject<TRootState, Action>;
}
export interface RematchStore<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> extends ReduxStore<RematchRootState<TModels, TExtraModels>, Action> {
    [index: string]: ExposedFunction | Record<string, any> | string;
    name: string;
    dispatch: RematchDispatch<TModels>;
    addModel: (model: NamedModel<TModels>) => void;
}
export declare type RematchRootState<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = ExtractRematchStateFromModels<TModels, TExtraModels>;
export declare type ExtractRematchStateFromModels<TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}> = {
    [modelKey in keyof TModels]: TModels[modelKey]['state'];
} & {
    [modelKey in keyof TExtraModels]: TExtraModels[modelKey]['state'];
};
export declare type RematchDispatch<TModels extends Models<TModels> = Record<string, any>> = ReduxDispatch & ExtractRematchDispatchersFromModels<TModels>;
export declare type ExtractRematchDispatchersFromModels<TModels extends Models<TModels> = Record<string, any>> = {
    [modelKey in keyof TModels]: TModels[modelKey] extends Model<TModels> ? ModelDispatcher<TModels[modelKey], TModels> : never;
};
export declare type ModelDispatcher<TModel extends Model<TModels> = Model, TModels extends Models<TModels> = Record<string, any>> = ExtractRematchDispatchersFromReducers<TModel['state'], TModel['reducers']> & ExtractRematchDispatchersFromEffects<TModel['effects'], TModels>;
export declare type ExtractRematchDispatchersFromReducers<TState, TReducers extends Model<Models, TState>['reducers']> = {
    [reducerKey in keyof TReducers]: ExtractRematchDispatcherFromReducer<TState, TReducers[reducerKey]>;
};
export declare type ExtractRematchDispatcherFromReducer<TState, TReducer> = TReducer extends () => any ? RematchDispatcher : TReducer extends (state: TState) => TState ? Parameters<TReducer> extends [TState] ? RematchDispatcher : RematchDispatcher<Parameters<TReducer>[1]> : TReducer extends (state: TState, payload: infer TPayload) => TState ? RematchDispatcher<TPayload> : never;
export declare type RematchDispatcher<TPayload = void> = [TPayload] extends [void] ? (() => Action<void>) & {
    isEffect: false;
} : undefined extends TPayload ? ((payload?: TPayload) => Action<TPayload>) & {
    isEffect: false;
} : ((payload: TPayload) => Action<TPayload>) & {
    isEffect: false;
};
export declare type ExtractRematchDispatchersFromEffects<TEffects extends Model<TModels>['effects'], TModels extends Models<TModels> = Record<string, any>> = TEffects extends (...args: any[]) => infer R ? R extends ModelEffects<TModels> ? ExtractRematchDispatchersFromEffectsObject<R, TModels> : never : TEffects extends ModelEffects<TModels> ? ExtractRematchDispatchersFromEffectsObject<TEffects, TModels> : void;
export declare type ExtractRematchDispatchersFromEffectsObject<TEffects extends ModelEffects<TModels>, TModels extends Models<TModels> = Record<string, any>> = {
    [effectKey in keyof TEffects]: ExtractRematchDispatcherFromEffect<TEffects[effectKey], TModels>;
};
export declare type ExtractRematchDispatcherFromEffect<TEffect extends ModelEffect<TModels>, TModels extends Models<TModels> = Record<string, any>> = TEffect extends () => infer TReturn ? EffectRematchDispatcher<TReturn> : TEffect extends (payload: infer TPayload) => infer TReturn ? EffectRematchDispatcher<TReturn, TPayload> : TEffect extends (payload: infer TPayload, state: any) => infer TReturn ? EffectRematchDispatcher<TReturn, TPayload> : never;
export declare type EffectRematchDispatcher<TReturn = any, TPayload = void> = [TPayload] extends [void] ? (() => TReturn) & {
    isEffect: true;
} : ((payload: TPayload) => TReturn) & {
    isEffect: true;
};
export interface DevtoolOptions {
    disabled?: boolean;
    [key: string]: any;
}
export interface ModelCreator {
    <RM extends Models<RM>>(): <R extends ModelReducers<S>, BR extends ReduxReducer<BS>, E extends ModelEffects<RM> | ModelEffectsCreator<RM>, S, BS = S>(mo: {
        name?: string;
        state: S;
        reducers?: R;
        baseReducer?: BR;
        effects?: E;
    }) => {
        name?: string;
        state: S;
        reducers: R;
        baseReducer: BR;
        effects: E;
    };
}
declare module 'redux' {
    interface Dispatch<A extends Action = AnyAction> {
        [modelName: string]: any;
    }
}
declare module 'react-redux' {
    interface Connect {
        <RM extends Models<RM> = Models, State = DefaultRootState, TStateProps = {}, TDispatchProps = {}, TOwnProps = {}>(mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>, mapDispatchToProps: MapRematchDispatchToPropsNonObject<TDispatchProps, TOwnProps, RM>): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;
    }
    type MapRematchDispatchToPropsNonObject<TDispatchProps, TOwnProps, RM extends Models<RM> = Models> = MapRematchDispatchToPropsFactory<TDispatchProps, TOwnProps, RM> | MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>;
    type MapRematchDispatchToPropsFactory<TDispatchProps, TOwnProps, RM extends Models<RM> = Models> = (dispatch: RematchDispatch<RM>, ownProps: TOwnProps) => MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>;
    type MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM extends Models<RM> = Models> = (dispatch: RematchDispatch<RM>, ownProps: TOwnProps) => TDispatchProps;
}
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    }
}
//# sourceMappingURL=types.d.ts.map