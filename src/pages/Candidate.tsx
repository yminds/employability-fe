import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MailIcon, PhoneIcon, MapPinIcon, GithubIcon, LinkedinIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetSingleResumeQuery } from '@/api/resumeUploadApiSlice';

const Candidate: React.FC = () => {
   const {id} = useParams()


   
      const { data: resume, isLoading} = useGetSingleResumeQuery(id, {
      });
    
//   const resume = {
//     name: "Jennifer Adams",
//     contact: {
//       email: "email@email.com",
//       phone: "+1 234 567 8900",
//       location: "New York, NY",
//       linkedin: "linkedin.com/in/jenniferadams",
//       github: "github.com/jenniferadams"
//     },
//     summary: "Full-stack developer with 2 years of experience specializing in MERN stack development...",
//     skills: ["React", "Node.js", "MongoDB", "TypeScript", "Express", "Git"],
//     experience: [{
//       jobTitle: "Full Stack Developer",
//       company: "Tech Corp",
//       location: "New York",
//       period: "2022 - Present",
//       responsibilities: [
//         "Developed and maintained web applications using MERN stack",
//         "Implemented responsive designs and improved application performance",
//         "Implemented responsive designs and improved application performance",
//       ]
//     }]
//   };

  return (
    <>
    {
        isLoading ?
         <div className='flex w-full h-[80vh] items-center justify-center'>
            laoding......
        </div>
        :
        <section className="w-screen min-h-screen  bg-[#F5F5F5]">
        <Card className="max-w-5xl mx-auto my-8 p-8 h-[calc(100vh-4rem)] bg-white ">
          {/* Header Section */}
          <CardContent className="h-full overflow-y-auto"> {/* Scrollable content */}
      {/* Rest of your content */}

          <div className="text-center mb-8   ">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{resume.name}</h1>
            <div className="flex justify-center items-center gap-6 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4" />
                <span>{resume.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                <span>{resume.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{resume.contact.location}</span>
              </div>
            </div>
          </div>
  
          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
  
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8">
            <a 
              href={`https://${resume.contact.github}`} 
              className="p-2 rounded-full hover:bg-gray-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="w-5 h-5 text-gray-600" />
            </a>
            <a 
              href={`https://${resume.contact.linkedin}`} 
              className="p-2 rounded-full hover:bg-gray-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="w-5 h-5 text-gray-600" />
            </a>
          </div>
  
          {/* Professional Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
            <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
          </div>
  
          {/* Experience Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            {resume.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{exp.period}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                </div>
                <ul className="list-disc ml-6 text-gray-600">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mt-2">{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      </section>
    }
 
    </>
  );
};

export default Candidate;