import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Sidebar from './components/Sidebar.jsx'
import {Provider} from 'react-redux'
import { store } from './features/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <div className="main">
      <Sidebar />
    <App />
    </div>
    </Provider>
)
