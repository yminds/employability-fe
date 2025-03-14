

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Edit, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Candidate {
  id: string
  name: string
  position: string
  location: string
  matchPercentage: number
  employabilityScore?: number
  avatar: string
}

export default function JobListingPage() {
  const [selectedTab, setSelectedTab] = useState("matching")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Lisa Kapoor",
      position: "Full Stack Developer",
      location: "Bangalore Urban, Karnataka, India",
      matchPercentage: 88,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "John Smith",
      position: "Full Stack Developer",
      location: "New York, USA",
      matchPercentage: 88,
      employabilityScore: 8.8,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      name: "Carlos Mendoza",
      position: "Full Stack Developer",
      location: "New York, USA",
      matchPercentage: 88,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "4",
      name: "Sarah O'Neil",
      position: "Full Stack Developer",
      location: "Bangalore Urban, Karnataka, India",
      matchPercentage: 88,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "5",
      name: "Aaron Davis",
      position: "Full Stack Developer",
      location: "Bangalore Urban, Karnataka, India",
      matchPercentage: 88,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "6",
      name: "Aaron Davis",
      position: "Full Stack Developer",
      location: "Bangalore Urban, Karnataka, India",
      matchPercentage: 88,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(candidates.map((candidate) => candidate.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter((candidateId) => candidateId !== id))
      setSelectAll(false)
    } else {
      setSelectedCandidates([...selectedCandidates, id])
      if (selectedCandidates.length + 1 === candidates.length) {
        setSelectAll(true)
      }
    }
  }

  return (
    <div className="bg-[#f0f3f7] min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <ChevronLeft className="w-4 h-4 text-[#666666]" />
          <span className="text-[#666666]">Jobs</span>
          <span className="text-[#666666]">{">"}</span>
          <span className="font-medium">Full Stack Developer</span>
        </div>

        {/* Main content */}
        <div className="flex gap-6">
          {/* Left section - Candidate list */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-[#d6d7d9]">
              <div className="flex">
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    selectedTab === "matching" ? "text-[#001630] border-b-2 border-[#001630]" : "text-[#68696b]"
                  }`}
                  onClick={() => setSelectedTab("matching")}
                >
                  Matching Candidates
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    selectedTab === "all" ? "text-[#001630] border-b-2 border-[#001630]" : "text-[#68696b]"
                  }`}
                  onClick={() => setSelectedTab("all")}
                >
                  All Applicants
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    selectedTab === "screening" ? "text-[#001630] border-b-2 border-[#001630]" : "text-[#68696b]"
                  }`}
                  onClick={() => setSelectedTab("screening")}
                >
                  Screening
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    selectedTab === "tasks" ? "text-[#001630] border-b-2 border-[#001630]" : "text-[#68696b]"
                  }`}
                  onClick={() => setSelectedTab("tasks")}
                >
                  Tasks
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${
                    selectedTab === "pipeline" ? "text-[#001630] border-b-2 border-[#001630]" : "text-[#68696b]"
                  }`}
                  onClick={() => setSelectedTab("pipeline")}
                >
                  In Pipeline
                </button>
              </div>
            </div>

            {/* Search and filters */}
            <div className="flex gap-4 my-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#909091] w-4 h-4" />
                <Input placeholder="Search" className="pl-10 border-[#d6d7d9] bg-white h-12" />
              </div>
              <div className="w-64">
                <Select defaultValue="uploaded">
                  <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
                    <div className="flex items-center gap-2">
                      <span className="text-[#909091]">Source :</span>
                      <SelectValue placeholder="Select source" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uploaded">Uploaded Resumes</SelectItem>
                    <SelectItem value="applied">Applied Online</SelectItem>
                    <SelectItem value="referred">Referred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-64">
                <Select defaultValue="matching">
                  <SelectTrigger className="border-[#d6d7d9] bg-white h-12">
                    <div className="flex items-center gap-2">
                      <span className="text-[#909091]">Sort by :</span>
                      <SelectValue placeholder="Select sort" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matching">Matching Score</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Candidate list */}
            <div className="bg-white rounded-lg border border-[#d6d7d9] overflow-hidden">
              {/* Select all row */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#fafafa]">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="mr-2 data-[state=checked]:bg-[#001630] data-[state=checked]:border-[#001630]"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <Button
                  variant="default"
                  className="bg-[#001630] hover:bg-[#001630]/90 text-white"
                  disabled={selectedCandidates.length === 0}
                >
                  Send Interview Invite
                </Button>
              </div>

              {/* Candidate rows */}
              {candidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center px-6 py-4 border-t border-[#d6d7d9]">
                  <Checkbox
                    id={`candidate-${candidate.id}`}
                    checked={selectedCandidates.includes(candidate.id)}
                    onCheckedChange={() => handleSelectCandidate(candidate.id)}
                    className="mr-4 data-[state=checked]:bg-[#001630] data-[state=checked]:border-[#001630]"
                  />
                  <div className="flex items-center flex-1">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#10b754]">
                      <img
                        src={candidate.avatar || "/placeholder.svg"}
                        alt={candidate.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{candidate.name}</h3>
                      <p className="text-sm text-[#666666]">{candidate.position}</p>
                      <p className="text-sm text-[#666666]">{candidate.location}</p>
                    </div>

                    {candidate.employabilityScore && (
                      <div className="flex items-center mr-8">
                        <div className="text-center">
                          <div className="flex items-center">
                            <span className="text-lg font-medium">{candidate.employabilityScore}</span>
                            <span className="text-sm text-[#909091]">/10</span>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-[#10b754] rounded-full p-1 mr-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-[#909091]">Employability score</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-right">
                      <div className="text-xl font-medium text-[#10b754]">{candidate.matchPercentage}%</div>
                      <div className="text-sm text-[#909091]">Match</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#d6d7d9]">
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded border border-[#d6d7d9]">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#001630] text-white">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded">2</button>
                  <span>...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded">9</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded">10</button>
                  <button className="p-1 rounded border border-[#d6d7d9]">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#909091]">Rows per page</span>
                  <Select defaultValue="20">
                    <SelectTrigger className="w-16 h-8 border-[#d6d7d9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Stats and job details */}
          <div className="w-[320px]">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-[#d6d7d9]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#fff2db] rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 6H16M8 10H16M8 14H11M6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22Z"
                        stroke="#f0a422"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#909091]">Applicants</span>
                </div>
                <div className="text-2xl font-bold">123</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#d6d7d9]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#d2e9ff] rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 11L12 14L22 4M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16"
                        stroke="#2d96ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#909091]">Screenings</span>
                </div>
                <div className="text-2xl font-bold">30</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-[#909091]">Completed</div>
                    <div className="text-sm font-medium">10</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#909091]">Not Started</div>
                    <div className="text-sm font-medium">10</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#d6d7d9]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#e4defd] rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H15L12 19L9 16Z"
                        stroke="#8a73ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#909091]">Interviews</span>
                </div>
                <div className="text-2xl font-bold">30</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-[#909091]">Completed</div>
                    <div className="text-sm font-medium">10</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#909091]">Not Started</div>
                    <div className="text-sm font-medium">8</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#d6d7d9]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#e2f8eb] rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                        stroke="#10b754"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#909091]">In Pipeline</span>
                </div>
                <div className="text-2xl font-bold">123</div>
              </div>
            </div>

            {/* Upload resumes card */}
            <div className="bg-white rounded-lg p-4 border border-[#d6d7d9] mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Upload Resumes</h3>
                <Upload className="w-4 h-4 text-[#001630]" />
              </div>
              <div className="bg-[#f0f3f7] rounded-lg p-4 flex items-center">
                <div className="flex-1">
                  <p className="text-sm">Import files—our AI will highlight top matches for your job.</p>
                </div>
                <div className="ml-4">
                  <img src="/placeholder.svg?height=80&width=80" alt="Upload illustration" width={80} height={80} />
                </div>
              </div>
            </div>

            {/* Job details card */}
            <div className="bg-white rounded-lg p-4 border border-[#d6d7d9]">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-[#f0f3f7] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H16M15 11V4M15 4L12 7M15 4L18 7"
                      stroke="#909091"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <button className="text-[#001630]">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-medium mb-1">Full Stack Developer</h2>
              <p className="text-[#909091] mb-4">Acme Inc.</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <div className="text-sm text-[#909091]">Location</div>
                  <div className="text-sm font-medium">Bangalore, India</div>
                </div>
                <div>
                  <div className="text-sm text-[#909091]">Job Type</div>
                  <div className="text-sm font-medium">Full Time</div>
                </div>
                <div>
                  <div className="text-sm text-[#909091]">Workplace Type</div>
                  <div className="text-sm font-medium">Onsite</div>
                </div>
                <div>
                  <div className="text-sm text-[#909091]">Job Experience Level</div>
                  <div className="text-sm font-medium">Senior</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

