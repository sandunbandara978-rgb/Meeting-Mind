import React, { useState } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { useUploadAudio } from '../services/api';
import { UploadCloud, FileAudio, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const FileUploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, setActiveTab, setSelectedMeetingId } = useMeetingStore();
  const uploadMutation = useUploadAudio();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(25);

    try {
      // Simulate step-by-step AI progress ticker
      const timer1 = setTimeout(() => setUploadProgress(65), 800);
      const timer2 = setTimeout(() => setUploadProgress(90), 1600);

      const res = await uploadMutation.mutateAsync(selectedFile);
      clearTimeout(timer1);
      clearTimeout(timer2);

      setUploadProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setIsUploadModalOpen(false);
        if (res && res.meeting) {
          setSelectedMeetingId(res.meeting.id);
          setActiveTab('meetings');
        }
      }, 500);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-gray-200 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900">Upload Meeting Audio</h3>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 hover:border-slate-400 rounded-2xl p-8 text-center space-y-3 bg-gray-50/60 hover:bg-gray-100/50 transition-all cursor-pointer relative">
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.m4a"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileAudio className="w-10 h-10 mx-auto text-slate-700" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                {selectedFile ? selectedFile.name : 'Drag & drop meeting recording or click to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Supports MP3, WAV, M4A up to 100MB</p>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-700" />
                  Transcribing via OpenAI Whisper...
                </span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-slate-700 text-xs font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs disabled:opacity-50 transition-all"
            >
              Start AI Processing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
