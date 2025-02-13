const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        // Try the standard fullscreen API first
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } 
        // Fallbacks for older browsers
        else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          (document.documentElement as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        // Fallbacks for older browsers
        else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to disable fullscreen:', err);
      }
    }
  };
  
  export default toggleBrowserFullscreen;