import { useState } from "react";

import { Button } from "@mui/material";

import HereMapDrawArea from "../area/map/HereMapDrawArea";

export function LandView() {

  const [reset, setReset] = useState(false);

  return (
    <div>
      {/* <HereMapDrawArea onAreaChange={(points) => { setValue("boundaries", points) }} /> */}
      <HereMapDrawArea onAreaChange={(points) => {console.log("onAreaChange")}} reset={reset} afterReset={() => setReset(false)} />
        <Button onClick={() => {setReset(true)}}>Reset</Button>
    </div>
  );
}