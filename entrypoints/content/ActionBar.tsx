import React, { useEffect } from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, sendNote, fetchFolders } from "../utils";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { Article, BlockType, Folder, NoteBlock } from "../types";
import axios from "axios";
import { SERVICE_URL } from "../constants";

const parseUrl = (url: string) => {
  const postUrlRaw = new URL(url);
  let hostName = postUrlRaw.hostname;
  if ("www." === hostName.substring(0, 4)) {
    hostName = hostName.substring(4);
  }
  return hostName;
};

interface ActionBarProps {
  accessToken?: string;
  title?: string;
  url?: string;
  selectedText?: string;
  actionBarActive?: boolean;
  noteBlocks: NoteBlock[];
  article: Article;
  setNoteBlocks: (infoBlocks: NoteBlock[]) => void;
  setActionBarActive: (active: boolean) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  accessToken,
  title,
  url,
  selectedText,
  actionBarActive,
  noteBlocks,
  article,
  setNoteBlocks,
  setActionBarActive,
}) => {
  const [notification, setNotification] = React.useState<string | null>(null);
  const [folder, setFolder] = React.useState<Folder | null>(null);
  const [ready, setReady] = React.useState(false);

  console.log(accessToken);


  // const accessToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWIzOTNjYzQtZDgxOS00NDBiLTkwYTEtZjUwYzJkOGMzZDNiIiwiZXhwIjoxNzE4MjQzNTIyfQ.fcFH58xy8-H1Kh7lsl5BASrLDzmdYCG29aGSxyYKQe4";

    const { isLoading: userLoading, data: user, error: userError } = useQuery({
      queryKey: ["fetchUser"],
      queryFn: () => fetchUser(accessToken ?? ""),
      enabled: accessToken !== undefined,
    });
  
    const {isLoading: foldersLoading, data: folders, error: foldersError} = useQuery<Folder[]>({
      queryKey: ["fetchFolders"],
      queryFn: () => fetchFolders(accessToken ?? ""),
      enabled: !userLoading && user !== undefined,
    });
  
  useEffect(() => {
    if(
      !userLoading && !userError && user && 
      !foldersLoading && !foldersError && folders
    ) {
      setFolder(folders[0]);
      setReady(true);
    }
  }, [userLoading, user, userError, foldersLoading, folders, foldersError]);

  const editor = useCreateBlockNote({placeholders: {
    "default": "Type '/' for commands",
  }});

  const pushNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const saveNote = async () => {
    if(accessToken === undefined) return;
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    const markdownNoteBlock = { content: markdown, block_type: BlockType.NOTE };
    const selectedTextBlock = { content: selectedText ?? "", block_type: BlockType.CONTENT };
    sendNote(accessToken, {
      title: title ?? "Untitled: " + new Date().toLocaleString(),
      session_id: "123",
      url: url,
      content: selectedText,
      blocks: [selectedTextBlock, ...noteBlocks, markdownNoteBlock],
      folder_id: folder.id,
      note_type: "ARTICLE",
    })
      .then((response) => {
        if (response) {
          setActionBarActive(false);
          pushNotification("Post saved successfully");
        }
      })
      .catch((error) => {
        console.log(error);
        pushNotification("Unable to save post");
      });
  };

  const getSummary = async (text: string) => {
    try {
      const response = await axios.post(`${SERVICE_URL}/v2/llm/summarize`, 
    { submittedText: text }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
    } catch (error) {
      console.log("Unable to summarize text", error);
    }
  };

  const getExplanation = async (text: string) => {
    try {
      const response = await axios.post(`${SERVICE_URL}/v2/llm/explain`, 
    { submittedText: text }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
    } catch (error) {
      console.log("Unable to explain text", error);
    }
  };

  const summarizeSelection = (editor: BlockNoteEditor) => ({
    title: "Summarize Selection",
    onItemClick: () => {
      if(selectedText) {
        getSummary(selectedText).then((summary) => {
          console.log(summary);
          setNoteBlocks([...noteBlocks, { content: summary, block_type: BlockType.SUMMARY }]);
        });
      }
    },
    aliases: ["summarize"],
    group: "AI",
    subtext: "Summarize the cipped text",
  });

  const explainSelection = (editor: BlockNoteEditor) => ({
    title: "Explain Selection",
    onItemClick: () => {
      if(selectedText) {
        getExplanation(selectedText).then((explaination) => {
          console.log(explaination);
          setNoteBlocks([...noteBlocks, { content: explaination, block_type: BlockType.EXPLANATION }]);
        });
      }
    },
    aliases: ["explain"],
    group: "AI",
    subtext: "Explain the cipped text",
  });

  const optionsToRemove = new Set(["Heading 1", "Heading 2", "Table", "Image"]);

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor).filter(
      (item) => !optionsToRemove.has(item.title),
    ),
    summarizeSelection(editor),
    explainSelection(editor),
  ];

  return (
    <>
      {notification && <div className="notification-bar">{notification}</div>}
      {actionBarActive && (
        <div
          className="app-container"
          onClick={(e) => {
            e.preventDefault();
            if (e.target === e.currentTarget) {
              setActionBarActive(false);
            }
          }}
        >
          <div className="action-bar-container">
            {accessToken && ready && <div className="action-bar">
              {!userLoading && !userError && user && <p className="hello-text">Hello, {user?.full_name}</p>}
              <select>
                {foldersLoading && <option>Loading...</option>}
                {!foldersLoading && !foldersError && folders && folders.map((folder) => {
                  return (
                    <option key={folder.id} value={folder.id} onSelect={() => setFolder(folder)}>{folder.name}</option>
                  );
                })}
                <option>Add New Folder</option>
              </select>
              {selectedText && selectedText.trim().length > 0 && (
                <div className="selected-text-container">
                  <pre>{selectedText}</pre>
                </div>
              )}
              <p className="action-bar-url">{url && parseUrl(url)}</p>
              {noteBlocks.length > 0 && noteBlocks.map((block, index) => {
                  return (
                    <div key={index} className="info-block">
                      <p>{block.content}</p>
                    </div>
                  );
                })}
              <BlockNoteView
                autoFocus={true}
                slashMenu={false}
                editor={editor}
                onKeyDown={(e) => {
                  if (e.metaKey && e.key === "Enter") {
                    console.log("Save post", e.target);
                    saveNote()
                      .then()
                      .catch((error) =>
                        console.log("Failed to save note", error),
                      );
                  }
                }}
              >
                <SuggestionMenuController
                  triggerCharacter={"/"}
                  getItems={async (query) =>
                    filterSuggestionItems(
                      getCustomSlashMenuItems(editor),
                      query,
                    )
                  }
                />
              </BlockNoteView>
            </div>}
            {!accessToken && (<p>Please login in!</p>)}
          </div>
        </div>
      )}
    </>
  );
};

export default ActionBar;
