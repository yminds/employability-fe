import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDeleteProjectMutation } from "@/api/projectApiSlice";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toast } from 'sonner';

interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess?: () => Promise<void>;
}

const ProjectDeleteModal: React.FC<DeleteProjectModalProps> = ({
  open,
  onOpenChange,
  projectId,
  onSuccess
}) => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  if (!open) return null;

  const handleDeleteProject = async () => {
    if (!userId || !projectId) {
      toast.error("Unable to delete project");
      return;
    }

    try {
      const response = await deleteProject({ 
        projectId, 
        userId 
      }).unwrap();

      toast.success(response.message || "Project deleted successfully");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        await onSuccess();
      }
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold">Delete Project</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this project? This action cannot be undone and all associated data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-gray-300 text-gray-800 rounded-full px-6 py-2 font-medium transition hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteProject}
            disabled={isLoading}
            className="bg-red-600 text-white rounded-full px-6 py-2 font-medium transition hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;