/**
 * ProgressIndicator - Staged progress display for file uploads
 */

import React from 'react';
import { FileText, Sparkles, Database, Check, AlertCircle } from 'lucide-react';
import type { UploadProgress, UploadStage } from '../../hooks/useUploadStream.js';

export interface ProgressIndicatorProps {
  progress: UploadProgress;
  showStages?: boolean;
  className?: string;
}

interface StageInfo {
  label: string;
  icon: React.ReactNode;
  rangeStart: number;
  rangeEnd: number;
  order: number | null;
}

const STAGES: Record<UploadStage, StageInfo> = {
  idle: { label: 'Waiting', icon: <FileText size={14} />, rangeStart: 0, rangeEnd: 0, order: null },
  reading: { label: 'Reading file', icon: <FileText size={14} />, rangeStart: 0, rangeEnd: 10, order: 0 },
  extracting: { label: 'Extracting text', icon: <FileText size={14} />, rangeStart: 10, rangeEnd: 30, order: 1 },
  chunking: { label: 'Chunking', icon: <FileText size={14} />, rangeStart: 30, rangeEnd: 35, order: 2 },
  embedding: { label: 'Generating embeddings', icon: <Sparkles size={14} />, rangeStart: 35, rangeEnd: 90, order: 3 },
  storing: { label: 'Storing', icon: <Database size={14} />, rangeStart: 90, rangeEnd: 100, order: 4 },
  complete: { label: 'Complete', icon: <Check size={14} />, rangeStart: 100, rangeEnd: 100, order: 5 },
  error: { label: 'Error', icon: <AlertCircle size={14} />, rangeStart: 0, rangeEnd: 0, order: null },
};

const STAGE_ORDER = (Object.entries(STAGES) as [UploadStage, StageInfo][])
  .filter(([, info]) => info.order !== null)
  .sort((a, b) => a[1].order! - b[1].order!)
  .map(([stage]) => stage);

/**
 * Get the current stage index (for highlighting)
 */
function getStageIndex(stage: UploadStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx >= 0 ? idx : 0;
}

export function ProgressIndicator({
  progress,
  showStages = true,
  className = '',
}: ProgressIndicatorProps): React.ReactElement {
  const { stage, percent, current, total, chunkCount } = progress;
  const stageInfo = STAGES[stage];
  const currentStageIndex = getStageIndex(stage);
  const isComplete = stage === 'complete';
  const isError = stage === 'error';

  // Build progress details text
  let detailText = '';
  if (stage === 'embedding' && current !== undefined && total !== undefined) {
    detailText = `${current}/${total} chunks`;
  } else if (stage === 'chunking' && chunkCount !== undefined) {
    detailText = `${chunkCount} chunks`;
  }

  return (
    <div className={`rag-upload-progress ${className}`}>
      {/* Progress bar */}
      <div className="rag-upload-progress-bar-container">
        <div
          className={`rag-upload-progress-bar ${isComplete ? 'complete' : ''} ${isError ? 'error' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Current stage info */}
      <div className="rag-upload-progress-info">
        <span className={`rag-upload-progress-stage ${isError ? 'error' : ''}`}>
          {stageInfo.icon}
          <span>{stageInfo.label}</span>
        </span>
        <span className="rag-upload-progress-percent">
          {detailText && <span className="rag-upload-progress-detail">{detailText}</span>}
          {!isError && <span>{percent}%</span>}
        </span>
      </div>

      {/* Stage indicators */}
      {showStages && !isError && (
        <div className="rag-upload-progress-stages">
          {STAGE_ORDER.slice(0, -1).map((s, idx) => {
            const info = STAGES[s];
            const isPast = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={s}
                className={`rag-upload-progress-stage-dot ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''}`}
                title={info.label}
              >
                {isPast ? <Check size={10} /> : <span className="dot" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
