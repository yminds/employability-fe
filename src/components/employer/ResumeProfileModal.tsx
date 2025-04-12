import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Download, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, FileText } from "lucide-react";
import { useGetCandidateDetailsQuery } from "../../api/candidatesApiSlice";

interface ResumeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  isApplicant: boolean;
}

const ResumeProfileModal: React.FC<ResumeProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  candidateId,
  isApplicant
}) => {
  // Fetch candidate details using the query hook instead of mutation
  const { data: candidateData, isLoading, error } = useGetCandidateDetailsQuery(
    candidateId,
    { skip: !isOpen || !candidateId }
  );

  const candidate = candidateData?.data;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {candidate?.name ? candidate.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <DialogTitle className="text-xl">{candidate?.name || "Candidate"}</DialogTitle>
              <div className="text-sm text-gray-500">{candidate?.role || "Role not specified"}</div>
              
              {isApplicant && (
                <Badge className="mt-1 bg-[#10b754] hover:bg-[#10b754]/90 text-white">
                  Applied for this job
                </Badge>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 border-4 border-t-[#001630] border-r-[#001630] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-[#666666]">Loading candidate details...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            Failed to load candidate details. Please try again.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Contact & Summary */}
              <div className="lg:col-span-1 space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  
                  {candidate?.contact?.email && (
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{candidate.contact.email}</span>
                    </div>
                  )}
                  
                  {candidate?.contact?.phone && (
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{candidate.contact.phone}</span>
                    </div>
                  )}
                  
                  {candidate?.contact?.address && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{candidate.contact.address}</span>
                    </div>
                  )}
                  
                  {candidate?.contact?.linkedin && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                      <a href={candidate.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  
                  {candidate?.contact?.github && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <a href={candidate.contact.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        GitHub Profile
                      </a>
                    </div>
                  )}
                </div>
                
                {candidate?.summary && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Summary</h3>
                    <p className="text-sm">{candidate.summary}</p>
                  </div>
                )}
                
                {candidate?.resume_s3_url && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Resume</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(candidate.resume_s3_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Right column - Experience, Education, Skills */}
              <div className="lg:col-span-2 space-y-6">
                {/* Skills */}
                {candidate?.skills && candidate.skills.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill: any, index: number) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-sm">{skill.name}</span>
                          {skill.rating && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {skill.rating}/10
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Experience */}
                {candidate?.experience && candidate.experience.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Experience</h3>
                    <div className="space-y-4">
                      {candidate.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-2">
                            <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">{exp.jobTitle}</h4>
                              <p className="text-sm text-gray-600">{exp.company}, {exp.location}</p>
                              <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                              
                              {exp.responsibilities && exp.responsibilities.length > 0 && (
                                <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                                  {exp.responsibilities.map((resp: string, i: number) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Education */}
                {candidate?.education && candidate.education.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Education</h3>
                    <div className="space-y-4">
                      {candidate.education.map((edu: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-2">
                            <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                              {edu.graduationYear && (
                                <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Certifications */}
                {candidate?.certifications && candidate.certifications.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Certifications</h3>
                    <div className="space-y-4">
                      {candidate.certifications.map((cert: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-2">
                            <Award className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">{cert.name}</h4>
                              <p className="text-sm text-gray-600">Issuer: {cert.issuer}</p>
                              <p className="text-sm text-gray-500">Date: {cert.dateObtained}</p>
                              {cert.expiryDate && (
                                <p className="text-sm text-gray-500">Expires: {cert.expiryDate}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Projects */}
                {candidate?.projects && candidate.projects.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Projects</h3>
                    <div className="space-y-4">
                      {candidate.projects.map((project: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-2">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">
                                {project.name}
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-600 hover:underline">
                                    (View Project)
                                  </a>
                                )}
                              </h4>
                              <p className="text-sm">{project.description}</p>
                              
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {project.technologies.map((tech: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              {isApplicant ? (
                <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
                  <div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                      This candidate has applied for this position
                    </Badge>
                  </div>
                  <Button onClick={onClose}>Close</Button>
                </div>
              ) : (
                <Button onClick={onClose}>Close</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeProfileModal;