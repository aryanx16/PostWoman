import React from 'react'
import logo from "./logo.jpg"
const Navbar = () => {
  return (
    <div className='flex fixed w-full border-gray-300 shadow-2xl border-b-2 top-0 justify-between bg-white p-3  text-neutral-900'>
        <div className='text-2xl font-bold font-sans '><img className='w-24 object-center' src={logo} alt="" /></div>
        <div className='flex justify-center items-center'><button  className='bg-[#E8F9FF] font-bold  p-2 rounded-md'>Who Built this?</button></div>
    </div>
  )
}

export default Navbar
