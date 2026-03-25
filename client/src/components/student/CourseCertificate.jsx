import React, { useRef } from "react";
import { X, Download, Award } from "lucide-react";
import { jsPDF } from "jspdf";

// draw certificate directly on canvas — no html2canvas
const drawCertificate = (canvas, { studentName, courseTitle, instructorName, formattedDate }) => {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  // white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // top gradient bar
  const topBar = ctx.createLinearGradient(0, 0, W, 0);
  topBar.addColorStop(0, "#2563eb");
  topBar.addColorStop(0.5, "#7c3aed");
  topBar.addColorStop(1, "#ec4899");
  ctx.fillStyle = topBar;
  ctx.fillRect(0, 0, W, 14);

  // bottom gradient bar
  const botBar = ctx.createLinearGradient(0, 0, W, 0);
  botBar.addColorStop(0, "#ec4899");
  botBar.addColorStop(0.5, "#7c3aed");
  botBar.addColorStop(1, "#2563eb");
  ctx.fillStyle = botBar;
  ctx.fillRect(0, H - 14, W, 14);

  // watermark circle
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 200, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  // corner circles
  const corners = [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]];
  corners.forEach(([x, y]) => {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // badge circle
  const badgeGrad = ctx.createRadialGradient(W / 2, 100, 0, W / 2, 100, 44);
  badgeGrad.addColorStop(0, "#3b82f6");
  badgeGrad.addColorStop(1, "#7c3aed");
  ctx.fillStyle = badgeGrad;
  ctx.beginPath();
  ctx.arc(W / 2, 100, 44, 0, Math.PI * 2);
  ctx.fill();

  // award star in badge
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px serif";
  ctx.textAlign = "center";
  ctx.fillText("★", W / 2, 112);

  // org name
  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 13px Arial";
  ctx.letterSpacing = "6px";
  ctx.textAlign = "center";
  ctx.fillText("IKIGAI LEARNING", W / 2, 175);

  // title
  ctx.fillStyle = "#111827";
  ctx.font = "bold 38px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", W / 2, 225);

  // divider
  const divGrad = ctx.createLinearGradient(W / 2 - 60, 0, W / 2 + 60, 0);
  divGrad.addColorStop(0, "#3b82f6");
  divGrad.addColorStop(1, "#7c3aed");
  ctx.fillStyle = divGrad;
  ctx.fillRect(W / 2 - 60, 244, 120, 4);

  // "this certifies"
  ctx.fillStyle = "#6b7280";
  ctx.font = "13px Arial";
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.fillText("THIS CERTIFIES THAT", W / 2, 290);

  // student name
  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 52px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(studentName, W / 2, 360);

  // body text
  ctx.fillStyle = "#4b5563";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("has successfully completed all lessons and requirements of the course", W / 2, 400);

  // course box
  ctx.fillStyle = "#eff6ff";
  ctx.strokeStyle = "#bfdbfe";
  ctx.lineWidth = 1.5;
  const boxW = Math.min(700, W - 160);
  const boxX = (W - boxW) / 2;
  ctx.beginPath();
  ctx.roundRect(boxX, 420, boxW, 64, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "bold 24px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(courseTitle, W / 2, 461);

  // divider line
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 520);
  ctx.lineTo(W - 80, 520);
  ctx.stroke();

  // footer — instructor
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 550);
  ctx.lineTo(280, 550);
  ctx.stroke();
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(instructorName, 190, 570);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px Arial";
  ctx.fillText("Instructor", 190, 587);

  // footer — verified badge
  const vGrad = ctx.createRadialGradient(W / 2, 555, 0, W / 2, 555, 30);
  vGrad.addColorStop(0, "#3b82f6");
  vGrad.addColorStop(1, "#7c3aed");
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.arc(W / 2, 555, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px serif";
  ctx.textAlign = "center";
  ctx.fillText("★", W / 2, 563);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "bold 11px Arial";
  ctx.fillText("VERIFIED", W / 2, 601);

  // footer — date
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W - 280, 550);
  ctx.lineTo(W - 100, 550);
  ctx.stroke();
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(formattedDate, W - 190, 570);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px Arial";
  ctx.fillText("Date of Completion", W - 190, 587);
};

const CourseCertificate = ({ isOpen, onClose, studentName, courseTitle, instructorName, completedAt }) => {
  const certRef = useRef(null);

  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 650;

    drawCertificate(canvas, { studentName, courseTitle, instructorName, formattedDate });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1000, 650] });
    pdf.addImage(imgData, "PNG", 0, 0, 1000, 650);
    pdf.save(`${courseTitle?.replace(/\s+/g, "_")}_Certificate.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl animate-fade-in">
        {/* action bar */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-lg">Your Certificate</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* certificate */}
        <div
          ref={certRef}
          className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {/* top border */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

          {/* corner ornaments */}
          <div className="absolute top-6 left-6 w-20 h-20 border-4 border-blue-200 rounded-full opacity-30" />
          <div className="absolute top-6 right-6 w-20 h-20 border-4 border-purple-200 rounded-full opacity-30" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-4 border-pink-200 rounded-full opacity-30" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-4 border-blue-200 rounded-full opacity-30" />

          {/* watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.035 }}>
            <Award style={{ width: 360, height: 360, color: "#4f46e5" }} />
          </div>

          <div className="px-16 py-12 text-center relative">
            {/* badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>

            <p className="text-xs font-bold tracking-[0.35em] text-blue-600 uppercase mb-1">Ikigai Learning</p>

            <h1 className="text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Certificate of Completion
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full my-6" />

            <p className="text-sm text-gray-500 tracking-widest uppercase mb-3">This certifies that</p>

            {/* gradient text — looks great on screen, PDF uses canvas version */}
            <p
              className="text-5xl font-bold mb-6"
              style={{
                fontFamily: "'Georgia', serif",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {studentName}
            </p>

            <p className="text-base text-gray-600 mb-4 leading-relaxed max-w-lg mx-auto">
              has successfully completed all lessons and requirements of the course
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl px-8 py-4 inline-block mb-8">
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                {courseTitle}
              </p>
            </div>

            {/* footer */}
            <div className="flex items-end justify-between pt-6 border-t border-gray-100 mt-2">
              <div className="text-center">
                <div className="w-40 h-px bg-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-800">{instructorName}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md mb-2">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-gray-400 font-medium tracking-wide">VERIFIED</p>
              </div>

              <div className="text-center">
                <div className="w-40 h-px bg-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-800">{formattedDate}</p>
                <p className="text-xs text-gray-500">Date of Completion</p>
              </div>
            </div>
          </div>

          {/* bottom border */}
          <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;
