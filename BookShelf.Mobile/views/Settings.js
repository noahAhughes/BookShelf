BookShelf.Settings = function(params) {

    var getDropboxClient = (function() {
        var client = new Dropbox.Client({ key: "mcugnshv15yrlkz" });
        client.authDriver(new Dropbox.AuthDriver.Cordova());

        var authenticateClient = function(callback) {
            var isPhoneGap = (document.location.protocol === "file:");
            if(!isPhoneGap) {
                callback(false);
            } else {
                client.authenticate({ interactive: false }, function() {
                    if(client.isAuthenticated()) {
                        callback(client);
                    } else {
                        client.authenticate(function() {
                            if(client.isAuthenticated()) {
                                callback(client);
                            } else {
                                callback(false);
                            }
                        });
                    }
                });
            }
        };

        var authenticatedClient;

        return function(callback) {
            if(authenticatedClient !== undefined) {
                callback(authenticatedClient);
            } else {
                authenticateClient(function(client) {
                    authenticatedClient = client;
                    callback(authenticatedClient);
                });
            }
        };
    })();
    
    var booksDataFilename = "BookShelf_Data_v1.json";

    var viewModel = {

        needExport: BookShelf.app.needExport,

        showLoadPanel: ko.observable(false),

        importData: function() {
            DevExpress.ui.dialog.confirm("This action will override all local BookShelf data", "Import Data").done(function(dialogResult) {
                if(!dialogResult)
                    return;

                getDropboxClient(function(client) {
                    if(!client) {
                        DevExpress.ui.dialog.alert("Authentication failed", "Import Failed");
                    } else {
                        viewModel.showLoadPanel(true);

                        client.readFile(booksDataFilename, {}, function(error, data) {
                            viewModel.showLoadPanel(false);

                            if(error) {
                                if(error.status === Dropbox.ApiError.NOT_FOUND) {
                                    DevExpress.ui.dialog.alert("There is no data to import", "Import Failed");
                                } else {
                                    DevExpress.ui.dialog.alert("Something went wrong", "Import Failed");
                                }
                            } else {
                                BookShelf.db.importData(data);

                                BookShelf.app.viewCache.clear();

                                DevExpress.ui.dialog.alert("Data imported", "Import Success");
                            }
                        });
                    }
                });
            });
        },

        exportData: function() {
            DevExpress.ui.dialog.confirm("This action will override all BookShelf data stored in Dropbox", "Export Data").done(function(dialogResult) {
                if(!dialogResult)
                    return;

                getDropboxClient(function(client) {
                    if(!client) {
                        DevExpress.ui.dialog.alert("Authentication failed", "Export Failed");
                    } else {
                        viewModel.showLoadPanel(true);

                        client.writeFile(booksDataFilename, BookShelf.db.exportData(), {}, function(error) {
                            viewModel.showLoadPanel(false);

                            if(error) {
                                DevExpress.ui.dialog.alert("Something went wrong", "Export Failed");
                            } else {
                                DevExpress.ui.dialog.alert("Data exported", "Export Success");
                                BookShelf.db.onExport.fire();
                            }
                        });
                    }
                });
            });
        }

    };

    return viewModel;
};