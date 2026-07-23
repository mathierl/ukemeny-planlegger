import React from 'react';
import { TbBreadOff, TbMilkOff } from 'react-icons/tb';

// Every recipe in this app is gluten-free and dairy-free by design (that's
// the app's whole premise — see CLAUDE.md), so these two tags are constant,
// not derived from recipe data. This is the app's signature visual element;
// keep it consistent everywhere a recipe is shown.
const TAGS = [
  { key: 'glutenfri', label: 'Glutenfri', icon: TbBreadOff },
  { key: 'melkefri', label: 'Melkefri', icon: TbMilkOff },
];

export const DietTag = ({ tag }) => {
  const Icon = tag.icon;
  return (
    <span className="inline-flex items-center gap-1 bg-moss-100 text-moss-800 text-[11px] font-medium px-[9px] py-[3px] rounded-full">
      <Icon size={12} aria-hidden="true" />
      {tag.label}
    </span>
  );
};

const DietTags = ({ className = '' }) => (
  <div className={`flex flex-wrap gap-1.5 ${className}`}>
    {TAGS.map((tag) => (
      <DietTag key={tag.key} tag={tag} />
    ))}
  </div>
);

export default DietTags;
