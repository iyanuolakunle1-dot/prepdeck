import {
  Calculator, BookOpen, Atom, FlaskConical, Dna, LineChart,
  Landmark, Globe, Feather, ShoppingCart, Receipt, Book, Sprout, GraduationCap,
} from 'lucide-react';

const iconMap = {
  calculator: Calculator,
  'book-open': BookOpen,
  atom: Atom,
  'flask-conical': FlaskConical,
  dna: Dna,
  'line-chart': LineChart,
  landmark: Landmark,
  globe: Globe,
  feather: Feather,
  'shopping-cart': ShoppingCart,
  receipt: Receipt,
  book: Book,
  sprout: Sprout,
};

export function getSubjectIcon(icon) {
  return iconMap[icon] || GraduationCap;
}
