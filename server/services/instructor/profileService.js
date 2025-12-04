export const getInstructorProfileSerice = (instructorId,req) => {
   
return req

}

export const updateInstructorProfile = async  (req) => {
    const { name, email, password, bio, website } = req.body
    const user = req.user

    if (user) {
        user.name = name || user.name
        user.email = email || user.email
        user.bio = bio || user.bio
        user.website = website || user.website

        if (password) {
            user.password = password
        }

        const updatedUser = await user.save()
     return updatedUser
    } else {
        res.status(404)
        throw new Error('User not found')
    }
}