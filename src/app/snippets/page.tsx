"use client";
import { NextPage } from "next";
import SnippetList from "./_components/SnippetList";
import NavigationHeader from "@/components/global/NavigationHeader";

const Page: NextPage = () => {
  return (
    <div className="w-full h-full">
      <div className="px-16">
        <NavigationHeader />
      </div>
      <SnippetList />
    </div>
  );
};

export default Page;
