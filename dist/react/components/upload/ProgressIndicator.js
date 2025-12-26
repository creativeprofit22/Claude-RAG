import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Sparkles, Database, Check, AlertCircle } from 'lucide-react';
const STAGES = {
    idle: { label: 'Waiting', icon: _jsx(FileText, { size: 14 }), rangeStart: 0, rangeEnd: 0, order: null },
    reading: { label: 'Reading file', icon: _jsx(FileText, { size: 14 }), rangeStart: 0, rangeEnd: 10, order: 0 },
    extracting: { label: 'Extracting text', icon: _jsx(FileText, { size: 14 }), rangeStart: 10, rangeEnd: 30, order: 1 },
    chunking: { label: 'Chunking', icon: _jsx(FileText, { size: 14 }), rangeStart: 30, rangeEnd: 35, order: 2 },
    embedding: { label: 'Generating embeddings', icon: _jsx(Sparkles, { size: 14 }), rangeStart: 35, rangeEnd: 90, order: 3 },
    storing: { label: 'Storing', icon: _jsx(Database, { size: 14 }), rangeStart: 90, rangeEnd: 100, order: 4 },
    complete: { label: 'Complete', icon: _jsx(Check, { size: 14 }), rangeStart: 100, rangeEnd: 100, order: 5 },
    error: { label: 'Error', icon: _jsx(AlertCircle, { size: 14 }), rangeStart: 0, rangeEnd: 0, order: null },
};
const STAGE_ORDER = Object.entries(STAGES)
    .filter(([, info]) => info.order !== null)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([stage]) => stage);
/**
 * Get the current stage index (for highlighting)
 */
function getStageIndex(stage) {
    const idx = STAGE_ORDER.indexOf(stage);
    return idx >= 0 ? idx : 0;
}
export function ProgressIndicator({ progress, showStages = true, className = '', }) {
    const { stage, percent, current, total, chunkCount } = progress;
    const stageInfo = STAGES[stage];
    const currentStageIndex = getStageIndex(stage);
    const isComplete = stage === 'complete';
    const isError = stage === 'error';
    // Build progress details text
    let detailText = '';
    if (stage === 'embedding' && current !== undefined && total !== undefined) {
        detailText = `${current}/${total} chunks`;
    }
    else if (stage === 'chunking' && chunkCount !== undefined) {
        detailText = `${chunkCount} chunks`;
    }
    return (_jsxs("div", { className: `rag-upload-progress ${className}`, children: [_jsx("div", { className: "rag-upload-progress-bar-container", children: _jsx("div", { className: `rag-upload-progress-bar ${isComplete ? 'complete' : ''} ${isError ? 'error' : ''}`, style: { width: `${percent}%` } }) }), _jsxs("div", { className: "rag-upload-progress-info", children: [_jsxs("span", { className: `rag-upload-progress-stage ${isError ? 'error' : ''}`, children: [stageInfo.icon, _jsx("span", { children: stageInfo.label })] }), _jsxs("span", { className: "rag-upload-progress-percent", children: [detailText && _jsx("span", { className: "rag-upload-progress-detail", children: detailText }), !isError && _jsxs("span", { children: [percent, "%"] })] })] }), showStages && !isError && (_jsx("div", { className: "rag-upload-progress-stages", children: STAGE_ORDER.slice(0, -1).map((s, idx) => {
                    const info = STAGES[s];
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (_jsx("div", { className: `rag-upload-progress-stage-dot ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''}`, title: info.label, children: isPast ? _jsx(Check, { size: 10 }) : _jsx("span", { className: "dot" }) }, s));
                }) }))] }));
}
//# sourceMappingURL=ProgressIndicator.js.map