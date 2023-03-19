import Link from "next/link";

type NavProps = {
  children?: React.ReactNode;
  className?: string;
};

type NavBarDiscriminatorProps = {
  loggedIn?: boolean;
};

const DefaultNavBar = () => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col justify-center">
        <Link href="/">
          <div className="cursor-pointer rounded-sm bg-gray-900 py-0 px-2 align-middle font-black text-primary_light-300 dark:bg-white/50 dark:text-gray-900">
            Poddy McPodface
          </div>
        </Link>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center justify-end gap-8">
          <Link href="/login">
            <a className="font-bold transition hover:text-black/80 dark:hover:text-gray-300">
              Sign in
            </a>
          </Link>
          <Link href="/signup">
            <a className="rounded-lg bg-green-500 px-4 py-2 font-bold transition duration-150 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800">
              Create a new account
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const LoggedInNavBar = () => {
  return <h1>Logged in</h1>;
};

const NavBarDiscriminator: React.FC<NavBarDiscriminatorProps> = ({ loggedIn }) => {
  if (loggedIn) {
    return <LoggedInNavBar />;
  }

  return <DefaultNavBar />;
};

export function NavBar() {
  return (
    <header className="py-6 px-8">
      <nav className={`flex h-12 w-full flex-col justify-center align-middle`}>
        <NavBarDiscriminator />
      </nav>
    </header>
  );
}
