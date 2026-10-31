import React from 'react';
import { BookOpen, FileText, CheckCircle2, Calendar, Clock, ArrowLeft } from 'lucide-react';

export const DecoyScreen = ({ onExit }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-[#1e293b] font-sans overflow-y-auto">
      {/* Classroom Style Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Return (or press Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold text-lg tracking-tight">Classroom</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium text-sm">AP Environmental Science · Period 4</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-800">Student Portal</div>
            <div className="text-[11px] text-slate-500">Term 2 · Due This Week</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
            S
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Banner */}
        <div className="bg-emerald-800 text-white rounded-xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Unit 4: Earth Systems & Resource Dynamics</h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Complete the assigned reading from Chapter 8 and submit your laboratory observation synthesis report by Friday 11:59 PM.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-emerald-200 font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Next Exam: Nov 14</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Lab Session: Thursday</span>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Coursework</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Soil Permeability & Hydrological Modeling Lab</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    Review sample calculations for soil volumetric water content and record porosity constants in your lab workbook.
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span>Due Tomorrow, 11:59 PM</span>
                    <span aria-hidden="true">·</span>
                    <span>100 points</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Assigned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Atmospheric Composition & Insolation Patterns</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Guided reading questions 1 through 14 in section 8.2. Prepare notes on Hadley cell convective circulation.
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span>Due Friday, 3:30 PM</span>
                    <span aria-hidden="true">·</span>
                    <span>50 points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs opacity-75">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">Tectonic Plate Boundaries Case Study</h3>
                  <p className="text-xs text-slate-500 mt-1">Submitted Oct 28 · Graded: 98/100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-400">
          Press <kbd className="px-2 py-1 bg-slate-200 text-slate-700 rounded font-mono text-[11px]">Esc</kbd> or click the top back button to return to library.
        </div>
      </main>
    </div>
  );
};
