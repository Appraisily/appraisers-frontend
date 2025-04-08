import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * MermaidDiagram Component
 * 
 * Renders a workflow diagram using Mermaid.js with interactive elements
 * 
 * @param {Object} props
 * @param {string} props.config - Mermaid diagram definition
 * @param {Object} props.appraisal - Current appraisal data
 * @param {Function} props.onStepClick - Callback when a step is clicked
 * @param {Function} props.onStepHover - Callback when a step is hovered
 * @param {string} props.className - Additional CSS classes
 */
const MermaidDiagram = ({ 
  config, 
  appraisal,
  steps = [], 
  onStepClick, 
  onStepHover,
  className = "" 
}) => {
  const diagramRef = useRef(null);
  
  // Initialize mermaid on component mount
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose', // Required for interactive clicks
      flowchart: {
        htmlLabels: true,
        curve: 'basis'
      }
    });
    
    renderDiagram();
  }, [config, steps]);
  
  // Render and attach event handlers to the diagram
  const renderDiagram = async () => {
    if (!diagramRef.current) return;
    
    try {
      // Clear the container
      diagramRef.current.innerHTML = config;
      
      // Render the diagram
      await mermaid.run({
        nodes: document.querySelectorAll('.mermaid')
      });
      
      // Add click and hover handlers to nodes
      const nodes = diagramRef.current.querySelectorAll('.node');
      nodes.forEach(node => {
        // Extract step ID from node
        const nodeId = node.id;
        const stepId = nodeId.replace('flowchart-', '');
        const step = steps.find(s => s.id === stepId);
        
        if (step) {
          // Update node appearance based on step status
          updateNodeStyle(node, step.status);
          
          // Add click handler
          node.style.cursor = 'pointer';
          node.addEventListener('click', () => {
            if (onStepClick) onStepClick(step.id);
          });
          
          // Add hover handler
          node.addEventListener('mouseenter', () => {
            if (onStepHover) onStepHover(step);
          });
          
          node.addEventListener('mouseleave', () => {
            if (onStepHover) onStepHover(null);
          });
        }
      });
    } catch (error) {
      console.error('Failed to render Mermaid diagram:', error);
    }
  };
  
  // Update node style based on step status
  const updateNodeStyle = (node, status) => {
    // Remove any existing status classes
    node.classList.remove('status-completed', 'status-failed', 'status-processing');
    
    // Add appropriate status class
    switch (status) {
      case 'completed':
        node.classList.add('status-completed');
        break;
      case 'failed':
      case 'error':
        node.classList.add('status-failed');
        break;
      case 'processing':
      case 'in-progress':
        node.classList.add('status-processing');
        break;
      default:
        // No specific styling for pending/not started
    }
  };
  
  return (
    <div className={`mermaid-container ${className}`}>
      <div ref={diagramRef} className="mermaid">
        {config}
      </div>
      <style jsx>{`
        .mermaid-container {
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }
        
        :global(.status-completed rect) {
          fill: #dcfce7 !important;
          stroke: #22c55e !important;
        }
        
        :global(.status-failed rect) {
          fill: #fee2e2 !important;
          stroke: #ef4444 !important;
        }
        
        :global(.status-processing rect) {
          fill: #dbeafe !important;
          stroke: #3b82f6 !important;
        }
        
        :global(.node:hover rect) {
          stroke-width: 2px !important;
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  );
};

export default MermaidDiagram; 