import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Pause, Play, Tag, Calendar, TrendingUp } from "lucide-react";
import CouponModal from "@/components/ui/CouponModal";
import Swal from "sweetalert2";
import { useAddCoupon, useGetCoupons, useDeleteCoupon, useTogglePauseCoupon } from "@/hooks/useCoupon";

const Coupons = () => {
  const {data:coupons, isLoading, error} = useGetCoupons()
  const {mutate:addCoupon,isPending:addCouponPending} = useAddCoupon()
  const {mutate:deleteCoupon} = useDeleteCoupon()
  const {mutate:togglePauseCoupon} = useTogglePauseCoupon()


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const itemsPerPage = 5;
console.log(coupons?.data?.data)
  const filteredCoupons = coupons?.data?.data?.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoupons = filteredCoupons.slice(startIndex, endIndex);

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getStatusBadge = (coupon) => {
    if (isExpired(coupon.expiryDate)) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Expired
        </span>
      );
    }
    if (coupon.isPaused) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
          Paused
        </span>
      );
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          Limit Reached
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        Active
      </span>
    );
  };

  const handleAddCoupon = () => {
    setModalMode("add");
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleEditCoupon = (coupon) => {
    setModalMode("edit");
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === "add") {
      addCoupon(formData, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Coupon created successfully",
            confirmButtonColor: "#14b8a6",
            timer: 2000,
          });
          setIsModalOpen(false);
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error?.response?.data?.message || "Failed to create coupon",
            confirmButtonColor: "#ef4444",
          });
        }
      });
    } else {
      // TODO: Implement update coupon
      Swal.fire({
        icon: "info",
        title: "Not Implemented",
        text: "Update functionality coming soon",
        confirmButtonColor: "#14b8a6",
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: "This coupon will be removed from the list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteCoupon(couponId, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Coupon has been deleted",
            confirmButtonColor: "#14b8a6",
            timer: 2000,
          });
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error?.response?.data?.message || "Failed to delete coupon",
            confirmButtonColor: "#ef4444",
          });
        }
      });
    }
  };

  const handleTogglePause = async (couponId) => {
    const coupon = coupons?.data?.data?.find((c) => c._id === couponId);
    const action = coupon?.isPaused ? "activate" : "pause";

    const result = await Swal.fire({
      title: `${action === "pause" ? "Pause" : "Activate"} Coupon?`,
      text: `Are you sure you want to ${action} this coupon?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "pause" ? "#f59e0b" : "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      togglePauseCoupon(couponId, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Coupon ${action}d successfully`,
            confirmButtonColor: "#14b8a6",
            timer: 2000,
          });
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error?.response?.data?.message || `Failed to ${action} coupon`,
            confirmButtonColor: "#ef4444",
          });
        }
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Coupon Management
        </h1>
        <p className="text-gray-600">
          Create and manage discount coupons for your platform
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddCoupon}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Coupon
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {filteredCoupons.length > 0 && (
            <>
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredCoupons.length)} of{" "}
              {filteredCoupons.length} coupons
            </>
          )}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading coupons...
            </div>
          ) : currentCoupons.length > 0 ? (
            currentCoupons.map((coupon,id) => (
              <div
                key={id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <Tag className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {coupon.code}
                          </h3>
                          {getStatusBadge(coupon)}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {coupon.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Discount</p>
                        <p className="font-semibold text-gray-800">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                          {coupon.maxDiscount && (
                            <span className="text-xs text-gray-500 ml-1">
                              (max ₹{coupon.maxDiscount})
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Min Purchase</p>
                        <p className="font-semibold text-gray-800">
                          ₹{coupon.minAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires
                        </p>
                        <p
                          className={`font-semibold ${
                            isExpired(coupon.expiryDate)
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          {formatDate(coupon.expiryDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Total Usage
                        </p>
                        <p className="font-semibold text-gray-800">
                          {coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : `${coupon.usedCount}/Unlimited`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Per User</p>
                        <p className="font-semibold text-gray-800">
                          {coupon.perUserLimit ? `${coupon.perUserLimit} uses` : 'Unlimited'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      disabled={isExpired(coupon.expiryDate)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePause(coupon._id)}
                      className={`flex-1 lg:flex-none px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        coupon.isPaused
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                      disabled={isExpired(coupon.expiryDate)}
                    >
                      {coupon.isPaused ? (
                        <>
                          <Play className="w-4 h-4" />
                          Activate
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? (
                <>
                  No coupons found matching "{searchTerm}".
                  <br />
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-teal-500 hover:text-teal-600 underline mt-2"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                'No coupons available. Click "Add Coupon" to create one.'
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) =>
                    pageNum === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-teal-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        coupon={selectedCoupon}
        mode={modalMode}
      />
    </div>
  );
};

export default Coupons;
