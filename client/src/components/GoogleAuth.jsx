import api from '@/api/axiosConfig.js';
import { GoogleLogin } from '@react-oauth/google';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
function GoogleAuth({role}) {
let navigate = useNavigate()
  const handleGoogleSuccess = async (credentialResponse) => {
  try{
   console.log(credentialResponse.credential)
    let res = await api.post(`/auth/${role}/google`, {
      token: credentialResponse.credential,
    });
    let { success,accessToken,message } = res.data
    if(!success){
      console.log(message)
    }
    console.log("sucess? ",success)
    if (success && role === "student") {
      
      localStorage.setItem('accessToken',accessToken)
      navigate('/course', { replace: true })
    } else if (success && role === "instructor") {
      localStorage.setItem('accessToken',accessToken)
      navigate("/instructor/dashboard", { replace: true })
    }
  }
  catch(err){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response.data.message
    })
    console.log(err)
  }
   
 
    
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("login failed");
        }}
       
      />
    </>
  );
}

export default GoogleAuth
