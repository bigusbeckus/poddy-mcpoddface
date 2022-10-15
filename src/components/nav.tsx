type NavProps = {
  children?: React.ReactNode;
  className?: string;
};

export const NavBar: React.FC<NavProps> = ({ className, children }) => {
  return (
    <header className={"px-8 py-4 flex flex-row drop-shadow-md " + className}>
      {children}
    </header>
  );
};
