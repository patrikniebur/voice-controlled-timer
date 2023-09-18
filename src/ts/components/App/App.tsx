import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Timer } from "../Timer/Timer";
import { Debug } from "../Debug";
import * as style from "./styles.module.css";

export function App() {
  const [resetKey, setResetKey] = React.useState(0);
  const [lastCommand, error] = useVoiceCommands();

  React.useEffect(() => {
    if (["reset", "stop"].includes(lastCommand)) {
      setResetKey((x) => x + 1);
    }
  }, [lastCommand]);

  return (
    <div className={style.container}>
      <Timer key={resetKey} run={lastCommand === "start"} />
      <Debug>
        <p>Last command: {lastCommand}</p>
        {error && <p>Error: [{error.error}] {error.message}</p>}
      </Debug>
    </div>
  );
}

function useVoiceCommands() {
  const [lastCommand, setLastCommand] = React.useState("");
  const [error, setError] = React.useState<SpeechRecognitionErrorEvent>();
  const { transcript, resetTranscript } = useSpeechRecognition({
    transcribing: false,
    commands: [
      {
        command: [
          "start",
          "stop",
          "reset",
          "pause",
          "pose" /* pose - catches misunderstood pause */,
        ],
        callback: (lastCommand) => {
          setLastCommand(lastCommand);
          resetTranscript();
        },
        matchInterim: true,
        isFuzzyMatch: true,
      },
    ],
  });

  React.useEffect(() => {
    const listener = (e: any) => {
      console.log({error: e})
      setError(e);
    };
    SpeechRecognition.getRecognition()?.addEventListener("error", listener);

    return () =>
      SpeechRecognition.getRecognition()?.removeEventListener(
        "error",
        listener,
      );
  }, []);

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

  return [lastCommand, error] as const;
}
