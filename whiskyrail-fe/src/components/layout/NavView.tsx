import s from "./styled/NavView.module.css";

interface HeaderViewBaseProps {
  children: React.ReactNode;
}

const NavViewIconItem = () => {
  return <div></div>;
};

const NavViewItem = () => {
  return (
    <div>
      <div>
        <a></a>
      </div>
    </div>
  );
};

const NavViewSearchBox = () => {
  return <div></div>;
};

const NavViewContaienr = ({ children }: HeaderViewBaseProps) => {
  return <div className={s.container}></div>;
};
export const NavView = Object.assign(NavViewContaienr, {
  Search: NavViewSearchBox,
  IconItem: NavViewIconItem,
  Item: NavViewItem,
});
