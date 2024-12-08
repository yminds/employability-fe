import TextInput from "@/components/TextInput";

interface CertificationsSectionProps {
  certifications: string[];
  onCertificationsChange: (value: string[]) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onCertificationsChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Certifications</h3>
      <TextInput
        label="Certifications"
        value={certifications.join(", ")}
        onChange={(e) =>
          onCertificationsChange(
            e.target.value.split(", ").map((s) => s.trim())
          )
        }
        placeholder="e.g., AWS Certified Solutions Architect, PMP"
      />
    </div>
  );
};

export default CertificationsSection;
