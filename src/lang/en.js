//Tool tips:
var tip_marker = "Draw point";
var tip_polyline = "Draw polyline";
var tip_polygon = "Draw polygon";
var tip_drive = "Draw along road";
var tip_editmode = "Edit drawing";
var tip_undo = "Undo last action";
var tip_trash = "Delete all objects";
var tip_btnErgaleia = "Tools";
var tip_btnAnazitisi = "Search";
var tip_btnLayers = "Layers";
var tip_btnMaps = "Available maps";
var tip_btnTables = "Tables";
var tip_btnSave = "Save map";

//Messages:
var msg_searchPrompt = "Insert address...";
var msg_errNoLicence = "You must be licensed to do that!";
var msg_errAddressNotFound = " not found";
var msg_errWrongKML = "The requested KML has errors";
var msg_errFeatureNotImplemented = "Coming soon!";



var msg_reg_step1 = "Registering opens up a world of possibilities!";
var msg_reg_step2 = "One step away from creating your profile!";
var msg_reg_successful = "Registration successful!";
var msg_reg_error = "Registration failed. Review the error message and go back to correct it";

//Titles;
var strings=namespace("AVMap.titles");
strings.AppManager = {
	grid_AppLogo: "Logo",
	grid_AppName: "Name",
	grid_AppOwner: "Creator",
	grid_AppPrefix: "Identifier",
	grid_AppWelcome: "Welcome text",
	grid_AppURLS: "No. of URLs",
	grid_AppMAPS: "No. of Maps",
	grid_AppLogo1: "Additional logo",
	grid_AppLogo2: "Additional 2nd logo",
	grid_selectBox: "Click to select/unselect",
	grid_Style_Name: "Name",
	grid_Style_IsActive: "Active",
	grid_Style_Published: "Published",
	grid_Style_Preview: "Preview",
	err_notAuthorized: "You are not authorized to edit this application",
	logo_selected: "You can see a preview by going back to the appication",
	logo_updated: "Logo was saved",
	settings_updated: "Settings updated.",
	appSetings_Label: "Settings for application",
	usergrid_UserID: "ID",
	usergrid_UserFirstName: "First Name",
	usergrid_UserLastName: "Last Name",
	usergrid_UserEmail: "Email",
	usergrid_Username: "Username",
	urlgrid_URL: "Address",
	amenu_Apps_Manager_ActionNew: "New",
	amenu_Apps_Manager_ActionEdit: "Edit",
	amenu_Apps_Manager_ActionStyle: "Style",
	amenu_Apps_Manager_ActionDelete: "Delete",
	amenu_Apps_Config_ActionSave: "Save",
	amenu_Apps_Config_ActionCancel:"Cancel",
	amenu_Maps_Manager_ActionNew: "New",
	amenu_Maps_Manager_ActionEdit: "Edit",
	amenu_Maps_Manager_ActionDelete: "Delete",
	addAlias_WindowTitle: "Add new URL",
	addAlias_err_InvalidUrl: "Invalid form of url",
	addAlias_err_PlatformRejected: "This address is currently in use",
	addAlias_err_MyGISRejected: "This address is currently in use by another application",
	addAlias_err_PortNumber: "1-65535",
	addAlias_operationSuccess: "Added address",
	deleteAlias_err_NotAll: "You cannot remove all addresses without deleting the application",
	deleteAlias_err_YouSure: "delete ({0}) addresses. Are you sure?",
	urls_updated: "Removed addresses",
	addApp_WindowTitle: "Adding new application",
	addApp_err_NotFilled: "You have to fill in a name",
	addApp_err_InvalidName: "There are invalid symbols in the name",
	addApp_msg_Success: "The application was created. Click to set it up.",
	msg_NotifyUnsaved: "Save your changes",
	window_NewStyle: "Create new style",
	window_EditStyle: "Edit στυλ",
	window_StyleManager: "Style Manager",
	addStyle_NewStyleName: "New style",
	addStyle_CopySuffix: " - Copy ",
	upmenu_ProfileInfo_Save:"Save changes",
	upmenu_ProfileInfo_SaveSuccess:"Your changes were saved",
	upmenu_ProfileInfo_Cancel: "Cancel changes",
	upmenu_ProfileInfo_CancelSuccess: "Your changes were cancelled"
};
strings.MapManager = {
	loadWindowTitle: "Link map",
	err_notEnoughSelected: "You must select at least ({0}) maps!",
	mapOwnershipType1: "My creation",
	mapOwnershipType2: "Buy ({0})",
	mapOwnershipType3: "My creation",
	mapOwnershipType4: "Subscription ({0})",
	mapOwnershipType5: "Buy (Free)",
	mapCheckAllTitle: "Select all",
	mapUncheckAllTitle: "Unselect all",
	mapSettingsLabel: "Settings for the map",
	addMap_err_NotFilled:"You have to fill in a name",
	addMap_err_InvalidName: "There are invalid symbols in the name",
	addMap_msg_Success: "The map was created. Click to set it up.",
	addMap_windowTitle: "Define new map",
	window_NewQS: "Mew quick filter",
	window_EditQS: "Edit filter",
	window_QSManager: "Filter manager",
	window_LayerManager: "Layer manager",
	window_NewMacro: "New macro",
	window_EditMacro: "Edit macro",
	window_MacroManager: "Macro manager",
	settings_updated: "Settings updated.",
	qsGrid_colWindowName: "Title",
	qsGrid_colLayerName: "Layer",
	qsGrid_colFieldName: "Field",
	qsNew_err_NoLayer: "You must select a layer!",
	qsNew_err_NoField: "You must select a field!",
	qsNew_err_NoTitle: "You must fill in a title!",
	qsNew_msg_Success: "The filter was saved.",
	macroGrid_colID: "ID",
	macroGrid_colName: "Name",
	macroGrid_colApp: "Application",
	macroGrid_colBtn: "Button",
	macroGrid_colRegister: "For logged-in",
	macroTip_name: "The macro's name. If it is a button, it will be used as the button's text.",
	macroTip_jselector: "A JQuery selector for the button's container. Example: #middlePane",
	macroTip_button: "If the macro will be used as button. Else, it can be called as mygis.Macros.XXX where ΧΧΧ is the given name.",
	macroTip_registered: "If the macro is available only when the user has logged in.",
	macroTip_app: "The application where this macro will be available",
	macroPopup_window: "Popup wizard"
};
strings.UserManager={
	amenu_Users_Manager_ActionNew: "New",
	amenu_Users_Manager_ActionEdit: "Edit",
	amenu_Users_Manager_ActionDelete: "Delete",
	col_userLastname: "Surname",
	col_userFirstname: "Name",
	col_userName: "Username",
	col_userEmail: "Email",
	col_userID: "User ID",
	deleteConfirmation: "delete {0} user(s). Are you sure?",
	userDeletedFeedback: "User(s) deleted",
	usersNotDeleted: "There was an error: "
};
strings.Editing = {
	loseChanges: "Lose all unsaved changes",
	deleteObject: "Delete selected object",
	noEditingForDigi: "<p>digitize, but you haven't setup a layer as editable.</p><p>Would you like to digitize in a new layer?</p>",
	tempNewObj: "New object temporarily added to layer ",
	newObjTitle: "New item",
	noEditingForce: "You must set a layer to editable first",
	wrongLayerType: "The layer you selected has been declared to contain only objects of type: ",
	btnAttachImage: "Attach image",
	btnAttachFile: "Attach file",
	gridFile_colThumb: "Image",
	gridFile_colName: "Name",
	gridFile_colActions: "Actions",
	btnImage_download: "Download",
	btnImage_fullZoom: "View",
	trueValue: "Yes",
	falseValue: "No",
	clickToEdit:"Click to edit",
	pleaseSelect:"Select a value",
	addImage: "Add an image",
	addFile: "Add a file",
	saveNewObjQuestion:"Save the new object",
	loseAllChanges: "Lose all changes, because there are errors in fields. YOUR OBJECT WILL NOT BE SAVED.",
	temporaryError: "Temporary error. Please try again."
};
strings.Registration={
	infoTitle: 'Join us...it\'s free!'
};
strings.Login={
	infoTitle: 'Login',
	notLoggedIn: 'You aren\'t logged in',
	welcomeTo: "Welcome to "
};
strings.MapRMenu={
	zoomin: 'Zoom in here ',
	zoomout: 'Zoom out from here',
	center: 'Center here'
};
strings.ObjRMenu={
	rename: 'Rename',
	edit: 'Toggle editing',
	deleteMe: 'Delete',
	styleMe: 'Change style',
	zoomin: 'Zoom in',
	zoomout: 'Zoom out',
	fitBounds: 'Zoom here'
};
strings.MediaManager={
	windowTitle: 'Media Manager',
	filetype_Image: 'Image',
	filetype_Document: 'Document',
	filetype_Other: 'Other',
	span_outOf: 'out of',
	btnAttachNew: 'Attach a new file',
	mm_err_noSpace: 'Not enough user space. Try deleting some files first.',
	mm_err_invalidUser: 'Not authorized user for this operation',
	mm_err_unknown: 'Unknown error',
	mm_err_notEnoughSelected: 'You have to select {0} items',
	btnSelectAll: 'Select all',
	btnUnselectAll: 'Unselect all',
	btnAttachFile: 'Upload new file',
	btnAttachComplete: 'Done'
};
strings.MapControl={
	gotoLayer: 'Click to see the layers',
	currentMap: 'Default map',
	loadingMap: 'Loading map:',
	loadMapTooltip: 'Load map',
	loadingMapLayer: 'layers',
	info_switch_backgrounds: 'Switching background layer due to zoom level',
	col_mapName: 'Name',
	col_mapDescr: 'Description',
	col_mapLCount: 'Layers',
	col_mapDefault: 'Initial',
	col_mapCreate: 'Created on',
	col_mapUpdate: 'Updated on',
	col_mapDeveloped: 'Developed by',
	col_mapOwner: 'Owner',
	col_mapIsPublic: 'Public Map',
	col_mapAmOwner: 'Ownership',
	col_mapAmCreator: 'Created by me',
	col_mapAmSubsciber: 'Subsciber',
	col_mapOwnership: 'Ownership type',
	loadMapConfirm: 'Load a new map. Are you sure?'
};
strings.MapTools= {
	mode_TopSelect: "Selects object only from the top level",
	mode_InfoSelect: "Show list of results",
	mode_InfoStore:"Save selection in 'My searches'",
	mode_AddSelect: "Add to existing selection",
	mode_SubtractSelect: "Remove from existing selection",
	editModeCopy: "Copy selection",
	editModePaste:"Paste selection",
	editModeDelete: "Delete selected objects",
	editModeDrag: "Move selected object",
	editModeRotate: "Rotate selected object",
	editModeResize: "Resize selected object",
	editModeReshape: "Reshape selected object",
	mode_EditableInfo: "Insert data while digitizing",
	mode_Grouping: "Digitize multiple shapes for the same object",
	mode_Snap: "Use snapping while digitizing",
	dragPanBtn: "Pan map",
	zoomBoxBtn: "Zoom in (Hold down the left mouse button to select the area of interest)",
	zoomOutBtn: "Zoom out",
	toggleInfoBtn: "'What is under here?' tool",
	selectObject: "Point selection",
	selectRect: "Area selection",
	infoTool: "Information",
	selectCircle: "Cyclic area selection",	//JK CHANGES
	selectClear: "Clear selection",
	markerButton: "Point digitizing",
	polylineButton: "Line digitizing",
	polygonButton: "Polygon digitizing",
	rectangleButton:"Rectangle digitizing",
	mapActionsBtn: "Show/hide map tools",
	infoToolExplain:"Select the first from:",
	otherToolExplain:"Select from:",
	showSearchesBtn: "Show previous searches",
	hideSearchesBtn: "Hide previous searches"
};
strings.LayerControl={
	noObjectTitle:"Object ",
	tipEdit: "Double click on an object to edit its name",
	moveUp: "Move up",
	moveDown: "Move down",
	gotoTable: "Click to see the object table",
	treeNodeData: "Data layers",
	treeNodeBackground: "Background layers",
	invalidReorder: "Invalid value. Must be 1 to ",
	columnIcon: "Icon",
	columnVisible: "Visible",
	columnEditable: "Editable",
	columnSelectable: "Selectable",
	columnLocked: "Locked",
	columnName: "Name",
	columnType: "Layers",
	columnProperties: "Actions",
	columnCycle: "Cycle through backgrounds",
	typeData: "data",
	typeBackground: "backgrounds",
	propertiesNotForBG: "There are no available actions for background layers",
	visibleRangeNotFilled: "This is not a valid value",
	labelBackground: "Background ",
	saveChanges: "Save changes",
	newLayerWindowTitle: "New Layer",
	layergrid_colName: "Name",
	layergrid_colDescription: "Description",
	layergrid_colTable: "Linked data",
	layergrid_colGeom: "Geographic type",
	layergrid_colPoints: "Points",
	layergrid_colLines: "Lines",
	layergrid_colPolygons: "Polygons",
	layergrid_colTableApp: "Origin application",
	layergrid_colFolder: "Group name",
	err_notEnoughSelected: "You must select at least ({0}) layers!",
	tip_ChangeBG: 'See how you can change backgrounds by clicking <a href="#" class="notifyAction" onclick="router(\'wizard_ChangeBG\',this);return false;">here</a>',
	tip_ChangeBG_cb: "Click here!",
	noFolderName: "Map data"
	
};
strings.Export={
	defaultDocumentTitle: "Digitized KML file",
	defaultDocumentDescription: "Source: http://www.MyGIS.gr",
	saveAsWindowTitle: "Save as"
};
strings.Info={
	windowTitle: "Info",
	windowTitleQuery: "Results of search",
	section1: "INFORMATION",
	section2: "IMAGES",
	section3: "FILES",
	section4: "Links",
	showAll: "Show all",
	infoAt: "What's at ",
	btnSelectAll: "Select all",
	btnSelectNone: "Unselect all",
	mapSelectionQText: "Map select at ",
	mapSelectionDefaultQText: "Last map selection",
	err_AtLeastOne: "You must select at least one record!",
	emptyPreview: "You haven't selected a file to preview!",
	infoWindowSubPart1:'in layer "',
	infoWindowSubPart2:'"',
	selectDeselect: "Hold CTRL pressed for multiple selection/deselection",
	infoImagesBtn: "Show all pictures",
	noResults: "No results found"
};
strings.Grid={
	groupsheaderstring: "Drag a column and drop it here to group by that column",
	sortascendingstring: "Sort Ascending",
	sortdescendingstring: "Sort Descending",
	sortremovestring: "Remove Sort",
	groupbystring: "Group By this column",
	groupremovestring: "Remove from groups"	
};
strings.QBuilder={
	windowTitle: "Create a query",
	windowClose: "HIDE",
	keywordSELECT: "SHOW",
	keywordALL: "ALL",
	keywordFROM: "FROM",
	keywordWHERE: "WHERE",
	keywordALSO: "ALSO",
	keywordNULL: "{NULL}",
	panelTitle: "Also for",
	feed_SearchSuccess:"Successful search ",
	runQuery: "Run",
	deleteQuery: "Delete query",
	friendlyNameDef: "Search at ",
	runQueryConfirm: 'run a previously saved query.',
	statsTitle: 'Statistical analysis of results',
	datatypeText: "Text",
	datatypeNumeric: "Numeric",
	statSum: "Sum",
	statMin: "Minimum",
	statMax: "Maximum",
	statAvg: "Average",
	statCount: "Total distinct",
	statResultIn: "from",
	statsFieldNameBefore: "For field",
	statsFieldNameAfter: "found in"
};
strings.BackgroundLayers={
	mygis_cachedICEDS: "Satellite Landsat 5",
	mygis_cachedICEDS_attrib: "University College London",
	ktimatologio: "Airphotos ktimatologio",
	ktimatologio_attrib: "Ktimatologio S.A.",
	opengeo_BLUEMARBLE: "Satellite BlueMarble",
	opengeo_BLUEMARBLE_attrib: "OpenGeo.org",
	opengeo_OSM: "Open Street Maps",
	opengeo_OSM_attrib:"OpenGeo.org",
	nasa_LANDSAT: "Satellite Landsat 7",
	nasa_LANDSAT_attrib: "NASA Jet Propulsion Laboratory",
	
	nasa_name: "Satellite NASA",
	nasa_attribution: "NASA",
	landsat_name: "Satellite Landsat 5",
	landsat_attribution: "University College London",
	ktimatologio_name: "Airphotos ktimatologio",
	ktimatologio_attribution: "Ktimatologio S.A.",
	google_hybrid: "Hybrid map",
	google_satellite: "Satellite map",
	google_roadmap: "Road map",
	google_terrain: "Terrain map"
};
strings.ConfirmBox={
	buttonConfirm: "Confirm",
	buttonCancel: "Cancel",
	msg_qb_resetcrit: 'clear search criteria',
	msg_lc_removemap: 'remove a layer from the map'
};
strings.QuickJump={
	placeholder: "Find a map location"
};
strings.Coding={
	badAttribution: 'geodata of Chios',
	noBackground: 'No background',
	loadingStep1: 'Loading styles',
	loadingStep2: 'Loading available maps',
	loadingStep3: 'Loading available layers',
	loadingStep4: 'Loading map',
	loadingStep5: 'Initializing tools',
	seconds: " seconds",
	promptThemeChoose: "- Choose theme -"
};
strings.HelpSystem={
	startHereTitle: "Map",
	manual: "Start here",
	mapResults: "Click here to see the database as you navigate the map"
};
strings.UserProfile={
	updateSuccess: "Successful profile update"
};
strings.Printing={
	statsWindowTitle: "STATISTICAL ANALYSIS OF RESULTS"
}

function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
}