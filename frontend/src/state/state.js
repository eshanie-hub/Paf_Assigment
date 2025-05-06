import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    name: null,
    token: null
};

export const authSlice = createSlice({
    name: " auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.userId = action.payload.userId;
            state.name = action.payload.name;
            state.token = action.payload.token;
            
        },
        setLogout: (state) => {
            state.userId = null;
            state.name = null;
            state.token = null;
            state.menuType = null;
       
        }
       
    }
})

export const{ setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;