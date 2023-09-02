import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../features/recipeSlice";

export const store = configureStore({
    reducer:{
        recipe: recipeReducer,   // recipeSlice.ts
    },
});
// Automatically update Local Storage when the state changes
store.subscribe(()=> {
    if(typeof window !== 'undefined'){
        localStorage.setItem('favorites', JSON.stringify(store.getState().recipe.favorites));
}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;