import api from '@/api/axiosConfig.js';
import { GoogleLogin } from '@react-oauth/google';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function GoogleAuth({role}) {
let navigate = useNavigate()
  const handleGoogleSuccess = async (credentialResponse) => {
    let res = await api.post(`/auth/${role}/google`, {
      token: credentialResponse.credential,
    });
    let { success,accessToken } = res.data
    console.log("sucess? ",success)
    if (success && role == "student") {
      localStorage.setItem('token',accessToken)
      navigate('/course')
    } else if (success && role == "instructor") {
      navigate("/instructor/dashboard")
    }
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("login failed");
        }}
        auto_select={true}
      />
    </>
  );
}

export default GoogleAuth
