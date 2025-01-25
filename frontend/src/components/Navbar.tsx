import React from 'react'

const Navbar = () => {
  return (
    <div className='flex fixed w-full border-gray-400 top-0 justify-between bg-gray-300 p-3 border-b text-neutral-900'>
        <div className='text-2xl font-bold font-sans'>PostWoman</div>
        <div className='text-xl font-bold bg-gray-400 p-1 rounded-md'>Theme</div>
    </div>
  )
}

export default Navbar
