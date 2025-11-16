import React, { useState } from 'react'

function Password() {
    const [password, setPassword] = useState()
  return (
      <div>
          <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} name="" id="" />
          <button>set password</button>
    </div>
  )
}

export default Password