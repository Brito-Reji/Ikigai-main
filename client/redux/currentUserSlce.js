const { createSlice } = require("@reduxjs/toolkit");

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    currentUser: null,
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { login, logout } = currentUserSlice.actions;

let token = 'xxx.yyy.zzz'
