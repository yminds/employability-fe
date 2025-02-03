// /src/utils/showToast.ts

const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger fade-out
    setTimeout(() => {
      toast.style.opacity = '0';
      // Remove the toast after the transition
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  };
  
  export default showToast;
  