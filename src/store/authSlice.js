
import {createSlice} from '@reduxjs/toolkit';

const initialState={
    status:false,
    userData:null}



const authSlice=createSlice({
name:"auth",
initialState,
reducers:{

    login:(state,action)=>{
      
        if(action.payload.userData)
        {state.userData=action.payload.userData}
        else state.userData=action.payload ;
        

        state.status=true
        
    },
    logout:(state)=>{
        state.userData=null
        state.status=false
    },
}

})

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;