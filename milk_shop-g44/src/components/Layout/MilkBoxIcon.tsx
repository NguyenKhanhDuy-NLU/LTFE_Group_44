interface MilkBoxIconProps {
  size?: string;
}
export default function MilkBoxIcon({ size = "1.7em" }: MilkBoxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9.5V20a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M6 9.5 9 3h6l3 6.5H6z" />
      <path d="M9 3l1.5 6.5M15 3l-1.5 6.5" />
      <path d="M12 12.5c1.6 2 2.4 3.1 2.4 4.1a2.4 2.4 0 0 1-4.8 0c0-1 .8-2.1 2.4-4.1z" />
    </svg>
  );
}


