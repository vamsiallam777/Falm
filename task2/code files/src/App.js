import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const SNAP_POINTS = {
  CLOSED: 80,    // Shows just a peek (80% hidden)
  HALF_OPEN: 40, // Shows half (40% hidden) 
  FULL_OPEN: 5   // Almost fully open (5% hidden)
};

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(SNAP_POINTS.CLOSED);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartTransform, setDragStartTransform] = useState(0);  const bottomSheetRef = useRef(null);
  const animationRef = useRef(null);

  // Spring animation function
  const animateToSnapPoint = useCallback((targetSnapPoint) => {
    if (!bottomSheetRef.current) return;

    const startTransform = parseFloat(bottomSheetRef.current.style.transform.replace('translateY(', '').replace('%)', '')) || 100;
    const startTime = performance.now();
    const duration = 600;    const animate = (currentTime) => {
      // Check if the ref is still valid
      if (!bottomSheetRef.current) {
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spring easing function
      const easeOutElastic = (t) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
      };

      const easedProgress = easeOutElastic(progress);
      const currentTransform = startTransform + (targetSnapPoint - startTransform) * easedProgress;

      bottomSheetRef.current.style.transform = `translateY(${currentTransform}%)`;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentSnapPoint(targetSnapPoint);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Handle mouse/touch start
  const handlePointerStart = useCallback((e) => {
    if (!isVisible) return;
    
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    
    const currentTransform = parseFloat(bottomSheetRef.current.style.transform.replace('translateY(', '').replace('%)', '')) || currentSnapPoint;
    setDragStartTransform(currentTransform);
    
    document.body.style.userSelect = 'none';
  }, [isVisible, currentSnapPoint]);

  // Handle mouse/touch move
  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !bottomSheetRef.current) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    const windowHeight = window.innerHeight;
    const deltaPercent = (deltaY / windowHeight) * 100;
    
    let newTransform = dragStartTransform + deltaPercent;
    newTransform = Math.max(SNAP_POINTS.FULL_OPEN, Math.min(100, newTransform));
    
    bottomSheetRef.current.style.transform = `translateY(${newTransform}%)`;
  }, [isDragging, dragStartY, dragStartTransform]);

  // Handle mouse/touch end
  const handlePointerEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    document.body.style.userSelect = '';

    const currentTransform = parseFloat(bottomSheetRef.current.style.transform.replace('translateY(', '').replace('%)', ''));
    
    // Find nearest snap point
    let nearestSnapPoint = SNAP_POINTS.CLOSED;
    let minDistance = Math.abs(currentTransform - SNAP_POINTS.CLOSED);
    
    Object.values(SNAP_POINTS).forEach(snapPoint => {
      const distance = Math.abs(currentTransform - snapPoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSnapPoint = snapPoint;
      }
    });

    // If dragged beyond closed position, close the sheet
    if (currentTransform > 90) {
      setIsVisible(false);
      nearestSnapPoint = 100;
    }

    animateToSnapPoint(nearestSnapPoint);
  }, [isDragging, animateToSnapPoint]);

  // Event listeners setup
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handlePointerMove(e);
      const handleMouseUp = () => handlePointerEnd();
      const handleTouchMove = (e) => handlePointerMove(e);
      const handleTouchEnd = () => handlePointerEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerEnd]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const closeSheet = useCallback(() => {
    animateToSnapPoint(100);
    setTimeout(() => setIsVisible(false), 300);
  }, [animateToSnapPoint]);

  const openSheet = (snapPoint = SNAP_POINTS.HALF_OPEN) => {
    setIsVisible(true);
    setCurrentSnapPoint(snapPoint);
    setTimeout(() => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.style.transform = `translateY(100%)`;
        animateToSnapPoint(snapPoint);
      }
    }, 10);
  };

  const moveToSnapPoint = (snapPoint) => {
    animateToSnapPoint(snapPoint);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;
      
      if (e.key === 'Escape') {
        closeSheet();
      } else if (e.key === 'ArrowUp' && currentSnapPoint !== SNAP_POINTS.FULL_OPEN) {
        const snapPoints = Object.values(SNAP_POINTS).sort((a, b) => a - b);
        const currentIndex = snapPoints.indexOf(currentSnapPoint);
        if (currentIndex > 0) {
          animateToSnapPoint(snapPoints[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowDown' && currentSnapPoint !== SNAP_POINTS.CLOSED) {
        const snapPoints = Object.values(SNAP_POINTS).sort((a, b) => a - b);
        const currentIndex = snapPoints.indexOf(currentSnapPoint);
        if (currentIndex < snapPoints.length - 1) {
          animateToSnapPoint(snapPoints[currentIndex + 1]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentSnapPoint, animateToSnapPoint, closeSheet]);

  return (
    <div className="App">
      <div className="main-content">
        <h1>Bottom Sheet Demo</h1>
        <p>Experience smooth spring animations with multiple snap points</p>
        <div className="control-buttons">
          <button 
            className="control-btn" 
            onClick={() => openSheet(SNAP_POINTS.HALF_OPEN)}
          >
            Open Half
          </button>
          <button 
            className="control-btn" 
            onClick={() => openSheet(SNAP_POINTS.FULL_OPEN)}
          >
            Open Full
          </button>
          <button 
            className="control-btn" 
            onClick={() => openSheet(SNAP_POINTS.CLOSED)}
          >
            Open Peek
          </button>
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      <div 
        className={`bottom-sheet-overlay ${isVisible ? 'visible' : ''}`}
        onClick={closeSheet}
      />

      {/* Bottom Sheet */}
      {isVisible && (
        <div 
          ref={bottomSheetRef}
          className="bottom-sheet"
          style={{ transform: 'translateY(100%)' }}
        >
          {/* Handle */}
          <div 
            className="bottom-sheet-handle"
            onMouseDown={handlePointerStart}
            onTouchStart={handlePointerStart}
            role="button"
            tabIndex={0}
            aria-label="Drag to resize bottom sheet"
          >
            <div className="handle-bar" />
          </div>

          {/* Content */}
          <div className="bottom-sheet-content">
            <div className="bottom-sheet-header">
              <h2 className="bottom-sheet-title">Bottom Sheet Content</h2>
              <button 
                className="close-btn" 
                onClick={closeSheet}
                aria-label="Close bottom sheet"
              >
                ×
              </button>
            </div>

            <div className="content-section">
              <h3>Features</h3>
              <ul className="feature-list">
                <li>Spring motion animations</li>
                <li>Multiple snap points (Closed, Half, Full)</li>
                <li>Drag and release functionality</li>
                <li>Touch and mouse support</li>
                <li>Keyboard accessibility (Arrow keys, Escape)</li>
                <li>Responsive design</li>
              </ul>
            </div>

            <div className="content-section">
              <h3>Controls</h3>
              <p>Use the buttons above to open at different positions, or drag the handle to resize.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  className="control-btn" 
                  style={{ background: '#667eea', color: 'white' }}
                  onClick={() => moveToSnapPoint(SNAP_POINTS.CLOSED)}
                >
                  Peek
                </button>
                <button 
                  className="control-btn" 
                  style={{ background: '#667eea', color: 'white' }}
                  onClick={() => moveToSnapPoint(SNAP_POINTS.HALF_OPEN)}
                >
                  Half
                </button>
                <button 
                  className="control-btn" 
                  style={{ background: '#667eea', color: 'white' }}
                  onClick={() => moveToSnapPoint(SNAP_POINTS.FULL_OPEN)}
                >
                  Full
                </button>
              </div>
            </div>

            <div className="content-section">
              <h3>Content Area</h3>
              <p>
                This is a scrollable content area. You can add any content here. 
                The bottom sheet automatically handles overflow with smooth scrolling.
              </p>
              <p>
                The spring animations provide a natural feel when transitioning between
                snap points, making the user experience smooth and intuitive.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;