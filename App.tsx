
import React, { useState, useCallback } from 'react';
import { FileUp, ClipboardCheck, FileText, RefreshCw, AlertCircle, CheckCircle2, Download, Printer } from 'lucide-react';
import { AppStatus, BillingData } from './types';
import { extractBillingData } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ExtractionResults from './components/ExtractionResults';
import ReceiptView from './components/ReceiptView';

declare var html2pdf: any;

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [extractedData, setExtractedData] = useState<BillingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const processFile = async (file: File) => {
    setStatus(AppStatus.PROCESSING);
    setError(null);
    setLoadingMessage('Initializing OCR engine...');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      setLoadingMessage('Analyzing invoice structure with Gemini AI...');
      const data = await extractBillingData(base64Data, file.type);
      
      setExtractedData(data);
      setStatus(AppStatus.REVIEW);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process file. Please try again.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownloadPdf = async () => {
    if (!extractedData) return;
    
    setIsExporting(true);
    const element = document.getElementById('receipt-content');
    const safeName = (extractedData.patientName || 'Patient').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Explicitly set styling for capture to prevent clipping
    const opt = {
      margin: [0, 0, 0, 0], // Zero margin in html2pdf, use CSS in ReceiptView
      filename: `PharmaScan_${safeName}_${extractedData.transactionDate || 'receipt'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // Approx A4 width in pixels at 96 DPI
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation failed', err);
      alert('Failed to generate PDF. Please use the Print option instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setExtractedData(null);
    setError(null);
  };

  const handleSave = (updatedData: BillingData) => {
    setExtractedData(updatedData);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">PharmaScan PDF</h1>
              <p className="text-xs text-slate-500 font-medium">Smart Medical Billing Extraction</p>
            </div>
          </div>
          
          {status !== AppStatus.IDLE && (
            <button 
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Start New
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {status === AppStatus.IDLE && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 no-print">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Automate Pharmacy Billing</h2>
              <p className="text-slate-600 text-lg">Upload your pharmacy PDF invoice and let AI handle the extraction and receipt reconstruction.</p>
            </div>
            <FileUpload onFileSelect={processFile} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                { icon: <FileUp className="w-5 h-5" />, title: 'Upload PDF', desc: 'Securely upload medical invoices' },
                { icon: <ClipboardCheck className="w-5 h-5" />, title: 'AI Extraction', desc: 'Gemini-powered OCR precision' },
                { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Clean Receipt', desc: 'Instant professional formatting' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 no-print">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <FileText className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{loadingMessage}</h3>
              <p className="text-slate-500 text-sm animate-pulse">This usually takes about 10-15 seconds...</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4 no-print">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Processing Failed</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={handleReset}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === AppStatus.REVIEW && extractedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
            <div className="space-y-6 no-print">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Extracted Data</h2>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">AI Verified</span>
              </div>
              <ExtractionResults data={extractedData} onUpdate={handleSave} />
            </div>
            
            <div className="space-y-6 sticky top-24 print:static print:w-full overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 no-print">
                <h2 className="text-2xl font-bold text-slate-900">Digital Receipt</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button 
                    onClick={handleDownloadPdf}
                    disabled={isExporting}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isExporting ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto pb-4">
                <ReceiptView data={extractedData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
