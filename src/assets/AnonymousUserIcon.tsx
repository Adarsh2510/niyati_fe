interface AnonymousUserIconProps {
  fillColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const AnonymousUserIcon = ({
  fillColor = '#333333',
  strokeColor = 'none',
  backgroundColor = '#E5E7EB',
  width = 48,
  height = 48,
  className = '',
}: AnonymousUserIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={width}
    height={height}
    className={className}
  >
    {/* Circle background */}
    <circle cx="24" cy="24" r="24" fill={backgroundColor} />

    {/* User silhouette */}
    <path
      d="M24 24c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 3c-4.11 0-12 2.07-12 6.2V36h24v-2.8c0-4.13-7.89-6.2-12-6.2z"
      fill={fillColor}
    />
  </svg>
);
