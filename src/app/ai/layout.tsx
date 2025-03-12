import Footer from "@/components/global/Footer";

interface layoutProps {
  children: React.ReactNode;
}

const aiLayout = ({ children }: layoutProps) => {
  return (
    <>
      <main className="h-full w-full min-h-screen relative  px-3">
        {children}
        <Footer />
      </main>
    </>
  );
};

export default aiLayout;
