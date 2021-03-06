import { Config, ModelEffects, ModelReducers, NamedModel, Plugin, Models } from './types';
export declare type Validation = [boolean | undefined, string];
export declare const isObject: <T>(obj: T) => boolean;
export declare const ifDefinedIsFunction: <T>(func: T) => boolean;
declare const validate: (runValidations: () => Validation[]) => void;
export declare const validateConfig: <TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(config: Config<TModels, TExtraModels>) => void;
export declare const validateModel: <TModels extends Models<TModels> = Record<string, any>>(model: NamedModel<TModels, any, any>) => void;
export declare const validatePlugin: <TModels extends Models<TModels> = Record<string, any>, TExtraModels extends Models<TModels> = {}>(plugin: Plugin<TModels, TExtraModels, Partial<TExtraModels>>) => void;
export declare const validateModelReducer: (modelName: string, reducers: ModelReducers, reducerName: string) => void;
export declare const validateModelEffect: <TModels extends Models<TModels>>(modelName: string, effects: ModelEffects<TModels>, effectName: string) => void;
export default validate;
//# sourceMappingURL=validate.d.ts.map