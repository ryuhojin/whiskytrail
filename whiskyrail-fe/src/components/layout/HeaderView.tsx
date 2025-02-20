import Link from "next/link";

interface HeaderViewProps {
  children: React.ReactNode;
}
const HeaderModuleView = ({ children }: HeaderViewProps) => {
  return (
    <div className="header flex flex-wrap justify-between items-center">
      {children}
    </div>
  );
};
const HeaderModuleFlatView = ({ children }: HeaderViewProps) => {
  return (
    <div className="header-f flex flex-wrap items-center ">{children}</div>
  );
};
const NavBoxView = ({ children }: HeaderViewProps) => {
  return <div className="flex items-center">{children}</div>;
};

const Title = () => {
  return (
    <Link href="/" className="inline-block">
      <h1 className="text-2xl font-bold leading-none text-[#B22222]">
        WHISKYRAIL
      </h1>
    </Link>
  );
};

const SearchBoxView = () => {
  return (
    <div className="relative hidden w-[300px] md:block ml-4">
      <svg
        className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        placeholder="Search Whisky"
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full
           placeholder-gray-500 text-gray-700
           focus:outline-none focus:ring-1 focus:ring-[#B22222]"
      />
    </div>
  );
};

const HeaderView = ({ children }: HeaderViewProps) => {
  return <header>{children}</header>;
};
export default Object.assign(HeaderView, {
  Title: Title,
  Module: HeaderModuleView,
  ModuleFlat: HeaderModuleFlatView,
  NavBox: NavBoxView,
  SearchBox: SearchBoxView,
});
