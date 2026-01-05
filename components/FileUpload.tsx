
import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-80 
          border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
            : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'}
        `}
      >
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,image/*" 
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`p-5 rounded-2xl mb-4 transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            <Upload className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-bold text-slate-700">
            {isDragging ? 'Drop your invoice here' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-sm text-slate-500 max-w-xs">
            Supports PDF, JPG, or PNG pharmacy invoices for automated data extraction.
          </p>
        </div>
      </label>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Max 10MB</span>
        <span className="flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Secure Processing</span>
      </div>
    </div>
  );
};

export default FileUpload;
