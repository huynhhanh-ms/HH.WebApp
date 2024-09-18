export default function NavItem({ href, children } : { href: string, children: React.ReactNode}) {
  return (
    <a
      href={href}
      className="pb-5 mx-8 ease-in-out hover:border-solid hover:border-b-4 hover:border-contrast text-xm"
    >
      {children}
    </a>
  )
}