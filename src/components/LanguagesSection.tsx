import TextInput from "@/components/TextInput";

interface LanguagesSectionProps {
  languages: string;
  onLanguagesChange: (value: string) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  onLanguagesChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Languages</h3>
      <TextInput
        label="Languages"
        value={languages}
        onChange={(e) => onLanguagesChange(e.target.value)}
        placeholder="e.g., English, Hindi"
      />
    </div>
  );
};

export default LanguagesSection;
