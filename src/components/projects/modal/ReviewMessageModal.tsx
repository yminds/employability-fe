import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    name: string;
    status: string; 
  };
  username:string | undefined;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onOpenChange,
  project,
  username
}) => {
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Project Review Status
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Track the review progress of your project
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Project Status Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-2 ring-4 ring-yellow-50">
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Hey {username}! Your Project Is Under Review
                </h3>
                <p className="text-gray-600 max-w-md">
                  We're currently reviewing <span className="font-medium text-gray-900">{project.name}</span>. 
                  Our team is thoroughly evaluating your work to ensure it meets all requirements.
                </p>
              </div>

              {/* Timeline Steps */}
              <div className="w-full max-w-sm mt-8 space-y-4">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Project submitted successfully</span>
                </div>
                <div className="flex items-center gap-3 text-yellow-600">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Technical review in progress</span>
                </div>
                {/* <div className="flex items-center gap-3 text-gray-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Ready for verification</span>
                </div> */}
              </div>

              {/* Info Box */}
              <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-700">
                  The review process typically few minutes . We'll notify you once your project is ready for verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;