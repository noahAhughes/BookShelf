
// NOTE object below must be a valid JSON
window.BookShelf = $.extend(true, window.BookShelf, {
  "config": {
    "layoutSet": "navbar",
    "navigation": [
      {
        "title": "Books",
        "onExecute": "#BookList",
        "icon": "bookmark"
      },
      {
        "title": "About",
        "onExecute": "#About",
        "icon": "info"
      }
    ],
    "commandMapping": {
      "ios-header-toolbar": {
        "defaults": {
          "showIcon": false,
          "location": "after"
        },
        "commands": [
          {
            "id": "addBook"
          },
          {
              "id": "saveBook"
          }
        ]
      }
    }
  }
});
