import React from 'react';
import { CheckCircle, XCircle, Clock, Globe, ArrowRight, ExternalLink } from 'lucide-react';

interface PathResultProps {
  path: string[];
  found: boolean;
  searchedPages: number;
  timeElapsed: number;
  onTryAgain: () => void;
}

export const PathResult: React.FC<PathResultProps> = ({
  path,
  found,
  searchedPages,
  timeElapsed,
  onTryAgain
}) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getWikipediaUrl = (title: string) => {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  };

  if (!found) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Path Found</h3>
        <p className="text-gray-600 mb-6">
          Unfortunately, we couldn't find a path between these pages within our search limits.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">
                {searchedPages.toLocaleString()} pages searched
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onTryAgain}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Try Different Pages
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Path Found!</h3>
        <p className="text-gray-600">
          Found a path with {path.length} steps in {formatTime(timeElapsed)}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {searchedPages.toLocaleString()} pages searched
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-semibold text-gray-900 text-center mb-4">
          Your Path:
        </h4>
        {path.map((page, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{page}</span>
                  </div>
                  <a
                    href={getWikipediaUrl(page)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            {index < path.length - 1 && (
              <div className="flex justify-center mx-2">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onTryAgain}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Find Another Path
        </button>
      </div>
    </div>
  );
};