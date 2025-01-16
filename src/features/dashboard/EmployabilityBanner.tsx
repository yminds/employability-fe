
interface EmployabilitySectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc: string;
  altText?: string;
}

const EmployabilityBannerSection = ({ 
  title = "What is Employability?", 
  subtitle = "Achieve your professional goals", 
  description = "Be it learning a new skill or getting that dream job, we help accelerate your journey through the power of AI.", 
  imageSrc, 
  altText = "Goal" 
}: EmployabilitySectionProps) => {
  return (
    <section className="flex flex-col items-start gap-4 self-stretch relative">
      <h5 className="text-[#000] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">
        {title}
      </h5>
      <div className="flex h-[192px] p-6 flex-col justify-center items-start gap-[23px] rounded-[8px] border border-[#0000000D] bg-[#FCF9D3] w-full">
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-[#202326] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">
            {subtitle}
          </h2>
          <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">
            {description}
          </p>
        </div>
        <div className="flex absolute bottom-0 end-0">
          <img src={imageSrc} alt={altText} />
        </div>
      </div>
    </section>
  );
};

export default EmployabilityBannerSection;
