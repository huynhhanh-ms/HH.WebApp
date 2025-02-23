import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useApp } from 'src/stores/use-app';
import { AuthApi } from 'src/services/api/auth.api';
import { ApiQueryKey } from 'src/services/api-query-key';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { pathname } = useLocation();
  const isLoggedIn = useApp((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/admin');
    }
  }, [isLoggedIn, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState({ username: 'admin', password: '' });

  const { enqueueSnackbar } = useSnackbar();

  const { login } = useApp();

  const { mutate } = useMutation({
    mutationFn: AuthApi.login,
    mutationKey: [ApiQueryKey.auth.login],
    onSuccess: (data) => {
      login(data).then(() => {
        enqueueSnackbar("Đăng nhập thành công", { variant: 'success' });
        router.replace('/admin');
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'warning' });
    }
  });

  const handleSignIn = () => {
    mutate(account);
  }

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="username"
        label="Tên đăng nhập"
        defaultValue={account.username}
        onChange={(e) => setAccount({ ...account, username: e.target.value })}
        InputLabelProps={{ shrink: true }}

        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        {/* Forgot password? */}
        Quên mật khẩu?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Mật khẩu"
        defaultValue={account.password}
        onChange={(e) => setAccount({ ...account, password: e.target.value })}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Đăng nhập
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Đăng nhập</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Không có tài khoản?{' '}
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Đăng ký
          </Link>
        </Typography> */}
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
