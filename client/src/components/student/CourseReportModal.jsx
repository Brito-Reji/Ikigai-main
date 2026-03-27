import React, { useState } from "react";
import { X, Flag, AlertCircle } from "lucide-react";
import { useSubmitReport } from "@/hooks/useReport";

const REASONS = [
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "misleading_information", label: "Misleading Information" },
    { value: "poor_quality", label: "Poor Quality" },
    { value: "copyright_violation", label: "Copyright Violation" },
    { value: "spam", label: "Spam or Scam" },
    { value: "other", label: "Other" },
];

const CourseReportModal = ({ isOpen, onClose, courseId, courseTitle }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [otherText, setOtherText] = useState("");
    const { mutate: submitReport, isPending } = useSubmitReport();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedReason) return;

        submitReport(
            { courseId, reason: selectedReason, otherReason: otherText },
            {
                onSuccess: () => {
                    onClose();
                    setSelectedReason("");
                    setOtherText("");
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <Flag className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Report Course</h2>
                            <p className="text-xs text-gray-500 truncate max-w-[220px]">{courseTitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <p className="text-sm text-gray-600">Why are you reporting this course?</p>

                    {/* reason list */}
                    <div className="space-y-2">
                        {REASONS.map((r) => (
                            <label
                                key={r.value}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    selectedReason === r.value
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={r.value}
                                    checked={selectedReason === r.value}
                                    onChange={() => setSelectedReason(r.value)}
                                    className="accent-red-500"
                                />
                                <span className="text-sm text-gray-700">{r.label}</span>
                            </label>
                        ))}
                    </div>

                    {/* other text area */}
                    {selectedReason === "other" && (
                        <textarea
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            placeholder="Describe the issue..."
                            rows={3}
                            maxLength={500}
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Your report will be reviewed by the admin team.</span>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedReason || isPending}
                            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseReportModal;
