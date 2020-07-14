import React from "react";

const DisplayVideoContext = React.createContext<
  [boolean, (newVal: boolean) => void]
>([
  true,
  () => {
    //
  },
]);

export default DisplayVideoContext;
