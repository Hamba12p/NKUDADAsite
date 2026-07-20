import {
  GraduationCap,
  MapPin,
  BookOpen,
  Flower2,
  Handshake,
  Megaphone,
  School,
  Stethoscope,
  Briefcase,
  Coins,
  HeartPulse,
  ClipboardList,
  Globe2,
  Lightbulb,
  Mail,
  MessageCircle,
  Instagram,
  Heart,
  PartyPopper,
  Sparkles,
  Sparkle,
  ImageIcon,
  BookMarked,
  Users,
  HandHeart,
  Compass
} from "lucide-react";

export const ICONS = {
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  "book-open": BookOpen,
  "flower-2": Flower2,
  handshake: Handshake,
  megaphone: Megaphone,
  school: School,
  stethoscope: Stethoscope,
  briefcase: Briefcase,
  coins: Coins,
  "heart-pulse": HeartPulse,
  "clipboard-list": ClipboardList,
  "globe-2": Globe2,
  lightbulb: Lightbulb,
  mail: Mail,
  "message-circle": MessageCircle,
  instagram: Instagram,
  heart: Heart,
  "party-popper": PartyPopper,
  sparkles: Sparkles,
  sparkle: Sparkle,
  image: ImageIcon,
  "book-marked": BookMarked,
  users: Users,
  "hand-heart": HandHeart,
  compass: Compass
};

export function Icon({ name, size = 20, ...props }) {
  const Cmp = ICONS[name] || Sparkle;
  return <Cmp size={size} {...props} />;
}
