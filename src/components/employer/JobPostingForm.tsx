import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface JobPostingFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements ? initialData.requirements.join('\n') : '',
    responsibilities: initialData?.responsibilities ? initialData.responsibilities.join('\n') : '',
    location: initialData?.location || '',
    type: initialData?.type || 'full-time' as const,
    experience_level: initialData?.experience_level || 'entry' as const,
    salary_range: {
      min: initialData?.salary_range?.min || 400000,
      max: initialData?.salary_range?.max || 1200000,
      currency: initialData?.salary_range?.currency || 'INR'
    },
    skills_required: initialData?.skills_required ? initialData.skills_required.join(', ') : '',
    status: initialData?.status || 'active'
  });
  
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY'];
  const [activeTab, setActiveTab] = useState('basic');
  const [salaryRange, setSalaryRange] = useState([
    formData.salary_range.min, 
    formData.salary_range.max
  ]);
  
  const handleNextStep = () => {
    if (activeTab === 'basic') {
      setActiveTab('details');
    } else if (activeTab === 'details') {
      setActiveTab('requirements');
    }
  };
  
  const handlePrevStep = () => {
    if (activeTab === 'requirements') {
      setActiveTab('details');
    } else if (activeTab === 'details') {
      setActiveTab('basic');
    }
  };
  
  const handleSalaryRangeChange = (values: number[]) => {
    // Ensure we have both min and max values
    if (values.length === 2) {
      setSalaryRange(values);
      setFormData({
        ...formData,
        salary_range: {
          ...formData.salary_range,
          min: values[0],
          max: values[1]
        }
      });
    }
  };
  
  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty value during input
    if (e.target.value === '') {
      // Just update the input field, but keep the form data at 0
      setSalaryRange([0, salaryRange[1]]);
      setFormData({
        ...formData,
        salary_range: {
          ...formData.salary_range,
          min: 0
        }
      });
      return;
    }
    
    const minValue = parseInt(e.target.value);
    // No need to enforce min < max during typing
    
    setSalaryRange([minValue, salaryRange[1]]);
    setFormData({
      ...formData,
      salary_range: {
        ...formData.salary_range,
        min: minValue
      }
    });
  };
  
  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty value during input
    if (e.target.value === '') {
      // Just update the input field, but when focusing out, we'll ensure it's > min
      setSalaryRange([salaryRange[0], salaryRange[0] + 10000]);
      setFormData({
        ...formData,
        salary_range: {
          ...formData.salary_range,
          max: salaryRange[0] + 10000
        }
      });
      return;
    }
    
    const maxValue = parseInt(e.target.value);
    // Allow any value for max, even less than min during typing
    
    setSalaryRange([salaryRange[0], maxValue]);
    setFormData({
      ...formData,
      salary_range: {
        ...formData.salary_range,
        max: maxValue
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only submit if we're on the last step and all required fields are filled
    if (activeTab === 'requirements') {
      const processedData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter((req: string) => req.trim()),
        responsibilities: formData.responsibilities.split('\n').filter((resp: string) => resp.trim()),
        skills_required: formData.skills_required.split(',').map((skill: string) => skill.trim()).filter((skill: any) => skill)
      };
      onSubmit(processedData);
    } else {
      handleNextStep();
    }
  };

  const getSalaryLabel = (value: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: formData.salary_range.currency,
      maximumFractionDigits: 0
    });
    return formatter.format(value);
  };
  
  const isFormValid = () => {
    if (activeTab === 'basic') {
      return formData.title && formData.location && formData.skills_required;
    } else if (activeTab === 'details') {
      return formData.description && formData.salary_range.min < formData.salary_range.max;
    } else {
      return formData.requirements && formData.responsibilities;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <TabsList className="grid grid-cols-3 w-full mb-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Job Title*</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g. Senior Frontend Developer"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Location*</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                placeholder="e.g. New York, NY or Remote"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Job Type*</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value as any})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Experience Level*</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => setFormData({...formData, experience_level: value as any})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Job Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Required Skills (comma-separated)*</Label>
            <Input
              value={formData.skills_required}
              onChange={(e) => setFormData({...formData, skills_required: e.target.value})}
              placeholder="e.g. React, TypeScript, Node.js"
              className="mt-1"
              required
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Description*</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
              placeholder="Provide a detailed description of the job role..."
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">Salary Range (<strong>LPA</strong>)*</Label>
              <Select
                value={formData.salary_range.currency}
                onValueChange={(value) => setFormData({
                  ...formData,
                  salary_range: {...formData.salary_range, currency: value}
                })}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <Label className="text-sm">Minimum Salary</Label>
                <Input
                  type="number"
                  value={salaryRange[0]}
                  onChange={handleMinSalaryChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Maximum Salary</Label>
                <Input
                  type="number"
                  value={salaryRange[1]}
                  onChange={handleMaxSalaryChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-2 px-2">
              <div className="py-4">
                <Slider
                  defaultValue={[formData.salary_range.min, formData.salary_range.max]}
                  max={2000000}
                  min={0}
                  step={10000}
                  value={[salaryRange[0], salaryRange[1]]}
                  onValueChange={handleSalaryRangeChange}
                  className="mt-3"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <div>Min: {getSalaryLabel(salaryRange[0])}</div>
                <div>Max: {getSalaryLabel(salaryRange[1])}</div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Requirements (one per line)*</Label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              required
              rows={3}
              placeholder="Enter each requirement on a new line"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Responsibilities (one per line)*</Label>
            <Textarea
              value={formData.responsibilities}
              onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
              required
              rows={3}
              placeholder="Enter each responsibility on a new line"
              className="mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-4 pt-2 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={activeTab === 'basic' ? onClose : handlePrevStep}
          disabled={isLoading}
        >
          {activeTab === 'basic' ? 'Cancel' : (
            <>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </>
          )}
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? 'Saving...' : (
            activeTab === 'requirements' ? (
              initialData ? 'Update Job' : 'Post Job'
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )
          )}
        </Button>
      </div>
    </form>
  );
};

export default JobPostingForm;