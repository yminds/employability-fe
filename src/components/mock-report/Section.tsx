import React from 'react';
import { TableSection } from './updatedReport';

// Reusable Section Component
interface SectionProps {
  id: string;
  title: string;
  imageSrc: string;
  data: Array<{ criteria: string; rating: string; remarks: string }>;
}

const Section: React.FC<SectionProps> = ({ id, title, imageSrc, data }) => {
  return (
    <section id={id} className="rounded-lg p-8 shadow-sm bg-white sm:p-4">
      <div className="flex gap-2 items-center">
        <img src={imageSrc} alt="" className="p-1 object-contain border rounded-full" />
        <h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">{title}</h2>
      </div>
      <TableSection
        title={title}
        rows={data.map((item) => ({
          criteria: item.criteria,
          rating: item.rating,
          remarks: item.remarks,
        }))}
      />
    </section>
  );
};

export default Section;