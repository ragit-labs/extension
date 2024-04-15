import React, { useEffect } from "react";
import "./App.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import ActionBar from "./ActionBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Article, BlockType, NoteBlock } from "../types";


const App: React.FC<{article: Article}> = ({article}) => {
  const queryClient = new QueryClient();
  const [selectedText, setSelectedText] = React.useState<string>("");
  const [actionBarActive, setActionBarActive] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");
  const [noteBlocks, setNoteBlocks] = React.useState<NoteBlock[]>([]);
  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);

  browser.runtime.sendMessage({ action: "getAccessToken" }).then((response) => {
    setAccessToken(response);
  });

  browser.runtime.onMessage.addListener(
    (message, sender, sendResponse: (args: any) => void) => {
      if (message.action === "toggleActionBar") {
        setActionBarActive(!actionBarActive);
        if(message.data.selectedText === "") {
          setSelectedText(article?.textContent ?? "");
        } else {
          setSelectedText(message.data.selectedText);
        }
        setUrl(message.data.url);
        setTitle(message.data.title);
      } else if (message.action === "readMode") {
        console.log(message.data);
      }
      return true;
    },
  );

  useEffect(() => {
    if(!actionBarActive) {
      setNoteBlocks([]);
      console.log("Toggle Action Bar");
    }
  }, [actionBarActive])
  console.log(article);

  // useEffect(() => {
  //   setNoteBlocks([...noteBlocks, { block_type: BlockType.CONTENT, content: selectedText !== "" ? selectedText : article?.textContent ?? ""}])
  // }, [selectedText]);

  return (
    <QueryClientProvider client={queryClient}>
      <ActionBar
      accessToken={accessToken}
        title={title}
        url={url}
        selectedText={selectedText}
        actionBarActive={actionBarActive}
        setActionBarActive={setActionBarActive}
        noteBlocks={noteBlocks}
        article={article}
        setNoteBlocks={setNoteBlocks}
      />
    </QueryClientProvider>
  );
};

export default App;
