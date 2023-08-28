## Voice controlled timer  
Requires [`SpeechRecognition` API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) which currently appears to work only in latest Chrome `v116`.  

Recognizes 4 commands:  
- `start` - To start the timer  
- `pause` - Pausing the timer at the current time which can be started again  
- `stop` - Stops and resets the timer  
- `reset` - Same as stop  

### Development  
**Requirements**  
`node` tested in latest version 19.8.1 and `npm`.  
**Setup**  
Run `npm install` and `npm start` to run the local server with HMR

