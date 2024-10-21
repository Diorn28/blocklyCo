import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './ExerciceSlice';

export const store = configureStore({
    reducer: {
        exercises: exercisesReducer,
    },
});

// Types pour le state et le dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
