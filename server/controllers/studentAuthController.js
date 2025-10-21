/**
 * @param {import("express").Request} req
 *  @param {import("express").Response} res
 */


const register = (req,res) => {
    let { email, username, firstname, lastname, password } = req.body
    
}
// api/auth/login
const login = (req,res) => {
    
}


const logout = (req,res) => {
    
}

const addToCart = (req,res) => {
    
}

const removeFromCart = (req,res) => {
    
}

const getUserCart = (req,res) => {
    
}

export {login,register,logout,addToCart,removeFromCart,getUserCart}