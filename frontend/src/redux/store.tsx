// store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import studentReducer from './student/studentSlice';
import tutorReducer from './tutor/tutorSlice'
import feedReducer from './feed/feedSlice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer=combineReducers({
    student:studentReducer,
    tutor:tutorReducer,
    feed:feedReducer
})

const persistConfig={
    key:'root',
    version:1,
    storage
}
const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor=persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
