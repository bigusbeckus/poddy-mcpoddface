import Link from "next/link";
import { FetchedImage } from "@/components/image";
import { SearchBar } from "./search-bar";

type CommonProps = {
  showSearchBar?: boolean;
};

type NavBarProps = CommonProps;

type NavBarDiscriminatorProps = {
  loggedIn?: boolean;
} & Required<CommonProps>;

type LoggedInNavBarProps = {
  username: string;
  avatar?: string;
} & Required<CommonProps>;

type DefaultNavBarProps = Required<CommonProps>;

const DefaultNavBar: React.FC<DefaultNavBarProps> = ({ showSearchBar }) => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col justify-center">
        <Link href="/">
          <div className="cursor-pointer rounded-sm bg-gray-900 py-0 px-2 align-middle font-black text-primary_light-300 dark:bg-white/50 dark:text-gray-900">
            Poddy McPodface
          </div>
        </Link>
      </div>
      {showSearchBar && <SearchBar />}
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

const LoggedInNavBar: React.FC<LoggedInNavBarProps> = ({ username }) => {
  return (
    <div className="flex h-full items-center justify-between">
      <div className="flex flex-col justify-center">
        <Link href="/">
          <div className="cursor-pointer rounded-sm bg-gray-900 py-0 px-2 align-middle font-black text-primary_light-300 dark:bg-white/50 dark:text-gray-900">
            Poddy McPodface
          </div>
        </Link>
      </div>
      <div className="flex h-full">
        <div className="flex items-center pr-16">
          {Array(8)
            .fill(1)
            .map((num, index) => (
              <a key={index + num} className="pr-8">
                Link #{index + num}
              </a>
            ))}
        </div>
        <div className="flex h-full overflow-hidden rounded-r-full bg-white/10">
          <div className="pr-2 pl-2">
            <h3 className="font-bold">{username}</h3>
            <p className="text-end text-sm font-thin">Lawyer</p>
          </div>
          <div className="aspect-square h-full overflow-hidden rounded-full">
            <FetchedImage
              src="https://api.dicebear.com/5.x/avataaars-neutral/svg"
              alt="dicebear-avatar"
              imgClassName="w-full"
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NavBarDiscriminator: React.FC<NavBarDiscriminatorProps> = ({ loggedIn, showSearchBar }) => {
  if (loggedIn) {
    return <LoggedInNavBar username="Ron LaFlamme" showSearchBar={showSearchBar} />;
  }

  return <DefaultNavBar showSearchBar={showSearchBar} />;
};

export const NavBar: React.FC<NavBarProps> = ({ showSearchBar }) => {
  return (
    <header className="py-6 px-8">
      <nav className={`flex h-12 w-full flex-col justify-center align-middle`}>
        <NavBarDiscriminator showSearchBar={!!showSearchBar} />
      </nav>
    </header>
  );
};
