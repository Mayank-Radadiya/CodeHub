const FeatureCategory = ({ children }: { children: React.ReactNode; label: string }) => (
    <div className="space-y-4">
      <div className="space-y-3">{children}</div>
    </div>
  );
  
  export default FeatureCategory;
  