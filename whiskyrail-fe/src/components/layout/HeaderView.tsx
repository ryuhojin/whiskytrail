import s from "./styled/HeaderView.module.css";


interface HeaderViewBaseProps {
  children: React.ReactNode;
}
interface HeaderViewModuleContainerProps extends HeaderViewBaseProps {}

interface HeaderViewModuleProps extends HeaderViewBaseProps {}

const HeaderViewContainer = ({ children }: HeaderViewBaseProps) => {
  return <div className={s.container}>{children}</div>;
};

const HeaderViewModuleContainer = ({
  children,
}: HeaderViewModuleContainerProps) => {
  return <div className={s.moduleContainer}>{children}</div>;
};

const HeaderViewModule = ({ children }: HeaderViewModuleProps) => {
  return <div className={s.module}>{children}</div>;
};

export const HeaderView = Object.assign(HeaderViewContainer, {
  Continaer: HeaderViewModuleContainer,
  Module: HeaderViewModule,
});
