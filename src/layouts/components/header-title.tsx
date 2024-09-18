import { Typography } from "@mui/material";

// ----------------------------------------------------------------------
interface TypographyProps {
  sx?: object;
  children?: React.ReactNode;
}

export function HeaderTitle({ sx, children, ...other }: TypographyProps) {
  return (
    <Typography variant="h6" sx={sx} {...other}>
      {children}
    </Typography>
  );
}