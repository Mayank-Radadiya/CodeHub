import { NextPage } from "next";

interface PageProps {}

const Page: NextPage<PageProps> = ({}) => {
  return (
    <div>
      <h1>Title: new Page</h1>
      <p>Page</p>
    </div>
  );
};

export default Page;
