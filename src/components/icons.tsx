import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copyright,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  Sun,
  Trash,
  User,
  X,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  ),
  close: X,
  spinner: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: Sun,
  moon: Moon,
  laptop: Laptop,
  logoWhite: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M50.0001 0.416626C45.2449 0.416626 41.3323 4.3292 41.3323 9.08445V31.8465C23.9573 35.864 12.5 52.482 12.5 71.2721C12.5 91.8023 29.5641 108.866 50 108.866C70.4359 108.866 87.5 91.8023 87.5 71.2721C87.5 52.482 76.0427 35.864 58.6679 31.8465V9.08445C58.6679 4.3292 54.7553 0.416626 50.0001 0.416626ZM50 8.75012C50.294 8.75012 50.5 8.95612 50.5 9.25012V30.5694C49.0069 30.6599 47.5303 30.8258 46.0965 31.0664L45.498 12.9818C45.4746 12.0628 45.6983 11.1611 46.1362 10.3794C46.6027 9.53928 47.2882 8.87893 48.0934 8.46824C48.7291 8.13256 49.4449 7.97395 50.1583 8.01663L50 8.75012Z"
        fill="white"
      />
    </svg>
  ),
  logoBlack: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50.0001 0.416626C45.2449 0.416626 41.3323 4.3292 41.3323 9.08445V31.8465C23.9573 35.864 12.5 52.482 12.5 71.2721C12.5 91.8023 29.5641 108.866 50 108.866C70.4359 108.866 87.5 91.8023 87.5 71.2721C87.5 52.482 76.0427 35.864 58.6679 31.8465V9.08445C58.6679 4.3292 54.7553 0.416626 50.0001 0.416626ZM50 8.75012C50.294 8.75012 50.5 8.95612 50.5 9.25012V30.5694C49.0069 30.6599 47.5303 30.8258 46.0965 31.0664L45.498 12.9818C45.4746 12.0628 45.6983 11.1611 46.1362 10.3794C46.6027 9.53928 47.2882 8.87893 48.0934 8.46824C48.7291 8.13256 49.4449 7.97395 50.1583 8.01663L50 8.75012Z"
        fill="black"
      />
    </svg>
  ),
}
