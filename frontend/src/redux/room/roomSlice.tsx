import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
    roomId: string | null;
}

const initialState: RoomState = {
    roomId: null,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoomId(state, action: PayloadAction<string | null>) {
            state.roomId = action.payload;
        },
        removeRoomId(state) {
            state.roomId = null;  // Clear the roomId
        }
    }
});

export const { setRoomId, removeRoomId } = roomSlice.actions;
export default roomSlice.reducer;
