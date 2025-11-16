import api from '@/api/axiosConfig.js'
import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'

function StudentForgetPassword() {
    const [email, setEmail] = useState('')
    let navigate = useNavigate()
    const sendOtp =async () => {
        let response = await api.post('/auth/send-otp', {
            email,
            
        })
        console.log(response)
        if (response.success) {
            navigate('/verify-otp', {
                state: {
                    email,
                    forget:true
                }
            })
        }
    }
  return (
      <div>
          <input type="text" onChange={(e)=>setEmail(e.target.value)} name="" id="" />
          <button onClick={sendOtp} >send otp</button> <br />
          
    </div>
  )
}

export default StudentForgetPassword