"use strict";

{
	globalThis.C3.Plugins.Massive_Cube_jsZip.Acts =
	{
		jsloadzipurl(zipurl)
		{
			this.loadFromURL(zipurl);
		},
		jsloadfile(filename,type) {
			this.loadFileFromZip(filename,type);
		},
		jsdeletezip()
		{
			this.zipfile = undefined;
			this.comzip = undefined;
		},
		jscreatezip() {
			this.createZip(this);
		},
		jsaddtexttozip(data,filename) {
			this.addTextToZip(this,data,filename);
		},
		jsaddfolder(folder) {
			this.addFolderToZip(this,folder);
		},
		jsgetdatafromzip(type){
			this.getDataFromZip(this,type);
		}
	};
}
