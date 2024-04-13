

import React, { useEffect, useState } from 'react';
import "./App.css";
import WEBAPP_URL from '../constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchUser, sendNote, Note } from '../utils';

const parseUrl = (url: string) => {
    const postUrlRaw = new URL(url);
      let hostName = postUrlRaw.hostname;
      if ("www." === hostName.substring(0, 4)) {
        hostName = hostName.substring(4);
      }
      return hostName;
}


const App: React.FC = () => {
    // const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
    const [actionBarActive, setActionBarActive] = React.useState(false);
    const [selectedText, setSelectedText] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [url, setUrl] = React.useState<string>("");
    const [notification, setNotification] = React.useState<string | null>(null);

    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWIzOTNjYzQtZDgxOS00NDBiLTkwYTEtZjUwYzJkOGMzZDNiIiwiZXhwIjoxNzE3OTYyNzE0fQ.djb_2SK3QOi_1uazJpvwkvBCZr_wiJxjnDTzVAg1zis";


    // useEffect(() => {
    //     browser.cookies
    //       .get({ url: WEBAPP_URL, name: "accessToken" })
    //       .then((cookie) => {
    //         setAccessToken(cookie?.value);
    //       });
    //   }, [browser, accessToken]);

    const { isLoading: userLoading, data: user } = useQuery({
        queryKey: ["fetchUser"],
        queryFn: () => fetchUser(accessToken ?? ""),
        enabled: accessToken !== undefined,
      });

    browser.runtime.onMessage.addListener((message, sender, sendResponse: (args:any) => void) => {
        if (message.action === "toggleActionBar") {
            setActionBarActive(!actionBarActive);
            console.log(message);
            setSelectedText(message.data.selectedText);
            setUrl(message.data.url);
            setTitle(message.data.title);
        }
        return true;
    })

    const pushNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 2000);
    };

    return (
        <>
        {notification && <div className='notification-bar'>
            {notification}
        </div>}
        {actionBarActive && <div className='app-container' onClick={(e) => {
            e.preventDefault();
            if(e.target === e.currentTarget) {
                setActionBarActive(false);
            }
        }}>
            <div className='action-bar-container'>
                <div className='action-bar'>
                    <p>Hello, {user?.full_name}</p>
                    {selectedText.trim().length > 0 && <div className='selected-text-container'><pre>{selectedText}</pre></div>}
                    <p className='action-bar-url'>{parseUrl(url)}</p>
                    <textarea autoFocus className='action-bar-input' placeholder='Start writing or use / to bring up command palette' onKeyDown={(e) => {
                        if(e.key === "/") {
                            console.log("Command palette");
                        }
                        if(e.metaKey && e.key === "Enter") {
                            console.log("Save post");
                            setActionBarActive(false);
                            sendNote(accessToken, {
                                title: title,
                                session_id: "123",
                                url: url,
                                content: selectedText,
                                note: e.currentTarget.value,
                                folder_id: "b6dfe2ce-63ee-494b-9761-37e91f76cb00",
                                note_type: "post"
                            }).then((response) => {
                                    response.success && pushNotification("Post saved successfully");
                            }).catch((error) => {
                                console.log(error);
                                pushNotification("Unable to save post");
                            });
                        }
                    }}></textarea>
                </div>
            </div>
        </div>}
        </>
    );
};

export default App;