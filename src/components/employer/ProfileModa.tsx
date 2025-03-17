import React from "react";
import { X, Mail, Phone, MapPin, FileText, Star, Calendar, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCandidateProfileQuery } from "../../api/candidatesApiSlice"; // You'll need to create this API slice

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  username?: string;
  initialData?: any; // Candidate data that might already be available
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  username,
  initialData,
}) => {
  // Fetch detailed profile data - use either candidateId or username
  const identifier = username || candidateId;
  const isUsername = Boolean(username);
  
  const { data: profileData, isLoading, error } = useGetCandidateProfileQuery(
    { id: identifier, isUsername },
    { skip: !identifier || !!initialData }
  );

  // Use either the fetched data or the initial data passed in
  const candidate = profileData?.data || initialData || {};

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Candidate Profile</DialogTitle>
          <DialogClose asChild>
            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-t-[#001630] border-r-[#001630] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#666666]">Loading profile...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-red-500 font-medium">Failed to load profile</p>
            <p className="text-[#666666] mt-2">Please try again later</p>
          </div>
        )}

        {!isLoading && !error && candidate && (
          <div className="space-y-6">
            {/* Header with basic info */}
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-[#10b754]">
                {candidate.profile_image ? (
                  <img
                    src={candidate.profile_image}
                    alt={candidate.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-500">
                      {candidate.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <div className="flex items-center text-gray-600">
                  {candidate.username && (
                    <span className="text-blue-600 mr-3">@{candidate.username}</span>
                  )}
                  {candidate.current_status && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {candidate.current_status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center mt-2 text-gray-600">
                  <div className="flex items-center mr-4">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>
                      {candidate.averageRating?.toFixed(1) || "0.0"}/10 Rating
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{candidate.experience_level || "Experience not specified"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              {candidate.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-sm font-medium">{candidate.email}</div>
                  </div>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="text-sm font-medium">{candidate.phone}</div>
                  </div>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="text-sm font-medium">{candidate.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Section */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: any, index: number) => (
                    <div key={index} className="flex items-center bg-blue-50 px-3 py-2 rounded-full">
                      <span className="text-blue-800 text-sm">{skill.name || skill}</span>
                      {skill.rating && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {skill.rating}/10
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {candidate.experience && candidate.experience.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Experience</h3>
                <div className="space-y-4">
                  {candidate.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {exp.start_date} - {exp.end_date || "Present"}
                        </span>
                      </div>
                      {exp.description && (
                        <div className="mt-2 text-sm text-gray-600">{exp.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {candidate.education && candidate.education.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Education</h3>
                <div className="space-y-4">
                  {candidate.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-gray-600">{edu.institution}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {edu.start_year} - {edu.end_year || "Present"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Close
              </Button>
              
              <div className="space-x-3">
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(`/candidates/${candidate.username || candidate.user_id}`, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                
                <Button 
                  className="bg-[#001630] hover:bg-[#001630]/90"
                  onClick={() => {
                    // Handle inviting candidate
                    console.log("Inviting candidate:", candidate.name);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Invite to Interview
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;