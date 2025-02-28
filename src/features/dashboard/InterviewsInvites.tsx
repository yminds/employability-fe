import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCreateInterview } from '@/hooks/useCreateInterview';
import ViewJD from '@/components/interview-list/ViewJD';

export const mockInterviews = [
  {
    id: 1,
    company: "Tech Corp",
    type: "Technical",
    jobTitle: "Frontend Developer",
    dueDate: "2023-06-15",
    jobDescription: {
      summary: `We are seeking a highly skilled Frontend Developer to join our dynamic development team at Tech Corp. The ideal candidate will be responsible for designing, developing, and maintaining scalable applications using MongoDB, Express.js, React.js, Next.js, and Node.js. You will work closely with other developers and team members to deliver high-quality, efficient, and secure applications.`,
      keyResponsibilities: [
        "Develop, test, and maintain backend services using Node.js, Express.js, and MongoDB.",
        "Build and maintain frontend components using React.js and Next.js.",
        "Design and optimize RESTful APIs for seamless communication between frontend and backend applications.",
        "Work with database technologies such as MongoDB (including schema design, indexing, aggregation, and performance optimization).",
        "Implement authentication and authorization using JWT, OAuth, or similar authentication methods.",
        "Integrate third-party services and APIs as required.",
        "Write unit tests and integration tests to ensure application reliability.",
        "Troubleshoot and debug applications for performance and scalability.",
        "Collaborate with UI/UX designers and DevOps engineers to create robust applications.",
        "Implement best coding practices, security standards, and code documentation.",
      ],
      requiredSkillsAndQualifications: [
        {
          name: "MERN Stack (React.js, Next.js, Node.js, Express.js, MongoDB)",
          description: "Proficiency in building and maintaining full-stack applications using the MERN stack.",
        },
        {
          name: "JavaScript",
          description: "Strong knowledge of modern JavaScript features and asynchronous programming.",
        },
        {
          name: "API Development",
          description: "Experience designing and implementing APIs for data exchange between client and server.",
        },
        {
          name: "Authentication (JWT, OAuth, Passport.js)",
          description: "Familiarity with authentication mechanisms for secure user and service interactions.",
        },
        {
          name: "MongoDB Queries & Aggregation",
          description: "Hands-on experience with schema design, indexing, and performance optimization in MongoDB.",
        },
        {
          name: "Version Control",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Testing Frameworks",
          description: "Experience with Jest, Mocha, or Chai for writing unit and integration tests.",
        },
      ],
      experience: "1-5 years in MERN full-stack development.",
      perksAndBenefits: `At ElixirBizz, we’re all about creating impactful solutions that drive success for our clients. Here, your ideas matter, your skills grow, and your contributions shape the future of our projects. Join us if you’re ready to make a difference in a collaborative, innovation-focused environment.`,
      whyJoinUs: [
        "Growth Opportunities: Gain experience across a variety of tech stacks and projects.",
        "Incentives: Monthly performance-based incentives.",
        "Flexible Work Culture: Embrace a collaborative environment where innovation and excellence are celebrated.",
        "Paid Time Off: Annual leave, sick leave, and selected public holidays included.",
      ],
      role: "Full Stack Developer",
      industryType: "IT Services & Consulting",
      department: "Engineering - Software & QA",
      employmentType: "Full Time, Permanent",
      roleCategory: "Software Development",
      keySkills: "MernExpressNode.JsReact.Js Mern StackMongoDBNextjs",
    },
  },
  {
    id: 2,
    company: "Innovate Inc",
    type: "Technical",
    jobTitle: "Full-Stack Engineer",
    dueDate: "2023-06-18",
    jobDescription: {
      summary: `We are seeking a highly skilled Full-Stack Engineer to join our dynamic development team at Innovate Inc. The ideal candidate will be responsible for designing, developing, and maintaining scalable applications using MongoDB, Express.js, React.js, Next.js, and Node.js. You will work closely with other developers and team members to deliver high-quality, efficient, and secure applications.`,
      keyResponsibilities: [
        "Develop, test, and maintain backend services using Node.js, Express.js, and MongoDB.",
        "Build and maintain frontend components using React.js and Next.js.",
        "Design and optimize RESTful APIs for seamless communication between frontend and backend applications.",
        "Work with database technologies such as MongoDB (including schema design, indexing, aggregation, and performance optimization).",
        "Implement authentication and authorization using JWT, OAuth, or similar authentication methods.",
        "Integrate third-party services and APIs as required.",
        "Write unit tests and integration tests to ensure application reliability.",
        "Troubleshoot and debug applications for performance and scalability.",
        "Collaborate with UI/UX designers and DevOps engineers to create robust applications.",
        "Implement best coding practices, security standards, and code documentation.",
      ],
      requiredSkillsAndQualifications: [
        {
          name: "MERN Stack (React.js, Next.js, Node.js, Express.js, MongoDB)",
          description: "Proficiency in building and maintaining full-stack applications using the MERN stack.",
        },
        {
          name: "JavaScript (ES6+)",
          description: "Strong knowledge of modern JavaScript features and asynchronous programming.",
        },
        {
          name: "API Development (RESTful Services)",
          description: "Experience designing and implementing APIs for data exchange between client and server.",
        },
        {
          name: "Authentication (JWT, OAuth, Passport.js)",
          description: "Familiarity with authentication mechanisms for secure user and service interactions.",
        },
        {
          name: "MongoDB Queries & Aggregation",
          description: "Hands-on experience with schema design, indexing, and performance optimization in MongoDB.",
        },
        {
          name: "Version Control",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Testing Frameworks",
          description: "Experience with Jest, Mocha, or Chai for writing unit and integration tests.",
        },
      ],
      experience: "1-5 years in MERN full-stack development.",
      perksAndBenefits: `At ElixirBizz, we’re all about creating impactful solutions that drive success for our clients. Here, your ideas matter, your skills grow, and your contributions shape the future of our projects. Join us if you’re ready to make a difference in a collaborative, innovation-focused environment.`,
      whyJoinUs: [
        "Growth Opportunities: Gain experience across a variety of tech stacks and projects.",
        "Incentives: Monthly performance-based incentives.",
        "Flexible Work Culture: Embrace a collaborative environment where innovation and excellence are celebrated.",
        "Paid Time Off: Annual leave, sick leave, and selected public holidays included.",
      ],
      role: "Full Stack Developer",
      industryType: "IT Services & Consulting",
      department: "Engineering - Software & QA",
      employmentType: "Full Time, Permanent",
      roleCategory: "Software Development",
    },
  },
  {
    id: 3,
    company: "Future Systems",
    type: "Technical Design",
    jobTitle: "Systems Architect",
    dueDate: "2023-06-20",
    jobDescription: {
      summary: `We are seeking a highly skilled Systems Architect to join our dynamic development team at Future Systems. The ideal candidate will be responsible for designing, developing, and maintaining scalable applications using MongoDB, Express.js, React.js, Next.js, and Node.js. You will work closely with other developers and team members to deliver high-quality, efficient, and secure applications.`,
      keyResponsibilities: [
        "Develop, test, and maintain backend services using Node.js, Express.js, and MongoDB.",
        "Build and maintain frontend components using React.js and Next.js.",
        "Design and optimize RESTful APIs for seamless communication between frontend and backend applications.",
        "Work with database technologies such as MongoDB (including schema design, indexing, aggregation, and performance optimization).",
        "Implement authentication and authorization using JWT, OAuth, or similar authentication methods.",
        "Integrate third-party services and APIs as required.",
        "Write unit tests and integration tests to ensure application reliability.",
        "Troubleshoot and debug applications for performance and scalability.",
        "Collaborate with UI/UX designers and DevOps engineers to create robust applications.",
        "Implement best coding practices, security standards, and code documentation.",
      ],
      requiredSkillsAndQualifications: [
        {
          name: "MERN Stack (React.js, Next.js, Node.js, Express.js, MongoDB)",
          description: "Proficiency in building and maintaining full-stack applications using the MERN stack.",
        },
        {
          name: "JavaScript (ES6+)",
          description: "Strong knowledge of modern JavaScript features and asynchronous programming.",
        },
        {
          name: "API Development (RESTful Services)",
          description: "Experience designing and implementing APIs for data exchange between client and server.",
        },
        {
          name: "Authentication (JWT, OAuth, Passport.js)",
          description: "Familiarity with authentication mechanisms for secure user and service interactions.",
        },
        {
          name: "MongoDB Queries & Aggregation",
          description: "Hands-on experience with schema design, indexing, and performance optimization in MongoDB.",
        },
        {
          name: "Version Control",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Testing Frameworks",
          description: "Experience with Jest, Mocha, or Chai for writing unit and integration tests.",
        },
      ],
      experience: "1-5 years in MERN full-stack development.",
      perksAndBenefits: `At ElixirBizz, we’re all about creating impactful solutions that drive success for our clients. Here, your ideas matter, your skills grow, and your contributions shape the future of our projects. Join us if you’re ready to make a difference in a collaborative, innovation-focused environment.`,
      whyJoinUs: [
        "Growth Opportunities: Gain experience across a variety of tech stacks and projects.",
        "Incentives: Monthly performance-based incentives.",
        "Flexible Work Culture: Embrace a collaborative environment where innovation and excellence are celebrated.",
        "Paid Time Off: Annual leave, sick leave, and selected public holidays included.",
      ],
      role: "Full Stack Developer",
      industryType: "IT Services & Consulting",
      department: "Engineering - Software & QA",
      employmentType: "Full Time, Permanent",
      roleCategory: "Software Development",
    },
  },
  {
    id: 4,
    company: "Dev Solutions",
    type: "Technical",
    jobTitle: "Backend Developer",
    dueDate: "2023-06-22",
    jobDescription: {
      summary: `We are seeking a highly skilled Backend Developer to join our dynamic development team at Dev Solutions. The ideal candidate will be responsible for designing, developing, and maintaining scalable applications using MongoDB, Express.js, React.js, Next.js, and Node.js. You will work closely with other developers and team members to deliver high-quality, efficient, and secure applications.`,
      keyResponsibilities: [
        "Develop, test, and maintain backend services using Node.js, Express.js, and MongoDB.",
        "Build and maintain frontend components using React.js and Next.js.",
        "Design and optimize RESTful APIs for seamless communication between frontend and backend applications.",
        "Work with database technologies such as MongoDB (including schema design, indexing, aggregation, and performance optimization).",
        "Implement authentication and authorization using JWT, OAuth, or similar authentication methods.",
        "Integrate third-party services and APIs as required.",
        "Write unit tests and integration tests to ensure application reliability.",
        "Troubleshoot and debug applications for performance and scalability.",
        "Collaborate with UI/UX designers and DevOps engineers to create robust applications.",
        "Implement best coding practices, security standards, and code documentation.",
      ],
      requiredSkillsAndQualifications: [
        {
          name: "MERN Stack (React.js, Next.js, Node.js, Express.js, MongoDB)",
          description: "Proficiency in building and maintaining full-stack applications using the MERN stack.",
        },
        {
          name: "JavaScript (ES6+)",
          description: "Strong knowledge of modern JavaScript features and asynchronous programming.",
        },
        {
          name: "API Development (RESTful Services)",
          description: "Experience designing and implementing APIs for data exchange between client and server.",
        },
        {
          name: "Authentication (JWT, OAuth, Passport.js)",
          description: "Familiarity with authentication mechanisms for secure user and service interactions.",
        },
        {
          name: "MongoDB Queries & Aggregation",
          description: "Hands-on experience with schema design, indexing, and performance optimization in MongoDB.",
        },
        {
          name: "Version Control",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Testing Frameworks",
          description: "Experience with Jest, Mocha, or Chai for writing unit and integration tests.",
        },
      ],
      experience: "1-5 years in MERN full-stack development.",
      perksAndBenefits: `At ElixirBizz, we’re all about creating impactful solutions that drive success for our clients. Here, your ideas matter, your skills grow, and your contributions shape the future of our projects. Join us if you’re ready to make a difference in a collaborative, innovation-focused environment.`,
      whyJoinUs: [
        "Growth Opportunities: Gain experience across a variety of tech stacks and projects.",
        "Incentives: Monthly performance-based incentives.",
        "Flexible Work Culture: Embrace a collaborative environment where innovation and excellence are celebrated.",
        "Paid Time Off: Annual leave, sick leave, and selected public holidays included.",
      ],
      role: "Full Stack Developer",
      industryType: "IT Services & Consulting",
      department: "Engineering - Software & QA",
      employmentType: "Full Time, Permanent",
      roleCategory: "Software Development",
    },
  },
  {
    id: 5,
    company: "Code Masters",
    type: "Behavioral",
    jobTitle: "Software Developer",
    dueDate: "2023-06-25",
    jobDescription: {
      summary: `We are seeking a highly skilled Software Developer to join our dynamic development team at Code Masters. The ideal candidate will be responsible for designing, developing, and maintaining scalable applications using MongoDB, Express.js, React.js, Next.js, and Node.js. You will work closely with other developers and team members to deliver high-quality, efficient, and secure applications.`,
      keyResponsibilities: [
        "Develop, test, and maintain backend services using Node.js, Express.js, and MongoDB.",
        "Build and maintain frontend components using React.js and Next.js.",
        "Design and optimize RESTful APIs for seamless communication between frontend and backend applications.",
        "Work with database technologies such as MongoDB (including schema design, indexing, aggregation, and performance optimization).",
        "Implement authentication and authorization using JWT, OAuth, or similar authentication methods.",
        "Integrate third-party services and APIs as required.",
        "Write unit tests and integration tests to ensure application reliability.",
        "Troubleshoot and debug applications for performance and scalability.",
        "Collaborate with UI/UX designers and DevOps engineers to create robust applications.",
        "Implement best coding practices, security standards, and code documentation.",
      ],
      requiredSkillsAndQualifications: [
        {
          name: "MERN Stack (React.js, Next.js, Node.js, Express.js, MongoDB)",
          description: "Proficiency in building and maintaining full-stack applications using the MERN stack.",
        },
        {
          name: "JavaScript (ES6+)",
          description: "Strong knowledge of modern JavaScript features and asynchronous programming.",
        },
        {
          name: "API Development (RESTful Services)",
          description: "Experience designing and implementing APIs for data exchange between client and server.",
        },
        {
          name: "Authentication (JWT, OAuth, Passport.js)",
          description: "Familiarity with authentication mechanisms for secure user and service interactions.",
        },
        {
          name: "MongoDB Queries & Aggregation",
          description: "Hands-on experience with schema design, indexing, and performance optimization in MongoDB.",
        },
        {
          name: "Version Control",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Testing Frameworks",
          description: "Experience with Jest, Mocha, or Chai for writing unit and integration tests.",
        },
      ],
      experience: "1-5 years in MERN full-stack development.",
      perksAndBenefits: `At ElixirBizz, we’re all about creating impactful solutions that drive success for our clients. Here, your ideas matter, your skills grow, and your contributions shape the future of our projects. Join us if you’re ready to make a difference in a collaborative, innovation-focused environment.`,
      whyJoinUs: [
        "Growth Opportunities: Gain experience across a variety of tech stacks and projects.",
        "Incentives: Monthly performance-based incentives.",
        "Flexible Work Culture: Embrace a collaborative environment where innovation and excellence are celebrated.",
        "Paid Time Off: Annual leave, sick leave, and selected public holidays included.",
      ],
      role: "Full Stack Developer",
      industryType: "IT Services & Consulting",
      department: "Engineering - Software & QA",
      employmentType: "Full Time, Permanent",
      roleCategory: "Software Development",
    },
  },
  {
    "id": 6,
    "company": "AI Solutions Group",
    "type": "Technical",
    "jobTitle": "AI Engineer",
    "dueDate": "2023-07-20",
    "jobDescription": {
      "summary": "AI Solutions Group is seeking a talented AI Engineer to develop and deploy cutting-edge AI models. The ideal candidate will have a strong background in machine learning, deep learning, and natural language processing. You will work on projects involving data analysis, model development, and deployment in a fast-paced, innovative environment.",
      "keyResponsibilities": [
        "Develop and implement machine learning models using Python and relevant libraries (TensorFlow, PyTorch, scikit-learn).",
        "Design and build deep learning architectures for image recognition, natural language processing, or other applications.",
        "Perform data preprocessing, feature engineering, and model evaluation.",
        "Deploy and maintain AI models in production environments.",
        "Collaborate with data scientists and software engineers to integrate AI solutions into applications.",
        "Research and implement state-of-the-art AI algorithms and techniques.",
        "Optimize model performance and scalability.",
        "Develop and maintain documentation for AI models and processes.",
        "Troubleshoot and debug AI models and systems.",
        "Stay up-to-date with the latest advancements in AI and machine learning."
      ],
      "requiredSkillsAndQualifications": [
        {
          "name": "Machine Learning",
          "description": "Strong understanding of machine learning algorithms and techniques (e.g., regression, classification, clustering)."
        },
        {
          "name": "Deep Learning",
          "description": "Experience with deep learning frameworks (TensorFlow, PyTorch) and architectures (CNNs, RNNs, Transformers)."
        },
        {
          "name": "Python",
          "description": "Proficiency in Python programming and relevant libraries (NumPy, Pandas, Scikit-learn)."
        },
        {
          "name": "Natural Language Processing (NLP)",
          "description": "Experience with NLP techniques and libraries (NLTK, spaCy, Transformers)."
        },
        {
          "name": "Data Analysis",
          "description": "Ability to analyze and interpret large datasets."
        },
        {
          "name": "Model Deployment",
          "description": "Experience with deploying and maintaining AI models in production environments (e.g., Docker, Kubernetes)."
        },
        {
          "name": "Version Control (Git)",
          "description": "Proficiency in Git and version control practices."
        },
        {
          "name": "Cloud Platforms (AWS, GCP, Azure)",
          "description": "Familiarity with cloud-based AI services and platforms."
        }
      ],
      "experience": "2-5 years of experience in AI or machine learning development.",
      "perksAndBenefits": "Join a team of passionate AI professionals and work on challenging projects that impact real-world problems. We offer competitive salaries, comprehensive benefits, and opportunities for professional growth.",
      "whyJoinUs": [
        "Work on cutting-edge AI technologies.",
        "Collaborate with a talented and innovative team.",
        "Contribute to meaningful projects that make a difference.",
        "Opportunities for continuous learning and professional development.",
        "Flexible work environment."
      ],
      "role": "AI Engineer",
      "industryType": "Artificial Intelligence",
      "department": "AI Development",
      "employmentType": "Full Time, Permanent",
      "roleCategory": "AI and Machine Learning"
    }
  },
  {
    id: 7, // Increment ID
    company: "WebCraft Studios",
    type: "Front-End Development",
    jobTitle: "Front-End Developer (HTML/CSS)",
    dueDate: "2023-07-15",
    jobDescription: {
      summary: `WebCraft Studios is looking for a talented Front-End Developer with a strong focus on HTML and CSS to join our creative team. You will be instrumental in building and maintaining visually appealing and user-friendly web interfaces, ensuring a seamless user experience across various platforms.`,
      keyResponsibilities: [
        "Develop and maintain clean, semantic, and well-structured HTML5 and CSS3 code.",
        "Translate UI/UX design wireframes and mockups into responsive and functional web pages.",
        "Ensure cross-browser compatibility and responsiveness across various devices and screen sizes.",
        "Optimize website performance by writing efficient and optimized CSS.",
        "Collaborate with UI/UX designers to ensure design consistency and accuracy.",
        "Implement and maintain accessibility standards (WCAG) to ensure inclusive web experiences.",
        "Participate in code reviews and provide constructive feedback.",
        "Stay up-to-date with the latest front-end development trends and best practices.",
        "Troubleshoot and debug front-end issues.",
        "Maintain and improve existing front-end codebases."
      ],
      requiredSkillsAndQualifications: [
        {
          name: "HTML5 & CSS3",
          description: "Proficiency in building and maintaining front-end interfaces using HTML5 and CSS3.",
        },
        {
          name: "Responsive Web Design",
          description: "Experience in creating responsive designs using media queries and flexible layouts.",
        },
        {
          name: "CSS Preprocessors (Sass/Less)",
          description: "Familiarity with CSS preprocessors like Sass or Less for efficient CSS development.",
        },
        {
          name: "CSS Frameworks (Bootstrap, Tailwind CSS)",
          description: "Experience with CSS frameworks like Bootstrap or Tailwind CSS for rapid development.",
        },
        {
          name: "Web Accessibility (WCAG)",
          description: "Understanding and implementation of web accessibility standards (WCAG).",
        },
        {
          name: "Version Control (Git)",
          description: "Knowledge of Git-based workflows using GitHub or GitLab.",
        },
        {
          name: "Basic JavaScript",
          description: "Basic understanding of JavaScript and its interaction with HTML and CSS.",
        },
      ],
      experience: "1-3 years of experience in front-end development with a focus on HTML and CSS.",
      perksAndBenefits: `At WebCraft Studios, we believe in fostering a creative and collaborative environment. We offer opportunities for professional growth, competitive salaries, and a range of benefits to support our team's well-being and success.`,
      whyJoinUs: [
        "Creative Environment: Work on visually stunning and innovative web projects.",
        "Growth Opportunities: Enhance your skills and grow your career in a dynamic environment.",
        "Collaborative Team: Work with a team of talented designers and developers.",
        "Work-Life Balance: Enjoy a flexible work culture and supportive team."
      ],
      role: "Front-End Developer",
      industryType: "Web Design & Development",
      department: "Front-End Development",
      employmentType: "Full Time, Permanent",
      roleCategory: "Web Development",
    },
  }
];

interface JobDescription {
  summary: string;
  keyResponsibilities: string[];
  requiredSkillsAndQualifications: { name: string; description: string }[];
  experience: string;
  perksAndBenefits: string;
  whyJoinUs: string[];
  role: string;
  industryType: string;
  department: string;
  employmentType: string;
  roleCategory: string;
}

interface Interview {
  id: number;
  company: string;
  type: string;
  dueDate: string;
  jobTitle: string;
  jobDescription: JobDescription;
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

  const handleSeeDetails = (interview: Interview) => {
    // Navigate to a detailed view (replace with your route)
    navigate(`/interviews/${interview.id}`);
  };

  const handleTakeInterview = async (interview: Interview) => {
    const interviewId = await createInterview({
      title: `Mock Interview for ${interview.jobTitle}`,
      type: "Mock",
    });

    // Start the interview directly if tutorial is disabled
    navigate(`/interview/${interviewId}`, {
      state: {title: `Mock Interview for ${interview.jobTitle}`, type : 'Mock', jobDescription: interview.jobDescription},
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
