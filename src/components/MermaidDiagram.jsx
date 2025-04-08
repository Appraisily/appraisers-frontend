import React from 'react';
// import mermaid from 'mermaid'; // Disabled for Netlify compatibility

/**
 * MermaidDiagram Component - DISABLED for Netlify compatibility
 * 
 * This component is disabled in favor of the WorkflowDiagram component
 * which doesn't rely on the Mermaid.js library that causes build issues on Netlify.
 * 
 * The implementation is kept for reference if needed in a different environment.
 */
const MermaidDiagram = ({ config, appraisal, steps = [], onStepClick, onStepHover, className = "" }) => {
  // Implementation disabled - using WorkflowDiagram instead
  
  return (
    <div className={`mermaid-placeholder ${className}`}>
      <div className="p-4 border rounded-lg bg-gray-50 text-center">
        <p className="text-muted-foreground">Mermaid diagram disabled. Using WorkflowDiagram instead.</p>
      </div>
    </div>
  );
};

export default MermaidDiagram; 