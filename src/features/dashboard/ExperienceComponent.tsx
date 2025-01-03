const ExperienceComponent: React.FC<{ selectedOption: string }> = ({ selectedOption }) => (
    <div className="flex p-[5px_20px_5px_16px] justify-center items-center gap-[10px] rounded-[57px] bg-[rgba(31,209,103,0.10)] text-[var(--Greens-G7,#10B754)] text-[16px] font-medium leading-[22px]">
        Experience: {selectedOption}
    </div>
);

export default ExperienceComponent;