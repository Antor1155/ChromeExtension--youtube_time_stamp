import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div")
    const newBookmarkElement = document.createElement("div")
    const controlsElement = document.createElement("div")

    bookmarkTitleElement.textContent = bookmark.desc
    bookmarkTitleElement.className = "bookmark-title"

    controlsElement.className = "bookmark-controls"

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark"
    newBookmarkElement.setAttribute("timestamp", bookmark.time)

    setBookmarkAttributes("play", onPlay, controlsElement)

    newBookmarkElement.appendChild(bookmarkTitleElement)
    newBookmarkElement.appendChild(controlsElement)
    bookmarksElement.appendChild(newBookmarkElement)



};

const viewBookmarks = (currentBookmars = []) => {
    const bookmarksElement = document.getElementById("bookmarks")
    bookmarksElement.innerHTML = "";
    if (currentBookmars.length > 0){
        for (let i = 0; i < currentBookmars.length; i++){
            const  bookmark = currentBookmars[i]
            addNewBookmark(bookmarksElement, bookmark)
        }
    } else {
        bookmarksElement.innerHTML = "<i class='row'> No bookmarks to show </i>"
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");

    const activeTab = await getActiveTabURL()

    chrome.tabs.sendMessage(activeTab.id, {
        type : "PLAY",
        value : bookmarkTime
    })

};

const onDelete = e => {};


const setBookmarkAttributes =  (src, eventListenerFunc, controlParentElement) => {
    const controlElement = document.createElement("img")

    controlElement.src = "assets/" + src + ".png"
    controlElement.title = src

    controlElement.addEventListener("click", eventListenerFunc)

    controlParentElement.appendChild(controlElement)
};


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const queryParameter = activeTab.url.split("?")[1]

    const urlParameters = new URLSearchParams(queryParameter)

    const currentVideo = urlParameters.get("v")

    if (activeTab.url.includes("youtube.com/watch") && currentVideo){

        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            //viewBookmarks
            viewBookmarks(currentVideoBookmarks);
            console.log(currentVideoBookmarks)


        })
    } else {
        const container = document.getElementsByClassName("container")[0]
        container.innerHTML = '<div class = "title"> This is not a video page of youtube ! </div>'
    }



});
