
export const detectMobileDevice = (): boolean => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') {
      return false;
    }
  
    // Check for mobile user agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Regex pattern for mobile devices
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    // Check if matches mobile regex
    if (mobileRegex.test(userAgent.toLowerCase())) {
      return true;
    }
    
    // Alternative check for mobile screen size (under 768px typically means mobile)
    if (window.innerWidth <= 768) {
      return true;
    }
    
    return false;
  };

  export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') {
      return 'desktop';
    }
  
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check for tablets specifically
    if (/ipad|android(?!.*mobile)/i.test(userAgent.toLowerCase())) {
      return 'tablet';
    }
    
    // Check for mobile phones
    if (detectMobileDevice()) {
      return 'mobile';
    }
    
    // Default to desktop
    return 'desktop';
  };