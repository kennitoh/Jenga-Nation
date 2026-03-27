export type ColorCategory = 
  | 'infrastructure' 
  | 'water' 
  | 'healthcare' 
  | 'education' 
  | 'waste' 
  | 'security';

export type AccentColor = 
  | 'blue' 
  | 'green' 
  | 'red' 
  | 'orange' 
  | 'purple';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
}

export interface CategoryStyle {
  background: string;
  text: string;
  badge: string;
}

export const CATEGORY_STYLES: Record<ColorCategory, CategoryStyle> = {
  infrastructure: {
    background: 'bg-category-infrastructure-50',
    text: 'text-category-infrastructure-600',
    badge: 'badge-infrastructure'
  },
  water: {
    background: 'bg-category-water-50',
    text: 'text-category-water-600',
    badge: 'badge-water'
  },
  healthcare: {
    background: 'bg-category-healthcare-50',
    text: 'text-category-healthcare-600',
    badge: 'badge-healthcare'
  },
  education: {
    background: 'bg-category-education-50',
    text: 'text-category-education-600',
    badge: 'badge-education'
  },
  waste: {
    background: 'bg-category-waste-50',
    text: 'text-category-waste-600',
    badge: 'badge-waste'
  },
  security: {
    background: 'bg-category-security-50',
    text: 'text-category-security-600',
    badge: 'badge-security'
  }
};