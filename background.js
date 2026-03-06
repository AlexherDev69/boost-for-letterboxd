chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "search-letterboxd",
    title: 'Search "%s" on Letterboxd',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "search-letterboxd" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText.trim());
    chrome.tabs.create({
      url: `https://letterboxd.com/search/${query}/`,
    });
  }
});
