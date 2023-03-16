type NavProps = {
  children?: React.ReactNode;
  className?: string;
};

export const NavBar: React.FC<NavProps> = ({ className, children }) => {
  return (
    <header className={"flex flex-row px-8 py-4 drop-shadow-md " + className}>{children}</header>
  );
};
