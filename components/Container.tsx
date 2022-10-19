import React from "react";

interface Props {
  children: React.ReactNode;
}

const Container: React.FC<Props> = ({ children }) => {
  return (
    <main>
      <div className="everythingContainer">{children}</div>
    </main>
  );
};

export default Container;
