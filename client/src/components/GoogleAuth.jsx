import api from '@/api/axiosConfig.js';
import { GoogleLogin } from '@react-oauth/google';
import React from 'react'

function GoogleAuth() {

  const handleGoogleSuccess = async (credentialResponse) => {
    let res = await api.post("/auth/student/google", {
      token: credentialResponse.credential,
    });
    console.log(res)
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
