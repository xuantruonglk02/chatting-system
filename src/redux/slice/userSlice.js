import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
   user: null
  },
  reducers: {
    userLogin: (state, action) => {
        state.user = action.payload
    },
    userLogout: (state) => {

    },
    userVeryfiMail: (state, action) => {
         let user = {
          ...state.user,
          email: action.payload.email,
          token: action.payload.token
        }
        state.user = user
    },
    userForgotPw: (state, action) => {
        let user = {
          ...state.user,
          email: action.payload.email
        }
        state.user = user
    }
  },
});

export const {userLogin, userLogout, userVeryfiMail, userForgotPw} = userSlice.actions;
export default userSlice.reducer;
