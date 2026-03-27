import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Flag, User, BookOpen, Calendar, MessageSquare, Ban } from "lucide-react";
import adminApi from "@/api/adminAxiosConfig";
import toast from "react-hot-toast";

const REASON_LABELS = {
    inappropriate_content: "Inappropriate Content",
    misleading_information: "Misleading Information",
    poor_quality: "Poor Quality",
    copyright_violation: "Copyright Violation",
    spam: "Spam or Scam",
    other: "Other",
};

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dismissed: "bg-gray-100 text-gray-600 border-gray-200",
    actioned: "bg-red-100 text-red-700 border-red-200",
};

const ReportDetail = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [adminNote, setAdminNote] = useState("");
    console.log(reportId);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-report", reportId],
        queryFn: async () => {
            const res = await adminApi.get(`/admin/reports/${reportId}`);
            return res.data;
        },
    });

    const report = data?.data;

    const updateStatus = useMutation({
        mutationFn: async ({ status, blockCourse }) => {
            const res = await adminApi.patch(`/admin/reports/${reportId}/status`, {
                status,
                adminNote,
                blockCourse: !!blockCourse,
            });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(variables.blockCourse ? "Report actioned and course blocked" : "Report updated");
            queryClient.invalidateQueries(["admin-reports"]);
            queryClient.invalidateQueries(["admin-report", reportId]);
        },
        onError: () => toast.error("Failed to update report"),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!report) return <div className="text-center py-12 text-gray-500">Report not found</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate("/admin/reports")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Reports</span>
            </button>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Flag className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Report Detail</h1>
                        <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[report.status]}`}>
                    {report.status}
                </span>
            </div>

            <div className="space-y-4">
                {/* course info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">Course</span>
                    </div>
                    {report.courseId ? (
                        <div className="flex items-center gap-3">
                            {report.courseId.thumbnail && (
                                <img src={report.courseId.thumbnail} alt="" className="w-14 h-10 object-cover rounded-lg" />
                            )}
                            <div>
                                <p className="font-medium text-gray-900">{report.courseId.title}</p>
                                {report.courseId.blocked && (
                                    <span className="text-xs text-red-500 font-medium">Currently Blocked</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Course has been deleted</p>
                    )}
                </div>

                {/* reporter info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">Reporter</span>
                    </div>
                    <p className="font-medium text-gray-900">
                        {report.reportedBy?.firstName} {report.reportedBy?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{report.reportedBy?.email}</p>
                </div>

                {/* reason */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Flag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">Reason</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{REASON_LABELS[report.reason] || report.reason}</p>
                    {report.otherReason && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{report.otherReason}</p>
                    )}
                </div>

                {/* admin note */}
                {report.status === "pending" && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">Admin Note (optional)</span>
                        </div>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Add an internal note..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>
                )}

                {report.adminNote && report.status !== "pending" && (
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Admin Note</p>
                        <p className="text-sm text-gray-700">{report.adminNote}</p>
                    </div>
                )}

                {/* actions */}
                {report.status === "pending" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => updateStatus.mutate({ status: "dismissed" })}
                            disabled={updateStatus.isPending}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Dismiss
                        </button>
                        {report.courseId && !report.courseId?.blocked && (
                            <button
                                onClick={() => updateStatus.mutate({ status: "actioned", blockCourse: true })}
                                disabled={updateStatus.isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Ban className="w-4 h-4" />
                                Action & Block Course
                            </button>
                        )}
                        <button
                            onClick={() => updateStatus.mutate({ status: "actioned" })}
                            disabled={updateStatus.isPending}
                            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            Mark Actioned
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportDetail;
