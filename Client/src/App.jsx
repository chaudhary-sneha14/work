import React from 'react'
import Home from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import Interview from './Pages/interview'
import Result from './Pages/Result'
import Roadmap from './Pages/RoadMap'
// import TechResult from './Pages/Result'
// import HrResult from './Pages/HrResult'
// import Behavioral from './Pages/Behavioral'
// import Interview from './Pages/interview.jsx'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard/:jobAnalysisId' element={<Interview/>}/>
        {/* <Route path='/interview/:jobAnalysisId' element={<Behavioral/>}/> */}
        {/* <Route path="/tech-result" element={<TechResult />} /> */}
{/* <Route path="/hr-result" element={<HrResult />} /> */}
<Route path="/roadmap/:jobAnalysisId" element={<Roadmap />} />
        <Route path="/result" element={<Result />} />
        {/* <Route path="/roadmap/:jobAnalysisId" element={<Roadmap />} /> */}
      </Routes>
      {/* <Interview/> */}
      {/* <Home/> */}
    </div>
  )
}

export default App
