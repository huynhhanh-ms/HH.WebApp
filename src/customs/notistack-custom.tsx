import type { ReactNode } from "react";

import { Icon } from "@iconify/react";
import { closeSnackbar, SnackbarProvider, MaterialDesignContent } from "notistack";

import { Button, styled } from "@mui/material";

const CustomStyle = {
  boxShadow: 'none',
  backgroundColor: '#FFFFFF',
  borderRadius: '25px',
  padding: '12.5px',
  paddingLeft: '25px',
  fontWeight: 'bold',
};

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent': CustomStyle,
  '&.notistack-MuiContent-default': {...CustomStyle, color: 'blue'},
  '&.notistack-MuiContent-info': {...CustomStyle, color: 'blue'},
  '&.notistack-MuiContent-error': {...CustomStyle, color: 'red'},
  '&.notistack-MuiContent-warning': {...CustomStyle, color: 'orange'},
  '&.notistack-MuiContent-success': {...CustomStyle, color: 'green'},
}));
interface SnackbarProviderCustomProps {
  children: ReactNode;
}

export default function SnackbarProviderCustom({ children }: SnackbarProviderCustomProps) {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        default: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
      action={(snackbarId) => (
        <Button sx={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}  onClick={() => closeSnackbar(snackbarId)}>
          <Icon icon="mingcute:close-fill" color="grey"/>
        </Button>
      )}
      hideIconVariant
    >
      {children}
    </SnackbarProvider>
  )
}