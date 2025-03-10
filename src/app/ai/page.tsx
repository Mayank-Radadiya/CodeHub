// import { useEffect, useState } from "react";
import Header from "./_components/Header";
import AiEditorPanel from "./_components/AiEditorPanel";
import AiOutputPanel from "./_components/AiOutputPanel";

const Page = () => {

  return (
    <>
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AiEditorPanel />
        <AiOutputPanel />
      </div>
    </>
  );
};

export default Page;
