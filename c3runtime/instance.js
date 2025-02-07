"use strict";

{
    globalThis.C3.Plugins.Massive_Cube_jsZip.Instance = class jsZipInstance extends globalThis.ISDKInstanceBase {
        constructor() {
            super();

            const properties = this._getInitProperties();

            this.zipfile = undefined;
            this.getResults = "teest";

            this.comzip = undefined;
            this.retdata = "";

            if (properties) {

            }

            this.createZip = function (_this) {
                _this.getResults = new JSZip();
            }

            this.addTextToZip = function (_this, _data, _filename) {
                if (typeof _this.getResults != "undefined") {
                    _this.getResults.file(_filename, _data);
                }
            }

            this.addFolderToZip = function (_this, _foldername) {
                if (typeof _this.getResults != "undefined") {
                    _this.getResults.folder(_foldername);
                }
            }

            this.getDataFromZip = function (_this, _type) {
                var ty = "base64";
                switch (_type) {
                    case 1:
                        ty = "binary";
                        break;
                }
                _this.getResults.generateAsync({ type: ty }).then(function (b64) {
                    _this.retdata = b64;
                    _this._trigger(globalThis.C3.Plugins.Massive_Cube_jsZip.Cnds.zipisnowbase64);
                });
            }

            this.getZipAsBase64 = function (_this) {
                console.log(_this.retdata);
                return _this.retdata;
            }

            this.loadFromURL = function (url) {
                JSZipUtils.getBinaryContent(url, this.loadGetBinaryContent, this);
            }

            this.loadGetBinaryContent = function (err, data, _this) {
                if (err) {
                    _this._trigger(globalThis.C3.Plugins.Massive_Cube_jsZip.Cnds.zipLoadFailed);
                    //throw err;
                } else {
                    var prom = JSZip.loadAsync(data).then(_this.loadFlAsync.bind(null, _this));
                }
            }

            this.loadFlAsync = function (_this, zip) {
                _this.zipfile = zip;
                _this._trigger(globalThis.C3.Plugins.Massive_Cube_jsZip.Cnds.zipIsLoaded);
                //zip.file("Hello.txt").async("string").then(_this.getResultFromFile.bind(null,_this));
            }

            this.loadFileFromZip = function (filename, type) {
                let tpy = "binarystring";
                switch (type) {
                    case 0:
                        tpy = "base64";
                        break;
                    case 2:
                        tpy = "uint8array";
                        break;
                    case 3:
                        tpy = "blob";
                        break;
                    case 4:
                        tpy = "arraybuffer";
                        break;
                    case 5:
                        tpy = "array";
                        break;
                    case 6:
                        tpy = "nodebuffer";
                        break;
                }

                this.zipfile.file(filename).async(tpy).then(this.getResultFromFile.bind(null, this));
            }

            this.getResultFromFile = function (_this, result) {
                _this.getResults = result;
                _this._trigger(globalThis.C3.Plugins.Massive_Cube_jsZip.Cnds.zipIsFileLoaded);
            }


        }

        _release() {
            super._release();
        }

        _saveToJson() {
            return {
                // data to be saved for savegames
            };
        }

        _loadFromJson(o) {
            // load state for savegames
        }
    };
}