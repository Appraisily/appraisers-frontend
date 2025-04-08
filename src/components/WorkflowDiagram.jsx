import React from 'react';
import { CheckCircle, XCircle, Loader2, Circle } from 'lucide-react';

/**
 * WorkflowDiagram Component
 * 
 * Displays a visual representation of the appraisal workflow
 * using native React components instead of Mermaid.js
 */
const WorkflowDiagram = ({ steps = [], onStepClick, onStepHover }) => {
  // Get status icon based on step status
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  // Get background color based on step status
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'processing':
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="workflow-diagram rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step node */}
            <div 
              className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors 
                ${getStatusColor(step.status)} hover:shadow-md flex-1 min-w-[120px]`}
              onClick={() => onStepClick?.(step.id)}
              onMouseEnter={() => onStepHover?.(step)}
              onMouseLeave={() => onStepHover?.(null)}
              title={step.description}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(step.status)}
                <span className="font-medium text-sm">{step.name}</span>
              </div>
            </div>
            
            {/* Arrow connector */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            
            {/* Mobile Down Arrow */}
            {index < steps.length - 1 && (
              <div className="flex md:hidden items-center justify-center h-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <style jsx>{`
        /* Additional styling for the workflow diagram */
        .workflow-diagram {
          width: 100%;
          background-color: white;
          padding: 1rem;
        }
        
        @media (max-width: 768px) {
          .workflow-diagram > div {
            width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkflowDiagram; 