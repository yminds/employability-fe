import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface EditSkillModalProps {
  currentSelfRating: number;
  onSave: (updatedSelfRating: number) => void;
  onClose: () => void;
  open: boolean;
}

const EditSkillModal: React.FC<EditSkillModalProps> = ({
  currentSelfRating,
  onSave,
  onClose,
  open
}) => {
  const [newSelfRating, setNewSelfRating] = useState<number>(currentSelfRating);
  const [error, setError] = useState<string>("");

  const handleRatingChange = (value: string) => {
    const numValue = Number(value);
    setNewSelfRating(numValue);
    
    if (numValue > 10) {
      setError("Rating cannot be greater than 10");
    } else if (numValue < 0) {
      setError("Rating cannot be less than 0");
    } else {
      setError("");
    }
  };

  const handleSave = () => {
    if (newSelfRating <= 10 && newSelfRating >= 0) {
      onSave(newSelfRating);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Skill Rating</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="selfRating" className="text-sm font-medium">
              Self Rating
            </Label>
            <div className="relative">
              <Input
                id="selfRating"
                type="number"
                value={newSelfRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                max={10}
                min={0}
                step={1}
                className="w-full pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                / 10
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!error || newSelfRating > 10 || newSelfRating < 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillModal;