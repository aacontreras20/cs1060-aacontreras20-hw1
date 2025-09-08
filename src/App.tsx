import React, { useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { SearchInput } from './components/SearchInput';
import { PathResult } from './components/PathResult';
import { ProgressDisplay } from './components/ProgressDisplay';
import { WikipediaPathfinder, PathfindingProgress } from './utils/pathfinder';

function App() {
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState<PathfindingProgress | null>(null);
  const [result, setResult] = useState<{
    path: string[];
    found: boolean;
    searchedPages: number;
    timeElapsed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pathfinder = new WikipediaPathfinder();

  const handleSearch = async () => {
    if (!startPage.trim() || !endPage.trim()) {
      setError('Please enter both start and end pages');
      return;
    }

    setIsSearching(true);
    setProgress(null);
    setResult(null);
    setError(null);

    try {
      const searchResult = await pathfinder.findPath(
        startPage,
        endPage,
        (progressData) => setProgress(progressData)
      );
      setResult(searchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSearching(false);
      setProgress(null);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setError(null);
    setStartPage('');
    setEndPage('');
  };

  const getRandomPages = () => {
    const examples = [
      ['Barack Obama', 'Pizza'],
      ['Albert Einstein', 'The Beatles'],
      ['World War II', 'Ice cream'],
      ['Shakespeare', 'Computer'],
      ['Mathematics', 'Basketball'],
      ['Ancient Rome', 'Mobile phone'],
      ['Cat', 'Quantum mechanics'],
      ['Coffee', 'Space exploration']
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setStartPage(random[0]);
    setEndPage(random[1]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Wikipedia Pathfinder
          </h1>
          <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
            Discover the shortest path between any two Wikipedia pages. Enter your starting and ending pages to begin the journey!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result && !isSearching && !progress && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <SearchInput
                value={startPage}
                onChange={setStartPage}
                placeholder="e.g., Barack Obama"
                label="Starting Page"
                disabled={isSearching}
              />
              <SearchInput
                value={endPage}
                onChange={setEndPage}
                placeholder="e.g., Pizza"
                label="Ending Page"
                disabled={isSearching}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSearch}
                disabled={isSearching || !startPage.trim() || !endPage.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Find Path
              </button>
              <button
                onClick={getRandomPages}
                disabled={isSearching}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Random Example
              </button>
            </div>

            {/* How it works */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works:</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p>Enter two Wikipedia page titles</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <p>Our algorithm searches for connecting links</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <p>Get the shortest path between pages</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {progress && (
          <ProgressDisplay progress={progress} />
        )}

        {result && (
          <PathResult
            path={result.path}
            found={result.found}
            searchedPages={result.searchedPages}
            timeElapsed={result.timeElapsed}
            onTryAgain={handleTryAgain}
          />
        )}
      </div>
    </div>
  );
}

export default App;