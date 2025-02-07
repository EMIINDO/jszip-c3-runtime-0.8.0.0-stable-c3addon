"use strict"; 
 // Porting BY EMI INDO with c3addon-ide-plus

{
	////////////////////////////////////////////
	// El plugin ID es como Construct identifica los diferentes tipos de plugins.
	// *** NUNCA CAMBIE EL PLUGIN ID UNA VEZ CREADO EL PLUGIN! ***
	// Si Cambias el ID despues de lanzar el plugin, 
	// Construct pensará que es un plugin completamente diferente
	// y asume que es incompatible con el antiguo,
	// y ROMPERAS TODOS LOS PROYECTOS QUE USEN EL PLUGIN.
	// tan solo el nombre del plugin es mostrado en el editor,
	// por lo tanto para renombrar tu plugin cambia el nombre pero NO el ID.
	// Si desea reemplazar por completo un plugin, hágalo obsoleto 
	// se ocultará pero los proyectos antiguos seguiran funcionando),
	// y crea un plugin completamente nuevo con un plugin ID diferente.
		
	////////////////////////////////////////////
	const PLUGIN_ID = "Massive_Cube_jsZip";
	////////////////////////////////////////////
	
	// callMap Deprecated const PLUGIN_VERSION = "0.8.0.0";
	const PLUGIN_CATEGORY = "general";
	
	// Esto es la devolucion de la llamada pasada a AddDragDropFileImportHandler().
	// Tenga en cuenta que es una funcion asincrona y
	// debe devolver un 'true' si reconoce y puede manejar los datos, sino 'false'.
	
	async function HandleDataInMyFormat(droppedFileName, zipFile, opts)
	{
		// Busca una entrada data.json en el archivo zip. si falta,
		// devuelve falso para indicar que este formato
		// no es reconocido por este handler. (controlador)
		
		const entry = zipFile.GetEntry("data.json");
		if (!entry)
			return false;
		
		// Lee la entrada de data.json desde el archivo zip en formato JSON.
		// es razonable tener algun tipo de indicador(bandera-flag) en el JSON
		// para identificar claramente el formato especifico que queremos leer
		// en este handler (controlador), para que no nos confundamos 
		// con nigun otro formato de datos que pueda implicar tambien un archivo 
		// llamado data.json en un zip. 
		// Entonces si la clave "is-my-custom-format" falta en el JSON, devuelve false.
		
		const json = await zipFile.ReadJson(entry);
		if (!json["is-my-custom-format"])
			return false;	// data.json no parece estar en el formato correcto
		
		// Iterar cada entrada en el array de "sprites" e importarlas en paralelo.
		
		const promises = [];
		
		for (const spriteData of json["sprites"])
		{
			promises.push(ImportSpriteData(zipFile, opts, spriteData));
		}
		
		// Esperar a que termine cada importacion de sprites.
		
		await Promise.all(promises);
		
		// devuelve true para indicar que los datos fueron reconocidos e importados.
		
		return true;
	}
	
	// Esta funcion es llamada para cada entrada en el array "sprites" en el data.json.
	// Importa una sola entrada de sprite. Tenga en cuenta que es asincrono 
	// y se ejecuta en paralelo a todas las demas importaciones.
	
	async function ImportSpriteData(zipFile, opts, spriteData)
	{
		// Lee los detalles basicos acerca de la localizacion 
		// del drop y el proyecto relevante.
		
		const layoutView = opts.layoutView;
		const project = layoutView.GetProject();
		const layoutX = opts.layoutX;
		const layoutY = opts.layoutY;
		
		// Lee los datos de entrada del sprite desde el JSON.
		const filename = spriteData["file"];
		const x = layoutX + spriteData["offsetX"];
		const y = layoutY + spriteData["offsetY"];
		const width = spriteData["width"];
		const height = spriteData["height"];
		const angle = spriteData["angle"] * (Math.PI / 180);	// convierte a radianes
		
		// Busca el nombre de archivo dado en el archivo zip.
		const imageEntry = zipFile.GetEntry(filename);
		if (!imageEntry)
			return;				// El nombre de archivo referenciado falta en el zip
		
		// Si el archivo existe, lee el archivo de imagen referenciado como un Blob(gota).
		const imageBlob = await zipFile.ReadBlob(imageEntry);
		
		// Crea un nuevo tipo de objeto sprite. 
		// Usa el nombre del archivo de la imagen sin extension
		// como el nombre del tipo de objeto 
		// (pero tenga en cuenta que Construct podria camabiarle el nombre si ya esta en uso).
		const name = filename.split(".")[0];
		const objectType = await project.CreateObjectType("Sprite", name);
		
		// Obtiene el primer cuadro de animacion en el nuevo tipo de objeto.
		const animations = objectType.GetAnimations();
		const firstAnim = animations[0];
		const frames = firstAnim.GetFrames();
		const firstFrame = frames[0];
		
		// Reemplaza el contenido de este frame(marco) con el blob del archivo de imagen.
		await firstFrame.ReplaceBlobAndDecode(imageBlob);
		
		// Ahora crea una instancia de sprite para este tipo de objeto en el layout.
		// Establece el tamaño (size) y el angulo (angle) desde
		// los datos JSON, y lo posiciona relativo a la posicion drop en el layout.
		const wi = objectType.CreateWorldInstance(layoutView.GetActiveLayer());
		wi.SetXY(x, y);
		wi.SetSize(width, height);
		wi.SetAngle(angle);
	}
	
	const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins.Massive_Cube_jsZip = class jsZipPlugin extends SDK.IPluginBase
	{
		constructor()
		{
			super(PLUGIN_ID);
			
			SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
			
			this._info.SetName(globalThis.lang(".name"));
			this._info.SetDescription(globalThis.lang(".description"));
			// callMap Deprecated this._info.SetVersion(PLUGIN_VERSION);
			this._info.SetCategory(PLUGIN_CATEGORY);
			this._info.SetAuthor("Massive_Cube");
			this._info.SetHelpUrl(globalThis.lang(".help-url"));
            this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
			this._info.SetIsSingleGlobal(true);
			//PNGthis._info.SetIcon("icon.png", "image/png");
			
			// Admite los tiempos de ejecucion (runtimes) de C2 y C3
			this._info.SetSupportedRuntimes(["c3"]);
			
			SDK.Lang.PushContext(".properties");
			
			this._info.SetProperties([

			]);
			
			this._info.AddFileDependency({
				filename: "c3runtime/jszip-utils.js",
				type: "inline-script"
			});

			this._info.AddFileDependency({
				filename: "c3runtime/jszip.js",
				type: "inline-script"
			});	
			

			SDK.Lang.PopContext();		// .propiedades
			
			SDK.Lang.PopContext();
			
			// Este es el principal punto de entrada para el Custom Importer API.
			// Esto registra una devolucion de llamada para manejar
			// archivos que se arrastran y se sueltan 
			// en la ventana de Construct 3 y que nada mas reconoce.
			SDK.UI.Util.AddDragDropFileImportHandler(HandleDataInMyFormat, {
				isZipFormat: true,		// segundo parametro de llamada sera IZipFile
				toLayoutView: true		// tercer parametro de llamada tendra
										// informacion relacionada con el layout
										// (vista de diseño)
			});
		}
	};
	
	PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}