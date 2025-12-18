import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

const WishlistHeart = ({ courseId, className = "" }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { data: wishlistData } = useWishlist();
    const { mutate: toggleWishlist, isPending } = useToggleWishlist();
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        if (wishlistData?.data && courseId) {
            // courses are now direct objects, not wrapped in courseId
            const inWishlist = wishlistData.data.some(
                (course) => course._id === courseId
            );
            setIsInWishlist(inWishlist);
        }
    }, [wishlistData, courseId]);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login to add to wishlist");
            navigate("/login");
            return;
        }

        if (!courseId) {
            toast.error("Course ID is missing");
            return;
        }

        toggleWishlist(courseId, {
            onSuccess: (data) => {
                setIsInWishlist(data.data.inWishlist);
                toast.success(data.data.action === 'added' ? "Added to wishlist!" : "Removed from wishlist");
            },
            onError: (error) => {
                console.error("Toggle error:", error);
                toast.error("Failed to update wishlist");
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`p-2 rounded-full bg-white shadow-md hover:scale-110 transition-all ${className}`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${isPending ? 'animate-pulse' : ''}`}
            />
        </button>
    );
};

export default WishlistHeart;
