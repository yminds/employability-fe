import { RootState } from "@/store/store";
import { s3ThumbnailUpload, s3Upload } from "@/utils/s3Service";
import { useState } from "react";
import { useSelector } from "react-redux";

const useScreenShot = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("userId", user?._id || "");
    formData.append("folder", "profile-image");
    formData.append("name", file?.name || "");

    const response = await s3ThumbnailUpload(formData);
    return response?.data[0].fileUrl
  };

  const captureScreenshot = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const html2canvas = (await import("html2canvas")).default;
        const domCanvas = await html2canvas(document.documentElement);
        ctx.drawImage(domCanvas, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        // Upload the screenshot to S3
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "screenshot.png", { type: "image/png" });
        const result = await upload(file);
        setScreenshot(dataUrl);

        return result;
      }
      return null;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  };

  return { screenshot, captureScreenshot };
};

export default useScreenShot;
