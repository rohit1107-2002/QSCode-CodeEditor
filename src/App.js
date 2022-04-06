import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import './App.css';

function App() {
  return (
    <> 
      <Toaster position="top-right"/>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
