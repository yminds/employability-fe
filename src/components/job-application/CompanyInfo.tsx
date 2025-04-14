import Location from "@/assets/job-posting/location.svg";
import Globe from "@/assets/job-posting/globe.svg";
import DefaultCompanyLogo from "@/assets/job-posting/DefaultCompanyLogo.svg";

interface CompanyInfoProps {
  jobDetails: any;
}

const formatCompanyName = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Helper function to format location
const formatLocation = (location: any): string => {
  if (!location) return "";
  
  if (typeof location === "string") {
    return location;
  }
  
  if (typeof location === "object") {
    const { city, state, country } = location;
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (country) parts.push(country);
    return parts.join(', ');
  }
  
  return "";
};

export default function CompanyInfo({ jobDetails }: CompanyInfoProps) {
  // Company details
  const company_name = jobDetails?.company?.name;
  const company_logo = jobDetails?.company?.logo;
  const company_website = jobDetails?.company?.website;
  const company_location = jobDetails?.company?.location;
  const company_about = jobDetails?.company?.about;

  const formattedCompanyName = formatCompanyName(company_name);
  const formattedLocation = formatLocation(company_location);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        {company_logo ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-sm">
            <img
              src={company_logo || "/placeholder.svg"}
              alt="Company Logo"
              className="w-full h-full object-cover rounded-full border"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center rounded-sm">
            <img
              src={DefaultCompanyLogo || "/placeholder.svg"}
              alt="Default Company Logo"
            />
          </div>
        )}
        <span className="text-[18px] font-medium leading-6 tracking-[0.27px] text-[#414447]">
          {formattedCompanyName}
        </span>
      </div>

      <h2 className="text-lg font-medium text-[#001630] mb-4">About company</h2>
      <p className="text-body2 text-[#414447] mb-6">
        {company_about}
      </p>

      <div className="flex items-center gap-2 text-[#0066d6] mb-2">
        <img src={Globe} alt="Globe" className="w-5 h-5" />
        <a href={company_website} className="text-[#0066d6] hover:underline">
          {company_website ? company_website : "Company Website"}
        </a>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <img src={Location} alt="Location" className="w-5 h-5" />
        <span>{formattedLocation || "Location"}</span>
      </div>
    </div>
  );
}