interface JobDescriptionProps {
  description: string;
}

export default function JobDescription({ description }: JobDescriptionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-sub-header text-[#001630] mb-4">Job Description</h2>
      <p className="text-body2 text-[#414447] mb-4 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
