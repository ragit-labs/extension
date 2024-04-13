import savePage from "./scripts/save";
import getInformationFromPage from "./scripts/getInformation";

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    if (command === "toggle-action-bar") {
      console.log("Toggle action bar");
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab = tabs[0];
        if (tab.id !== undefined) {
          browser.scripting
            .executeScript({
              target: { tabId: tab.id },
              func: getInformationFromPage,
              args: [],
            })
            .then((info) => {
              if (tab.id) {
                browser.tabs.sendMessage(tab.id, {
                  action: "toggleActionBar",
                  data: { ...info[0].result, url: tab.url },
                });
              }
            });
        }
      });
    }
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "arkivePage",
      title: "Arkive It",
      contexts: ["all"],
    });
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "arkivePage") {
      browser.cookies
        .get({ url: "https://app.arkive.site", name: "accessToken" })
        .then((cookie) => {
          if (cookie?.value) {
            if (tab !== undefined && tab.id !== undefined) {
              browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: savePage,
                args: [tab.url, cookie?.value],
              });
            }
          } else {
            if (tab !== undefined && tab.id !== undefined) {
              browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: loginPopup,
                args: [],
              });
            }
          }
        });
    }
  });

  browser.action.onClicked.addListener(() => {
    browser.tabs.create({ url: browser.runtime.getURL("/popup.html") });
  });

  browser.runtime.onMessage.addListener(
    (message, sender, sendResponse: (args: any) => void) => {
      if (message.action === "getTab") {
        browser.tabs
          .query({ currentWindow: true, active: true })
          .then((tabs) => {
            const tab = tabs[0];
            sendResponse(tab);
          });
      }
      return true;
    },
  );
});

function loginPopup() {
  const popup = document.createElement("div");
  popup.textContent = "Please Login to ArkiveIt. Click on extension icon.";
  popup.style.position = "fixed";
  popup.style.top = "10px";
  popup.style.right = "10px";
  popup.style.padding = "10px";
  popup.style.backgroundColor = "yellow";
  popup.style.color = "#000";
  popup.style.zIndex = "10000";
  document.body.appendChild(popup);
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 3000);
}
