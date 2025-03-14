import NavigationHeader from "@/components/global/NavigationHeader";
import AiEditorPanel from "./_components/AiEditorPanel";
import AiOutputPanel from "./_components/AiOutputPanel";

const Page = () => {
  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b border-gray-800/50  backdrop-blur-xl backdrop-saturate-150 rounded-md shadow-lg px-4 py-4">
        <NavigationHeader />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AiEditorPanel />
        <AiOutputPanel />
      </div>
    </>
  );
};

export default Page;
