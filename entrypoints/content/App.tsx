

import React from 'react';
import "./App.css";

const parseUrl = (url: string) => {
    const postUrlRaw = new URL(url);
      let hostName = postUrlRaw.hostname;
      if ("www." === hostName.substring(0, 4)) {
        hostName = hostName.substring(4);
      }
      return hostName
}

const App: React.FC = () => {
    const [actionBarActive, setActionBarActive] = React.useState(false);
    const [selectedText, setSelectedText] = React.useState<string>("");
    const [url, setUrl] = React.useState<string>("");

    browser.runtime.onMessage.addListener((message, sender, sendResponse: (args:any) => void) => {
        if (message.action === "toggleActionBar") {
            console.log("Toggle action bar");
            setActionBarActive(!actionBarActive);
            setSelectedText(message.data.selectedText[0].result);
            setUrl(message.data.url);
        }
        return true;
    })

    return (
        <>
        {actionBarActive && <div className='app-container' onClick={(e) => {
            e.preventDefault();
            if(e.target === e.currentTarget) {
                setActionBarActive(false);
            }
        }}>
            <div className='action-bar-container'>
                <div className='action-bar'>
                    {selectedText.trim().length > 0 && <div className='selected-text-container'><pre>{selectedText}</pre></div>}
                    <p>{parseUrl(url)}</p>
                    {/* <textarea placeholder='Search...'>{selectedText}</textarea> */}
                </div>
            </div>
        </div>}
        </>
    );
};

export default App;