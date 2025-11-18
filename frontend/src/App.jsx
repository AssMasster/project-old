import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {} from ''

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<ErrorPage/>}></Route>
        <Route path='/'></Route>
        <Route path='/login' element={<AuthorizationForm/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}