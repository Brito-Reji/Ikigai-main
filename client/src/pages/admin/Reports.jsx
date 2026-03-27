import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Flag, ChevronRight, AlertCircle } from "lucide-react";
import adminApi from "@/api/adminAxiosConfig";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    dismissed: "bg-gray-100 text-gray-600",
    actioned: "bg-red-100 text-red-700",
};

const REASON_LABELS = {
    inappropriate_content: "Inappropriate Content",
    misleading_information: "Misleading Information",
    poor_quality: "Poor Quality",
    copyright_violation: "Copyright Violation",
    spam: "Spam or Scam",
    other: "Other",
};

const Reports = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-reports", statusFilter],
        queryFn: async () => {
            const params = statusFilter ? `?status=${statusFilter}` : "";
            const res = await adminApi.get(`/admin/reports${params}`);
            return res.data;
        },
    });

    const reports = data?.data || [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Review reports submitted by students</p>
                </div>
                <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">{reports.length} reports</span>
                </div>
            </div>

            {/* filter tabs */}
            <div className="flex gap-2 mb-6">
                {["", "pending", "dismissed", "actioned"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                            statusFilter === s
                                ? "bg-teal-500 text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {s || "All"}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reports found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reporter</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reports.map((report) => (
                                <tr
                                    key={report._id}
                                    onClick={() => navigate(`/admin/reports/${report._id}`)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
                                            {report.courseId?.title || "Deleted course"}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {report.reportedBy?.firstName} {report.reportedBy?.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {REASON_LABELS[report.reason] || report.reason}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[report.status]}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <ChevronRight className="w-4 h-4" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
