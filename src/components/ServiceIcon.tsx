import {
  BookOpen,
  Compass,
  Feather,
  Heart,
  Leaf,
  Sparkles,
  Sprout,
  Sun,
  Users,
  Wind,
} from 'lucide-react';

export function ServiceIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  switch (name) {
    case 'Wind':
      return <Wind className={className} aria-hidden="true" />;
    case 'Compass':
      return <Compass className={className} aria-hidden="true" />;
    case 'Feather':
      return <Feather className={className} aria-hidden="true" />;
    case 'Sun':
      return <Sun className={className} aria-hidden="true" />;
    case 'BookOpen':
      return <BookOpen className={className} aria-hidden="true" />;
    case 'Users':
      return <Users className={className} aria-hidden="true" />;
    case 'Sprout':
      return <Sprout className={className} aria-hidden="true" />;
    case 'Sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'Heart':
      return <Heart className={className} aria-hidden="true" />;
    default:
      return <Leaf className={className} aria-hidden="true" />;
  }
}
