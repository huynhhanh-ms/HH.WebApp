import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Chốt sổ',
    path: '/admin/session',
    icon: icon('ic-session'),
  },
  {
    title: 'Bồn chứa',
    path: '/admin/tank',
    icon: icon('ic-tank'),
  },
  // {
  //   title: 'Công nợ',
  //   path: '/admin/debt',
  //   icon: icon('ic-debt'),
  // },
  {
    title: 'Giá bán',
    path: '/admin/price',
    icon: icon('ic-price'),
  },
  {
    title: 'Nhân viên',
    path: '/admin/user',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'User',
  //   path: '/admin/user',
  //   icon: icon('ic-user'),
  // },
  // {
  //   title: 'Product',
  //   path: '/admin/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: 'Blog',
  //   path: '/admin/blog',
  //   icon: icon('ic-blog'),
  // },
];
