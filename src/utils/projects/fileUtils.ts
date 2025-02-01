export const FILE_EXTENSIONS = {
    images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    documents: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'],
    all: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx']
  };
  
  export const extractFileNameFromUrl = (url: string): string => {
    try {
      // Get the last part of the URL
      const urlParts = url.split('/');
      let fileName = urlParts[urlParts.length - 1];
      
      // Remove query parameters if any
      fileName = fileName.split('?')[0];
      
      // Remove any timestamp or unique identifier prefix
      fileName = fileName.replace(/^.*?-(\d+)?-/, '');
  
      // Find the actual filename by removing format-related prefixes
      let cleanedFileName = fileName;
      for (const ext of FILE_EXTENSIONS.all) {
        // If filename starts with format (e.g., "jpg-something.jpg")
        if (fileName.toLowerCase().startsWith(`${ext}-`)) {
          cleanedFileName = fileName.substring(ext.length + 1);
          break;
        }
      }
  
      // Clean up the filename
      cleanedFileName = cleanedFileName
        // Replace multiple dashes/underscores with single dash
        .replace(/[-_]+/g, '-')
        // Replace dash-dot-dash patterns
        .replace(/-\.-/g, '.')
        // Remove any leading/trailing dashes
        .replace(/^-+|-+$/g, '');
  
      // Ensure proper extension format
      const parts = cleanedFileName.split('.');
      if (parts.length > 2) {
        const extension = parts.pop(); // Get the last part as extension
        const name = parts.join('-'); // Join the rest with dashes
        cleanedFileName = `${name}.${extension}`;
      }
  
      // Additional cleanup for any remaining format-extension patterns
      const extensionPattern = FILE_EXTENSIONS.all.join('|');
      cleanedFileName = cleanedFileName.replace(
        new RegExp(`-+(${extensionPattern})\.(${extensionPattern})$`, 'i'),
        '.$2'
      );
  
      // If no extension is found, try to determine from the URL
      if (!cleanedFileName.includes('.')) {
        for (const ext of FILE_EXTENSIONS.all) {
          if (url.toLowerCase().includes(`.${ext}`)) {
            cleanedFileName = `${cleanedFileName}.${ext}`;
            break;
          }
        }
      }
  
      // Format specific cleanup
      for (const ext of FILE_EXTENSIONS.all) {
        // Clean cases like "document-pdf.pdf" or "image-jpg.jpg"
        const pattern = new RegExp(`-${ext}\\.${ext}$`, 'i');
        cleanedFileName = cleanedFileName.replace(pattern, `.${ext}`);
      }

      
  
      return decodeURIComponent(cleanedFileName);
    } catch (error) {
      console.error('Error extracting filename:', error);
      // Return appropriate default name based on URL
      if (url.toLowerCase().includes('.pdf')) return 'document.pdf';
      if (url.toLowerCase().includes('.doc')) return 'document.doc';
      if (url.toLowerCase().includes('.docx')) return 'document.docx';
      if (url.toLowerCase().includes('.txt')) return 'document.txt';
      if (url.toLowerCase().includes('.ppt')) return 'document.ppt';
      if (url.toLowerCase().includes('.pptx')) return 'document.pptx';
      for (const ext of FILE_EXTENSIONS.images) {
        if (url.toLowerCase().includes(`.${ext}`)) return `image.${ext}`;
      }
      return 'untitled.file';
    }
  };
  
  // Helper function to get file extension
  export const getFileExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return extension;
  };
  
  // Helper function to get file type
  export const getFileType = (filename: string): 'image' | 'document' | 'unknown' => {
    const extension = getFileExtension(filename);
    
    if (FILE_EXTENSIONS.images.includes(extension)) {
      return 'image';
    }
    if (FILE_EXTENSIONS.documents.includes(extension)) {
      return 'document';
    }
    
    return 'unknown';
  };