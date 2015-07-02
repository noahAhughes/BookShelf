
// NOTE object below must be a valid JSON
window.BookShelf = $.extend(true, window.BookShelf, {
  "config": {
    "layoutSet": "navbar",
    "navigation": [
      {
        "title": "To Read",
        "onExecute": "#LaterList",
        "icon": "bookmark"
      },
      {
        "title": "Finished",
        "onExecute": "#FinishedList",
        "icon": "bookmark"
      },
      {
        "title": "Settings",
        "onExecute": "#Settings",
        "icon": "preferences"
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
            "id": "filterBooks"
          },
          {
            "id": "applyFilter"
          },
          {
            "id": "addBook"
          },
          {
            "id": "saveBook"
          },
          {
            "id": "editBook"
          },
          {
            "id": "addTag"
          },
          {
            "id": "saveTag"
          }
        ]
      }
    }
  }
});
