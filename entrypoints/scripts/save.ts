const savePage = (url: string, accessToken: string, title?: string, tags?: string[]) => {
    const pageContent = document.body.innerText;
    const SERVICE_URI = "https://api.arkive.site";
    const popup = document.createElement("div");
    popup.textContent = "Saving Page";
    popup.style.position = "fixed";
    popup.style.top = "10px";
    popup.style.right = "10px";
    popup.style.padding = "10px";
    popup.style.backgroundColor = "yellow";
    popup.style.color = "#000";
    popup.style.zIndex = "10000";
    document.body.appendChild(popup);
  
    fetch(`${SERVICE_URI}/save`, {
      method: "POST",
      body: JSON.stringify({ url: url, raw_data: pageContent, title: title, tags: tags }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        if (response.status === 201) {
          popup.style.backgroundColor = "blue";
          popup.style.color = "#fff";
          popup.textContent = "Page saved";
          setTimeout(() => {
            document.body.removeChild(popup);
          }, 2000);
        } else {
          popup.style.backgroundColor = "red";
          popup.style.color = "#fff";
          popup.textContent = "Unable to save page";
          setTimeout(() => {
            document.body.removeChild(popup);
          }, 2000);
        }
      });
    });
  };

export default savePage;