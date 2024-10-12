import { useEffect } from "react";
import { useSnackbar } from "notistack";

export function useErrorToast({
  isError = false,
  title = 'Error',
  // description = 'Something went wrong',
  status = 'error'
}) {
  const { enqueueSnackbar: toast } = useSnackbar();

  useEffect(() => {
    if (isError) {
      // toast({ title, description, status });
      toast(title, { variant: 'warning' });
    }
  }, [isError, title, toast]);
}