const getInformationFromPage = () => {
    const ogTitle = (document.querySelector('meta[property="og:title"]') as HTMLElement)?.innerText;
    const ogDescription = (document.querySelector('meta[property="og:description"]') as HTMLElement)?.innerText;
    const ogAuthor = (document.querySelector('meta[name="author"]') as HTMLElement)?.innerText;
    const ogBanner = (document.querySelector('meta[property="og:image"]') as HTMLElement)?.innerText;
    const title = document.title;

    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return {
        ogTitle, ogDescription, ogAuthor, ogBanner, title, selectedText: text
    }
}

export default getInformationFromPage;
