import React, { useState } from 'react';

function Register() {
    const [formData,setFormData]=useState(null)
  return (
    <div className="pt-20 min-h-screen bg-blue-100 flex items-center justify-center">
      <main className="w-full max-w-md bg-red-500 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 font-medium">Username</label>
            <input
              id="username"
              type="text"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">Password</label>
            <input
              id="password"
              type="password"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirm-password" className="mb-1 font-medium">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
        <button
            type="submit"
            className=" my-5 w-full bg-slate-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Continue with Google
          </button>
      </main>
    </div>
  );
}

export default Register;
