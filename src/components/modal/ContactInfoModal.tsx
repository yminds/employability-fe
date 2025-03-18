import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  phoneNumber: string;
}

const ContactInfoModal = ({
  isOpen,
  onClose,
  email,
  phoneNumber,
}: ContactInfoModalProps) => {
  const handleCopyPhoneNumber = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast.success("Phone number copied to clipboard");
    }
  };

  const handleSendEmail = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Contact Information
          </DialogTitle>
          <DialogDescription>
            Here's how you can reach this user directly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Phone className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{phoneNumber || "Not provided"}</p>
                {phoneNumber && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCopyPhoneNumber}
                    aria-label="Copy phone number"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Mail className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email Address</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{email || "Not provided"}</p>
                {email && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleSendEmail}
                    aria-label="Send email"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoModal;
