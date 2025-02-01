import {
  useBulkUploadResumesMutation,
  useGetAllResumesQuery,
  useGetResumesParsedStatusQuery,
  useUploadResumeMutation,
} from "@/api/resumeUploadApiSlice";
import BulkResumeUploadModal from "@/components/modal/BulkResumeUploadModal";
import ResumeUploadModal from "@/components/modal/ResumeUploadModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, Eye, FileImage, SearchCheckIcon, UploadIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/projects/modal/ProgressBar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
interface IContact {
  email: string;
}
interface IPerson {
  _id: string;
  name: string;
  contact: IContact;
}
const Canidates: React.FC = () => {
  const [UploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [resumes, setResumes] = useState<any[]>([1, 2]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [uploadId, setUploadId] = useState<string>("");
  const [pollingActive, setPollingActive] = useState(false);
  const [progressionParsing, setProgressionParsing] = useState<number | string>(0);
  const [parsedReSumesCount, setParsedReSumesCount] = useState<number | string>("0/0");
  const [isParsingComplete, setIsParsingComplete] = useState<boolean>(false);
  const [isUploadStart, setIsUploadStart] = useState<boolean>(false);
  const { data: allResumes, isLoading, refetch: refetchAllResumes } = useGetAllResumesQuery({});
  const [bulkUploadResumes] = useBulkUploadResumesMutation();
  const { data: status, refetch } = useGetResumesParsedStatusQuery(uploadId, {
    skip: !uploadId || !pollingActive,
  });

  const onResumesUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploads = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsUploadStart(true);
      const result = await bulkUploadResumes({
        files: Array.from(selectedFiles),
      }).unwrap();

      console.log("result,", result.data);

      if (result.data) {
        setUploadId(result.data.uploadId);
        setPollingActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!pollingActive || !uploadId) return;
    console.log("==============================");
    console.log(status);
    console.log("==============================");

    if (!status || !status.total) {
      // setProgressionParsing(0);
    } else {
      const progress = ((status.completed + status.failed) / status.total) * 100;
      setProgressionParsing(Number(progress.toFixed(2)));
      setParsedReSumesCount(`${status.completed + status.failed}/${status.total}`);

      if (status.isParsingDone || status.completed + status.failed >= status.total) {
        setProgressionParsing(100);
        setParsedReSumesCount(`${status.total}/${status.total}`);
        setIsParsingComplete(true);
        setPollingActive(false);

        refetchAllResumes();
      }
    }

    const interval = setInterval(async () => {
      console.log("Checking upload status...");
      await refetch();
      if (status?.isParsingDone) {
        console.log("✅ All resumes parsed!", status);
        setProgressionParsing(100);
        setParsedReSumesCount(`${status.total}/${status.total}`);
        setPollingActive(false);
        setIsParsingComplete(true);
        setIsUploadStart(false);
        await refetchAllResumes();
        clearInterval(interval);
      } else if (status?.completed && status?.completed + status?.failed >= status?.total) {
        console.log("✅ All resumes parsed!", status);
        setProgressionParsing(100);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [uploadId, pollingActive, status]);

  const isResumesEmpty = Array.isArray(allResumes?.data) && allResumes?.data.length === 0;
  const isSelectedFiles = selectedFiles.length === 0;
  const isParsingComplted = progressionParsing === 100;
  console.log("========================");
  console.log(allResumes?.data);
  console.log(isResumesEmpty);
  console.log("========================");
  return (
    <>
      <section className=" w-screen h-screen flex  items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-row gap-6 p-4  mx-auto w-[93%] h-[calc(100vh-4rem)] my-8 ">
          <div
            style={{ flex: `${isSelectedFiles ? 7 : 3}` }}
            className="left transition-all duration-300  flex flex-col gap-4"
          >
            <div className="filters">
              <Card className="flex items-center    space-x-8 w-full">
                {/* Search Input with Icon */}
                <div className="relative w-[30%]">
                  <SearchCheckIcon className="absolute left-3 h-5 w-6 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input className="w-full pl-10 h-10 " placeholder="Search" />
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center border text-gray-500 border-gray-200 px-3 h-10 bg-white rounded-md hover:bg-gray-200">
                    My Candidates <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>My Candidates</DropdownMenuItem>
                    <DropdownMenuItem>Freshers</DropdownMenuItem>
                    <DropdownMenuItem>Experienced</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Card className="space-y-4 border-2 rounded-md bg-white px-2 h-10">
                  <button
                    onClick={onResumesUpload}
                    className="flex items-center space-x-3 w-full text-[#414447] hover:text-[#000000] transition-colors"
                  >
                    <div className="p-2">
                      <UploadIcon className="w-5 h-5" />
                    </div>
                    <span className="text-base font-normal leading-6 tracking-[0.24px]">Upload your resumes</span>
                  </button>
                </Card>
              </Card>
            </div>
            <Card className="w-full h-full rounded-lg bg-white border border-gray-200 flex flex-col gap-4">
              {isResumesEmpty ? (
                <div className="flex items-center justify-center w-full h-full">
                 <p className="text-gray-300 text-5xl capitalize">No resume uploaded</p>
                </div>
              ) : (
                <section className="rounded-lg">
                  <Table className="rounded-lg border border-gray-100">
                    <TableCaption className="text-gray-500 ">List of resumes</TableCaption>
                    <TableHeader className="rounded-lg border border-gray-100">
                      <TableRow className="bg-gray-100 rounded-lg">
                        <TableHead className=""> No.</TableHead>
                        <TableHead className="w-[200px] py-4 ">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Stack</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-700">
                      {allResumes?.data.map((person: Partial<IPerson>, i: number) => (
                        <TableRow key={i} className="hover:bg-gray-50  ">
                          <TableCell className="text-gray-600 pl-6 ">{i + 1}</TableCell>
                          <TableCell className="font-normal text-sm uppercase  ">{person?.name}</TableCell>
                          <TableCell className="text-gray-600">{person.contact?.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              2 years
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">Mern</TableCell>

                          <TableCell className="text-right">
                            <Link to={`/candidates/${person?._id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100 text-sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Example of another row with different status */}
                    </TableBody>
                  </Table>
                </section>
              )}
            </Card>
          </div>
          {selectedFiles.length > 0 && (
            <div className="right flex-[1] overflow-hidden ">
              <Card className="w-full shadow-sm rounded-lg bg-white">
                <CardContent className="p-6">
                  {!isUploadStart && (
                    <div className="space-y-4 border-2 rounded-md border-dashed border-gray-200 mb-4">
                      <button
                        onClick={() => setSelectedFiles([])}
                        className="flex items-center space-x-3 w-full text-[#414447] hover:text-[#000000] transition-colors"
                      >
                        <div className="p-2">
                          <X className="w-5 h-5" />
                        </div>
                        <span className="text-base font-normal leading-6 tracking-[0.24px]">Cancel Upload</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${progressionParsing}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{parsedReSumesCount}</span>
                  </div>

                  <div className="previewResums flex flex-col gap-2">
                    {selectedFiles &&
                      !isParsingComplete &&
                      Array.from(selectedFiles)
                        .slice(0, selectedFiles.length > 10 ? 10 : selectedFiles.length)
                        .map((file, index: number) => (
                          <div
                            key={index}
                            className="w-full flex items-center justify-between p-[6px_12px] rounded-lg bg-[#F0F5F3]"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <FileImage className="h-6 w-6 text-gray-400" />
                              <div className="space-y-1 flex-1">
                                <p className="text-sm font-medium text-gray-700">{file.name?.slice(0, 10)}.pdf</p>
                              </div>
                            </div>
                            <button type="button" className="ml-2 p-1 hover:bg-gray-100 rounded-full">
                              {/* {uploadProgress[file.name] < 100 ? (
                              <X className="h-4 w-4 text-[#6a6a6a]" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-[#6a6a6a]" />
                            )} */}
                            </button>
                          </div>
                        ))}

                    {isParsingComplete ? (
                      <Button onClick={() => setSelectedFiles([])} className="bg-[#188644] hover:bg-[#03963F]">
                        Completed
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUploads}
                        disabled={isUploadStart}
                        className="bg-[#188644] hover:bg-[#03963F]"
                      >
                        {isUploadStart ? "uploading" : "save"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {UploadModalOpen && (
            <BulkResumeUploadModal
              onClose={() => setIsUploadModalOpen(false)}
              onUpload={() => {
                console.log();
              }}
              setSelectedFiles={setSelectedFiles}
              setIsUploadModalOpen={setIsUploadModalOpen}
              setIsParsingComplete={setIsParsingComplete}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Canidates;
