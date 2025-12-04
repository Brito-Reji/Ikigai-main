import asyncHandler from 'express-async-handler'
import { getInstructorProfileSerice, updateInstructorProfileService } from '../../services/instructor/profileService'

export const getInstructorProfile = asyncHandler(async (req, res) => {
    let instuctorProfrofile = getInstructorProfileSerice()
    res.status(200).json(instuctorProfrofile)
})

export const updateInstructorProfileService = asyncHandler(async (req, res) => {
    const updatedinstructorProfile = updateInstructorProfileService(req)
    res.status(200).json({
        success: true,
        message: 'instuctor profile updated successfuly',
        data: {
            _id: updatedinstructorProfile._id,
            name: updatedinstructorProfile.name,
            email: updatedinstructorProfile.email,
            phone: updatedinstructorProfile.phone,
            bio: updatedinstructorProfile.bio,
            socialLinks: updatedinstructorProfile.socialLinks,
            profileImage: updatedinstructorProfile.profileImage,
            coverImage: updatedinstructorProfile.coverImage,
        }
    
    })
  
})