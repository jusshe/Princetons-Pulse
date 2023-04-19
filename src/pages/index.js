import React from "react";
// Modules
import dynamic from "next/dynamic";

const MainComp = dynamic(() => import("./mainComp.js"), { ssr: false });

const HomePage = () => {
  return <MainComp />;
};

export default HomePage;
