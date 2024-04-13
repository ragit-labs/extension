import { useEffect, useState } from "react";
import "./App.css";
import WEBAPP_URL from "../constants";
import homeIcon from "./Vector.svg";
import googleLogin from "./GoogleLogin.svg";
import { useQuery } from "@tanstack/react-query";
import enterIcon from "./enter-icon.svg";
import { Tabs } from "wxt/browser";
import savePage from "../scripts/save";
import { fetchUser, fetchTags } from "../utils";


function App() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<any>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<Tabs.Tab | undefined>(undefined);

  const { isLoading: userLoading, data: user } = useQuery({
    queryKey: ["fetchUser"],
    queryFn: () => fetchUser(accessToken ?? ""),
    enabled: accessToken !== undefined,
  });

  const {isLoading: tagsLoading, data: tagsData} = useQuery({
    queryKey: ["fetchTags"],
    queryFn: () => fetchTags(accessToken ?? ""),
    enabled: accessToken !== undefined,
  });

  useEffect(() => {
    if(!tagsLoading && tagsData) setTags(tagsData.map((tag) => tag.id));
  }, [tagsData, tagsLoading]);

  useEffect(() => {
    if (user) {
      browser.runtime.sendMessage({ action: "getTab" }).then((tab) => {
        setCurrentTab(tab);
        setTitle(tab.title);
      });
    }
  }, [userLoading, user]);

  useEffect(() => {
    browser.cookies
      .get({ url: WEBAPP_URL, name: "accessToken" })
      .then((cookie) => {
        setAccessToken(cookie?.value);
      });
  }, [browser, accessToken]);

  const openLoginPage = () => {
    window.open(`${WEBAPP_URL}/login`, "_blank");
  };

  const openDashboard = () => {
    window.open(`${WEBAPP_URL}`, "_blank");
  };

  const saveCurrentPage = () => {
    browser.scripting.executeScript({
      target: { tabId: currentTab?.id ?? -1 },
      func: savePage,
      args: [currentTab?.url, accessToken],
    }).then(() => {
      window.close();
    });
  };

  return (
    <div className="extension-popup">
      <div className="header" onClick={() => openDashboard()}>
        <img src={homeIcon} className="home-icon" alt="home-icon" />
        <p className="header-text">Open lightcone</p>
      </div>
      {!userLoading && !user ? (
        <div className="login-container">
          <p className="login-header">Your Super Smart Knowledge Hub</p>
          <img
            src={googleLogin}
            className="login-button"
            style={{ cursor: "pointer" }}
            onClick={() => openLoginPage()}
          />
        </div>
      ) : (
        <div className="home-container">
          <p className="title-header">Title</p>
          <textarea
            className="title-input"
            placeholder="Enter title here"
            value={title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
          ></textarea>
          <input
            className="tag-input"
            value={searchTerm}
            style={{
              paddingRight: "2rem",
              background: `url(${enterIcon}) no-repeat scroll center right 1rem`,
            }}
            onFocus={(e) => {
              e.target.value = "";
              setSearchTerm(e.target.value);
              setShowTags(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowTags(false), 100);
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="add tag"
          />
          {showTags && (
            <div className="tags-container">
              {tags
                .sort((a, b) => a.localeCompare(b))
                .filter((tag) =>
                  tag.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .slice(0, 4)
                .map((tag) => {
                  return <div onClick={() => {(setTag(tag)), setSearchTerm(tag)}} className="tag">{tag}</div>;
                })}
            </div>
          )}
          <div className="save-button" onClick={() => saveCurrentPage()}>
            Save this page
          </div>
        </div>
      )}
      <p>{}</p>
    </div>
  );
}

export default App;
