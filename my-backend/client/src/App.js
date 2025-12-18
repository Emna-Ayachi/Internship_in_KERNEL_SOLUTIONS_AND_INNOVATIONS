import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthFlip from './components/Auth/AuthFlip.js';
import Header from './components/Header.js'
import Introduction from './components/Introduction.js'
import Benefits from './components/Benefits.js'
import Mentor from './components/Mentor.js'
import Student from './components/Student.js'

import Protection from './components/Auth/Protection.js'
import HeaderH from './components/Home/Header.js'
import IntroductionH from './components/Home/Introduction.js'
import Filter from './components/Home/Filter.js'
import CalendarPage from './components/Home/Calender.js'
import GetApp from './components/Home/GetApp.js'
import Notification from './components/Home/Notification.js';
import Profile from './components/Home/Profile.js'
import Msg from './components/Home/Msg.js'
import { useState } from 'react';


function App() {
  const [isLogin, setIsLogin] = useState(true);
  // const CalendarWithHeader = () => (
  //   <>
  //     <HeaderH />
  //     <CalendarPage />
  //   </>
  // );
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header setIsLogin={setIsLogin} />
              <Introduction />
              <Benefits />
              <Mentor />
              <Student />
            </>
          }
        />
        <Route path="/login" element={<AuthFlip isLogin={true} />} />
        <Route path="/signup" element={<AuthFlip isLogin={false} />} />
        <Route path="/home" element={
            <Protection > 
              <HeaderH/>
              <IntroductionH/>
              <Filter/>
            </Protection>
        
        }/>
        <Route path="/calendar" element={
          <>
            <HeaderH />
            <CalendarPage />
          </>
        }/>
        <Route path="/getapp/:mentorId" element={
          <>
            <HeaderH />
            <GetApp />
          </>
        } />
        <Route path="/notification" element={
          <>
            <HeaderH />
            <Notification/>
          </>
        } />
        <Route path="/profile" element ={
          <>
            <HeaderH/>
            <Profile/>
          </>
        }
        />
        <Route path="/message/:senderId" element ={
          <>
            <HeaderH/>
            <Msg/>
          </>
        }
        />


      </Routes>
    </Router>
  );
}
export default App;
