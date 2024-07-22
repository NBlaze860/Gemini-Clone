import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    historyArr: [],
    newChat: false,
    chatIndex: -1
}

export const promptSlice = createSlice({
    name: 'Prompt',
    initialState,
    reducers: {
        localHistory: (state,action) => {
            state.historyArr = action.payload
        },
        addHistory: (state,action) => {
            state.historyArr.push(action.payload)
        },
        updateHistory: (state,action) => {
            let len = state.historyArr.length-1
            if (state.chatIndex>=0){
                state.historyArr[state.chatIndex] = action.payload
            }
            else {
                state.historyArr[len]=action.payload
            }
        },
        deleteHistory: (state,action) => {
            state.historyArr.splice(action.payload,1)
        },
        toggleNewChat: (state,action) => {
            state.newChat = action.payload
        },
        setChatIndex: (state,action) => {
            state.chatIndex = action.payload
        }
    }
})

export const {addHistory,updateHistory,deleteHistory,toggleNewChat,setChatIndex,localHistory} = promptSlice.actions
export default promptSlice.reducer