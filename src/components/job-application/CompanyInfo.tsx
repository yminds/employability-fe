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

export default function CompanyInfo({ jobDetails }: CompanyInfoProps) {
  // Company details
  const company_name = jobDetails?.company.name;
  const company_logo = jobDetails?.company.logo;
  const company_website = jobDetails?.company.website;
  const company_location = jobDetails?.company.location;

  const formattedCompanyName = formatCompanyName(company_name);

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
        Elanco is a global animal health company that develops products and
        knowledge services to prevent and treat disease in food animals and pets
        in more than 90 countries. With a 64-year heritage, we rigorously
        innovate to improve the health of animals and benefit our customers,
        while fostering an inclusive, cause-driven culture for more than 5,800
        employees. At Elanco, we're driven by our vision of food and
        companionship enriching life – all to advance the health of animals,
        people, and the planet.
      </p>

      <div className="flex items-center gap-2 text-[#0066d6] mb-2">
        <img src={Globe} alt="Globe" className="w-5 h-5" />{" "}
        <a href={company_website} className="text-[#0066d6] hover:underline">
          {company_website}
        </a>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <img src={Location} alt="Location" className="w-5 h-5" />
        <span>{company_location || "location"}</span>
      </div>
    </div>
  );
}
