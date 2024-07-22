import { useState,useEffect, useId, useRef } from 'react'
import './App.css'
import {assets} from './assets/assets.js'
import run from './config/gemini.js'
import {useSelector,useDispatch} from 'react-redux'
import { addHistory, deleteHistory, localHistory, setChatIndex, toggleNewChat, updateHistory } from './features/promptSlice.js'

function App() {
  const [input,setInput] = useState("")
  const [conversationHistory,setConversationHistory] = useState([])
  const [loading,setLoading] = useState(false)
  const bottomRef = useRef(null)

  const allHistory = useSelector(state=> state.prompt.historyArr)
  const newChat = useSelector(state=> state.prompt.newChat)
  const chatIndex = useSelector(state=> state.prompt.chatIndex)
  const dispatch = useDispatch() //this and the handle functions are because of hooks' rule that they should be placed directly inside your function but outside any loops, conditions, or nested functions.
  
  const handleAdd = (conv) => {
    dispatch(addHistory(conv))
  }
  const handleUpdate = (conv) => {
    dispatch(updateHistory(conv))
  }
  const handleDelete = (index) => {
    dispatch(deleteHistory(index))
  }
  const handleChat = () => {
    dispatch(toggleNewChat(false))
  }
  const handleChatIndex = (index) => {
    dispatch(setChatIndex(index))
  }
  const handleAllHistory = () => {
    let history = JSON.parse(localStorage.getItem("historyArr"))
    if (history){
      dispatch(localHistory(history))}
  }
  useEffect(() => {
    handleAllHistory();
  }, []);
  

  function jsonEscape(str) {
    str=str.split("*").join("<br>")
    return str
      .replace(new RegExp("\r?\n\n","\g"),"<br>")   //Creates a regular expression object, matches it with the string and replaces it,
      .replace(new RegExp("\r?\n","\g"),"<br>")     // This method is here for markup of the code received from API
  }
  useEffect(()=>{
    localStorage.setItem("historyArr",JSON.stringify(allHistory))  
  },[allHistory])
  useEffect(()=>{
    if (chatIndex>=0) {

      setConversationHistory([...allHistory[chatIndex]]);  //spread operator(...) is being used to create a new array that has all the elements from allHistory[chatIndex]
    }                                                      // This was done to avoid the problem of conversationHistory not becoming extensible
  },[chatIndex])

  useEffect(()=>{                           //Adds new chat when button is clicked from sidebar
    if (newChat) {
      setConversationHistory([])
      handleChat()
      handleChatIndex(-1)
    }
  },[newChat])

  useEffect(()=>{
    if (conversationHistory.length==1) {                    //adds new conversation in the historyArr that has all the chats
      handleAdd(conversationHistory)
    }
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 0);
    }
  },[conversationHistory])

  const handleRun = async () => {                 //async function because it takes some time to fetch response from api
    
    if (input!=="") {
      setConversationHistory(prev=>[...prev,
        { role: "user", parts: [{ text: input }]}])
        let prompt = input
        setInput("")
      setLoading(true)
    const response = await run(conversationHistory,prompt)    //await stops execution until response is fetched
    
      setLoading(false)  
    setConversationHistory(prevHistory => [...prevHistory,
      { role: "model", parts: [{ text: response }] }])
      if (conversationHistory.length>1){
        handleUpdate(conversationHistory)                   //updates conversation in historyArr
      }
  }
}
  
  return (
    <div className='App'>
        <div className="top">
          <span className='title'>Gemini</span>
          <img src={assets.user_icon} className='userIcon' alt="" />
        </div>
        <div className={conversationHistory.length===0 ? "midContainer" : "chatContainer"}>

        {conversationHistory.length!==0 ? conversationHistory.map((convo,index=0)=>{

          if (loading&&conversationHistory.length-1===index ) {
            const convoKey = `convo-${index}`;
            return (
              <div key={convoKey}>
              <div className="chat">
                {convo.role==="user" ? <img src={assets.user_icon} className='chatImg' alt="" /> :  <img src={assets.gemini_icon} className='chatImg' alt="" /> }
                <span className={index%2!==0 ? "chatText lighter" : "chatText"} ref={conversationHistory.length-1===index ? bottomRef : null}  dangerouslySetInnerHTML={{__html:convo.parts[0].text}}></span>
              </div>
              <div className="chat">
              <img src={assets.gemini_icon} className='chatImg rotateImg' alt="" />
              <div className="loader" ref={conversationHistory.length-1===index ? bottomRef : null  /* this div is for animation and this ref is to scroll to bottom automatically */} >  
              
                 <hr />
                 <hr />
                 <hr />
               </div>
              </div>
              </div>
            )
          }
          else { //this else part is to markup the response received from API
            let str = convo.parts[0].text
            let resArr = str.split("**")
            let markupRes=[]
            for (let i=0;i<resArr.length;i++) { 
              if (i%2==0) {
                markupRes += resArr[i]
              }
              else {
                markupRes += "<b>" + resArr[i] + "</b>"
              }
            }
              str = jsonEscape(markupRes)
            return (
              <div className="chat" key={index++}>
                {convo.role==="user" ? <img src={assets.user_icon} className='chatImg' alt="" /> :  <img src={assets.gemini_icon} className='chatImg gemImg' alt="" /> }
                <span className={index%2!==0 ? "chatText lighter" : "chatText"} ref={conversationHistory.length-1===index ? bottomRef : null}  dangerouslySetInnerHTML={{__html:str}}></span>
              </div>
            )
          }

})
        
        : <><div className="greet">
          <span className='colorGreet'>Hello, Dev.</span>
          <span className=''>How can I help you today?</span>
        </div>
        <div className="suggestion">
          <button className='sgBtn' onClick={()=>setInput("Compare the differences between pickleball and tennis")}>
          <span className='sgTxt'>Compare the differences between pickleball and tennis</span>
          <img className='sgImg' src={assets.bulb_icon} alt="" />
          </button>
          <button className='sgBtn' onClick={()=>setInput("Recommend new types of water sports, including pros & cons")}>
          <span className='sgTxt'>Recommend new types of water sports, including pros & cons</span>
          <img className='sgImg' src={assets.compass_icon} alt="" />
          </button>
          <button className='sgBtn' onClick={()=>setInput("Brainstorm team bonding activities for our work retreat")}>
          <span className='sgTxt'>Brainstorm team bonding activities for our work retreat</span>
          <img className='sgImg' src={assets.message_icon} alt="" />
          </button>
          <button className='sgBtn' onClick={()=>setInput("What is React js and what is it's importance")}>
          <span className='sgTxt'>What is React js and what is it's importance</span>
          <img className='sgImg pblm1' src={assets.code_icon} alt="" />
          </button>
        </div></>}
        </div>
        <div className='Footer'>
      <div className="Search">
        <input type="text"
          value={input}
          onChange={(e)=>setInput(e.target.value) }
          onKeyDown={(e)=> {
            if (e.key==='Enter') {
              e.preventDefault()
              handleRun()
            }
          }}
          placeholder='Enter a prompt here' className="searchBar"  />
        <button className='srhImg'><img src={assets.gallery_icon} alt="" /></button>
        <button className='srhImg'><img src={assets.mic_icon} alt="" /></button>
        {input!=="" ? 
        <button className='srhImg'
         onClick={()=>
            handleRun()}
         ><img src={assets.send_icon} 
         alt="" />
         </button> : ""}
      </div>
      <div className='info'>
      Gemini may display inaccurate info, including about people, so double-check its responses.<button className='infbtn'>Your privacy and Gemini Apps</button> 
      </div>
      </div>
    </div>
  )
}

export default App