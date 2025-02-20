import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from "react";

// 공통 스타일 생성 함수
const baseClasses = (textClassName: string, hideOnMobile: boolean) =>
  `${
    hideOnMobile ? "hidden md:flex" : "flex"
  } items-center gap-2 px-4 py-2 bg-white mx-2 rounded-md ${textClassName} font-normal text-gray-800 hover:underline cursor-pointer`;

// NavLinkButton: Next.js의 Link를 기반으로 한 버튼 (새로운 Link 사용법에 따라 <a> 태그 없이 className 직접 전달)
interface NavLinkButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Pick<LinkProps, "href" | "replace" | "scroll" | "shallow" | "prefetch"> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** 모바일 기기에서 버튼을 숨길지 여부 */
  hideOnMobile?: boolean;
  /** 텍스트 크기 관련 Tailwind 클래스 (기본: "text-lg") */
  textClassName?: string;
}

export const NavLinkButton: FC<NavLinkButtonProps> = ({
  href,
  children,
  icon,
  hideOnMobile = false,
  textClassName = "text-lg",
  ...props
}) => {
  return (
    <Link
      href={href!}
      {...props}
      className={baseClasses(textClassName, hideOnMobile)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

// NavButton: 일반 <button> 태그 기반 버튼
interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** 모바일 기기에서 버튼을 숨길지 여부 */
  hideOnMobile?: boolean;
  /** 텍스트 크기 관련 Tailwind 클래스 (기본: "text-lg") */
  textClassName?: string;
}

export const NavButton: FC<NavButtonProps> = ({
  children,
  icon,
  hideOnMobile = false,
  textClassName = "text-lg",
  ...props
}) => {
  return (
    <button
      type="button"
      {...props}
      className={baseClasses(textClassName, hideOnMobile)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
