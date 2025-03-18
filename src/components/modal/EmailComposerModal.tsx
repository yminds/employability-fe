"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Send, X, AlertCircle, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSendEmailMutation } from "@/api/userPublicApiSlice";
import { useGetEmployerJobsQuery } from "@/api/employerJobsApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  employer?: any;
}

const MAX_MESSAGE_LENGTH = 5000;

const EmailComposerModal = ({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  employer,
}: EmailComposerModalProps) => {
  const { data: jobsData } = useGetEmployerJobsQuery(
    { employer_id: employer?._id || "" },
    { skip: !employer?._id }
  );

  console.log("jobsData", jobsData);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<{
    subject?: string;
    message?: string;
    job?: string;
  }>({});
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Use the sendEmail mutation hook
  const [sendEmail] = useSendEmailMutation();

  useEffect(() => {
    if (isOpen && subjectInputRef.current) {
      setTimeout(() => subjectInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { subject?: string; message?: string; job?: string } = {};

    if (!selectedJobId) {
      newErrors.job = "Please select a job position";
    }

    // if (!message.trim()) {
    //   newErrors.message = "Message is required";
    // } else if (message.length > MAX_MESSAGE_LENGTH) {
    //   newErrors.message = `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`;
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSending(true);

    try {
      // Get the selected job details
      const selectedJob = jobsData?.data.find(
        (job) => job._id === selectedJobId
      );

      // Send email using the backend API with job information
      const response = await sendEmail({
        recipientEmail,
        recipientName,
        subject,
        message,
        jobId: selectedJobId,
      }).unwrap();

      // Show success toast
      toast.success(response.message || "Email sent successfully");

      // Reset form and close modal
      onClose();
      setSubject("");
      setMessage("");
      setSelectedJobId("");
      setErrors({});
    } catch (error) {
      // Handle error
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send email. Please try again.";

      toast.error(errorMessage);
      console.error("Email send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl/Cmd + Enter to send the message
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendEmail();
    }
  };

  const handleClose = () => {
    setSubject("");
    setMessage("");
    setSelectedJobId("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-h2 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 mb-4">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800">
                  This user has turned off direct contact information. You can
                  still send them a message through our platform, and we'll
                  deliver it to their email address.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="px-6">
          <Card className="bg-muted/50 border-muted mb-4">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{recipientName}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Recipient
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="px-6 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="job-select" className="flex justify-between">
              Select a job position:
              {errors.job && (
                <span className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.job}
                </span>
              )}
            </Label>
            <Select
              onValueChange={(value) => {
                setSelectedJobId(value);
                const selectedJob = jobsData?.data.find(
                  (job) => job._id === value
                );
                if (selectedJob) {
                  setSubject(`Regarding: ${selectedJob.title}`);
                }
                if (errors.job) {
                  setErrors({ ...errors, job: undefined });
                }
              }}
              value={selectedJobId}
            >
              <SelectTrigger
                className={cn("w-full", errors.job && "border-destructive")}
              >
                <SelectValue placeholder="Choose a job position" />
              </SelectTrigger>
              <SelectContent>
                {jobsData?.data && jobsData.data.length > 0 ? (
                  jobsData.data.map((job) => (
                    <SelectItem key={job._id} value={job._id} className="py-3">
                      <div className="flex flex-col w-full gap-0.5">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{job.title}</span>
                          <span className="text-sm text-muted-foreground ml-auto pl-4">
                            {job.createdAt
                              ? format(new Date(job.createdAt), "MMM d, yyyy")
                              : ""}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {job.location}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-jobs" disabled>
                    No jobs available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 px-6">
          {/* <div className="grid gap-2">
            <Label htmlFor="subject" className="flex justify-between">
              Subject
              {errors.subject && (
                <span className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.subject}
                </span>
              )}
            </Label>
            <Input
              id="subject"
              ref={subjectInputRef}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject)
                  setErrors({ ...errors, subject: undefined });
              }}
              placeholder="Enter email subject"
              className={cn(errors.subject && "border-destructive")}
            />
          </div> */}

          {/* <div className="grid gap-2">
            <Label htmlFor="message" className="flex justify-between">
              Message
              {errors.message ? (
                <span className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.message}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  {message.length}/{MAX_MESSAGE_LENGTH} characters
                </span>
              )}
            </Label>
            <Textarea
              id="message"
              ref={messageInputRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message)
                  setErrors({ ...errors, message: undefined });
              }}
              onKeyDown={handleKeyDown}
              placeholder="Write your message here..."
              className={cn(
                "min-h-[200px] resize-none",
                errors.message && "border-destructive",
                message.length > MAX_MESSAGE_LENGTH && "border-destructive"
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="px-1 py-0.5 bg-muted border rounded text-xs">
                Enter
              </kbd>{" "}
              to send
            </p>
          </div> */}
        </div>

        <DialogFooter className="px-6 py-4 flex flex-row justify-end space-x-2 bg-muted/30 border-t mt-4">
          <Button variant="outline" onClick={handleClose} className="gap-1">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending}
            className="bg-[#001630] text-white hover:bg-[#002a54] transition-colors duration-200 ease-in-out gap-1"
          >
            {isSending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailComposerModal;
