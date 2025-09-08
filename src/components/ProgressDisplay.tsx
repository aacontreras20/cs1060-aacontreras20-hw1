import React from 'react';
import { Globe, Search, Layers, HelpCircle } from 'lucide-react';
import { PathfindingProgress } from '../utils/pathfinder';

interface ProgressDisplayProps {
  progress: PathfindingProgress;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Finding Path...</h3>
        <p className="text-gray-600">
          Currently exploring: <span className="font-medium">{progress.currentPage}</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Pages Searched</span>
            <Tooltip text="Total number of Wikipedia pages we've examined for links">
              <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-blue-600 font-semibold">
            {progress.searchedPages.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">Queue Size</span>
            <Tooltip text="Number of pages waiting to be explored. A larger queue means we're finding many potential paths to investigate.">
              <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-green-600 font-semibold">
            {progress.queueSize.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-gray-700 font-medium">Current Depth</span>
            <Tooltip text="How many 'clicks' away we are from the starting page. Depth 1 means direct links from the start page.">
              <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-orange-600 font-semibold">
            {progress.depth}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress.searchedPages / 10, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Search progress (max 1000 pages)
        </p>
      </div>
    </div>
  );
};