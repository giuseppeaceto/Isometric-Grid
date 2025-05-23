import { useEffect } from 'react';
import { useScene } from '../../context/SceneContext';

/**
 * Component to handle keyboard shortcuts for the application
 * This is a non-visual component that just adds keyboard functionality
 */
export default function KeyboardShortcuts() {
  const { 
    undo, 
    redo, 
    clearScene, 
    selectedElementId, 
    removeElement,
    duplicateElement,
    updateZoom,
    zoom,
    updateOffset,
    offset,
    toggleGridVisibility
  } = useScene();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Delete or Backspace: Remove selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        removeElement(selectedElementId);
      }
      
      // Ctrl/Cmd + D: Duplicate selected element
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        duplicateElement(selectedElementId);
      }
      
      // Ctrl/Cmd + 0: Reset zoom and position
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        updateZoom(1);
        updateOffset({ x: 0, y: 0 });
      }
      
      // Ctrl/Cmd + Plus: Zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        updateZoom(Math.min(2, zoom + 0.1));
      }
      
      // Ctrl/Cmd + Minus: Zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        updateZoom(Math.max(0.5, zoom - 0.1));
      }
      
      // G: Toggle grid visibility
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleGridVisibility();
      }
      
      // Arrow keys: Pan the view
      if (e.key.startsWith('Arrow')) {
        const panAmount = 20;
        
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            updateOffset({ ...offset, y: offset.y + panAmount });
            break;
          case 'ArrowDown':
            e.preventDefault();
            updateOffset({ ...offset, y: offset.y - panAmount });
            break;
          case 'ArrowLeft':
            e.preventDefault();
            updateOffset({ ...offset, x: offset.x + panAmount });
            break;
          case 'ArrowRight':
            e.preventDefault();
            updateOffset({ ...offset, x: offset.x - panAmount });
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    undo, 
    redo, 
    clearScene, 
    selectedElementId, 
    removeElement,
    duplicateElement,
    updateZoom,
    zoom,
    updateOffset,
    offset,
    toggleGridVisibility
  ]);
  
  // This component doesn't render anything
  return null;
}