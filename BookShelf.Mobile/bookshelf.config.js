
// NOTE object below must be a valid JSON
window.BookShelf = $.extend(true, window.BookShelf, {
    "config": {
        "layoutSet": "navbar",
        "navigation": [
          {
              "title": "Reading",
              "onExecute": "#ReadingList",
              "icon": "bookmark"
          },
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
              "title": "All",
              "onExecute": "#AllList",
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
                  },
                  {
                      "id": "editBook"
                  }
                ]
            }
        }
    }
});
