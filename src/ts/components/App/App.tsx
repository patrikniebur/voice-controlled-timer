import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Timer } from "../Timer/Timer";
import style from "./styles.module.css";

export function App() {
  const [resetKey, setResetKey] = React.useState(0);
  const lastCommand = useVoiceCommands();

  React.useEffect(() => {
    if (["reset", "stop"].includes(lastCommand)) {
      setResetKey((x) => x + 1);
    }
  }, [lastCommand]);

  return (
    <div className={style.container}>
      <Timer key={resetKey} run={lastCommand === "start"} />
    </div>
  );
}

function useVoiceCommands() {
  const [lastCommand, setLastCommand] = React.useState("");
  useSpeechRecognition({
    commands: [
      {
        command: ["start", "stop", "reset", "pause", "pose" /* pose - catches misunderstood pause */],
        callback: setLastCommand,
        matchInterim: true,
        isFuzzyMatch: true,
      },
    ],
  });

  React.useEffect(() => {
    // Timeout fixes error during development when listenning attempted to start
    // before it has been aborted in a cleanup
    setTimeout(
      () => SpeechRecognition.startListening({ continuous: true }),
      500,
    );

    return () => {
      SpeechRecognition.abortListening();
    };
  }, []);

  return lastCommand;
}
