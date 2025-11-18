import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFoundPage } from './Components/NotFoundPage';
import { ChatPage } from './Components/ChatPage'
import { LoginPage } from './Components/LoginPage'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ChatPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='*' element={<NotFoundPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}