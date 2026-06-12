type SectionTitleProps = {
  children: React.ReactNode;
};

export default function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="mb-2 font-bold tracking-wider">{children}</h2>;
}
