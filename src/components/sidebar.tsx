import clsx from "clsx";

interface SidebarProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ children, className, ...rest }: SidebarProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "w-52 bg-paper w-250 flex flex-col justify-between items-center p-20 md:p-10 border-r border-solid border-border",
        className
      )}
    >
      {children}
    </div>
  );
}
