interface layoutProps {
  children: React.ReactNode;
}

const snippetsLayout = ({ children }: layoutProps) => {
  return (
    <>
      <main className="h-full w-full flex flex-col p-4 mina-h-screen">
        {children}
      </main>
    </>
  );
};

export default snippetsLayout;
