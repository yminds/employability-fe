// roleSlice.ts (Redux slice for managing user role)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoleState {
  role: string | null;
}

const initialState: RoleState = {
  role: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
