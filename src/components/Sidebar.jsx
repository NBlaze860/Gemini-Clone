import React, { useState } from 'react'
import './sidebar.css'
import {assets} from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import run from '../config/gemini'
import { setChatIndex, toggleNewChat } from '../features/promptSlice'
function Sidebar() {
  const [menu, setMenu] = useState(false)

  const allHistory = useSelector(state =>state.prompt.historyArr)
  const newChat = useSelector(state=>state.prompt.newChat)
  const chatIndex = useSelector(state=> state.prompt.chatIndex)
  const dispatch = useDispatch()
  const handleChat = () => {
    dispatch(toggleNewChat(true))
  }
  const handleChatIndex = (i) => {
    dispatch(setChatIndex(i))
  }

  return (
    <>
        <div className="sideBar">
            <div className="upperSide">
                <button className='menu'><img src={assets.menu_icon} onClick={() => setMenu(prev => !prev)} alt="" /></button>
                <button className='plus plus1' onClick={()=>{handleChat()}}><img src={assets.plus_icon} className='plusImg' alt="" />{ menu ? "New Chat" : ""} </button>
                {menu ? <div className="recent">
                  <span className='recentText'>Recent</span>
                    <div className="scroll">
                    {allHistory.map((conv,index=0)=>{

                      if(conv.length>0) 
                      {
                        
                        let s = conv[0].parts[0].text.slice(0,17)   //to slice the headings of chat in sidebar
                        return(<div className="recentTabs" key={index}>
                      <button className={chatIndex===index||(chatIndex===-1&&index===allHistory.length-1) ? "high tab" : "tab"} onClick={()=>handleChatIndex(index)} >
                        <img src={assets.message_icon} alt="" />
                        {s}...
                      </button>
                    </div>)}
                  index++
                  })}</div>
                </div> : ""}
            </div>
            <div className="lowerSide">
                <button className='btns' ><img src={assets.question_icon} alt="" />{menu ? "Help" : ""}</button>
                <button className='btns' ><img src={assets.history_icon} alt="" />{menu ? "Activity" : ""}</button>
                <button className='btns' ><img src={assets.setting_icon} alt="" />{menu ? "Settings" : ""}</button>
            </div>
        </div>
    </>
  )
}

export default Sidebar