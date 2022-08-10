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
      state.user = null
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
    },
    updateUsername: (state, action) => {
      state.user.name = action.payload
    },
    updateAvtUrl: (state, action) => {
      state.user.avatarUrl = action.payload
    },
  },
});

export const {userLogin, userLogout, userVeryfiMail, userForgotPw, updateUsername, updateAvtUrl} = userSlice.actions;
export default userSlice.reducer;
