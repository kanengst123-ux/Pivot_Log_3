import React, { useState, useEffect } from 'react';
import { parseCSV } from './services/dataService';
import { DataRow } from './types';
import { Loader2, AlertCircle, RefreshCw, FileText, ChartPie, Database, ArrowRight } from 'lucide-react';
import PivotView from './components/PivotView';
import DataLog from './components/DataLog';

const SHEET_ID = '10gGU4ZZH_qUKwYklfIK0sQFNCUCfUc36C3SpkfUoQlA';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

type ViewMode = 'home' | 'log' | 'pivot';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName] = useState<string>("Google Sheet Data");
  
  const [view, setView] = useState<ViewMode>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
          const res = await fetch(CSV_URL);
          if (!res.ok) throw new Error('Failed to connect to Google Sheets');
          const text = await res.text();
          const parsedData = parseCSV(text);
          
          if (parsedData.length === 0) throw new Error('Sheet is empty or invalid CSV');

          setData(parsedData);
          setHeaders(Object.keys(parsedData[0]));

      } catch (e) {
          console.error(e);
          setFetchError("Could not load data from Google Sheet. Ensure the sheet is published or shared publicly.");
      } finally {
          setIsLoading(false);
      }
  };

  // 1. Loading State
  if (isLoading) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="text-slate-500 font-medium animate-pulse">Fetching Google Sheet Data...</div>
          </div>
      );
  }

  // 2. Error State
  if (fetchError) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4 p-8 text-center">
              <div className="bg-red-100 p-4 rounded-full">
                  <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
              <p className="text-slate-500 max-w-md">{fetchError}</p>
              <button 
                onClick={fetchData}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                  <RefreshCw className="w-4 h-4" /> Retry Connection
              </button>
          </div>
      );
  }

  // 3. Routing
  if (view === 'log') {
      return <DataLog data={data} headers={headers} onBack={() => setView('home')} />;
  }

  if (view === 'pivot') {
      return <PivotView data={data} headers={headers} fileName={fileName} onRefresh={fetchData} onBack={() => setView('home')} />;
  }

  // 4. Main Page (Home)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-lg mb-2">
                <Database className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">PivotAI Explorer</h1>
           <p className="text-lg text-slate-500 max-w-lg mx-auto">
             Your intelligent command center for Google Sheet analysis. Select a mode to begin.
           </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Log Button */}
            <button 
                onClick={() => setView('log')}
                className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 text-left"
            >
                <div className="bg-green-100 p-3 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-green-800">Raw Log</h3>
                <p className="text-slate-500 mb-8 group-hover:text-slate-600">
                    View the raw dataset from your Google Sheet in a clean, scrollable tabular format.
                </p>
                <div className="mt-auto flex items-center font-bold text-green-600">
                    View Data <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </button>

            {/* Pivot Button */}
            <button 
                onClick={() => setView('pivot')}
                className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 text-left"
            >
                <div className="bg-blue-100 p-3 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <ChartPie className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-800">Pivot AI</h3>
                <p className="text-slate-500 mb-8 group-hover:text-slate-600">
                    Analyze data with dynamic pivot tables, interactive charts, and an AI assistant.
                </p>
                <div className="mt-auto flex items-center font-bold text-blue-600">
                    Start Analysis <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-400">
            Connected to Google Sheet &bull; {data.length} records loaded
        </div>

      </div>
    </div>
  );
};

export default App;