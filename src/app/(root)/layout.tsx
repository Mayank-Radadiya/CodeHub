import Footer from "@/components/global/Footer";

interface layoutProps {
  children: React.ReactNode;
}

const rootLayout = ({ children }: layoutProps) => {
  return (
    <>
      <main className="h-full w-full min-h-screen">
        {children}
        <Footer />
      </main>
    </>
  );
};

export default rootLayout;
