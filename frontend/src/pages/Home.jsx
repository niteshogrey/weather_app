import React from 'react'
import Navbar from '../components/Navbar'
import WeatherApp from '../components/WeatherApp'
import Signup from './Signup'

const useAuth = () =>{
  return !!localStorage.getItem("Token")
}

const Home = () => {
  const isAuthenticate = useAuth()
  return (
    <div >
      {
        (isAuthenticate)?

        (
        <div className='h-screen bg-blue-100'>
          <Navbar/>
          <WeatherApp/>
          </div>):
          (
            <div>
              <Signup/>
            </div>
          )
      }
    </div>
  )
}

export default Home