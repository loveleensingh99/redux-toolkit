import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
  searchData: "",
};

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  try {
    const response = await axios.get(
      "https://641dd63d945125fff3d75742.mockapi.io/crud"
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
});

export const createUser = createAsyncThunk("createUser", async (data) => {
  try {
    const response = await axios.post(
      "https://641dd63d945125fff3d75742.mockapi.io/crud",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error; // Rethrow the error to mark the async thunk as rejected
  }
});

export const deleteUser = createAsyncThunk("deleteUser", async (id) => {
  try {
    const response = await axios.delete(
      `https://641dd63d945125fff3d75742.mockapi.io/crud/${id}`,
      id
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error; // Rethrow the error to mark the async thunk as rejected
  }
});

export const updateUser = createAsyncThunk("updateUser", async (data) => {
  try {
    const response = await axios.put(
      `https://641dd63d945125fff3d75742.mockapi.io/crud/${data.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error; // Rethrow the error to mark the async thunk as rejected
  }
});

export const userDetailSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {
    searchUser: (state, action) => {
      state.searchData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = [...state.users, ...action.payload];
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      if (id) {
        state.users = state.users.filter((ele) => ele.id !== id);
      }
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updateUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.map((ele) =>
        ele.id === action.payload.id ? action.payload : ele
      );
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const getUsers = (state) => {
  return state.userDetail.users;
};

export const getUserDetails = (state) => {
  return state.userDetail;
};

export default userDetailSlice.reducer;
export const { searchUser } = userDetailSlice.actions;
