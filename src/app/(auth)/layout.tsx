interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <div className="flex items-center h-screen w-full justify-center">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
