'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';

interface QuestionDisplayProps {
  questionText: string;
  questionName?: string;
  className?: string;
}

export default function QuestionDisplay({
  questionText,
  questionName,
  className = '',
}: QuestionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Question Display */}
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col ${className}`}
      >
        <div className="p-4 flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              {questionName && (
                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                  {questionName}
                </h3>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 text-sm text-gray-600 leading-relaxed overflow-y-auto">
            {questionText}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{questionName || 'Question'}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {questionText}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
