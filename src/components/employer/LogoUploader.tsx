import { useState, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
import { toast } from "sonner"; 

// Logo upload component for CompanyForm
const LogoUploader = ({ 
  logoPreview, 
  setLogoPreview, 
  onLogoUploaded 
}: {
  logoPreview: string | null;
  setLogoPreview: (preview: string | null) => void;
  onLogoUploaded: (logoUrl: string, logoKey: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<{
    status: "idle" | "uploading" | "uploaded" | "error";
    progress: number;
    url?: string;
    s3Key?: string;
  }>({
    status: logoPreview ? "uploaded" : "idle",
    progress: logoPreview ? 100 : 0,
    url: logoPreview || undefined,
  });

  const user = useSelector((state: RootState) => state.employerAuth.employer);

  // Function to handle file selection
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(file);
      // Create a local preview
      const localPreview = URL.createObjectURL(file);
      setLogoPreview(localPreview);
      uploadLogoToS3(file);
    }
  };

  // Function to upload logo to S3
  const uploadLogoToS3 = async (file: File) => {
    setUploadState({
      status: "uploading",
      progress: 0
    });

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", `companies/${user?._id || 'new'}/logo`);
      formData.append("userId", user?._id || 'temp');

      const response = await axios.post(`https://employability.ai/api/v1/s3/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total) 
            : 0;
          setUploadState(prev => ({
            ...prev,
            progress
          }));
        }
      });

      const [uploadedFile] = response.data.data;
      setUploadState({
        status: "uploaded",
        progress: 100,
        url: uploadedFile.fileUrl,
        s3Key: uploadedFile.key
      });

      // Notify parent component about the successful upload
      onLogoUploaded(uploadedFile.fileUrl, uploadedFile.key);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      setUploadState({
        status: "error",
        progress: 0
      });
      toast.error("Failed to upload logo");
    }
  };

  // Function to prompt file selection
  const promptFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Function to delete logo
  const handleLogoDelete = async () => {
    if (uploadState.s3Key) {
      try {
        // Delete from S3
        await axios.delete(`https://employability.ai/api/v1/s3/delete`, {
          data: { key: uploadState.s3Key }
        });

        // Reset states
        setLogoPreview(null);
        setLogo(null);
        setUploadState({
          status: "idle",
          progress: 0
        });
        
        // Notify parent component
        onLogoUploaded("", "");
        toast.success("Logo deleted successfully");
      } catch (error) {
        console.error("Error deleting logo:", error);
        toast.error("Failed to delete logo");
      }
    } else {
      // If there's no S3 key (e.g., just a local preview), just reset the states
      setLogoPreview(null);
      setLogo(null);
      setUploadState({
        status: "idle",
        progress: 0
      });
      onLogoUploaded("", "");
    }
  };

  // Logo preview component
  const LogoPreview = () => {
    if (!logoPreview && uploadState.status !== "uploading") return null;

    // Get filename from the file object or extract it from the URL
    const displayName = logo?.name || 
      (uploadState.url ? uploadState.url.split("/").pop() : "") || 
      "Company Logo";

    return (
      <div className="w-full flex flex-col p-3 rounded-lg bg-[#F0F5F3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Company Logo" 
                className="h-12 w-12 object-cover rounded-full"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {displayName.length > 20 
                  ? `${displayName.slice(0, 17)}...${displayName.slice(-3)}` 
                  : displayName}
              </p>
              {uploadState.status === "uploading" && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={handleLogoDelete} 
            className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            disabled={uploadState.status === "uploading"}
          >
            <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
          </button>
        </div>
        {uploadState.status === "error" && (
          <p className="text-red-500 text-sm mt-1">Upload failed</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleLogoSelect}
          className="hidden"
        />
        
        {/* Upload area */}
        <div 
          onClick={promptFileSelect}
          className={`w-[120px] h-[120px] rounded-full border-2 border-dashed 
            border-gray-300 flex flex-col items-center justify-center cursor-pointer
            hover:border-green-500 transition-colors mb-4
            ${uploadState.status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
        >
          {logoPreview ? (
            <img 
              src={logoPreview} 
              alt="Company Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <>
              {uploadState.status === "uploading" ? (
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-3xl text-gray-400">+</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Upload<br />Company Logo
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Preview area */}
      <LogoPreview />
    </div>
  );
};

export default LogoUploader;