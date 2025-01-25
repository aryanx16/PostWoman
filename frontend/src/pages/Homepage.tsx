import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { div, head } from 'framer-motion/client';

const Homepage = () => {
  const [headers, setheaders] = useState<{ key: string; value: string }[]>([])
  const addheader = () => {
    setheaders([...headers, { key: "", value: "" }])
  }
  const removeheader = (index: number) => {
    setheaders(headers.filter((_, i) => i !== index))
  }
  return (
    <div className='bg-gray-200   min-h-screen pt-28'>
      <Navbar />
      {/* main  */}
      <div className='bg-gray-300 p-4 border border-gray-400 shadow-2xl min-h-96 text-black mx-auto max-w-4xl  rounded-md'>
        {/* first line  url and method*/}
        <div className='flex gap-4 mb-4'>
          <div className='flex-grow'>
            <label htmlFor="" className=''>URL</label>
            <input className='bg-gray-400 w-full rounded-md p-2 shadow-xl border' placeholder='Enter Url ' type="text" />
          </div>
          <div className=''>
            <label htmlFor="">Method</label>
            <select name="" className='w-full p-2 bg-gray-400 rounded-md shadow-xl border' id="">

              <option className='bg-gray-400 shadow-xl border' value="GET">GET</option>
            </select>
          </div>
        </div>
        {/* second line  headers section*/}
        <div className=''>
          {/* headers add btn  */}
          <div className=' flex justify-between items-center mb-4'>
            <div className=''>Headers</div>
            <div onClick={addheader} className='bg-blue-400 font-semibold rounded-md p-2'>+ Add Header</div>
          </div>
          {/* after headers are added */}
          <div className=''>
            {headers.map((header, index) => (
              <div key={index} className='flex flex-col sm:flex-row  gap-3 mb-2'>
                <input type="text" placeholder='key' className='bg-gray-400 flex-1 w-full   rounded-md p-2 border shadow-2xl' />
                <input type="text" placeholder='value' className='bg-gray-400 flex-1 w-full rounded-md p-2 border shadow-2xl' />
                <div onClick={() => { removeheader(index) }} className='bg-red-600 rounded-md text-white text-center p-2 '>Remove</div>
              </div>
            ))}
          </div>
        </div>
        {/* third line body */}
        <div>
          <div className='mb-2'>Body(JSON)</div>
          <div><textarea name="" className='bg-gray-400 p-2 w-full h-28 rounded-md border shadow-xl' placeholder='Enter JSON Body(optional)' id=""></textarea></div>
        </div>
        {/* fourth line  */}
        <div>
          <div className='flex justify-center items-center'>
            <button className='p-1 bg-blue-500 px-4 rounded-md shadow-2xl text-white font-semibold font-mono'>Send Request</button>
          </div>
        </div>
        {/* response */}
        <div>
          
        </div>
      </div>

    </div>
  )
}

export default Homepage
