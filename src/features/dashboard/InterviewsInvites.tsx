import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCreateInterview } from '@/hooks/useCreateInterview';
import ViewJD, { JobDescription } from '@/components/interview-list/ViewJD';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetAllUserInterviewsQuery } from '@/api/interviewApiSlice';

export const mockInterviews = [
  {
    "id": 1,
    "company": "Web Innovators",
    "type": "Technical",
    "jobTitle": "Frontend Web Developer",
    "dueDate": "2023-07-01",
    "jobDescription": {
      "summary": "Join our cutting-edge team at Web Innovators as a Frontend Web Developer. You will work on user-facing elements of our flagship products, ensuring seamless experiences across browsers and devices. Your expertise in modern JavaScript frameworks and responsive design will help drive our product strategy and user satisfaction.",
      "keyResponsibilities": [
        "Develop and maintain efficient, reusable, and reliable code using React.js and modern JavaScript.",
        "Implement responsive UI using HTML5, CSS3, and pre-processors like SASS or LESS.",
        "Optimize front-end components for maximum performance across a vast array of web-capable devices and browsers.",
        "Collaborate with product managers and UI/UX designers to shape the visual and interactive elements.",
        "Write and execute test cases for new features and bug fixes."
      ],
      "requiredSkillsAndQualifications": [
        {
          skill: "HTML5/CSS3",
          importance: "important"
        },
        {
          skill: "JavaScript (ES6+)",
          importance: "important"
        },
        {
          skill: "React.js",
          importance: "critical"
        },
        {
          skill: "Responsive Web Design",
          importance: "important"
        },
        {
          skill: "Version Control (Git)",
          importance: "somewhat important"
        }
      ],
      "experience": "2-4 years in frontend web development.",
      "perksAndBenefits": "A dynamic environment where your innovative ideas are valued. We offer health insurance, flexible work hours, and opportunities for continuous learning.",
      "whyJoinUs": [
        "Innovative Culture: Work on challenging projects that push the boundaries of web technologies.",
        "Personal Growth: Access to workshops, online courses, and mentorship programs.",
        "Flexible Timing: Maintain a healthy work-life balance with our flexible schedule.",
        "Team Events: Participate in hackathons, retreats, and team-building outings."
      ],
      "role": "Frontend Developer",
      "industryType": "IT Services & Consulting",
      "department": "Engineering - Web Development",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "Software Development",
      "keySkills": "HTML5 CSS3 JavaScript React Git"
    },
    "specificQuestions": [
      "How do you optimize React applications for performance?",
      "Which strategies do you use to ensure cross-browser compatibility?",
      "Can you describe a scenario where you used advanced CSS features to improve the user experience?"
    ]
  },
  {
    "id": 2,
    "company": "MegaByte Solutions",
    "type": "Technical",
    "jobTitle": "Backend Web Developer",
    "dueDate": "2023-08-15",
    "jobDescription": {
      "summary": "At MegaByte Solutions, we are looking for a Backend Web Developer to create and maintain robust server-side applications. The ideal candidate will have experience with Node.js, RESTful APIs, and database schema design, ensuring our web services are performant, secure, and scalable.",
      "keyResponsibilities": [
        "Design and maintain RESTful APIs for internal and external services using Node.js.",
        "Implement database schemas in MongoDB and optimize queries for performance.",
        "Ensure security best practices for user authentication and data protection.",
        "Work closely with frontend teams to integrate APIs efficiently.",
        "Troubleshoot and resolve backend-related issues promptly."
      ],
      "requiredSkillsAndQualifications": [
        {
          skill: "Node.js",
          importance: "important"
        },
        {
          skill: "Express.js", 
          importance: "important"
        },
        {
          skill: "RESTful API Development",
          importance: "important"
        },
        {
          skill: "MongoDB / SQL",
          importance: "important"
        },
        {
          skill: "Testing Frameworks (Jest or Mocha)",
          importance: "somewhat important"
        }
      ],
      "experience": "3-5 years in backend web development.",
      "perksAndBenefits": "Competitive salary with bonuses, medical insurance, and a collaborative environment that fosters innovation and professional growth.",
      "whyJoinUs": [
        "Cutting-Edge Projects: Work on large-scale web solutions impacting millions of users.",
        "Career Advancement: Clear pathways for progression and specialized training programs.",
        "Inclusive Environment: We value diverse perspectives and encourage creative problem-solving.",
        "Work-Life Balance: Ample leave policies to ensure personal well-being."
      ],
      "role": "Backend Developer",
      "industryType": "Software Development",
      "department": "Engineering - Web Services",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "Software Development",
      "keySkills": "Node.js Express.js API MongoDB SQL"
    },
    "specificQuestions": [
      "Explain how you structure a Node.js project for maintainability and scalability.",
      "What authentication methods have you implemented, and why did you choose them?",
      "How do you handle large datasets and optimize database queries?"
    ]
  },
  {
    "id": 3,
    "company": "CloudScape Digital",
    "type": "Technical",
    "jobTitle": "Full Stack Web Developer",
    "dueDate": "2023-09-10",
    "jobDescription": {
      "summary": "CloudScape Digital is seeking a Full Stack Web Developer to build and maintain end-to-end web solutions. The role involves working with both frontend (React.js or Vue.js) and backend (Node.js or Python) technologies to deliver high-performing, secure, and scalable web applications.",
      "keyResponsibilities": [
        "Develop and maintain client-facing interfaces using modern JavaScript frameworks.",
        "Build and optimize server-side logic to handle data-intensive workloads.",
        "Implement secure user authentication and authorization.",
        "Collaborate with designers, product managers, and QA teams to ensure high-quality software.",
        "Perform troubleshooting and debugging across the entire web stack."
      ],
      "requiredSkillsAndQualifications": [
        {
          skill: "React.js",
          importance: "Very Important"
        },
        {
          skill: "Node.js",
          importance: "Very Important"
        },
        {
          skill: "MongoDB",
          importance: "Very Important"
        },
        {
          skill: "Express.js",
          importance: "Very Important"
        },
        {
          skill: "HTML",
          importance: "important"
        },
        {
          skill: "CSS",
          importance: "important"
        },
        {
          skill: "JavaScript",
          importance: "important"
        }
      ],
      "experience": "2-5 years in full-stack web development.",
      "perksAndBenefits": "Highly competitive salary, stock options, remote work flexibility, and a culture that promotes professional growth through continuous learning.",
      "whyJoinUs": [
        "Tech-First Culture: Embrace the latest tools and methodologies.",
        "Remote & Flexible Work: We trust you to get work done wherever you are.",
        "Mentorship Programs: Grow under the guidance of seasoned developers.",
        "Innovative Environment: Challenge yourself with cutting-edge projects."
      ],
      "role": "Full Stack Developer",
      "industryType": "IT Services & Consulting",
      "department": "Engineering - Software & QA",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "Software Development",
      "keySkills": "React Vue Node Python Full Stack"
    },
    "specificQuestions": [
      "How do you decide when to use a SQL database over a NoSQL solution?",
      "Describe your process for ensuring code quality across the frontend and backend.",
      "What are some best practices for handling user authentication and session management?"
    ]
  },
  {
    "id": 4,
    "company": "PixelCraft Labs",
    "type": "Technical",
    "jobTitle": "UI/UX Web Developer",
    "dueDate": "2023-10-05",
    "jobDescription": {
      "summary": "PixelCraft Labs is on the lookout for a UI/UX Web Developer with a strong eye for design and a passion for creating intuitive user experiences. You'll work closely with designers and product managers to translate wireframes and mockups into high-fidelity, interactive web pages.",
      "keyResponsibilities": [
        "Implement pixel-perfect, responsive web layouts using HTML, CSS, and JavaScript.",
        "Integrate design tools (Figma, Sketch, or Adobe XD) to streamline workflow.",
        "Optimize UI components for maximum speed and scalability.",
        "Conduct user testing and gather feedback to refine user experiences.",
        "Collaborate with cross-functional teams to ensure design integrity."
      ],
      "requiredSkillsAndQualifications": [
        {
          skill: "HTML/CSS/JavaScript",
          importance: "critical"
        },
        {
          skill: "Responsive & Adaptive Design",
          importance: "critical"
        },
        {
          skill: "UI/UX Principles",
          importance: "critical"
        },
        {
          skill: "Design Tool Proficiency (Figma/Sketch/XD)",
          importance: "important"
        },
        {
          skill: "Cross-Browser Testing",
          importance: "important"
        }
      ],
      "experience": "1-3 years in UI/UX or frontend development.",
      "perksAndBenefits": "Employee wellness programs, ongoing training opportunities, and an open office environment that encourages creativity and collaboration.",
      "whyJoinUs": [
        "Creative Freedom: Bring your unique design ideas to life.",
        "Collaborative Space: Brainstorm and innovate with talented UI/UX professionals.",
        "Growth: Expand your skill set through hands-on projects and learning resources.",
        "Recognition: Your contributions are acknowledged and rewarded."
      ],
      "role": "UI/UX Developer",
      "industryType": "Web and Design Services",
      "department": "Product & Design",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "Design & Development",
      "keySkills": "HTML CSS JavaScript UI/UX Figma Sketch"
    },
    "specificQuestions": [
      "What's your process for transforming wireframes into interactive prototypes?",
      "Describe a time you improved the accessibility of a web application.",
      "How do you balance aesthetics with performance optimization?"
    ]
  },
  {
    "id": 5,
    "company": "Skyline Tech",
    "type": "Technical",
    "jobTitle": "Web Developer",
    "dueDate": "2023-11-20",
    "jobDescription": {
      "summary": "Skyline Tech is hiring a Web Developer to design, code, and modify websites, from layout to function. You will ensure that the web properties align with user expectations, providing a seamless experience that is visually appealing and intuitive to navigate.",
      "keyResponsibilities": [
        "Write well-designed, testable, and efficient code using best software development practices.",
        "Create website layout/user interfaces using standard HTML/CSS practices.",
        "Integrate data from various back-end services and databases.",
        "Gather and refine specifications and requirements based on technical needs.",
        "Troubleshoot and resolve website performance and usability issues."
      ],
      "requiredSkillsAndQualifications": [
        {
          skill: "HTML/CSS/JavaScript",
          importance: "important"
        },
        {
          skill: "Backend Integration (PHP, Node.js, or similar)",
          importance: "important"
        },
        {
          skill: "Database Knowledge (MySQL or MongoDB)",
          importance: "somewhat important"
        },
        {
          skill: "Cross-Platform & Cross-Browser Optimization",
          importance: "important"
        },
        {
          skill: "CMS Experience (WordPress or Drupal)",
          importance: "somewhat important"
        }
      ],
      "experience": "1-3 years in general web development.",
      "perksAndBenefits": "Competitive salary, a friendly work atmosphere, regular team lunches, and career growth opportunities within a rapidly expanding company.",
      "whyJoinUs": [
        "Dynamic Team: Collaborate with passionate developers who love building web solutions.",
        "Skill Enhancement: Access to courses, certifications, and regular training workshops.",
        "Fast Growth: Be part of an expanding firm with clear career progression pathways.",
        "Innovation: Opportunity to experiment with the latest web technologies."
      ],
      "role": "Web Developer",
      "industryType": "IT Services & Consulting",
      "department": "Engineering - Web Development",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "Software Development",
      "keySkills": "HTML CSS JavaScript PHP Node MySQL MongoDB"
    },
    "specificQuestions": [
      "What strategies do you use to ensure a website is mobile-responsive?",
      "How do you handle server-side rendering versus client-side rendering?",
      "Can you describe a complex integration you've managed involving multiple APIs?"
    ]
  }
]
;

interface Interview {
  id: number;
  company: string;
  type: string;
  dueDate: string;
  jobTitle: string;
  jobDescription: JobDescription;
  specificQuestions?: string[];
}

interface InterviewListProps {
  isDashboard?: boolean;
  isLoading?: boolean;
}

const InterviewInvites: React.FC<InterviewListProps> = ({ isDashboard = false, isLoading = false }) => {
  const { createInterview } = useCreateInterview();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setInterviews(mockInterviews);
    }, 1000);
  }, []);

  const displayedInterviews = isDashboard ? interviews.slice(0, 3) : interviews;
  const totalInterviews = interviews.length;

  const handleRowClick = (interview: Interview) => {
    // Toggle selection: if clicking the same row, deselect it
    setSelectedInterview((prev) => (prev?.id === interview.id ? null : interview));
  };


  const handleTakeInterview = async (interview: Interview) => {
    const interviewId = await createInterview({
      title: `${interview.jobTitle}`,
      type: "Job",
    });

    // Start the interview directly if tutorial is disabled
    navigate(`/interview/${interviewId}`, {
      state: {title: `${interview.jobTitle}`, type : 'Job', jobDescription: interview},
    });
  };

  const renderLoadingSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton /></TableCell>
      <TableCell><Skeleton /></TableCell>
      <TableCell><Skeleton /></TableCell>
      <TableCell><Skeleton /></TableCell>
    </TableRow>
  );

  return (
    <div className="relative">  
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-[#1f2226] text-lg font-medium font-['Ubuntu'] leading-snug">
            Upcoming Interviews ({totalInterviews})
          </h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Interview Type</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? Array(3)
                    .fill(null)
                    .map((_, index) => <React.Fragment key={index}>{renderLoadingSkeleton()}</React.Fragment>)
                : displayedInterviews.map((interview) => (
                    <React.Fragment key={interview.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleRowClick(interview)}
                      >
                        <TableCell>{interview.company}</TableCell>
                        <TableCell>{interview.type}</TableCell>
                        <TableCell>{interview.jobTitle}</TableCell>
                        <TableCell>{interview.dueDate}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              }
            </TableBody>
          </Table>

          {/* No interviews found message */}
          {!isLoading && displayedInterviews.length === 0 && (
            <div className="text-gray-500 text-center py-4">No interviews found</div>
          )}

          {/* "View All" button for dashboard view */}
          {isDashboard && totalInterviews > 3 && (
            <div className="w-full flex justify-center mt-4">
              <button
                onClick={() => navigate("/interviews")}
                className="flex items-center gap-1 text-[#001630] text-sm font-medium hover:underline"
              >
                View all
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3.33334L8 12.6667"
                    stroke="#001630"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.6667 8L8.00004 12.6667L3.33337 8"
                    stroke="#001630"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Right-Side Panel / Drawer --- */}
      {selectedInterview && (
        <ViewJD
          selectedInterview={selectedInterview}
          setSelectedInterview={setSelectedInterview}
          handleTakeInterview={handleTakeInterview}/>
      )}
    </div>
  );
};


export default InterviewInvites;
