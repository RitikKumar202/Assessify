import React from 'react'
import { Link } from 'react-router-dom';
import colleges from '../../data/collegeName';

const Register = () => {
    return (
        <section className="container mx-auto py-10 px-5">
            <div className="w-full max-w-sm mx-auto p-6 rounded-md font-Inter shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
                <h1 className="text-xl font-bold text-center text-dark-hard mb-3">
                    Sign Up
                </h1>
                <form>
                    <div className="flex flex-col mb-2 w-full">
                        <label
                            htmlFor="name"
                            className="text-[#5a7184] font-semibold block"
                        >
                            <p className='text-base'>
                                Name<span className="text-red-600 ml-[1.5px]">*</span>
                            </p>
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="placeholder:text-[#ccc] text-dark-soft mt-1 rounded-md px-2 py-1 text-base font-medium  block outline-none border-[1px] border-gray-300 focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col mb-2 w-full">
                        <label
                            htmlFor="email"
                            className="text-[#5a7184] font-semibold block"
                        >
                            <p className='text-base'>
                                Email<span className="text-red-600 ml-[1.5px]">*</span>
                            </p>
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="placeholder:text-[#ccc] text-dark-soft mt-1 rounded-md px-2 py-1 text-base font-medium  block outline-none border-[1px] border-gray-300 focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col mb-2 w-full">
                        <label
                            htmlFor="rollNo"
                            className="text-[#5a7184] font-semibold block"
                        >
                            <p className='text-base'>
                                University Roll No<span className="text-red-600 ml-[1.5px]">*</span>
                            </p>
                        </label>
                        <input
                            type="text"
                            id="rollNo"
                            placeholder="Enter your university roll no"
                            className="placeholder:text-[#ccc] text-dark-soft mt-1 rounded-md px-2 py-1 text-base font-medium  block outline-none border-[1px] border-gray-300 focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col mb-2 w-full">
                        <label
                            htmlFor="collegeName"
                            className="text-[#5a7184] font-semibold block"
                        >
                            <p className='text-base'>
                                Institute Name<span className="text-red-600 ml-[1.5px]">*</span>
                            </p>
                        </label>
                        <select
                            id="collegeName"
                            className="placeholder:text-[#ccc] text-dark-soft mt-1 rounded-md px-2 py-1 text-base font-medium block outline-none border-[1px] border-gray-300 focus:border-primary"
                        >
                            <option selected>Select College</option>
                            {colleges.map((college) => (
                                <option key={college} value={college}>{college}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col mb-2 w-full">
                        <label
                            htmlFor="password"
                            className="text-[#5a7184] font-semibold block"
                        >
                            <p className='text-base'>
                                Password<span className="text-red-600 ml-[1.5px]">*</span>
                            </p>
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            className="placeholder:text-[#ccc] text-dark-soft mt-1 rounded-md px-2 py-1 text-base font-medium  block outline-none border-[1px] border-gray-300 focus:border-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white font-bold rounded-lg text-base px-1 py-2 w-full mb-3 mt-2 disabled:bg-gray-400 disabled:hover:bg-primary disabled:hover:opacity-60 disabled:cursor-not-allowed"
                    >
                        Register
                    </button>
                    <p className="font-semibold text-sm text-[#5a7184]">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary ml-1 text-base">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    )
}

export default Register