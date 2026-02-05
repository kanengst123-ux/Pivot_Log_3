import React, { ChangeEvent } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onUpload: (content: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onUpload(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Import Data</h2>
          <p className="text-slate-500 mb-8">Upload a CSV file to analyze, or load a saved Project (JSON).</p>
          
          <label className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Select File
            </span>
            <input 
              type="file" 
              accept=".csv,.json" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        <div className="text-xs text-slate-400">
          Supported formats: .csv, .json (PivotAI Project)
        </div>
      </div>
    </div>
  );
};

export default FileUpload;