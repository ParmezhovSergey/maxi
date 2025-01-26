import {combineReducers, applyMiddleware} from "redux";
import {legacy_createStore as createStore} from "redux";
import {thunk} from "redux-thunk";
import userReducer from "./userReducer";
import {composeWithDevTools} from "@redux-devtools/extension";

const reducer = combineReducers({
    userReducer: userReducer,
});

export const makeStore = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);

 export type Reducers = ReturnType<typeof reducer>;
 type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
 export type ActionsTypes<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<PropertiesType<T>>;

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

