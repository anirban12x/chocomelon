import React from 'react'
import { About, Collection, Discover, Top } from '../container'; 
import Create1 from '../container/Create1/Create1'
import Home1 from '../container/Home/Home1'

function Landing() {
  return (
    <>
     <Home1 />
    <About />
    <Top />
    <Collection />
    <Create1 />
    <Discover/>
    </>
  )
}

export default Landing