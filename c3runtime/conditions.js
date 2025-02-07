"use strict";

{
	globalThis.C3.Plugins.Massive_Cube_jsZip.Cnds =
	{
		
		zipIsLoaded()
		{
			return true;
		},
		zipIsFileLoaded()
		{
			return true;
		},
		zipLoadFailed()
		{
			return true;
		},
		supportArraybuffer() {
			return JSZip.support.arraybuffer;
		},
		supportuint8array() {
			return JSZip.support.uint8array;
		},
		supportBlob() {
			return JSZip.support.blob;
		},
		supportnodebuffer() {
			return JSZip.support.nodebuffer;
		},
		supportnodestream() {
			return JSZip.support.nodestream;
		},
		zipisnowbase64() {
			return true;
		}
		
	};
}