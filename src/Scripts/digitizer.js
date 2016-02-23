var config={
	mapserver: "/mapserver/",
	namespace: "http://mgmapserver2.avmap.gr:8081/geoserver/",
	folderPath: "/DesktopModules/AVMap.MapDigitizer_v2/",
	mgreq: "/DesktopModules/AVMap.MapDigitizer_v2/mgreq.ashx"		//alternative: config.mgreq+""
};
Object.defineProperties(config,{
	"mapserver": {
		value: "/mapserver/",
		writable: false,
		configurable: false
	},
	"namespace": {
		value: "http://mgmapserver2.avmap.gr:8081/geoserver/",
		writable: false,
		configurable: false
	},
	"folderPath": {
		value: "/DesktopModules/AVMap.MapDigitizer_v2/",
		writable: false,
		configurable: false
	},
	"mgreq": {
		value: "/DesktopModules/AVMap.MapDigitizer_v2/mgreq.ashx",
		writable: false,
		configurable: false
	}

});
var internalConfig={
	mapTabIndex: 1,
	layerTabIndex: 2,
	searchTabIndex: 3,
	editTabIndex: 4,
	changeDefaultMap: null,
	apiVersion: '2.0.0',
	hotSearches: [],
	myCustomFilters: [],
	selectionToolbarIndex: 1,
	digitizingToolbarIndex: 2,
	filteringToolbarIndex: 4,
	mediaManagerSearchTimer: null,
	mmCallback:{
		fn: null,
		objectCount: -1,
		object: null
	},
	defaultBG1_index: 4,
	defaultBG2_index: 4,
	isAdminInterfaceLoaded: false,
	isUserPageLoaded: false,
	uiBlocked: false,
	mapThumbCropper: null,
	mapThumbPreviousBox: "",
	macroButtons: [],
	helpTips:{
		switchBG:false,
		switchBG_animPlaying: false
	},
	moveendEvent: -1,
	zoomToFeat: -1,
	legendWidth: 20
};
var internalMemory={
	lastZoom: null,
	dialogTop: 0,
	dialogLeft: 0,
	unsavedLayerChanges: [],
	layerFields:{}
}
var backgrounds = {

};


var appPath;
var digimap;
var criteriaMap;
var digiContainer;
var drawControls;
var infoControls;
var naviControls;
var lastCritIndex;

var countMarkers, countPolygons, countPolylines;
var digiOutLoc;
var geoXml;
var postbackurl;
var extra;
var myguid;
var current;
var wmsHighlight;
var cosmeticLayer;
var selectionLayer;
var feedbackLayer;
var selectionWMSLayer;
var selectionFlasher={timer:null,count:null};
var featuresUnsaved = [];
var featuresModified = {};
var featuresDeleted = [];

var drawingManager;
var mapContainerPosition;
var panTimer;

var toolbarToggling = false;
var filledMode = 2; //2 - filled polygon, 4 - filled circle, 5 - filled rectangle
var real_editMode = false;
var rightmenuOpen = false;
var infoWindows;
var autocomplete;
var saveFlasher;

var toolsEnabled = {
    allTools: false,
    toolbar: false,
    search: false,
    maps: false,
    layers: false,
    marker: false,
    filledRect: false,
    openRect: false,
    filledCircle: false,
    openCircle: false,
    openPolygon: false,
    filledPolygon: false,
    polyLine: false,
    polyLineDirections: false,
    database: false,
    undo: false
};

var cmenu;
var objcmenu;
var rightClickedObj;

window.trigger_calendar = [];		//JK CHANGES	-	flag array to determine when to trigger calendar(s)
window.lines_id =[[0,false,false,false]];					//JK CHANGES	-	array for naming second row&calendar instances
window.current_row=["",""];				//JK CHANGES	-	this remembers the current row we are modifiying in order to use calendar instances

$.xhrPool = [];
$.xhrPool.abortAll = function() {
    $(this).each(function(idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length=0;
};

$.ajaxSetup({
    beforeSend: function(jqXHR) {
		if (!$.xhrPool){
			$.xhrPool = [];
		}
        $.xhrPool.push(jqXHR);
    },
    complete: function(jqXHR) {
		if ($.xhrPool){
			var index = $.xhrPool.indexOf(jqXHR);
			if (index > -1) {
				$.xhrPool.splice(index, 1);
			}
		}
    }
});

/**
Main library

@namespace mygis
**/
window.mygis = {};//namespace("AVMap.mygis");

/**
Browser Local Storage functions
@class mygis.Storage
@static

**/
mygis.Storage = {

	/**
	Checks to see if browser supports local storage
	@method isStorageEnabled
	@return {Boolean} Browser supports local storage
	**/
	isStorageEnabled: function(){
		var retvalue=false;
		if (localStorage)retvalue=false;
		return retvalue;
	},

	/**
	Returns an item from the local storage
	@method getItem
	@param {String} key
	@return {String} The locally stored object
	**/
	getItem: function(key){
		var retvalue;
		if (mygis.Storage.isStorageEnabled()){
			if (localStorage.length && key){
				retvalue = localStorage.getItem(key);
			}
		}
		return retvalue;
	},

	/**
	Stores an item to the local storage
	@method storeItem
	@param {String} key
	@param {String} value The value to store
	@return {Boolean} The result of the operation
	**/
	storeItem: function(key,value){
		var retvalue=false;
		if (mygis.Storage.isStorageEnabled){
			localStorage.setItem(key,value);
			retvalue=true;
		}
		return retvalue;
	}
};

//END OF mygis.Storage


/**
Styling and Digitizing functions

@class Drawing
@static
**/
mygis.Drawing = {

	/**
	Editing existing features functions

	@class Drawing.Editing
	@static
	**/
	Editing: {
	
		/**
		  * Returns true if at least one data property is not empty
		  * @method isFilledIn
		  * @param data {Object}
		  */
		isFilledIn: function(data){
			var retvalue=false;
			$.each(data,function(i,v){
				if (v){
					retvalue=true;
				}
			});
			return retvalue;
		},

		editInfoFields: function(fieldInfo){
			var fields=$(".infoFieldsInnerCont .featureVCell");
			var cont = $(".infoFieldsInnerCont");
			if (!cont.hasClass('editable')){
				cont.addClass("editable");
			}
			$.each(fields,function(i,field){
				var key=$(field).prev().attr("data-originalName");
				var descr = $(field).prev().attr("data-description");
				var data=fieldInfo[key];
				var params={
					element: $(field).prev(),
					message: descr
				}
				singleQTip('editField',params);
				if (data.fieldLists.length>0){
					var jsonParams="{'':'"+strings.Editing.pleaseSelect+"'";
					$.each(data.fieldLists,function(i,v){
						jsonParams+=",";
						jsonParams+="'"+v.value+"'";
						jsonParams+=":";
						jsonParams+="'"+v.name+"'";
					});
					jsonParams+="}";
					$(field).editable(
						function(value,settings){
							return value;
						},
						{
							data: jsonParams,
							type   : 'select',
							onblur: 'submit',
							placeholder: '<span class="placeholder">'+strings.Editing.clickToEdit+'</span>',
							onsubmit: function(settings, td) {
								var input = $(td).find('input');
								//var name = input.attr("name");
								$(this).validate({
									rules: {
										'value': {
											required: true
										}
									},
									messages: {
										'actionItemEntity.name': {
											number: 'Required field'

										}

									}
								});

								return ($(this).valid());
							}
						}
					);
				}else{
					switch(data.originalType){
						case 'bit':
							$(field).editable(
								function(value,settings){
									return value;
								},
								{
								data: "{'':'"+strings.Editing.pleaseSelect+"','True':'"+strings.Editing.trueValue+"','False':'"+strings.Editing.falseValue+"'}",
								type   : 'select',
								onblur: 'submit',
								placeholder: '<span class="placeholder">'+strings.Editing.clickToEdit+'</span>'
								//,submit:'ok'
								}
							);
						case 'float':
						case 'double':
						case 'int':
						case 'numeric':
							$(field).editable(
								function(value,settings){
									return value;
								},
								{
								onsubmit: function(settings, td) {
									var input = $(td).find('input');
									//var name = input.attr("name");
									$(this).validate({
										rules: {
											'value': {
												number: true
											}
										},
										messages: {
											'actionItemEntity.name': {
												number: 'Only numbers are allowed'

											}

										}
									});

									return ($(this).valid());
								},
								type:'text',
								onblur: 'submit',
								placeholder: '<span class="placeholder">'+strings.Editing.clickToEdit+'</span>'
								//,submit:'ok'
								}
							);
							break;
						default:
							$(field).editable(
								function(value,settings){
									return value;
								},
								{
								type:'textarea',
								onblur: 'submit',
								placeholder: '<span class="placeholder">'+strings.Editing.clickToEdit+'</span>'
								//,submit:'ok'
								}
							);
							break;
					}
				}
				
			});
			
		},
		
		toggleEditableInfoFields: function(on){
			var mode="";
			if (on){
				mode="enable";
			}else{
				mode="disable";
			}
			try{
				mygis.Drawing.Editing.editInfoFields();
			}catch(err){}
			$(".infoFieldsInnerCont .featureVCell").editable(mode);
		},
		
		checkInfoPopupButtons: function(layername,objectID,fieldInfo){
			try{$(".infoPopupBtn").die().remove();}catch(err){}
			try{$(".infoPopup_saveChangesBtn").die().remove();}catch(err){}
			try{$(".infoPopup_editBtn").die().remove();}catch(err){}
			try{$(".infoPopup_deleteBtn").die().remove();}catch(err){}
			var records = layerSource.records;
			var fn = function(elem){
				return elem.layerTABLE==layername;
			};
			//Get the layer (to get layerID):
			if (objectID==-1){	//it's a new item
				
				var btn1=$("<a class='infoPopup_addImageBtn infoPopupBtn' href='#'></a>");
				btn1.append(strings.Editing.addImage);
				$(".infoImagesLabel").append(btn1);
				btn1.bind("click",mygis.Drawing.Editing.handlerAttachImage);
				var btn2=$("<a class='infoPopup_addFileBtn infoPopupBtn' href='#'></a>");
				btn2.append(strings.Editing.addFile);
				$(".infoFilesLabel").append(btn2);
				btn2.bind("click",mygis.Drawing.Editing.handlerAttachFile);
				var btn3=$("<a class='infoPopup_saveChangesBtn ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only' href='#'></a>");
				btn3.append('<span class="ui-button-icon-primary ui-icon ui-icon-disk"></span>');
				var container = $(".infoCont.ui-dialog-content").prev();
				container.append(btn3);
				btn3.bind("click",function(){setTimeout(mygis.Drawing.Editing.attachFieldsToFeature,400);});	//there is a 200ms delay in jEditable's code to actually submit...go figure.
			}else{
				var layer = records.find(fn);
				
				if (layer && internalMemory.layerRights){
					if (mygis.Drawing.Exporting.checkRights(objectID,layer.layerID,'update')){
						var btn1=$("<a class='infoPopup_addImageBtn infoPopupBtn' href='#'></a>");
						btn1.append(strings.Editing.addImage);
						$(".infoImagesLabel").append(btn1);
						btn1.bind("click",(function(x,y){return function(){mygis.Drawing.Editing.handlerAttachImage(x,y); }})(objectID,layer.layerTABLE));
						var btn2=$("<a class='infoPopup_addFileBtn infoPopupBtn' href='#'></a>");
						btn2.append(strings.Editing.addFile);
						$(".infoFilesLabel").append(btn2);
						btn2.bind("click",(function(x,y){return function(){mygis.Drawing.Editing.handlerAttachFile(x,y); }})(objectID,layer.layerTABLE));
						var btn3=$("<a class='infoPopup_saveChangesBtn ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only' href='#'></a>");
						btn3.append('<span class="ui-button-icon-primary ui-icon ui-icon-disk"></span>');
						var container = $(".infoCont.ui-dialog-content").prev();
						container.append(btn3);
						btn3.bind("click",(function(objectID,layer){
							return function(event){
								var errorsFound=$(event.target).closest(".ui-dialog").find("form .error").length>0;
								if (errorsFound){
									showConfirmationDialog(strings.Editing.loseAllChanges,function(){	
										var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
										try{
											dialogContent.dialog('destroy');
											dialogContent.remove();
										}catch(err){}
										console.log("removed 1");
										cosmeticLayer.destroyFeatures();
										digimap.layers[1].redraw(true);
										mygis.UI.activateControl('drag');
										
									},function(){console.log('cancelled');return false});
								}else{
									var previous=layerCurrentEditing;
									layerCurrentEditing=mygis.Utilities.mggetLayerIndex(layer.layerTABLE);
									mygis.Drawing.Editing.mg_updateFeature(objectID,layer.layerTABLE)
									layerCurrentEditing=previous;
									var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
									try{
										dialogContent.dialog('destroy');
										dialogContent.remove();
									}catch(err){}
								}
								
								
							};
						})(objectID,layer));
						mygis.Drawing.Editing.editInfoFields(fieldInfo);
						$(".ui-dialog .ui-layout-center h3.ui-accordion-header").show();
					}
					if (mygis.Drawing.Exporting.checkRights(objectID,layer.layerID,'delete')){
						var btn1=$("<a class='infoPopup_deleteBtn ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only' href='#'></a>");
						btn1.append('<span class="ui-button-icon-primary ui-icon ui-icon-trash"></span>');
						container.append(btn1);
						btn1.bind("click",(function(objectID,layer){
								return function(event){
									showConfirmationDialog(strings.Editing.deleteObject,function(){
										var previous=layerCurrentEditing;
										layerCurrentEditing=mygis.Utilities.mggetLayerIndex(layer.layerTABLE);
										mygis.Drawing.Editing.mg_deleteFeature(objectID,layer.layerTABLE)
										layerCurrentEditing=previous;
										var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
										try{
											dialogContent.dialog('destroy');
											dialogContent.remove();
										}catch(err){}
									}, function(){return false;});
								};
							})(objectID,layer));
							
					}
				}
			}
			
		},
	
		/**
		 * Clears the contents of the editDigitize popup
		 * @method clearDigiPopup
		 */
		clearDigiPopup: function(){
			$("#appSetting_DigitizeFields").empty();
			$("#appSetting_DigitizeImages").empty();
			$("#appSetting_DigitizeFiles").empty();
			$("#appSetting_DigitizeLinks").empty();
		},

		/**
		 *	Adds default UI to editDigitize popup. Used after clearing.
		 *	@method addDigiDefaults
		 */
		addDigiDefaults: function(){
			//----IMAGES----//
			var imageCont = $("<div class='appSetting' />");
			var wrapper = $("<div class='imageWrapper' />");
			var divImages = $("<div id='editImageContainer' />");
			var btnImgAttach = $("<a href='#' class='defaultAction freshButton' />");
			btnImgAttach.html(strings.Editing.btnAttachImage);
			btnImgAttach.bind("click",mygis.Drawing.Editing.handlerAttachImage);
			//imageCont.append(btnImgAttach);
			wrapper.append(divImages);
			imageCont.append(wrapper);

			$("#appSetting_DigitizeImages").append(imageCont);

			//----FILES----//
			var fileCont = $("<div class='appSetting' />");
			var divFiles = $("<div id='editFileContainer' />");
			var btnFileAttach = $("<a href='#' class='defaultAction freshButton' />");
			btnFileAttach.html(strings.Editing.btnAttachFile);
			btnFileAttach.bind("click",mygis.Drawing.Editing.handlerAttachFile);
			fileCont.append(divFiles);
			//fileCont.append(btnFileAttach);
			$("#appSetting_DigitizeFiles").append(fileCont);
		},

		/**
		 *	Handles the "Attach Image" button click
		 *	@method handlerAttachImage
		 */
		handlerAttachImage: function(oid,layer){
			internalConfig.mmCallback.fn = mygis.Drawing.Editing.imageAttached;
			internalConfig.mmCallback.objectCount=1;
			internalConfig.mmCallback.object=null;
			internalConfig.mmCallback.oid=oid;
			internalConfig.mmCallback.layer=layer;
			showMediaManager(true);
		},

		/**
		 *	Handles the "Attach File" button click
		 *	@method handlerAttachFile
		 */
		handlerAttachFile: function(oid,layer){
			internalConfig.mmCallback.fn = mygis.Drawing.Editing.fileAttached;
			internalConfig.mmCallback.objectCount=1;
			internalConfig.mmCallback.object=null;
			internalConfig.mmCallback.oid=oid;
			internalConfig.mmCallback.layer=layer;
			showMediaManager();
		},

		/**
		 *	"Remembers" the images attached to the feature and displays a gallery
		 *	@method imageAttached
		 *	@param {String} result
		 */
		imageAttached: function(result){
			if (result=="ok"){
				var resultObj=this;
				var lastFeature;
				var layer; 
				var fid;
				var oid;
				if (internalConfig.mmCallback.oid>-1){
					layer = internalConfig.mmCallback.layer;
					oid = internalConfig.mmCallback.oid;
					mygis.Drawing.Editing.mg_featureModified(oid,layer);
					lastFeature = featuresModified[layer+"."+internalConfig.mmCallback.oid];
				}else{
					lastFeature = featuresUnsaved[featuresUnsaved.length-1];
					layer = layerSource.records[layerCurrentEditing].layerTABLE;
					oid = -1;
				}
				fid = layer+"."+oid;
				if (!lastFeature.attachedImages){
					lastFeature.attachedImages=[];
				}
				if (!lastFeature.attachedImagesFull){
					lastFeature.attachedImagesFull=[];
				}
				var panel=$("#detached"+layer+"_"+oid+" .popupimageContainer");
				var data=panel.data("images");
				if (data){
					$.each(data,function(i,v){
						lastFeature.attachedImages.push(v.imageID);
						lastFeature.attachedImagesFull.push(v);
					});
				}
				for (var i=0;i<resultObj.length;i++){
					var resultObjItem = resultObj[i];
					
					resultObjItem.imageID=resultObjItem.fileID;	//interoperability with other functions
					resultObjItem.imageTYPE = resultObjItem.fileTYPE; //interoperability with other functions
					resultObjItem.imageNAME = resultObjItem.fileNAME; //interoperability with other functions
					
					lastFeature.attachedImages.push(resultObjItem.fileID);
					lastFeature.attachedImagesFull.push(resultObjItem);
				}
				
				panel.empty();
				if (lastFeature.attachedImages.length>0){
					panel.append(mygis.UI.getInfoImageGrid(lastFeature.attachedImagesFull,fid));
					var mainCont=$("#detached"+layer+"_-1").find(".mainImageCont");
					mainCont.removeClass("editable");
					mainCont.unbind('click');
					var src=mygis.Utilities.format(
							"url('{0}GetImage.ashx?qType=userFile&qContents={1}&qSize=430')",
							config.folderPath,
							lastFeature.attachedImages[0]);
					mainCont.css("background-image",src);
				}
				
				
			}
		},

		/**
		 *	"Remembers" the files attached to the feature and displays a list
		 *	@method fileAttached
		 *	@param {String} result
		 */
		fileAttached: function(result){
			if (result=="ok"){
				var resultObj=this;
				var lastFeature;
				var layer; 
				var fid;
				var oid;
				if (internalConfig.mmCallback.oid>-1){
					layer = internalConfig.mmCallback.layer;
					oid = internalConfig.mmCallback.oid;
					mygis.Drawing.Editing.mg_featureModified(oid,layer);
					lastFeature = featuresModified[layer+"."+internalConfig.mmCallback.oid];
				}else{
					lastFeature = featuresUnsaved[featuresUnsaved.length-1];
					layer = layerSource.records[layerCurrentEditing].layerTABLE;
					oid = -1;
				}
				fid = layer+"."+oid;
				if (!lastFeature.attachedFiles){
					lastFeature.attachedFiles=[];
				}
				if (!lastFeature.attachedFilesFull){
					lastFeature.attachedFilesFull=[];
				}
				var panel=$("#detached"+layer+"_"+oid+" .popupFileContainer");
				var data=panel.data("files");
				if (data){
					$.each(data,function(i,v){
						lastFeature.attachedFiles.push(v.imageID);
						lastFeature.attachedFilesFull.push(v);
					});
				}
				for (var i=0;i<resultObj.length;i++){
					var resultObjItem = resultObj[i];
					
					resultObjItem.imageID=resultObjItem.fileID;	//interoperability with other functions
					resultObjItem.imageTYPE = resultObjItem.fileTYPE; //interoperability with other functions
					resultObjItem.imageNAME = resultObjItem.fileNAME; //interoperability with other functions
					
					lastFeature.attachedFiles.push(resultObjItem.fileID);
					lastFeature.attachedFilesFull.push(resultObjItem);
				}
				
				panel.empty();
				if (lastFeature.attachedFiles.length>0){
					panel.append(mygis.UI.getInfoFileGrid(lastFeature.attachedFilesFull,fid));
				}
				
			}
		},

		/**
		 * Used to remove an image from the "to be attached" array
		 * @method imageDetach
		 */
		imageDetach: function(){
			var grid = $("#editImageContainer");
			var lastFeature = featuresUnsaved[featuresUnsaved.length-1];
			var selection = grid.jqxGrid('getselectedrowindexes');
			var newIDs=[];
			var newObjects=[];

			for (var i=0;i<lastFeature.attachedImages.length;i++){
				if (selection.indexOf(i)==-1){
					newIDs.push(lastFeature.attachedImages[i]);
					newObjects.push(lastFeature.attachedImagesFull[i]);
				}
			}
			lastFeature.attachedImages=newIDs;
			lastFeature.attachedImagesFull=newObjects;
			var source = mygis.Utilities.getLocalGridSource(lastFeature.attachedImagesFull);
			grid.jqxGrid({source: source});
			/*
			for (var i=selection.length-1;i>=0;i--){
				grid.jqxGrid('deleterow',selection[i]);
			}
			*/
			grid.jqxGrid('clearselection');
			grid.jqxGrid('refreshdata');
			mygis.Drawing.Editing.imageGridSelected();
		},

		/**
		 * Used to remove a file from the "to be attached" array
		 * @method fileDetach
		 */
		fileDetach: function(){
			var grid = $("#editFileContainer");
			var lastFeature = featuresUnsaved[featuresUnsaved.length-1];
			var selection = grid.jqxGrid('getselectedrowindexes');
			var newIDs=[];
			var newObjects=[];

			for (var i=0;i<lastFeature.attachedFiles.length;i++){
				if (selection.indexOf(i)==-1){
					newIDs.push(lastFeature.attachedFiles[i]);
					newObjects.push(lastFeature.attachedFilesFull[i]);
				}
			}
			lastFeature.attachedFiles=newIDs;
			lastFeature.attachedFilesFull=newObjects;
			var source = mygis.Utilities.getLocalGridSource(lastFeature.attachedFilesFull);
			grid.jqxGrid({source: source});
			/*
			for (var i=selection.length-1;i>=0;i--){
				grid.jqxGrid('deleterow',selection[i]);
			}
			*/
			grid.jqxGrid('clearselection');
			grid.jqxGrid('refreshdata');
			mygis.Drawing.Editing.fileGridSelected();
		},

		/**
		 * Used to download an image
		 * @method imageDownload
		 * @param {Element} The calling element
		 */
		imageDownload: function(elem){
			var inp = $(elem).parent().find(".inputID")[0];
			mygis.UI.MediaManager.downloadFile(inp.value);
		},

		/**
		 * Used to view fully an image
		 * @method imageZoom
		 * @param {Element} The calling element
		 */
		imageZoom: function(elem){
			var inp = $(elem).parent().find(".inputID")[0];
			var url = mygis.Utilities.format("/DesktopModules/AVMap.MapDigitizer_v2/GetImage.ashx?qType=userFile&qContents={0}",inp.value);
			var newImg = $("<img />");
			newImg.attr("src",url);
			newImg.attr("class","imagePreviewer");
			var newImgCont = $("<div />");
			var popupCont = $("<div />");
			var mywidth,myheight;
			newImgCont.attr("style","display: table-cell; text-align: center; vertical-align: middle; width: 900px; height: 360px;");
			popupCont.append(newImgCont);
			newImg.load(function(){
				mywidth = this.width;
				myheight = this.height;
				newImgCont.append(newImg);
				popupCont.dialog({
					width: 900,	//mywidth,
					height: 410,//myheight,
					modal: true,
					draggable: false,
					resizable: false
				});//.siblings('div.ui-dialog-titlebar').remove();
				newImgCont.focus();
			});
		},

		/**
		 * Used to download a file
		 * @method fileDownload
		 * @param {Element} The calling element
		 */
		fileDownload: function(elem){
			var inp = $(elem).parent().find(".inputID")[0];
			mygis.UI.MediaManager.downloadFile(inp.value);
		},

		/**
		 *	Creates/refreshes an image slider for editDigitize popup
		 *	@method refreshImageSlider
		 *	@deprecated
		 */
		refreshImageSlider: function(){
			var slider = $("#editImageContainer");
			slider.empty();
			var contDiv = $("$<ul />");

			var lastFeature = featuresUnsaved[featuresUnsaved.length-1];
			$.each(lastFeature.attachedImages,function(i,v){
				var item = $("<li />");
				var img = $("<img />");
				var link = $("<a />");
				var src = config.folderPath+"GetImage.ashx?qtype=userFile&qSize=50&qContents="+v;
				img.attr("src",src);
				link.bind("click",mygis.Drawing.Editing.imageMenuClick);
				link.append(img);
				item.append(link);
				contDiv.append(item);
			});
			var wrapItem = $("<div />");
			wrapItem.append(contDiv);
			wrapItem.attr("class","es-carousel");
			slider.append(wrapItem);
			slider.elastislide({
				imageW  : 50,
				border  : 0
			});
		},

		/**
		 * Creates/refreshes an image grid for editDigitize popup
		 * @method refreshImageGrid
		 */
		refreshImageGrid: function(){
			var lastFeature = featuresUnsaved[featuresUnsaved.length-1];
			//lastFeature.attachedImagesFull
			var grid = $("#editImageContainer");
			grid.removeData().empty();
			mygis.Drawing.Editing.createImageGrid(lastFeature.attachedImagesFull);
		},

		/**
		 * Creates/refreshes a file grid for editDigitize popup
		 * @method refreshFileGrid
		 */
		refreshFileGrid: function(){
			var lastFeature = featuresUnsaved[featuresUnsaved.length-1];
			//lastFeature.attachedImagesFull
			var grid = $("#editFileContainer");
			grid.removeData().empty();
			mygis.Drawing.Editing.createFileGrid(lastFeature.attachedFilesFull);
		},

		/**
		 *	Creates the image grid for editDigitize
		 *	@method createImageGrid
		 */
		createImageGrid: function(data){
			$.each(data,function(i,v){
				v.imageSelected=false;
			});

			var source = mygis.Utilities.getLocalGridSource(data);
			var container = $("#editImageContainer");
			var rowheight = 50;
			var columnrenderer = function(value){
				var action = 'router("editPopup_imageSelectAll",this);';
				var grid = $("#editImageContainer");
				var selection = grid.jqxGrid('getselectedrowindexes');
				var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
				var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
				retobject = mygis.Utilities.format("<div style='{2}'><input id='editDigitizeImageAll' type='checkbox' onclick='{0}'{1}/></div>",
													action,checked,customStyle);
				return retobject;
			};
			var cellrenderer = function(row,datafield,value){
				var retobject;
				switch (datafield){
					case "fileID":
						var src = config.folderPath+"GetImage.ashx?qtype=userFile&qSize=48&qContents="+value;
						retobject = mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'><img src='{0}'/></div>",src,rowheight);
						break;
					case "fileNAME":
						retobject=mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'>{0}</div>",value,rowheight);
						break;
					default:
						var buttons = "";
						var fileID = this.owner.getrowdata(row).fileID;
						buttons += mygis.Utilities.format("<a href='#' class='freshButton' onclick='{0}'>{1}</a>",'router("editDigi_btnImageDownload",this);',strings.Editing.btnImage_download);
						buttons += mygis.Utilities.format("<a href='#' class='freshButton' onclick='{0}'>{1}</a>",'router("editDigi_btnImageZoom",this);',strings.Editing.btnImage_fullZoom);
						buttons += mygis.Utilities.format("<input class='inputID' type='hidden' value='{0}' />",fileID);
						retobject=mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'>{0}</div>",buttons,rowheight);
						break;
				}
				return retobject;
			};
			container.jqxGrid({
				source: source,
				width: '100%',
				height: '300px',
				autoheight: false,
				theme: 'pk_mg_jm',
				altrows: true,
				enabletooltips: true,
				columns: [
					{text: "asdf",datafield:"imageSelected",width: 45, columntype: "checkbox",renderer:columnrenderer},
					{text: strings.Editing.gridFile_colThumb, datafield: "fileID",width: 55,cellsrenderer: cellrenderer,editable: false},
					{text: strings.Editing.gridFile_colName, datafield: "fileNAME",cellsrenderer: cellrenderer,editable: false},
					{text: strings.Editing.gridFile_colActions,datafield:"",width: 200, cellsrenderer: cellrenderer,editable:false}
				],
				enableanimations: false,
				showheader: true,
				columnsmenu: false,
				editable: true,
				selectionmode: 'none',
				rowsheight: rowheight
			});
			container.bind("rowselect",mygis.Drawing.Editing.imageGridSelected);
			container.bind("rowunselect",mygis.Drawing.Editing.imageGridUnselected);
			container.bind("cellendedit",mygis.Drawing.Editing.imageGridCheckClicked);
		},

		/**
		 *	Creates the file grid for editDigitize
		 *	@method createFileGrid
		 */
		createFileGrid: function(data){
			$.each(data,function(i,v){
				v.fileSelected=false;
			});
			var source = mygis.Utilities.getLocalGridSource(data);
			var container = $("#editFileContainer");
			var rowheight = 50;
			var columnrenderer = function(value){
				var action = 'router("editPopup_fileSelectAll",this);';
				var grid = $("#editFileContainer");
				var selection = grid.jqxGrid('getselectedrowindexes');
				var checked;
				if (selection){
					checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
				}else{
					checked = false;
				}
				var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
				retobject = mygis.Utilities.format("<div style='{2}'><input id='editDigitizeFileAll' type='checkbox' onclick='{0}'{1}/></div>",
													action,checked,customStyle);
				return retobject;
			};
			var cellrenderer = function(row,datafield,value){
				var retobject;
				switch (datafield){
					case "fileID":
						var cname = "";
						var extParts = this.owner.getrowdata(row).fileNAME.split(".");
						var ext = extParts[extParts.length-1].toLowerCase();
						switch(ext){
							case "doc":
							case "docx":
								cname = "doc";
								break;
							case "xls":
							case "xlsx":
								cname = "xls";
								break;
							case "ppt":
							case "pptx":
								cname = "ppt";
								break;
							case "pdf":
								cname = "pdf";
								break;
							case "png":
							case "jpg":
							case "jpeg":
							case "gif":
								cname="image";
								break;
							default:
								cname = "unknown";
								break;
						}
						if (cname=="image"){
							var src = config.folderPath+"GetImage.ashx?qtype=userFile&qSize=50&qContents="+value;
							retobject = mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'><img src='{0}'/></div>",src,rowheight);
						}else{
							retobject = mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;width: {1}px;'><div class='MMFile2 {0}' /></div>",cname,rowheight);
						}
						break;
					case "fileNAME":
						retobject=mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'>{0}</div>",value,rowheight);
						break;
					default:
						var buttons = "";
						var fileID = this.owner.getrowdata(row).fileID;
						buttons += mygis.Utilities.format("<a href='#' class='freshButton' onclick='{0}'>{1}</a>",'router("editDigi_btnFileDownload",this);',strings.Editing.btnImage_download);
						buttons += mygis.Utilities.format("<input class='inputID' type='hidden' value='{0}' />",fileID);
						retobject=mygis.Utilities.format("<div class='imageVerticalContainer2' style='height: {1}px;'>{0}</div>",buttons,rowheight);
						break;
				}
				return retobject;
			};
			container.jqxGrid({
				source: source,
				width: '100%',
				height: '300px',
				autoheight: false,
				theme: 'pk_mg_jm',
				altrows: true,
				enabletooltips: true,
				columns: [
					{text: "asdf",datafield:"fileSelected",width: 45, columntype: "checkbox",renderer:columnrenderer},
					{text: strings.Editing.gridFile_colThumb, datafield: "fileID",width: 55,cellsrenderer: cellrenderer,editable: false},
					{text: strings.Editing.gridFile_colName, datafield: "fileNAME",cellsrenderer: cellrenderer,editable: false},
					{text: strings.Editing.gridFile_colActions,datafield:"",width: 200, cellsrenderer: cellrenderer,editable:false}
				],
				enableanimations: false,
				showheader: true,
				columnsmenu: false,
				editable: true,
				selectionmode: 'none',
				rowsheight: rowheight
			});
			container.bind("rowselect",mygis.Drawing.Editing.fileGridSelected);
			container.bind("rowunselect",mygis.Drawing.Editing.fileGridUnselected);
			container.bind("cellendedit",mygis.Drawing.Editing.fileGridCheckClicked);
		},


		/**
		 * Activates/deactivates some buttons when an image is selected in the editDigitize popup
		 * @method imageGridUnselected
		 */
		imageGridSelected: function(){
			var grid = $("#editImageContainer");
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (selection.length>=1){
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_RemoveClassName("disabled");
			}else{
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_AddClassName("disabled");
			}
			if (selection.length==grid.jqxGrid('source').records.length){
				document.getElementById('editDigitizeImageAll').checked=true;
			}else{
				document.getElementById('editDigitizeImageAll').checked=false;
			}
		},

		/**
		 * Activates/deactivates some buttons when an image is unselected in the editDigitize popup
		 * @method imageGridUnselected
		 */
		imageGridUnselected: function(){
			var grid = $("#editImageContainer");
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (selection.length>=1){
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_RemoveClassName("disabled");
			}else{
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_AddClassName("disabled");
			}
			if (selection.length==grid.jqxGrid('source').records.length){
				document.getElementById('editDigitizeImageAll').checked=true;
			}else{
				document.getElementById('editDigitizeImageAll').checked=false;
			}
		},

		/**
		 * Handles the checking of the imageGrid row in editDigitize
		 * @method imageGridCheckClicked
		 * @param {Element} elem The firing element
		 */
		imageGridCheckClicked: function(elem){
			var grid=$("#editImageContainer");
			if (elem.args.value) {
				grid.jqxGrid('selectrow', elem.args.rowindex);
			}
			else {
				grid.jqxGrid('unselectrow', elem.args.rowindex);
			}
		},

		/**
		 * Handles the check all button for the imageGrid in editDigitize
		 * @method imageGridCheckAll
		 * @param {Element} elem The firing checkbox
		 */
		imageGridCheckAll: function(elem){
			var grid = $("#editImageContainer");
			var records = grid.jqxGrid('source').records;
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (elem.checked){
				for (var i=0;i<records.length;i++){
						if (selection.indexOf(i)==-1){
							records[i].imageSelected=true;
							grid.jqxGrid('selectrow',i)
						}
				}
				grid.jqxGrid('refreshdata');
			}else{
				for (var i=0;i<records.length;i++){
					records[i].imageSelected=false;
					grid.jqxGrid('unselectrow',i)
				}
				grid.jqxGrid('refreshdata');
			}
		},

		/**
		 * Activates/deactivates some buttons when a file is selected in the editDigitize popup
		 * @method fileGridSelected
		 */
		fileGridSelected: function(){
			var grid = $("#editFileContainer");
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (selection.length>=1){
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_RemoveClassName("disabled");
			}else{
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_AddClassName("disabled");
			}
			if (selection.length==grid.jqxGrid('source').records.length){
				document.getElementById('editDigitizeFileAll').checked=true;
			}else{
				document.getElementById('editDigitizeFileAll').checked=false;
			}
		},

		/**
		 * Activates/deactivates some buttons when a file is unselected in the editDigitize popup
		 * @method fileGridUnselected
		 */
		fileGridUnselected: function(){
			var grid = $("#editFileContainer");
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (selection.length>=1){
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_RemoveClassName("disabled");
			}else{
				$("#editDigitizeTabActions .sectionButtons a")[1].ex_AddClassName("disabled");
			}
			if (selection.length==grid.jqxGrid('source').records.length){
				document.getElementById('editDigitizeFileAll').checked=true;
			}else{
				document.getElementById('editDigitizeFileAll').checked=false;
			}
		},

		/**
		 * Handles the checking of the fileGrid row in editDigitize
		 * @method fileGridCheckClicked
		 * @param {Element} elem The firing element
		 */
		fileGridCheckClicked: function(elem){
			var grid=$("#editFileContainer");
			if (elem.args.value) {
				grid.jqxGrid('selectrow', elem.args.rowindex);
			}
			else {
				grid.jqxGrid('unselectrow', elem.args.rowindex);
			}
		},

		/**
		 * Handles the check all button for the fileGrid in editDigitize
		 * @method fileGridCheckAll
		 * @param {Element} elem The firing checkbox
		 */
		fileGridCheckAll: function(elem){
			var grid = $("#editFileContainer");
			var records = grid.jqxGrid('source').records;
			var selection = grid.jqxGrid('getselectedrowindexes');
			if (elem.checked){
				for (var i=0;i<records.length;i++){
						if (selection.indexOf(i)==-1){
							records[i].fileSelected=true;
							grid.jqxGrid('selectrow',i)
						}
				}
				grid.jqxGrid('refreshdata');
			}else{
				for (var i=0;i<records.length;i++){
					records[i].fileSelected=false;
					grid.jqxGrid('unselectrow',i)
				}
				grid.jqxGrid('refreshdata');
			}
		},

		/**
		 * Creates an input for a field of the editDigitize popup
		 * @method createFieldDiv
		 * @param {Object} field The field object
		 * @param {String} type The field type. One of text,dropdown,datetime
		 * @param {Object} Reserved for future use
		 * @returns {Element} The result element.
		 */
		createFieldDiv: function(field,type,params){
			var retobject;
			retobject = $("<div />"); //remake
			//var theme = getDemoTheme();
			//retobject = $("#jqxWidget").jqxDateTimeInput({width: '250px', height: '25px', theme: theme});

			retobject.attr("class","appSetting");
			var label = $("<label />");
			label.attr("for","inp__"+field.name);
			label.html(field.name);
			var inp;
			switch (type){
				case "text":
					inp = $("<input type='text' />");
					break;
				case "dropdown":
					/*
					inp = $("<div />");

					var listSource = new $.jqx.dataAdapter({
						datatype: "local",
						localdata: field.fieldLists,
						id: "dadapt"+field.name.replace(' ','')
					}
					);

					inp.jqxDropDownList({
						source: listSource,
						displayMember: "name",
						valueMember: "value",
						selectedIndex: 0,
						width: 300,
						height: 20
					});
					*/
					inp = $("<select />");
					mygis.Utilities.populateSelect(inp[0],field.fieldLists,true);
					break;
				case "datetime":
					inp = $("<div />");
					inp.attr("class","datetime");

					break;
			}
			inp.attr("id","inp__"+field.name);
			retobject.append(label);
			retobject.append(inp);
			return retobject;
		},

		/**
		 *	Checks if the field should be output to the UI.
		 *	Example of fields that are excluded: OID, Geometry
		 *	@method isValidOutput
		 *	@param {Object} field
		 *	@param {String} destination	One of "fields","images","files","links"
		 *	@returns {Boolean}
		 */
		isValidOutput: function(field,destination){
			var retvalue=true;
			switch(destination){
				case "fields":
					retvalue=mygis.Drawing.Editing.isValidOutputIntern(field.name);
					break;
				case "links":
					if (field.name.indexOf("__LNK")!=0){
						retvalue=false;
					}
					break;
				case "images":
				case "files":
					retvalue=false;
					break;
			}
			return retvalue;
		},
		
		isValidOutputIntern: function(name){
			var retvalue=true;
			if (name.endsWith("__")){
				retvalue=false;	//RESERVED FIELDS
			}else {
				switch(name){
					case "Geometry":
					case "GeometryText":
					case "OID":
					case "Center_X":
					case "Center_Y":
						retvalue=false;	//INTERNAL fields
				}
			}
			return retvalue;
		},

		/**
		 *	Returns the type of input box to create based on field type
		 *	@method getInputType
		 *	@param {Object} field
		 *	@returns {String} One of "text","datetime","dropdown"
		 */
		getInputType: function(field){
			var type;
			if (field.fieldLists.length>0){
				type="dropdown";
			}else if (
				field.originalType.indexOf("char")>-1 ||
				field.originalType.indexOf("nchar")>-1 ||
				field.originalType.indexOf("varchar")>-1 ||
				field.originalType.indexOf("nvarchar")>-1 ||
				field.originalType.indexOf("Text")>-1 ||
				field.originalType.indexOf("nText")>-1){
				type="text";
			}else if (field.originalType.indexOf("date")>-1){
				type="datetime"; //JK CHANGE
			}else{
				type="text";	//number?
			}
			return type;
		},

		/**
		 *	Fills in the editDigitize popup
		 *	@method fillDigiPopup
		 *	@param {Array} dataColumns
		 *	@param {String} layername
		 */
		fillDigiPopup: function(datacolumns,layername){
			mygis.Drawing.Editing.clearDigiPopup();
			mygis.Drawing.Editing.addDigiDefaults();
			$.each(datacolumns,function(i,v){
				if (mygis.Drawing.Editing.isValidOutput(v,"fields")){
					var type = mygis.Drawing.Editing.getInputType(v);
					$("#appSetting_DigitizeFields").append(mygis.Drawing.Editing.createFieldDiv(v,type));
				}
			});
			$("#appSetting_DigitizeFields .datetime").jqxDateTimeInput({
				width: "430px",
				height: "20px"
			});
		},

		/**
		 *	Checks if the input in the editDigitize popup is valid
		 *	@method checkValidInfo
		 *	@returns {Boolean}
		 */
		checkValidInfo: function(){
			/*
			 * 	This could be used to perform validation for "not null" fields etc.
			 * 	But for now...
			 */
			 return true;
		},

		/**
		 *	Called when the user presses save/cancel at the editDigitize popup
		 *	@method digiPopupResult
		 */
		digiPopupResult: function(result){
			if (!result || result!="ok"){
				mygis.UI.cosmeticPop(featuresUnsaved[featuresUnsaved.length-1]);
			}else{
				mygis.Drawing.Editing.attachFieldsToFeature();
			}
		},

		/**
		 * Attaches fields to last created feature
		 * @method attachFieldsToFeature
		 */
		attachFieldsToFeature: function(suppressNotification,whereTo){
			var f;
			if (whereTo==null){
				f = featuresUnsaved[featuresUnsaved.length-1];	//last object
			}else{
				f=whereTo;
			}
			if (f){
				var fieldsToAttach = $(".infoCont.ui-dialog-content .infoFieldsInnerCont .featureVCell");//$("#appSetting_DigitizeFields").find(".appSetting");
				$.each(fieldsToAttach,function(i,v){
					var data=$(v).data('fieldInfo');
					var col = data.name;//$(v).find("label").html();
					var inp = $(v).text()==strings.Editing.clickToEdit?"":$(v).text(); //$(v).find("input")[0];
					/*
					if (!inp){
						inp =$(v).find("select option:selected")[0];
					}
					*/
					if (!f.data){f.data={}};
					f.data[col]=inp;
					

				});
				if (!suppressNotification){
					displayNotify(strings.Editing.tempNewObj+layerSource.records[layerCurrentEditing].layerNAME);
				}
			}else{
				//Something went wrong: Feature should exist before save popup.
				cosmeticLayer.destroyFeatures();
				var dialogContent=$(".ui-dialog").find(".ui-dialog-content");
				try{
					dialogContent.dialog('destroy');
					dialogContent.remove();
				}catch(err){}
				displayError(strings.Editing.temporaryError);
			}
			
			//mygis.Drawing.Exporting.saveDigitizing();
		},

		/**
		 *	Switches the active tab to the given index.
		 *	@method switchToTab
		 *	@param {Integer} index
		 */
		switchToTab: function(index){
			var tabHeaders = $("#editDigitizeLinkTabsRound").find(".sectionHeader");
			for (var i=0;i<tabHeaders.length;i++){
					if (i!=index){
							tabHeaders[i].ex_RemoveClassName("active");
					}else{
							tabHeaders[i].ex_AddClassName("active");
					}
			}
			var tabs = $("#editDigitizeTab").find(".appSettingFrame");
			for (var i=0;i<tabs.length;i++){
					if (i!=index){
							$(tabs[i]).hide();
							tabs[i].ex_RemoveClassName("active");
					}else{
							$(tabs[i]).show();
							tabs[i].ex_AddClassName("active");
							var buttons = $(tabs[i]).find(".sectionButtons");
							$("#editDigitizeTabActions").empty();
							$("#editDigitizeTabActions").append(buttons.clone());
					}

			}
		},

		/**
			Removes a selected feature from the map

			@method mg_removeFeature
		**/
		mg_removeFeature: function(e){
			if (!cosmeticLayer.deletedFeatures){
				cosmeticLayer.deletedFeatures = [];
			}
			while (cosmeticLayer.selectedFeatures.length>0){
				var e = cosmeticLayer.selectedFeatures[0];
				var ref = new Object();
				ref.fid = e.fid;
				cosmeticLayer.deletedFeatures.push(ref);
				featuresDeleted.push(e.fid);
				drawControls.modify.selectControl.unselect(e);
				cosmeticLayer.removeFeatures(e);
			}

			mygis.UI.notifyUnsavedLayer(layerCurrentEditing);
		},
		
		mg_deleteFeature: function(oid,layername){
			featuresDeleted.push(layername+"."+oid);
			mygis.Drawing.Exporting.saveDigitizing();
		},
		
		mg_featureModified: function(oid,layername){
			var fid=layername+"."+oid;
			if (!featuresModified[fid]){featuresModified[fid]={};}
			featuresModified[fid].data={};
			featuresModified[fid].data.OID=oid;
			mygis.Drawing.Editing.attachFieldsToFeature(true,featuresModified[fid]);
		},
		
		mg_updateFeature: function(oid,layername){
			mygis.Drawing.Editing.mg_featureModified(oid,layername);
			mygis.Drawing.Exporting.saveDigitizing();
		},

		/**
			Edits the given layer. Retrieves features via WFS.

			@method editLayer
			@param {String} layername The layer name to search for
		**/
		editLayer: function(layername){

			var options= {
				strategies: [new mygis.Map.strategies.BBOXUnique({ratio:1,resFactor:1})],
				protocol: new OpenLayers.Protocol.WFS({
					url: config.mapserver+"wfs",
					version : "1.1.0",
					featureType: layername,
					featureNS: config.namespace+"MyGIS",	//+currentAppName,
					geometryName : "Geometry",
					type: "Geometry"
					//srsName: digimap.projection.getCode()
					/*
					,
					propertyNames: ["Geometry"]
					*/
				}),
				styleMap: new OpenLayers.StyleMap(),
					preFeatureInsert: function(feature) {
					var y=feature.geometry.getCentroid().y;
			   }

			};
			digimap.removeLayer(cosmeticLayer);
			cosmeticLayer.events.unregister("afterfeaturemodified");
			cosmeticLayer = new OpenLayers.Layer.Vector("Cosmetic Layer",options);

			//var style = layerStyles[layername].namedLayers[layername].userStyles[0];

			//cosmeticLayer.styleMap.styles["default"]=style;

			digimap.addLayer(cosmeticLayer);
			digimap.removeControl(drawControls.modify);

			var featureToUnselect;

			drawControls.modify = new OpenLayers.Control.ModifyFeature(cosmeticLayer,{

				createVertices: false,
				standalone: false

			});

			switch (featureEditMode){
				case 4:
				case 0:
					drawControls.modify.mode = OpenLayers.Control.ModifyFeature.DRAG;
					break;
				case 1:
					drawControls.modify.mode = OpenLayers.Control.ModifyFeature.ROTATE;
					break;
				case 2:
					drawControls.modify.mode = OpenLayers.Control.ModifyFeature.RESIZE;
					break;
				case 3:
					drawControls.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
					break;
			}
			OpenLayers.Util.extend(drawControls.modify.selectControl.callbacks,{
				over: function(feature){
					if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures, feature) > -1)) {
						this.highlight(feature);
					}
				},
				out: function(feature){
					if(!(OpenLayers.Util.indexOf(this.layer.selectedFeatures, feature) > -1)) {
						this.unhighlight(feature);
					}
				}
			});

			drawControls.modify.selectControl.renderIntent = "select";
			drawControls.modify.selectControl.multipleKey='shiftKey';
			digimap.addControl(drawControls.modify);

			mygis.UI.activateOLControl(drawControls.modify);

			cosmeticLayer.events.on({
				"afterfeaturemodified": mygis.UI.featureModified,
				"featureselected": function(e){
					mygis.UI.editFeatureSelected(e);
					switch(layerSource.records[layerCurrentEditing].layerGeomType){
						case "Point":
							document.getElementById("editModeRotate").ex_AddClassName("disabled");
							document.getElementById("editModeResize").ex_AddClassName("disabled");
							document.getElementById("editModeReshape").ex_AddClassName("disabled");
							break;
						case "Line":
						case "Mixed":
						case "Polygon":
							document.getElementById("editModeRotate").ex_RemoveClassName("disabled");
							document.getElementById("editModeResize").ex_RemoveClassName("disabled");
							document.getElementById("editModeReshape").ex_RemoveClassName("disabled");
							break;

					}
					//mygis.UI.selectToolbar("0,1,2",true);
					
					document.getElementById("selectClear").ex_RemoveClassName("disabled");
				},
				"featureunselected": function(e){
					
				}
			 });


		},

		/**
			Gathers the features to modify/delete/insert

			@method getFinalChanges
			@return {Object} Object with features to modify/delete/insert
		**/
		getFinalChanges: function(){
			for (var i=0;i<featuresDeleted.length;i++){
				var item = featuresDeleted[i];
				if (item.fid){
					mygis.Drawing.Editing.removeFeatureFromChange(item,featuresModified);	//Remove deleted item from modified items
				}else{
					mygis.Drawing.Editing.removeFeatureFromChange(item,featuresUnsaved);	//Remove deleted item from items to be inserted
				}
			}
			var retvalue = {};
			retvalue.featuresModified = featuresModified;
			retvalue.featuresDeleted  = featuresDeleted;
			retvalue.featuresUnsaved  = featuresUnsaved;

			return retvalue;
		},

		/**
			Removes a given feature from the given 'change' array

			@method removeFeatureFromChange
			@param feature The feature to remove
			@param featureArray The array to remove it from
		**/
		removeFeatureFromChange: function(feature,featureArray){
			var found=false;
			var i=0;

			while (i<featureArray.length && !found){
				var comp = featureArray[x];
				if (comp.fid==feature.fid){
					found=true;
					featureArray.splice(i,1);
				}else{
					i++;
				}
			}

		}


	},

	/**
	Provides various objects and methods related to styling.
	@class Drawing.Styling
	@static
	**/
    Styling: {
		polyStyle: {
			strokeColor: "#FF0000",
			fillColor: "#FF0000",
			strokeOpacity: 1,
			fillOpacity: 0.5,
			strokeWidth: 3
		},

		lineStyle: {
			color: "#FF0000",
			width: 3,
			opacity: 1
		},

		pointStyle: {
			icon: config.folderPath+"Images/Styles/marker/location.png",
			size: 32,
			defaultIcon: config.folderPath+"Images/Styles/marker/location.png"
		},

		/**
			Returns the default OpenLayers style, parameterized by the defaults specified in mygis.Drawing.Styling
			@method getOLStyle
			@param {String} type 'point','line','polygon','selectpoint','selectline','selectpolygon'
			@return {Object} An object containing the appropriate style.
		**/
		getOLStyle: function(type){

			var retvalue;
			switch(type)
			{
				case 'point':

					var defaultPointStyle = OpenLayers.Util.applyDefaults(defaultPointStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultPointStyle.externalGraphic = mygis.Drawing.Styling.pointStyle.icon;
					defaultPointStyle.graphicWidth = mygis.Drawing.Styling.pointStyle.size;
					defaultPointStyle.graphicHeight = mygis.Drawing.Styling.pointStyle.size;
					defaultPointStyle.graphicOpacity = 1;
					defaultPointStyle.graphicXOffset=-16;
					defaultPointStyle.graphicYOffset=-32;
					retvalue = defaultPointStyle;

					break;
				case 'line':
					var defaultLineStyle = OpenLayers.Util.applyDefaults(defaultLineStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultLineStyle.strokeColor = mygis.Drawing.Styling.lineStyle.color;
					defaultLineStyle.strokeOpacity = mygis.Drawing.Styling.lineStyle.opacity;
					defaultLineStyle.strokeWidth = mygis.Drawing.Styling.lineStyle.width;
					defaultLineStyle.strokeDashstyle = "longdashdot";
					retvalue = defaultLineStyle;

					break;
				case 'polygon':
					var defaultPolyStyle = OpenLayers.Util.applyDefaults(defaultPolyStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultPolyStyle.fillColor = mygis.Drawing.Styling.polyStyle.fillColor;
					defaultPolyStyle.fillOpacity = mygis.Drawing.Styling.polyStyle.fillOpacity;
					defaultPolyStyle.strokeColor = mygis.Drawing.Styling.polyStyle.strokeColor;
					defaultPolyStyle.strokeOpacity = mygis.Drawing.Styling.polyStyle.strokeOpacity;
					defaultPolyStyle.strokeWidth = mygis.Drawing.Styling.polyStyle.strokeWidth;
					retvalue = defaultPolyStyle;

					break;
				case 'selectPolygon':
					var defaultPolyStyle = OpenLayers.Util.applyDefaults(defaultPolyStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultPolyStyle.strokeColor = "#000000";
					defaultPolyStyle.fillColor = "#FF00FF";
					defaultPolyStyle.strokeOpacity = 1;
					defaultPolyStyle.fillOpacity = 0.5;
					defaultPolyStyle.strokeWidth = 0.7;
					retvalue = defaultPolyStyle;

					break;
				case 'selectLine':
					var defaultLineStyle = OpenLayers.Util.applyDefaults(defaultLineStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultLineStyle.strokeColor = "#FF0000";
					defaultLineStyle.fillColor = "#FF0000";
					defaultLineStyle.strokeOpacity = 1;
					defaultLineStyle.fillOpacity = 0.7;
					defaultLineStyle.strokeWidth = 0.7;
					retvalue = defaultLineStyle;
					break;
				case 'selectPoint':
					var defaultPointStyle = OpenLayers.Util.applyDefaults(defaultPointStyle, OpenLayers.Feature.Vector.style['temporary']);
					defaultPointStyle.strokeColor = "#000000";
					defaultPointStyle.fillColor = "#000000";
					defaultPointStyle.fillOpacity = 0.7;
					retvalue = defaultPointStyle;
					break;
			}
			return retvalue;
		},

		/**
			Returns an OpenLayers config object for symbolizer
			@method getSymbolizer
			@param {String} type 'Point','Line', or 'Polygon'
			@return {Object} The config object.
		**/
		getSymbolizer: function(type){
			var retvalue=new Object();
			var inner;
			switch (type)
			{
				case "Point":
					inner = new Object();
					inner.strokeColor = "";	//[String] Color for line stroke.
					inner.strokeOpacity = 1;	//[Number] Stroke opacity (0-1).
					inner.strokeWidth = 1;	//[Number] Pixel stroke width.
					inner.strokeLinecap = "square";	//[String] Stroke cap type (βbuttβ, βroundβ, or βsquareβ).
					inner.fillColor = "#FF0000";	//[String] RGB hex fill color .
					inner.fillOpacity = 1;	//[Number] Fill opacity (0-1).
					inner.pointRadius = 5;	//[Number] Pixel point radius.
					inner.externalGraphic = "";	//[String] Url to an external graphic that will be used for rendering points.
					inner.graphicWidth = 16;	//[Number] Pixel width for sizing an external graphic.
					inner.graphicHeight = 16;	//[Number] Pixel height for sizing an external graphic.
					inner.graphicOpacity = 1;	//[Number] Opacity (0-1) for an external graphic.
					inner.graphicXOffset = 0;	//[Number] Pixel offset along the positive x axis for displacing an external graphic.
					inner.graphicYOffset = 0;	//[Number] Pixel offset along the positive y axis for displacing an external graphic.
					inner.rotation = 0;	//[Number] The rotation of a graphic in the clockwise direction about its center point (or any point off center as specified by graphicXOffset and graphicYOffset).
					inner.graphicName = "";	//[String] Named graphic to use when rendering points.
					break;
				case "Line":
					inner = new Object();
					inner.strokeColor = "#FF0000";	//[String] Color for line stroke.
					inner.strokeOpacity = 1;	//[Number] Stroke opacity (0-1).
					inner.strokeWidth = 1;	//[Number] Pixel stroke width.
					inner.strokeLinecap = "square";	//[String] Stroke cap type (βbuttβ, βroundβ, or βsquareβ).
					break;
				case "Polygon":
					inner = new Object();
					inner.strokeColor = "#FF0000";	//[String] Color for line stroke.
					inner.strokeOpacity = 1;	//[Number] Stroke opacity (0-1).
					inner.strokeWidth = 1;	//[Number] Pixel stroke width.
					inner.strokeLinecap = "square";	//[String] Stroke cap type (βbuttβ, βroundβ, or βsquareβ).
					inner.fillColor = "#FF0000";	//[String] RGB hex fill color
					inner.fillOpacity = 1;	//[Number] Fill opacity (0-1).
					break;
			}
			retvalue[type]=inner;
			return retvalue;
		},

		/**
			Returns an SLD object

			@method createSLD
			@param {String} name The named identifier.
			@param {String} geomType 'Point','Line', 'Polygon' or 'Mixed'
			@return {Object} The sld object.
		**/
		createSLD: function(name, geomType){
			var sld ={
				version: "1.0.0",
				namedLayers: new Object()
			};
			var sldString;
			var retvalue = new Object();
			retvalue.name = name;
			retvalue.userStyles = [];
			retvalue.userStyles[0]= {
				rules: []
			};
			switch(geomType){
				case 'Point':
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Point",name));
					break;
				case 'Line':
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Line",name));
					break;
				case 'Polygon':
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Polygon",name));
					break;
				case 'Mixed':
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Point",name));
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Line",name));
					retvalue.userStyles[0].rules.push(new mygis.Drawing.Styling.createSLDRule("","Polygon",name));
					break;
			}

			sld.namedLayers[name] = retvalue;
			return sld;
		},

		/**
			Creates a named sld rule.

			@method createSLDRule
			@param {String} name The named identifier.
			@param {String} geometryType 'Point','Line', 'Polygon' or 'Text'
			@param {String} layername
			@return {Object} The sld rule for the given layer.
		**/
		createSLDRule: function(name,geometryType,layername){
			var retvalue;
			var assignedName;

			if (name){
				assignedName=name;
			}else{
				switch (geometryType){
					case "Point":
						assignedName = layername+" - Points";
						break;
					case "Line":
						assignedName = layername+" - Lines";
						break;
					case "Polygon":
						assignedName = layername+" - Polygons";
						break;
					case "Text":
						assignedName = layername+" - labels";
						break;
					default:
						assignedName = layername;
				}
			}
			if (geometryType){
				var assignedSymbolizer = new mygis.Drawing.Styling.getSymbolizer(geometryType);
				retvalue= new OpenLayers.Rule({
					name: assignedName,
					title: assignedName,
					description: '',
					symbolizer: assignedSymbolizer,
					filter: mygis.Drawing.Styling.getSLDFilter("EQ","Geometry",geometryType)
				});
			}else{
				retvalue= new OpenLayers.Rule({
					name: assignedName,
					title: assignedName,
					description: ''
				});
			}


			return retvalue;
		},

		/**
			Creates an sld filter.

			@method getSLDFilter
			@param {String} comparison The type of comparison. Possible values: "EQ", "LIKE", "NEQ", "GEQ", "GT", "LT", "LEQ"
			@param {String} property The property to filter
			@param {String} value The filter's value

			@return {Object} The sld filter.
		**/
		getSLDFilter: function(comparison,property,value){
			var retvalue;
			var comptype;
			switch (comparison)
			{
				case "EQ":
					comptype = OpenLayers.Filter.Comparison.EQUAL_TO;
					break;
				case "LIKE":
					comptype = OpenLayers.Filter.Comparison.LIKE;
					break;
				case "NEQ":
					comptype = OpenLayers.Filter.Comparison.NOT_EQUAL_TO;
					break;
				case "GEQ":
					comptype = OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO;
					break;
				case "GT":
					comptype = OpenLayers.Filter.Comparison.GREATER_THAN;
					break;
				case "LT":
					comptype = OpenLayers.Filter.Comparison.LESS_THAN;
					break;
				case "LEQ":
					comptype = OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO;
					break;
			}
			if (property=="Geometry" && value!="Point"){
				switch (value){
					case "Polygon":
						retvalue = new OpenLayers.Filter.Logical({
							type: OpenLayers.Filter.Logical.OR,
							filters: [
								new OpenLayers.Filter.Comparison({
									type: comptype,
									property: property,
									value: value
								}),
								new OpenLayers.Filter.Comparison({
									type: comptype,
									property: property,
									value: 'MultiPolygon'
								})
							]
						});
						break;
					case "Line":
						retvalue = new OpenLayers.Filter.Logical({
							type: OpenLayers.Filter.Logical.OR,
							filters: [
								new OpenLayers.Filter.Comparison({
									type: comptype,
									property: property,
									value: 'LineString'
								}),
								new OpenLayers.Filter.Comparison({
									type: comptype,
									property: property,
									value: 'MultiLineString'
								})
							]
						});
						break;
				}
			}else{
				retvalue = new OpenLayers.Filter.Comparison({
								type: comptype,
								property: property,
								value: value
							});
			}
			return retvalue;
		},

		/**
		 * Displays the Style Manager window
		 * @method showStyleManager
		 * @param {String} layerIDThe layer tablename to edit
		 */
		showStyleManager:function(layerID){
			var windowTitle="Manager";
			var myconfig = "";
			$("#styleManagerTitleElem").html(windowTitle);
			//myconfig.checkfn = ;
			//myconfig.callbackfn = ;
			//myconfig.objectCount = -1;
			//myconfig.windowTitle = "";
			$("#styleManager").dialog({
				autoOpen: true,
				modal: true,
				resizable: false,
				width: 900,
				height: 510,
				title: "",
				closeOnEscape:false
			})
		},

		/**
		 * Handles switching of tabs in theStyle Manager window
		 * @method styleManager_switchTab
		 * @param {Integer} index The tab index
		 */
		styleManager_switchTab: function(index){
			var tabHeaders = $("#styleManagerLinkTabsRound").find(".sectionHeader");
			for (var i=0;i<tabHeaders.length;i++){
				if (i!=index){
						tabHeaders[i].ex_RemoveClassName("active");
				}else{
						tabHeaders[i].ex_AddClassName("active");
				}
			}
			var tabs = $("#styleManagerHeaderTab").find(".appSettingFrame");
			for (var i=0;i<tabs.length;i++){
				if (i!=index){
						$(tabs[i]).hide();
				}else{
						$(tabs[i]).show();

				}
			}
		}
	},

	/**
	Provides various objects and methods related to exporting the map and/or its objects

	@class Drawing.Exporting
	@static
	**/
    Exporting: {


		/**
			Exports the current map with the "KTIMATOLOGIO" background

			@method exportMapAs
			@param {String} filetype The format to export to. Accepts "jpg", "png", "pdf","kml", "kmz"
		**/
		exportMapAs: function(filetype){
			var format;
			var bbox = digimap.getExtent().toBBOX();
			var srs = digimap.projection.toString();
			var size = digimap.getSize();
			var layersNormal=mygis.Utilities.getVisibleLayerString(currentAppName);
			var layerBG;
			switch (digimap.baseLayer.params.LAYERS){
				case "landsat5":
				case "KTBASEMAP":
				case "landsat":
				case "openstreetmap":
				case "bluemarble":
					layerBG = digimap.baseLayer.params.LAYERS;
					break;
				default:
					layerBG = "openstreetmap";
					break;
			}
			//layerBG= "KTBASEMAP";//digimap.baseLayer.params.LAYERS;	//TODO proper
			var layers=layerBG+","+layersNormal;
			var url;
			switch (filetype){
				case "jpg":
					format = "image/jpeg";
					break;

				case "png":
					format = "image/png";
					break;
				case "pdf":
					format = "application/pdf";
					break;

				case "kml":
					format = "application/vnd.google-earth.kml+xml";
					break;
				case "kmz":
					format = "application/vnd.google-earth.kmz+xml";
					break;

			}
			url = mygis.Utilities.format(config.mapserver+"wms?service=WMS&version=1.1.0&request=GetMap&layers={0}&styles=&bbox={1}&width={2}&height={3}&srs={4}&format={5}&TILED=TRUE",
				layers,bbox,size.w,size.h,srs,format);
			window.open(url);
		},

		/**
			Exports the layer's features to GeoJSON

			@method layerToJSON
			@param {Object} layer An OpenLayers layer
		**/
		layerToJSON: function(layer){
			var retvalue="";
			var features = layer.features;
			var writer = new OpenLayers.Format.GeoJSON();
			retvalue = writer.write(features);
			return retvalue;
		},

		/**
			Exports the layer's features to WKT

			@method layerToWKT
			@param {Object} layer An OpenLayers layer
		**/
		layerToWKT: function(layer){
			var retvalue="";
			var features = layer.features;
			var writer = new OpenLayers.Format.WKT();
			for (var i=0;i<features.length;i++){
				if (i>0){
					retvalue+="$";
				}
				features[i].geometry.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
				retvalue += writer.write(features[i]);
				features[i].geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			}
			//retvalue = writer.write(features);
			return retvalue;
		},

		/**
			Exports the features to WKT

			@method arrayToWKT
			@param {Array} featureArray An array of OpenLayers features
		**/
		arrayToWKT: function(featureArray){
			var retvalue="";
			var features = featureArray;
			var writer = new OpenLayers.Format.WKT();
			for (var i=0;i<features.length;i++){
				features[i].geometry.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
				if (i>0){
					retvalue+="$";
				}
				retvalue += writer.write(features[i]);
			}

			return retvalue;
		},
		
		checkDigitizing: function(event){
			mygis.Drawing.Editing.attachFieldsToFeature(true);
			var dataObj = featuresUnsaved[featuresUnsaved.length-1].data;
			if(mygis.Drawing.Editing.isFilledIn(dataObj)){
				var errorsFound=$(event.target).closest(".ui-dialog").find("form .error").length>0;
				if (errorsFound){
					showConfirmationDialog(strings.Editing.loseAllChanges,function(){	
						var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
						try{
							dialogContent.dialog('destroy');
							dialogContent.remove();
						}catch(err){}
						console.log("removed 1");
						mygis.UI.clearUnsavedLayer(layerCurrentEditing);
						digimap.layers[1].redraw(true);
						mygis.UI.activateControl('drag');
						
					},function(){console.log('cancelled');return false});
				}else{
					showConfirmationDialog(strings.Editing.saveNewObjQuestion,function(){
						var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
						try{
							dialogContent.dialog('destroy');
							dialogContent.remove();
						}catch(err){}
						console.log("removed 2");
						mygis.Drawing.Exporting.saveDigitizing();	
					},function(){console.log('cancelled');return false});
				}
				return false;
			}else{
				cosmeticLayer.destroyFeatures();
				var dialogContent=$(event.target).closest(".ui-dialog").find(".ui-dialog-content");
				try{
					dialogContent.dialog('destroy');
					dialogContent.remove();
				}catch(err){}
				console.log("removed 3");
			}
		},
		
		checkRights: function(oid,layerID,operation){
			retvalue=false;
			if (!$.isEmptyObject(internalMemory.layerRights)){
				var fn2= function(elem){
					return elem.objectID==oid;
				}
				if (internalMemory.layerRights[layerID]){
					var object = internalMemory.layerRights[layerID].find(fn2);
					if (object){
						if ((operation=='update' || operation== null) && (object.hasUpdate || object.isOwner)){
							retvalue=true;
						}
						if ((operation=='delete' || operation== null) && (object.hasDelete || object.isOwner)){
							retvalue=true;
						}
					}
				}
			}
			return retvalue;
		},

		/**
			Gets all unsaved features and saves them to the DB.

			@method saveDigitizing
		**/
		saveDigitizing: function(){
			//var elem=document.getElementById('mapAction_Save');
			//if (!elem.ex_HasClassName('disabled')){
				var layername = layerSource.records[layerCurrentEditing].layerTABLE;
				var postObject=new Object();
				var featuresAttr="";
				var featuresImages="";
				var featuresFiles="";
				var featArray = mygis.Drawing.Editing.getFinalChanges();

				//Build strings for each unsaved feature
				$.each(featArray.featuresUnsaved,function(i,v){
					if (i>0){
						featuresAttr+="$";
						featuresImages+="$";
						featuresFiles+="$";
					}
					//column data string:
					var counter=0;
					$.each(v.data,function(j,vv){
						if (counter>0){featuresAttr+="#";}
						featuresAttr += j.toString() +"%"+vv.toString();
						counter++;
					});
					//attached images string:
					var imagecounter=0;
					if (v.attachedImages){
						$.each(v.attachedImages,function(k,vvv){
							if (imagecounter>0){featuresImages+="#";}
							featuresImages+= vvv.toString();
							imagecounter++;
						});
					}
					//attached files string:
					var filecounter=0;
					if (v.attachedFiles){
						$.each(v.attachedFiles,function(l,vvvv){
							if (filecounter>0){featuresFiles+="#";}
							featuresFiles+= vvvv.toString();
							filecounter++;
						});
					}
				});

				//----------NEW
				postObject["layerID"]=layerSource.records[layerCurrentEditing].layerID;
				postObject["layername"]=layername;
				postObject["featureAttr"]=featuresAttr;
				postObject["featureImages"]=featuresImages;
				postObject["featureFiles"]=featuresFiles;
				postObject["geometry"]=mygis.Drawing.Exporting.arrayToWKT(featArray.featuresUnsaved);
				postObject["crs"]=digimap.displayProjection.toString();


				//----------MODIFIED
				var writer = new OpenLayers.Format.WKT();
				var output = [];
				$.each(featArray.featuresModified, function(i,v){
					var mydata = "";
					counter = 0;
					var outputItem={};
					/*
					$.each(v.data,function(j,vv){
						if (counter>0){mydata+="#";}
						mydata += j.toString() +"%"+vv.toString();
						counter+=1;
					});
					*/
					var mydata = "";
					counter = 0;
					if (v.attachedImages){
						$.each(v.attachedImages,function(j,vv){
							if (counter>0){mydata+="#";}
							mydata+= vv.toString();
							counter+=1;
						});
					}
					
					outputItem.images=mydata;
					var mydata = "";
					counter = 0;
					if (v.attachedFiles){
						$.each(v.attachedFiles,function(j,vv){
							if (counter>0){mydata+="#";}
							mydata+= vv.toString();
							counter+=1;
						});
					}
					
					outputItem.files=mydata;
					outputItem.data = v.data;
					
					//outputItem.geometry=writer.write(v);
					output.push(outputItem);
				});
				postObject["modified"]=JSON.stringify(output);
				//----------TO DELETE
				var output = "";
				counter = 0;
				$.each(featArray.featuresDeleted,function(i,v){
					if (counter>0){output+="#";}
					output += v;
					counter+=1;
				});
				postObject["deleted"]=output;

				$.ajax({
				  type: 'POST',
				  url: config.mgreq+"?qtype=SaveDigitizing",
				  data: postObject,
				  success: mygis.UI.saveDigiResults
				});
			/*}else{

			}
			*/
		},

		/**
			TODO: Posts back the layer style.

			@method updateStyle

		**/
		updateStyle: function(){
			var postObject=new Object();
			postObject["layer"]=layername;
			postObject["sld"]=null;	//TODO
			$.ajax({
			  type: 'POST',
			  url: config.mgreq+"?qtype=updateStyle",
			  data: postObject,
			  success: null	//TODO
			});
		},

		/**
			Attaches all fields in the editableInfo window to the last feature digitized.

			@method attachInfoToFeature
		**/
		attachInfoToFeature: function(){
			var f = featuresUnsaved[featuresUnsaved.length-1];	//last object
			var editwindow = $("#editableInfo");
			var fieldsToAttach = editwindow.find(".infoFields span.featureHCell");
			var fieldValues = editwindow.find(".infoFields input.featureVCell");
			$.each(fieldValues,function(i,v){
				f.data[$(fieldsToAttach[i]).html()]=v.value;
				v.value="";
			});
			displayNotify(strings.Editing.tempNewObj+layerSource.records[layerCurrentEditing].layerNAME);

		}


	},

	/**
	Provides various objects and methods related to importing things into the current map

	@class Drawing.Importing
	@static
	**/
	Importing: {

		/**
			Loads a KML

			@method loadKML
			@param {String} kmlstring
			@param {String} layername
			@deprecated
        */
        loadKML: function(kmlstring,layername) {
			var realParse = function(nodes,options){

			}
            var format = new OpenLayers.Format.KML({
				'internalProjection': digimap.baseLayer.projection,
				'externalProjection': new OpenLayers.Projection("EPSG:4326"),
				'extractStyles': true,
				'extractAttributes': true
			});

			var newLayer = new OpenLayers.Layer.Vector(layername);

			setTimeout(function(){
				newLayer.addFeatures(format.read(kmlstring));
			},25);
			digimap.addLayers([newLayer]);




        }
    }

};

//END of mygis.Drawing

/**
Methods used instead of OpenLayers default ones

@class OLOverrides
@static
**/
mygis.OLOverrides = {

	CustomDragControl: OpenLayers.Class(OpenLayers.Control, {

		defaultHandlerOptions: {
			'stopDown': false
			/* important, otherwise it prevent the click-drag event from 
			   triggering the normal click-drag behavior on the map to pan it */
		},

		initialize: function(options) {
			this.handlerOptions = OpenLayers.Util.extend(
				{}, this.defaultHandlerOptions
			);
			OpenLayers.Control.prototype.initialize.apply(
				this, arguments
			); 
			this.handler = new OpenLayers.Handler.Drag(
				this, {
					'down': this.onDown, //could be also 'move', 'up' or 'out'
					'move': this.onMove,
					'up': this.onUp
				}, this.handlerOptions
			);
		}, 

		onDown: function(evt) {
			// do something when the user clic on the map (so on drag start)
			//console.log('user clicked down on the map');
		},
		onMove: function(evt){
			//console.log('user moved the map');
		},
		onUp: function(evt){
			//console.log('user released the map');
			internalMemory.lastZoom=digimap.getExtent();
		}
	}),
	
	/**
		Provides overrides for OpenLayers.Control

		@class OLOverrides.mygis_Control
		@static
	**/
	mygis_Control: {

			/**
				Provides ovverrides for OpenLayers.Control.GetFeature

				@class OLOverrides.mygis_Control.mygis_GetFeature
				@static
			**/
			mygis_GetFeature: {

				/**
					Used instead of GetFeature.request. Adds any existing cql_filters to the spatial one.

					@method mygis_request
				**/
		
				mygis_request: function(bounds, options) {
					options = options || {};
					var filter;
					if (customFiltered){
						var format = new OpenLayers.Format.CQL();
						var filterA_cql = mygis.Map.getCustomFilter(this.protocol.featureType);
						try{
						var filterA = format.read(filterA_cql);
						//JK CHANGES - add the circle functionality
						if (this.circle){
							var filterB = new OpenLayers.Filter.Spatial({
								type: OpenLayers.Filter.Spatial.INTERSECTS,
								value: bounds
							});
						}else{
							var filterB = new OpenLayers.Filter.Spatial({
								type: this.filterType,
								value: bounds
							});
						}
						//JK CHANGES END
						filter = new OpenLayers.Filter.Logical({
							type: OpenLayers.Filter.Logical.AND,
							filters: [filterA,filterB]
						});
						}catch(err){
							console.log("Error in converting CQL filter: "+err.message);
							//JK CHANGE - add the circle functionality
							if (this.circle) {
								filter = new OpenLayers.Filter.Spatial({ 
								type: OpenLayers.Filter.Spatial.INTERSECTS, 
								value: bounds /* bounds is the geometry representing the circle */ 
								}); 
							} else {
								filter = new OpenLayers.Filter.Spatial({ 
									type: this.filterType,  
									value: bounds
								});
							}
							//JK CHANGES END
						}
					}else{
						//JK CHANGE - add the circle functionality
						/* Default OL functionality */
						if (this.circle) {
							filter = new OpenLayers.Filter.Spatial({ 
							type: OpenLayers.Filter.Spatial.INTERSECTS, 
							value: bounds /* bounds is the geometry representing the circle */ 
							}); 
						} else {
							filter = new OpenLayers.Filter.Spatial({ 
								type: this.filterType,  
								value: bounds
							});
						}
						//JK CHANGES END
					}
					// Set the cursor to "wait" to tell the user we're working.
					mygis.Utilities.blockUI();
					//OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");

					var response = this.protocol.read({
						maxFeatures: options.single == true ? this.maxFeatures : undefined,
						filter: filter,
						callback: function(result) {
							mygis.Utilities.unblockUI();
							if(result.success()) {
								if(result.features.length) {
									//JK CHANGE
									if (this.circle){mygis.OLOverrides.mygis_Control.mygis_GetFeature.selectBestFeature_Circle(result.features,bounds.getCentroid(), options, this);}
									else{this.selectBestFeature(result.features,bounds.getCenterLonLat(), options);}
									//JK CHANGE END
								} else if(options.hover) {
									this.hoverSelect();
								} else {
									this.events.triggerEvent("clickout");
									if(this.clickout) {
										this.unselectAll();
									}
									displayShortNotify(strings.Info.noResults);
									if (!document.getElementById("panel3Out").ex_HasClassName("collapsed")){
										document.getElementById("panel3Out").ex_AddClassName("collapsed");
										document.getElementById("rpanelCollapseBtn").ex_RemoveClassName("active");
										document.getElementById("panel2").ex_RemoveClassName("rightExpanded");
									}
								}
							}
							// Reset the cursor.
							OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
						},
						scope: this
					});
					if(options.hover == true) {
						this.hoverResponse = response;
					}
				},

				/**
					Used instead of GetFeature.selectBeastFeature, to overcome some conditions that we didn't want applied.

					@method mygis_selectBestFeature
					@deprecated We now use mygis_selectBestFeature_v2 instead.
				**/
				mygis_selectBestFeature: function(features, clickPosition, options) {
				options = options || {};
				if(features.length) {

						var point = new OpenLayers.Geometry.Point(clickPosition.lon,
							clickPosition.lat);
						var feature, resultFeature, dist;
						var minDist = Number.MAX_VALUE;
						var i;
						var areas = [];
						// treat (multi)polygons separately
						for(i=features.length-1; i>=0; i--) {
							feature = features[i];
							if(feature.geometry instanceof OpenLayers.Geometry.Polygon ||
							   feature.geometry instanceof OpenLayers.Geometry.MultiPolygon) {
								areas.push(features.pop());
							}
						}
						var compare = function(feature) {
							if(feature.geometry) {
								dist = point.distanceTo(feature.geometry, {edge: false});
								if(dist < minDist) {
									minDist = dist;
									resultFeature = feature;
								}
							}
						};
						if (features.length) {
							// points or linestring take precedence to any polygon
							for(i=0; i<features.length; ++i) {
								feature = features[i];
								compare(feature);
							}
						} else {
							areas.reverse();
							for(i=0; i<areas.length; ++i) {
								feature = areas[i];
								compare(feature);
							}
						}

						if(options.hover == true) {
							this.hoverSelect(resultFeature);
						} else {
							this.select(resultFeature || features);
						}

				}
			},

			/**
				Used instead of GetFeature.selectBeastFeature, to overcome some conditions that we didn't want applied.

				@method mygis_selectBestFeature_v2
			**/
			mygis_selectBestFeature_v2: function(features){
				if (mygis.UI.isActiveSelectMode("mode_TopSelect")){
					var newFeatures = mygis.Map.selectTopFeatures(features);
					this.select(newFeatures);
				}else{
					this.select(features);
				}
			},
			//JK CHANGES 
			/**
			 * Used instead of GetFeature.selectBeastFeature, for circles
			 * Selects the feature from an array of features that is the best match
			 * for the click position.
			 */
			selectBestFeature_Circle: function(features, clickPosition, options, circle) {
				options = options || {};
				if(features.length) {
					var point = new OpenLayers.Geometry.Point(clickPosition.x,clickPosition.y);					
					var feature, resultFeature, dist;
					var minDist = Number.MAX_VALUE;
					for(var i=0; i<features.length; ++i) {						
						feature = features[i];
						if(feature.geometry) {
							dist = point.distanceTo(feature.geometry, {edge: false});
							if(dist < minDist) {
								minDist = dist;
								resultFeature = feature;
								if(minDist == 0) {break;}
							}
						}
					}					
					if(options.hover == true) {circle.hoverSelect(resultFeature);
					} else {						
						//circle.select(resultFeature || features); //unuseable coz circle mode
						//recreate the .select function just for the circle mode
						features = features || resultFeature
						if(!circle.multiple && !circle.toggle) {circle.unselectAll();}
						if(!(OpenLayers.Util.isArray(features))) {features = [features];}						
						var cont = circle.events.triggerEvent("beforefeaturesselected", {features: features});
						if(cont !== false) {
							var selectedFeatures = [];
							var feature;
							for(var i=0, len=features.length; i<len; ++i) {
								feature = features[i];
								if(circle.features[feature.fid || feature.id]) {
									if(circle.toggle) {circle.unselect(circle.features[feature.fid || feature.id]);}
								} else {
									cont = circle.events.triggerEvent("beforefeatureselected", {feature: feature});
									if(cont !== false) {
										circle.features[feature.fid || feature.id] = feature;
										selectedFeatures.push(feature);								
										circle.events.triggerEvent("featureselected",{feature: feature});
									}
								}
							}
							circle.events.triggerEvent("featuresselected", {features: selectedFeatures});
						}
					}
				}
			}
			//JK CHANGES END
		}
	}
};

//END of mygis.OLOverrides

/**
	All map related functions and main functionality.

	@class Map
	@static
**/
mygis.Map = {

	/**
		Overrides the default map to load.

		@method overrideDefaults
	**/
	overrideDefaults: function(params){
		internalConfig.changeDefaultMap = params;
	},

    /**
		Initializes variables
		@method setDigiVars
		@param contID The map container's ID
		@param tools An array of integers, specifying tools to enable
		@param misc Various application parameters
    **/
    setDigiVars: function(contID, tools, misc) {
		backgrounds = {
			google: {
				terrain: {
					name: strings.BackgroundLayers.google_terrain,
					options: {
						type: google.maps.MapTypeId.TERRAIN,
						numZoomLevels: 20,
						sphericalMercator:true,
						maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						attribution: "Map data ©2014 Basarsoft,Google"
					},
					isWMS: false
				},
				roadmap: {
					name: strings.BackgroundLayers.google_roadmap,
					options: {
						type: google.maps.MapTypeId.ROADMAP,
						numZoomLevels: 20,
						sphericalMercator:true,
						maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						attribution: "Map data ©2014 Basarsoft,Google"
					},
					isWMS: false
				},
				satellite: {
					name: strings.BackgroundLayers.google_satellite,
					options: {
						type: google.maps.MapTypeId.SATELLITE,
						numZoomLevels: 20,
						sphericalMercator:true,
						maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						attribution: "Map data ©2014 Basarsoft,Google"
					},
					isWMS: false
				},
				hybrid: {
					name: strings.BackgroundLayers.google_hybrid,
					options: {
						type: google.maps.MapTypeId.HYBRID,
						numZoomLevels: 20,
						sphericalMercator:true,
						maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
						attribution: "Map data ©2014 Basarsoft,Google"
					},
					isWMS: false
				}
			},
			ktimatologio:{
				name:strings.BackgroundLayers.ktimatologio,
				url: "http://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx",
				options:{
					layers: "KTBASEMAP",
					TILED: "true",
					format: "image/png",
					CRS: "EPSG:4326"
				},
				secondaryOptions:{
					tileSize: new OpenLayers.Size(256,256),
					isBaseLayer: true,
					attribution: strings.BackgroundLayers.ktimatologio_attrib,
					buffer: 0
				},
				mg_MinScale: -1,
				mg_MaxScale: 27000000,
				isWMS: true
			},
			
			opengeo_BLUEMARBLE: {
				name:strings.BackgroundLayers.opengeo_BLUEMARBLE,
				url: "http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi",
				options:{
					layers: "BlueMarble_NextGeneration",
					TILED: "true",
					format: "image/jpeg",
					CRS: "EPSG:4326"
				},
				secondaryOptions:{
					tileSize: new OpenLayers.Size(256,256),
					isBaseLayer: true,
					attribution: strings.BackgroundLayers.opengeo_BLUEMARBLE_attrib,
					buffer: 0
				},
				mg_MinScale: 800000,
				mg_MaxScale: -1
			},
			
			opengeo_OSM:{
				name: "OpenStreetMap",	//strings.BackgroundLayers.opengeo_OSM,
				url: "http://maps.opengeo.org/geowebcache/service/wms",
				options:{
					layers: "openstreetmap",
					TILED: "true",
					format: "image/png",
					CRS: "EPSG:4326"
				},
				secondaryOptions:{
					tileSize: new OpenLayers.Size(256,256),
					isBaseLayer: true,
					attribution: strings.BackgroundLayers.opengeo_OSM_attrib
				},
				mg_MinScale: -1,
				mg_MaxScale: -1,
				isWMS: true
			},
			nasa_LANDSAT:{
				name:strings.BackgroundLayers.nasa_LANDSAT,
				url: "http://irs.gis-lab.info/",
				options:{
					layers: "landsat",
					TILED: "true",
					format: "image/jpeg",
					CRS: "EPSG:4326"
				},
				secondaryOptions:{
					tileSize: new OpenLayers.Size(256,256),
					isBaseLayer: true,
					attribution: strings.BackgroundLayers.nasa_LANDSAT_attrib
				},
				mg_MinScale: -1,
				mg_MaxScale: -1,
				isWMS: true
			}
			
		};
		digiContainer = document.getElementById(contID);
		if (misc) {
			try {
				if (misc[0]) {appPath = misc[0];}
				//if (misc[1]) {layerlist = document.getElementById(misc[1]);}
				if (misc[2]) {postbackurl = misc[2];}
				if (misc[3]) {extra = misc[3];}
				if (misc[4]) {myguid = misc[4];}
				if (misc[5]) {postbackurl = misc[5];}
			} catch (Error) { }
		}

		if (tools) {
			for (var i = 0; i < tools.length; i++) {
				switch (tools[i]) {
					case 0:
						toolsEnabled.allTools = true;
						break;
					case 1:
						toolsEnabled.toolbar = true;
						break;
					case 2:
						toolsEnabled.search = true;
						break;
					case 3:
						toolsEnabled.maps = true;
						break;
					case 4:
						toolsEnabled.layers = true;
						break;
					case 5:
						toolsEnabled.marker = true;
						break;
					case 6:
						toolsEnabled.filledRect = true;
						break;
					case 7:
						toolsEnabled.openRect = true;
						break;
					case 8:
						toolsEnabled.filledCircle = true;
						break;
					case 9:
						toolsEnabled.openCircle = true;
						break;
					case 10:
						toolsEnabled.openPolygon = true;
						break;
					case 11:
						toolsEnabled.filledPolygon = true;
						break;
					case 12:
						toolsEnabled.polyLine = true;
						break;
					case 13:
						toolsEnabled.polyLineDirections = true;
						break;
					case 14:
						toolsEnabled.database = true;
						break;
				}
			}
		}
		mygis.Map.initMap();


    },

    /**
		Initializes the map object and services
		@method initMap
    **/
    initMap: function() {
       $.when( loadGoogleMaps( 3, null, 'el-GR' ) )
			.then(function() {
				mygis.Utilities.googleAutoComplete();
		});
	   var sphericalMercator = new OpenLayers.Projection("EPSG:900913");
		var wgs84 = new OpenLayers.Projection("EPSG:4326");
		naviControls = {
			navigation: new OpenLayers.Control.Navigation({
				handleRightClicks: false,
				autoActive:true,
				dragPanOptions: {enableKinetic: true}
			}),
			zoomBox: new OpenLayers.Control.ZoomBox()
		};
		/*
		var mapserver = new OpenLayers.Layer.WMS("OpenLayers WMS",
			"http://vmap0.tiles.osgeo.org/wms/vmap0",
			{ layers: 'basic', gutter:0,buffer:0,isBaseLayer:true,transitionEffect:'resize',
			
			units:"dd",
			//projection: new OpenLayers.Projection("EPSG:4326".toUpperCase()),
			//sphericalMercator: false,
			visibility: false,
			attribution: 'Provided by <a href="http://www.osgeo.org" target="_blank">OSGeo</a>'
			},
			{wrapDateLine: true}
		);
		*/
		var mapserver = new OpenLayers.Layer.OSM();
		
		digimap = new OpenLayers.Map(digiContainer.id, {
			units: 'm',
			projection: sphericalMercator,
			displayProjection: wgs84,
			fractionalZoom: false,
			/*
			maxExtent: new OpenLayers.Bounds(
                -128 * 156543.0339,
                -128 * 156543.0339,
                128 * 156543.0339,
                128 * 156543.0339),
                maxResolution: 156543.0339,
				
				*/
			minResolution: 0.00000001,
			maxResolution: 'auto',
				
			controls: [

				new OpenLayers.Control.ScaleBar({
					'div': OpenLayers.Util.getElement('olScaleLine_wrapper'),
					geodesic: true ,
					minWidth: 150,
					abbreviateLabel:true
				}),
				new OpenLayers.Control.Permalink({
					'id': 'permalink',
					'element': OpenLayers.Util.getElement('permaElem'),
					'div': OpenLayers.Util.getElement('permaContainer')
				}),
				new OpenLayers.Control.Attribution({
					template: '© 2012 AVMap GIS S.A., MyGIS™ , ${layers}',
					'div': OpenLayers.Util.getElement('customAttribution')
				}),
				new OpenLayers.Control.MousePosition({'div':OpenLayers.Util.getElement('ll_mouse'), id: 'll_mouse',formatOutput: mygis.Utilities.formatLonlats})
			]
                
		});
		digimap.addControl(naviControls.navigation);
		digimap.addControl(naviControls.zoomBox);
		digimap.addControl(new mygis.OLOverrides.CustomDragControl({'autoActivate': true}));
		bg1 = new OpenLayers.Layer("No Basemap", {isBaseLayer: true});
		
		var bg1 = new OpenLayers.Layer.Google(
				"Google Hybrid",
				{ type: google.maps.MapTypeId.HYBRID, numZoomLevels: 40}
			); 

		digimap.addLayers([bg1]);
		

		naviControls.overview= new OpenLayers.Control.OverviewMap({
				'div':OpenLayers.Util.getElement('customOverview'),
				size: new OpenLayers.Size(245,104),
				layers: [mapserver.clone()],
				maximized: true,
				autoPan: true,
				mapOptions: {
					tileSize: new OpenLayers.Size(104,104),
					zoom: 5
				}
			});
		
		naviControls.overview.isSuitableOverview = function() {
			return false;
		};
		digimap.addControl(naviControls.overview);
		//naviControls.overview.maxRatio=25;
		//naviControls.overview.maxRatio = naviControls.overview.map.getResolution()/digimap.getResolutionForZoom(digimap.numZoomLevels);
		//naviControls.overview.minRatio = naviControls.overview.map.getResolution()/digimap.getResolutionForZoom(0);

		digimap.events.register("zoomend",digimap,function(){
			document.getElementById('currentScale').innerHTML = "<span class='scalepart1'>1</span><span class='scalepart2'>:</span><span class='scalepart3'> "+mygis.Utilities.addCommas(digimap.getScale().toFixed(0))+"</span>";
			document.getElementById('currentScale').innerHTML = "1: "+mygis.Utilities.addCommas(digimap.getScale().toFixed(0));
			//try{$("#olScale_wrapper").linkselect("val","1: "+mygis.Utilities.addCommas(digimap.getScale().toFixed(0)));}catch(err){}
			mygis.Map.checkScaleConstraints();
		});
		
		digimap.events.register("moveend",digimap,function(){
			clearTimeout(internalConfig.moveendEvent);
			internalConfig.moveendEvent = setTimeout(mygis.Map.moveEnd,500);
		});
		
		mygis.UI.createContextMenu("map");
		var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
			externalGraphic:config.folderPath+"Images/target4.png",
			graphicWidth: 24,
			graphicHeight: 24,
			graphicXOffset:-12,
			graphicYOffset:-12,
			graphicOpacity:1
		},OpenLayers.Feature.Vector.style["default"]));

		cosmeticLayer = new OpenLayers.Layer.Vector("Cosmetic Layer",{
			
			preFeatureInsert: function(feature) {
				//feature.geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
		   }
		   
		});
		selectionLayer = new OpenLayers.Layer.Vector("Selection Layer",{
			styleMap:styleMap,
			
			preFeatureInsert: function(feature) {
				/*
				console.log(feature.geometry.toString());
				console.log(feature.attributes.OID);
				*/
				var y=feature.geometry.getCentroid().y;
				if (y<90 && y>-190){
					feature.geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
				}
		   }
		   
			
		});
		feedbackLayer = new OpenLayers.Layer.Vector("Feedback Layer",{
			
			preFeatureInsert: function(feature) {
				var y=feature.geometry.getCentroid().y;
				if (y<90 && y>-190){
					feature.geometry.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
				}
		   }
		   
		});

		digimap.addLayers([cosmeticLayer,selectionLayer,feedbackLayer]);

		var defaultPointStyle = OpenLayers.Util.applyDefaults(defaultPointStyle, OpenLayers.Feature.Vector.style['temporary']);
		drawControls = {
			marker: new OpenLayers.Control.DrawFeature(cosmeticLayer,
				OpenLayers.Handler.Point,{
					featureAdded: function(feature){
						feature.overlaytype = "marker";
						mygis.UI.increaseMarkers(feature);
					}
				}
			),
			polyline: new OpenLayers.Control.DrawFeature(cosmeticLayer,
				OpenLayers.Handler.Path,{
					featureAdded: function(feature){
						feature.overlaytype = "polyline";
						mygis.UI.increasePolylines(feature);
					}
				}
			),
			polygon: new OpenLayers.Control.DrawFeature(cosmeticLayer,
				OpenLayers.Handler.Polygon,{
					featureAdded: function(feature){
						feature.overlaytype = "polygon";
						mygis.UI.increasePolygons(feature);
					}
				}
			),
			rectangle: new OpenLayers.Control.DrawFeature(cosmeticLayer,
				OpenLayers.Handler.RegularPolygon, {
					featureAdded: function(feature){
						feature.overlaytype = "rectangle";
						mygis.UI.increasePolygons(feature);
					}
				}
			),
			modify: new OpenLayers.Control.ModifyFeature(cosmeticLayer,{
				mode: OpenLayers.Control.ModifyFeature.RESHAPE,
				createVertices: true

			}),
			selection: new OpenLayers.Control.DrawFeature(selectionLayer,
				OpenLayers.Handler.Point,{
					handlerOptions: {
						//style:mygis.Drawing.Styling.getOLStyle('point')
						style: mygis.Drawing.Styling.getOLStyle('point')
					},
					featureAdded: function(feature){
						feature.style = mygis.Drawing.Styling.getOLStyle('point');

						this.layer.redraw();
					}
				}
			)

		};
		for(var key in drawControls) {
			digimap.addControl(drawControls[key]);
		}


		var thelogo = mygis.Map.createLogo();
		$("#avlogo_wrapper").append(thelogo);

		mygis.UI.setProjectionTip();
		
		
		
		//mygis.Utilities.googleAutoComplete();
		
		mygis.UI.createEditableInfo();
		mygis.Map.infoInit();
		$(document).bind('keydown',function(event){
			if (event.ctrlKey || event.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
					case 'i':
						event.preventDefault();
						router('selectCtrl',document.getElementById('infoTool'));
						break;
					case 'f':
						event.preventDefault();
						router('mapFeatureSearchOpen');
						break;
				}
			}else{
				switch (event.which){
					case 27:
						if ($("#mapFeatureSearchBar").is(":visible")){
							event.preventDefault();
							router('mapFeatureSearchClose');
						}
						try{
							$.xhrPool.abortAll();
							mygis.Utilities.unblockUI();
						}catch(err){}
						break;
				}
			}
		});
		$("#mapFeatureSearch").bind('keydown',function(event){
			if(event.keyCode==13){
				internalMemory.searchKeyword = $("#mapFeatureSearch").val();
				if (!$("#mapFeaturesCont").is(":visible")){
					$("#mapFeaturesCont").show();
					$("#mapResultsToggleBtn").attr("class","pressed");
					mygis.Map.moveEnd();
				}else{
					mygis.Map.gotoNextFeatureResult();
				}
				
			}
		});
		
    },

	/**
		Creates a new layer.

		@method createNewLayer
		@param {String} name
	**/
	createNewLayer: function(name){
		var newItem = {};
		$.each(layerSource.records[0],function(key,value){
			newItem[key]="";
		});
		newItem.mapID=$("#mapsList").jqxListBox('getSelectedItem').originalItem.id;
		newItem.layerNAME = name;
		newItem.layerTABLE = currentAppName + "_"+name;
		layerSource.records.splice(0,0,newItem);
		mygis.UI.updateLayerGrid();
	},
	
	moveEnd: function(){
		//if (!maplayout.state.south.isClosed){
		naviControls.overview.ovmap.setCenter(digimap.getCenter());
		if ($("#mapFeaturesCont").is(":visible")){
			var bounds = digimap.getExtent().transform(digimap.getProjection(),new OpenLayers.Projection("EPSG:4326")).toString();
			clearTimeout(internalConfig.moveendEvent);
			digimap.events.remove("moveend");	//to prevent more calls while calculating
			var tablenames=[];
			$.each(layerSource.records,function(x,item){
				if (!(Boolean(item.hidden)===true) && (Boolean(item.Selectable)===true)){
					tablenames.push(item.layerTABLE);
				}
			});
			var data={
				extent: bounds,
				layers: tablenames
			};
			var customUrl = config.mgreq+"?qtype=GetFeatureCount&qContents="+JSON.stringify(data);
			$("#mapFeaturesCont").die().empty();
			$("#mapFeaturesCont").addClass("loading");
			$.ajax({
				type:"GET",
				url: customUrl,
				success: function(data){
					var results = eval(data);
					
					$("#mapFeaturesCont").data("results",results);
					
					var counter=0;
					$.each(results,function(x,result){
						var output=$("<div id='featureResult_"+counter+"' class='featureResult' />");
						var label =$("<h3 class='resultLabel'>"+mygis.Utilities.getFriendlyName(result.TableName)+"</h3>");
						output.append("<div id='featureResultGrid_"+counter+"' />");
						$("#mapFeaturesCont").append(label);
						$("#mapFeaturesCont").append(output);
						counter++;
					});
					//maplayout.show('south');
					var counter=0;
					$.each(results,function(x,result){
						var resultArray=[];
						var mycolumns=[];
						var layerID=mygis.Utilities.mggetLayerID(result.TableName);
						$.each(result.Fields,function(x,field){
							if (mygis.Drawing.Editing.isValidOutputIntern(field.Name)){
								var col={
									text:internalMemory.layerFields[layerID][field.Name].friendlyName,
									datafield: field.Name
								};
								mycolumns.push(col);
							}
						});
						$.each(result.Rows,function(x,row){
							var item={};
							$.each(row.Cells,function(y,cell){
								if (mygis.Drawing.Editing.isValidOutputIntern(cell.ColumnName)){
									item[cell.ColumnName]=cell.Value;
								}
							});
							resultArray.push(item);
						});
						var source= {
							datatype: 'array',
							localdata: resultArray
						};
						$("#featureResultGrid_"+counter).jqxGrid({
							source:source,
							width: '100%',
							rowheight: 29,
							autoheight: true, 
							theme: 'pk_mg',
							columns:mycolumns,
							enableanimations: true,
							enabletooltips: true,
							rowdetails: false,
							sortable: true,
							groupable: false,
							showheader: true,
							showgroupsheader: false,
							editable: false,
							pageable: false,
							columnsresize: true,
							columnsmenu: false,
							columnsreorder: true,
							pageable: true,
							pagesize: 5,
							pagesizeoptions: [5,10,20,50,100,200],
							selectionmode: 'singlecell'//,
							//scrollbarsize: 5
						});
						
						counter++;
					});
					try{
						$("#mapFeaturesCont").accordion('destroy');
					}catch(err){}
					$("#mapFeaturesCont").accordion({ 
						fillSpace:true,  
						heightStyle: 'auto', 
						active: 0, 
						collapsible: true,
						activate: function(event){
							var counter=0;
							var id =arguments[1].newPanel[0].id.split("_")[1];
							//console.log('id :'+id);
							$("#featureResultGrid_"+id).jqxGrid('render');
							/*
							$.each($("#mapFeaturesCont .featureResult"),function(x,item){
								$("#featureResultGrid_"+counter).jqxGrid('render');
								counter++;
							});
							*/
							$("#mapFeaturesCont").scrollTo($("#mapFeaturesCont .resultLabel.ui-state-active"));
						},
						create: function(event){
							internalMemory.mapFeatureResults=null;
							if (internalMemory.searchKeyword){
								
								mygis.Map.highlightMapFeatureResult(internalMemory.searchKeyword);
								//internalMemory.searchKeyword = "";
							}
						}
					});
					$("#mapFeaturesCont").removeClass("loading");
				}
			});
			digimap.events.register("movestart",digimap,function(){
				$("#mapFeaturesCont").die().empty();
				$("#mapFeaturesCont").addClass("loading");
			});
			digimap.events.register("moveend",digimap,function(){
				clearTimeout(internalConfig.moveendEvent);
				internalConfig.moveendEvent = setTimeout(mygis.Map.moveEnd,500);
			});
		}
	},
	
	getFieldDescriptions: function(){
		var records = layerSource.records;
		$.each(records,function(i,v){
			var id=v.layerID;
			var name=v.layerTABLE;
			$.ajax({
				type: "GET",
				url: config.mgreq+"?qtype=GetLayerFields&qContents="+escape(name.replace(/ /g,"_")),
				success: function(data){
					var results=eval(data);
					$.each(results,function(i, result){
						if (!internalMemory.layerFields[result.layerID]){
							internalMemory.layerFields[result.layerID]={};
						}
						var store = internalMemory.layerFields[result.layerID];
						store[result.fieldNAME]=(result);
					});
				}
			});
		});
	},
	
	showSearchPanel: function(){
		mygis.UI.resetControls();
		$("#mapFeatureSearchBar").show();
		$("#mapFeatureSearch").focus();
	},
	
	hideSearchPanel: function(){
		$("#mapFeatureSearchBar").hide();
		mygis.UI.Help.shortcutStart();
		$("#mapFeatureSearch").val("");
		internalMemory.searchKeyword = "";
	},
	
	highlightMapFeatureResult: function(text){
		var search = text.toUpperCase();
		var data = $("#mapFeaturesCont").data("results");
		var results=[];
		$.each(data,function(x,result){
			var tablename = result.TableName;
			$.each(result.Rows,function(y,row){
				$.each(row.Cells,function(z,cell){
					if (mygis.Drawing.Editing.isValidOutputIntern(cell.ColumnName)){
						if (cell.Value.toUpperCase().contains(search)){
							var obj={
								tableName: tablename,
								tableIndex: x,
								rowIndex: y,
								cellIndex: z,
								cellName: cell.ColumnName
							};
							results.push(obj);
						}
					}
				});
			});
		});
		internalMemory.mapFeatureResults=results;
		internalMemory.mapFeatureCurrentIndex=-1;
		mygis.Map.gotoNextFeatureResult();
	},
	
	gotoNextFeatureResult: function(){
		if (internalMemory.mapFeatureResults){
			var len = internalMemory.mapFeatureResults.length;
			var ind = internalMemory.mapFeatureCurrentIndex;
			if (ind+1>=len){
				ind=0;
			}else{
				ind++;
			}
			internalMemory.mapFeatureCurrentIndex=ind;
			mygis.Map.showFeatureResult();
		}else{
			var search = $("#mapFeatureSearch").val();
			if (search){
				mygis.Map.highlightMapFeatureResult(search);
			}
		}
		
	},
	
	gotoPreviousFeatureResult: function(){
		if (internalMemory.mapFeatureResults){
			var len = internalMemory.mapFeatureResults.length;
			var ind = internalMemory.mapFeatureCurrentIndex;
			if (ind-1<0){
				ind=len-1;
			}else{
				ind--;
			}
			internalMemory.mapFeatureCurrentIndex=ind;
			mygis.Map.showFeatureResult();
		}else{
			var search = $("#mapFeatureSearch").val();
			if (search){
				mygis.Map.highlightMapFeatureResult(search);
			}
		}
	},
	
	showFeatureResult:function(){
		var result = internalMemory.mapFeatureResults[internalMemory.mapFeatureCurrentIndex];
		try{
			$("#mapFeaturesCont").accordion('option','active',result.tableIndex);
			
		}catch(err){}
		$("#featureResultGrid_"+result.tableIndex).jqxGrid('ensurerowvisible', result.rowIndex);
		$("#featureResultGrid_"+result.tableIndex).jqxGrid('selectcell', result.rowIndex, result.cellName);
	},
	/**
		Creates an OpenLayers.Layer.WMS object
		@method getBackgroundWMS
		@param {String} name
		@return {Object} The WMS layer
	**/
	getBackgroundWMS: function(name){
		var queriedObj = backgrounds[name];
		var retobj;
		if (queriedObj){
			retobj = new OpenLayers.Layer.WMS(queriedObj.name, queriedObj.url,queriedObj.options,queriedObj.secondaryOptions);
		}
		retobj.mg_MinScale = queriedObj.mg_MinScale;
		retobj.mg_MaxScale = queriedObj.mg_MaxScale;
		return retobj;
	},
	
	/**
		Creates an OpenLayers.Layer for background
		@method getBackground
		@param {String} name
		@return {Object} The OpenLayers.Layer
	**/
	getBackground: function(name){
		var nameparts = name.split(".");
		var twopart = nameparts.length>1?true:false;
		var layer;
		if (twopart){
			switch (nameparts[0]){
				case "google":
					var qObj = backgrounds[nameparts[0]][nameparts[1]];
					layer = new OpenLayers.Layer.Google(qObj.name,qObj.options);
					break;
			}
		}else{
			//console.log(name);
			switch (name){
				case "opengeo_BLUEMARBLE":
					layer = new OpenLayers.Layer.WMTS({
						name: backgrounds['opengeo_BLUEMARBLE'].name,
						url: [
							"//map1a.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi", //backgrounds['opengeo_BLUEMARBLE'].url,
							"//map1a.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi", //backgrounds['opengeo_BLUEMARBLE'].url,
							"//map1a.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi" //backgrounds['opengeo_BLUEMARBLE'].url
						],
						layer: "BlueMarble_NextGeneration",	//"MODIS_Terra_CorrectedReflectance_TrueColor",
						style: "",
						matrixSet: "GoogleMapsCompatible_Level8",
						maxResolution: 156543.03390625,
						numZoomLevels: 8,
						maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
						tileSize: new OpenLayers.Size(256, 256),
						format: "image/jpeg",
						projection: "EPSG:3857",
						isBaseLayer: true
					});   
					layer.mergeNewParams({time: "2015-10-28"});
					break;
				case "opengeo_OSM":
					layer = new OpenLayers.Layer.OSM();
					break;
				default: 
					layer = mygis.Map.getBackgroundWMS(name);
			}
		}
		return layer;
	},

	/**
	 * Switches one of the available backgrounds
	 * @method switchBackground
	 * @param {String} bgname The background name as stored in the backgrounds object
	 * @param {Integer} index The index of the background to switch
	 */
	switchBackground: function(bgname,index){
		var newlayer = mygis.Map.getBackground(bgname);	//mygis.Map.getBackgroundWMS(bgname);
		var layerToSwitch = digimap.layers[index];
		digimap.addLayer(newlayer);
		if (layerToSwitch.isBaseLayer){digimap.setBaseLayer(newlayer);}
		digimap.removeLayer(layerToSwitch);
		digimap.setLayerIndex(newlayer,index);
		mygis.UI.updateLayerGrid();
	},

	/**
		Creates a custom filter for layers.

		@method getCustomFilter
		@param {String} specificList A comma-delimited string of layer names
		@return {String} either the combined filters (if they exist) or an 'always true' filter.
	**/
	getCustomFilter: function(specificList){
		var retvalue="";
		var recs = layerSource.records;
		var myCustomFilters = internalConfig.myCustomFilters;
		var fullLayers=[];

		if (specificList==undefined){
		/*
		*	Get a list of all visible layers
		*/
		for (var i=recs.length-1;i>=0;i--)
		{
			if (!(Boolean(recs[i].hidden)===true)){
				var layername = recs[i].layerTABLE;
				fullLayers.push(layername);
			}
		}
		}else{
			fullLayers=specificList;
		}
		/*
		*	For those layers, either get the combined filters (if they exist)
		*	or enter an 'always true' filter.
		*/
		for (var i=0;i<fullLayers.length;i++){
			if (i>0){
				retvalue+=";"
			}
			if (myCustomFilters[fullLayers[i]]){
				var propCounter =0;
				for (prop in myCustomFilters[fullLayers[i]]){
					var insertValue = myCustomFilters[fullLayers[i]][prop];
					var secondItem=false;
					if (propCounter>0 && insertValue!=null){
						retvalue += " AND (";
						secondItem=true;
					}
					if (insertValue){
						retvalue += insertValue;
						if (secondItem){
							retvalue += ")";
						}
					}
					propCounter+=1;
				}
				//retvalue += myCustomFilters[fullLayers[i]];
			}else{
				retvalue+="1=1";
			}
		}
		return retvalue;
	},

	/**
		Zooms out the map by one level
		@method ZoomOut
	**/
	ZoomOut: function(){
		digimap.zoomTo(digimap.getZoom()-1);
	},

	
	/**
		Used to initialize selection tools (info, select rectangle etc)
		@method infoInit
	**/
	infoInit: function(){
		infoControls = {
			click: new OpenLayers.Control.WMSGetFeatureInfo({
				url: config.mapserver+'wms',
				title: 'Identify features by clicking',
				drillDown: true,
				infoFormat:"text/html",
				maxFeatures: 10,
				layers: [digimap.layers[1]],
				vendorParams: {
					EXCEPTIONS: 'XML'
				}
			}),

			select: new OpenLayers.Control.GetFeature({
				protocol: null,	//to be set on activate
				box: true,
				hover: false,
				multipleKey: "",
				toggleKey: ""
			}),
			
			//JK CHANGE - ADD the circle select tool
			select_circle: new OpenLayers.Control.GetFeature({
				protocol: null,	//to be set on activate
				circle: true,
				hover: false,
				multipleKey: "",
				toggleKey: ""
			})
			//JK CHANGES END			

		};
		infoControls.click.events.register("getfeatureinfo", this, mygis.Map.showInfo2);

		for (var i in infoControls) {
			digimap.addControl(infoControls[i]);
		}

		//infoControls.click.activate();

	},

    elementPosition: function(param) {
        var x = 0, y = 0;
        var obj = (typeof param == "string") ? document.getElementById(param) : param;
        if (obj) {
            x = obj.offsetLeft;
            y = obj.offsetTop;
            var body = document.getElementsByTagName('body')[0];
            while (obj.offsetParent && obj != body) {
                x += obj.offsetParent.offsetLeft;
                y += obj.offsetParent.offsetTop;
                obj = obj.offsetParent;
            }
        }
		var retobj = new Object();
		retobj.x = x;
		retobj.y = y;
        mapContainerPosition = retobj;
    },

    /**
		Creates the AV logo inside the map
		@method createLogo
    */
    createLogo: function() {
        var retobj = document.createElement("DIV");
        //retobj.setAttribute("class","AVLogoCont");
        var btnAVMap = document.createElement("INPUT");
        btnAVMap.id = "AVLogoBtn";
        btnAVMap.type = "button";
        $(btnAVMap).bind('click',function() { window.open("http://www.avmap.gr/"); });
        retobj.appendChild(btnAVMap);
		//$(retobj).css({"});
        return retobj;
    },

	/**
		Creates the Smartest logo inside the map
		@method createLogoSmartest
		@deprecated
    */
	createLogoSmartest: function(){
		var retobj = document.createElement("DIV");
		var btnLogo = document.createElement("a");
		btnLogo.id = "SmartestBtn";
		retobj.appendChild(btnLogo);
		$(retobj).css({"position":"absolute","bottom":0,"z-index":999,"left":10});
        return retobj;
	},

	/**
		Creates the Cordis logo inside the map
		@method createLogoCordis
		@deprecated
    */
	createLogoCordis: function(){
		var retobj = document.createElement("DIV");
		var btnLogo = document.createElement("a");
		btnLogo.id = "CordisBtn";
		retobj.appendChild(btnLogo);
		$(retobj).css({"position":"absolute","bottom":0,"z-index":999,"left":10});
        return retobj;
	},

	/**
		Creates the EU logo inside the map
		@method createLogoEU
		@deprecated
    */
	createLogoEU: function(){
		var retobj = document.createElement("DIV");
		var btnLogo = document.createElement("a");
		btnLogo.id = "EUBtn";
		retobj.appendChild(btnLogo);
		$(retobj).css({"position":"absolute","bottom":0,"z-index":999,"left":10});
        return retobj;
	},
	
	/**
		Styles the editmode as a jquery button
		@method styleButton
		@deprecated
    */
    styleButton: function() {
        $("#editmodeButton").button();
    },

    /**
		Resets the map to its initial state
		@method clearMap
    */
    clearMap: function() {
        try {
            mygis.Map.deleteOverlays();
			mygis.Map.clearSelection();
        } catch (Error) { }


    },

	/**
		Clears any selection on the map

		@method clearSelection
		@param {Boolean} initialLoad If this is the initial loading of the application
    */
	clearSelection: function(initialLoad){
		//mygis.UI.selectToolbar();
		selectionLayer.removeAllFeatures();
		drawControls.modify.selectControl.unselectAll();
		infoWindows = [];
		if (!infoWindowInitialized){
			initializeInfoWindow();
		}
		if(initialLoad){
			$("#infoLeftList").jqxListBox({source:layerSource,displayMember:'layerNAME',valueMember:'layerID'});
		}
		//$("#selectAnalysis").empty();
		document.getElementById("selectClear").ex_AddClassName("disabled");
		mygis.UI.queryResultsReset();
	},
	
	setSelectableLayers: function(source,selectionLayers){
		//console.log("setSelectableLayers fired");
		var getItemByValue = function(listbox,value){	//we have old version of jqxwidgets, so hack it manually
			var found=false;
			var retvalue=null;
			var i=0;
			var items = listbox.jqxListBox('getItems');
			while (!found && i<items.length){
				var item = listbox.jqxListBox('getItem',i);
				if (item.value==value){
					found=true;
					retvalue=item;
				}else{
					i++;
				}
			}
			return retvalue;
		};
		selectionLayers.jqxListBox('uncheckAll'); 
		$.each(source,function(x,item){
			if (item.Selectable=="True" || item.Selectable){
				var item=getItemByValue(selectionLayers,item.layerTABLE);
				if (item){
					selectionLayers.jqxListBox('checkIndex',item.index);
				}
				
			}
		});
	},
	
	determineSelectionToggleStatus: function(id){
		var status=0;
		var btnID="";
		switch (id){
			case "#layerSelectionList":
				btnID="#layerSelectionToggleBtn";
				break;
			case "#layerWithinSelectionList":
				btnID="#layerWithinSelectionToggleBtn";
				break;
		}
		var selectionLayers = $(id);
		var allItems = selectionLayers.jqxListBox('getItems');
		var checkedItems = selectionLayers.jqxListBox('getCheckedItems');
		if (allItems.length==checkedItems.length){
			status=2;
		}else if (allItems.length>checkedItems.length && checkedItems.length>0){
			status=1;
		}
		$(btnID).removeClass("checked");
		$(btnID).removeClass("indeterminate");
		switch (status){
			case 2:
				$(btnID).addClass("checked");
				break;
			case 1:
				$(btnID).addClass("indeterminate");
				break;
		}
	},
	
	switchSelectionToggleBtn: function(id){
		var listID="";
		switch(id){
			case "#layerSelectionToggleBtn":
				listID="#layerSelectionList";
				break;
			case "#layerWithinSelectionToggleBtn":
				listID="#layerWithinSelectionList";
				break;
		}
		var btn = $(id);
		var listbox = $(listID);
		if (btn.hasClass("checked")){	
			btn.removeClass('checked');
			listbox.jqxListBox('uncheckAll');
		}else{	//check all
			btn.removeClass('indeterminate');	//just in case
			btn.addClass('checked');
			listbox.jqxListBox('checkAll');
		}
	},
	

    /**
		Clears layers from the map
		@method deleteOverlays
    */
    deleteOverlays: function() {
		var layer;
		var i=0;
		var foundOne=false;
		while (i<digimap.getNumLayers()){
			layer = digimap.layers[i];
			layer.events.remove("loadend");
			if (!(layer.isBaseLayer || layer.name=="Cosmetic Layer" || layer.name=="Selection Layer" || layer.name=="Feedback Layer") ){
				try{
				layer.destroy(false);
				}catch(err){

				}

			}else{
				i++;
			}
		}



    },

	/**
		Returns a combined OpenLayers WMS layer from the geoserver store.

		@method getMapServerLayer
		@param {String} layername Either one, or a comma-delimited string of layers to load
		@param {String} map Deprecated parameter
		@param mapExtent Comma-delimited string of map extents
    */
	getMapServerLayer: function(layername,map,mapExtent){
		var retvalue;
		var extentArray = mapExtent.split(",");
		retvalue = new OpenLayers.Layer.WMS(layername,
			config.mapserver+"wms",
			{
				//map: map,
				layers: customStyleApplied?null:layername,
				EXCEPTIONS:'BLANK',
				FORMAT:'image/png',
				//TILED: 'true',
				"transparent":"true",
				VERSION: "1.1.1",
				CQL_FILTER: customFiltered?mygis.Map.getCustomFilter():null,
				sld_body: customStyleApplied?mygis.Map.getCustomAppliedStyle():null
			},
			{
				'isBaseLayer': false,
				'alpha': true,
				//maxExtent : new OpenLayers.Bounds(extentArray[0],extentArray[1],extentArray[2],extentArray[3]),
				//maxExtent: new OpenLayers.Bounds(-180.000000,-90.000000,180.000000,90.000000),
				singleTile:true,ratio: 2,
				transitionEffect:'null',
				//gutter: 2,
				buffer: 2,
				attribution: ''
			}
		);
		//retvalue.mergeNewParams({format_options: "layout:legend"});
		return retvalue;
	},


	markSelectionPoint: function(point,eraseAll){

		if (eraseAll){
			feedbackLayer.removeAllFeatures();
		}

		if (point){
			var defaultPointStyle = OpenLayers.Util.applyDefaults(defaultPointStyle, OpenLayers.Feature.Vector.style['temporary']);
			var markerPoint = new OpenLayers.Geometry.Point(point.lon,point.lat);
			var markerFeature = new OpenLayers.Feature.Vector(markerPoint,null,defaultPointStyle);
			/*
			defaultPointStyle.fillColor = "#FF0000";
			defaultPointStyle.fillOpacity = 0.5;
			defaultPointStyle.strokeColor="#FF0000";
			defaultPointStyle.strokeOpacity = 1;
			*/
			defaultPointStyle.externalGraphic = config.folderPath+"Images/target2.png";	//target5
			defaultPointStyle.graphicWidth = 64;	//12;	
			defaultPointStyle.graphicHeight = 64;	//19
			//defaultPointStyle.graphicYOffset= 19;
			defaultPointStyle.graphicOpacity = 1;

			feedbackLayer.addFeatures(markerFeature);
		}
	},

	markFeatures: function(features){
		selectionLayer.removeAllFeatures();
		if (features){
			clearTimeout(internalConfig.zoomToFeat);
			var fn = function(x){
				return function(){
					selectionLayer.addFeatures(x);
					digimap.zoomToExtent(selectionLayer.getDataExtent());
					//console.log('fired');
				}
			};
			internalConfig.zoomToFeat=setTimeout(fn(features),1000);

		}
		
	},
	
	clearFeedback: function(){
		feedbackLayer.removeAllFeatures();
	},

	layerHasProperty: function(name,property){
		var retvalue=false;
		var i=0;
		var found=false;
		var checkitem;
		while (!found && i<layerSource.records.length){
			checkitem = layerSource.records[i];
			if (checkitem.layerTABLE==name){
				found=true;
			}else{
				i++;
			}
		}
		if (found){
			switch (property){
				case "selectable":
					retvalue = checkitem.Selectable;
					break;
				case "editable":
					retvalue = checkitem.Editable;
					break;
				case "locked":
					retvalue = checkitem.Locked;
					break;
			}
		}
		return retvalue;
	},

	selectTopFeatures: function(features){
		var resultLayers=mygis.Utilities.categorizeFeatures(features);
		var minIndex=999999;
		var lname;
		$.each(resultLayers,function(i,v){
			var index = mygis.Utilities.mggetLayerIndex(i);
			if (index<minIndex){
				lname = i;
				minIndex=index;
			}
		});
		if (resultLayers[lname].length>0){
			resultLayers[lname].length=1;	//	return only one;
		}
		return resultLayers[lname];
	},

	showInfo2: function(evt){
		console.log("showInfo2");
		var dump = evt.text;
		var parts = dump.split("</table>");
		//var parts = $(dump).find('table.featureInfo');
		var lonlat = digimap.getLonLatFromPixel(evt.xy);
		mygis.Map.markSelectionPoint(lonlat,true);

		var realText;
		var layernames = [];
		infoWindows = [];
		$("#infoRightGrid").hide();
		$("#infoLeftList").hide();
		for (var i=0;i<parts.length-1;i++){
			var startIndex = parts[i].indexOf("<table");
				if (startIndex>-1){

				var layerIDs="";
				var layername;
				var featuresFound=0;
				realText = parts[i].substring(startIndex).trim()+"</table>";
				var jTable = $(realText);
				var jRows = jTable.find("tr");
				//layername = jTable.find('caption').html().split("_").slice(1).join("_");
				layername = jTable.find('caption').html();
				if (mygis.Map.layerHasProperty(layername,"selectable")){
					layernames.push(layername);
					jRows.each(function(i,v){
						var cells =$(v).find("td");
						if (i>=1){
							if (i>1){
								layerIDs+=",";
							}
							layerIDs+=$(cells[1]).html();
							featuresFound+=1;
						}
					});
					var myurl = config.mgreq+"?qtype=GetFeatureList&qContents="+escape(layername+"$"+layerIDs);
					var prevText = layernames[layernames.length-1];
					layernames[layernames.length-1] = new Object();
					layernames[layernames.length-1].text = prevText;
					layernames[layernames.length-1].dataurl = myurl;
				}
			}
		}

		//$("#bottomTabContainer").jqxTabs('select',internalConfig.layerTabIndex);
		//$("#bottomTabContainer").jqxTabs('select',0);
		if (!infoWindowInitialized){
			initializeInfoWindow();
		}

		var qItem = new Object();
		qItem.text=strings.Info.infoAt+lonlat.lon+" , "+lonlat.lat;
		displaySuccess(qItem.text);
		qItem.value=-1;
		qItem.isInitialized=true;
		qItem.linkedResults=layernames;
		qItem.isDBQuery=false;
		qItem.isMapSelect=false;
		qItem.centerPoint=lonlat;
		querySource.push(qItem);
		mygis.UI.updateQueryList();
		var leftList = $("#infoLeftList");
		leftList.show();
		var itemCount = leftList.jqxListBox('getItems').length;
		leftList.jqxListBox('selectIndex',itemCount-1);
		mygis.UI.queryResultsRun();

	},

	checkScaleConstraints: function(){
		/*
		var layerlist = $('#layersList');
		var currentScale = digimap.getScale();
		var baselayer = digimap.baseLayer;
		var switchBackgrounds = false;
		if (currentScale<baselayer.mg_MinScale || (currentScale>baselayer.mg_MaxScale && baselayer.mg_MaxScale!=-1)){
			 switchBackgrounds=true;
		}
		if (switchBackgrounds && (!internalConfig.helpTips.switchBG)){
			internalConfig.helpTips.switchBG=true;
			displayNotify(strings.LayerControl.tip_ChangeBG,true,function(){internalConfig.helpTips.switchBG=false;});
		}
		var atLeastOne = false;
		
		for (var i=0;i<layerSource.records.length;i++){
			var item=layerSource.records[i];
			if (!item.manualVisibility){
				if (item.hidden){
					if (currentScale>=item.layerMinScale && (currentScale<item.layerMaxScale || item.layerMaxScale==-1)){
						item.hidden=false;
						atLeastOne=true;
					}
				}else{
					if(currentScale<item.layerMinScale || (currentScale>item.layerMaxScale && item.layerMaxScale!=-1)){
						item.hidden=true;
						atLeastOne=true;
					}
				}

			}
		}
		if (atLeastOne){
			var mapItem = $("#mapsList").jqxListBox('getSelectedItem').originalItem;
			loadMapSequence(mapItem);
		}

		if (switchBackgrounds || atLeastOne){
			mygis.UI.updateLayerGrid();
		}
		*/
	},

	getLayerSLD: function(name){
		var locallyStored = mygis.Storage.getItem('layerStyle_'+name);
		if (locallyStored){
			mygis.Map.getLayerSLDComplete(eval(locallyStored),name,true);
		}else{
			/*
			$.ajax({
				url:config.namespace+"styles/"+name+".sld"+"?outputFormat=text/javascript&format_options=callback:getJson", //config.mapserver+"styles/"+name+".sld",	//this would be the proper way to do it, however URL rewrite causes error on sld (flush response?)
				dataType: 'jsonp',
				success: function(req){
					req.responseText=req.responseText.replace(config.namespace,config.mapserver);
					mygis.Storage.storeItem('layerStyle_'+name,JSON.stringify(req.responseText));
					mygis.Map.getLayerSLDComplete(req,name);
				},
				contentType: 'application/json',
				jsonp: false,
				processData: false
			})
			.fail(function(req) {
			req.responseText=req.responseText.replace(config.namespace,config.mapserver);
					mygis.Storage.storeItem('layerStyle_'+name,JSON.stringify(req.responseText));
					mygis.Map.getLayerSLDComplete(req,name);
			});
			*/
			var realUrl=config.namespace+"styles/"+name+".sld";
			var proxyUrl = config.folderPath+"Proxy.ashx?u="+escape(realUrl);
			OpenLayers.Request.GET({
				url: proxyUrl, //config.mapserver+"styles/"+name+".sld",	//this would be the proper way to do it, however URL rewrite causes error on sld (flush response?)
				headers: {
					"Content-Type": "text/xml;charset=utf-8"
				},
				success: function(req){
					req.responseText=req.responseText.replace(config.namespace,config.mapserver);
					mygis.Storage.storeItem('layerStyle_'+name,JSON.stringify(req.responseText));
					mygis.Map.getLayerSLDComplete(req,name);
				}
			});
			
		}

	},

	getLayerSLDComplete: function(req,layername,textOnly){
		var format = new OpenLayers.Format.SLD({
			multipleSymbolizers: true,
			namedLayersAsArray: false
		});
		if (textOnly){
			layerStyles[layername]=format.read(req);
		}else{
			layerStyles[layername]=format.read(req.responseXML || req.responseText);
		}
	},

	getCustomAppliedStyle: function(){
		var completeSLD = mygis.Map.combineLayerSLDs();
		var frmt = new OpenLayers.Format.SLD();
		var sldString = frmt.write(completeSLD);

		sldString = sldString.replace(/<ogc:PropertyName>Geometry<\/ogc:PropertyName>/g,"<ogc:Function name=\"geometryType\"><ogc:PropertyName>Geometry</ogc:PropertyName></ogc:Function>");
		sldString = '<?xml version="1.0" encoding="utf-8"?>'+sldString;
		return sldString;
	},

	getSingleAppliedStyle: function(name){
		var retvalue = new Object();
		retvalue.version = "1.0.0";
		retvalue.namedLayers=new Object();
		retvalue.namedLayers[name]=layerStyles[name].namedLayers[name];
		//retvalue.namedLayers[name].userStyles[0].Name=name;
		var frmt = new OpenLayers.Format.SLD();
		var sldString = frmt.write(retvalue);

		sldString = sldString.replace(/<ogc:PropertyName>Geometry<\/ogc:PropertyName>/g,"<ogc:Function name=\"geometryType\"><ogc:PropertyName>Geometry</ogc:PropertyName></ogc:Function>");

		sldString = '<?xml version="1.0" encoding="utf-8"?>'+sldString;
		return sldString;
	},

	combineLayerSLDs: function(){
		var retvalue = new Object();
		retvalue.version = "1.0.0";
		retvalue.namedLayers=new Object();
		var recs = layerSource.records;
		for (var i=recs.length-1;i>=0;i--)
		{
			if (!(Boolean(recs[i].hidden)===true)){
				var name = recs[i].layerTABLE;
				retvalue.namedLayers[name]=layerStyles[name].namedLayers[name];

			}

		}
		/*
		$.each(layerStyles,function(i,v){
			if (v){
				retvalue.namedLayers[i]=v.namedLayers[i];
			}
		});
		*/
		//var frmt = new OpenLayers.Format.SLD();
		//var xxx = frmt.write(retvalue);
		//digimap.layers[2].mergeNewParams({sld_body:"<?xml version=\"1.0\" encoding=\"utf-8\"?>"+xxx.replace(/#/g,"%23")});
		return retvalue;
	},

	buildSLDArray: function(){
		var recs = layerSource.records;
		layerStyles = new Object();
		for (var i=recs.length-1;i>=0;i--)
		{
			if (!(Boolean(recs[i].hidden)===true)){
				mygis.Map.getLayerSLD(recs[i].layerTABLE);

			}

		}
	},

	getUniqueGraphics: function(){
		var retvalue = [];
		var retitem;
		$.each(layerStyles,function(i,v){
			var examine = v.namedLayers[i].userStyles[0];
			for (var j=0;j<examine.rules.length;j++){
				var symbolizer = examine.rules[j].symbolizer;
				for (var name in symbolizer){
					if (name.toString()=='Point'){
						if (symbolizer[name].graphic){
							retitem = new Object();
							retitem.layer=i;
							retitem.graphicUrl = symbolizer[name].externalGraphic;
							retvalue.push(retitem);
						}
					}
				}
			}
		});
		return retvalue;
	},

	strategies: {
		BBOXUnique: OpenLayers.Class(OpenLayers.Strategy, {

			/**
			 * Property: bounds
			 * {<OpenLayers.Bounds>} The current data bounds (in the same projection
			 *     as the layer - not always the same projection as the map).
			 */
			bounds: null,

			/**
			 * Property: resolution
			 * {Float} The current data resolution.
			 */
			resolution: null,

			/**
			 * APIProperty: ratio
			 * {Float} The ratio of the data bounds to the viewport bounds (in each
			 *     dimension).  Default is 2.
			 */
			ratio: 2,

			/**
			 * Property: resFactor
			 * {Float} Optional factor used to determine when previously requested
			 *     features are invalid.  If set, the resFactor will be compared to the
			 *     resolution of the previous request to the current map resolution.
			 *     If resFactor > (old / new) and 1/resFactor < (old / new).  If you
			 *     set a resFactor of 1, data will be requested every time the
			 *     resolution changes.  If you set a resFactor of 3, data will be
			 *     requested if the old resolution is 3 times the new, or if the new is
			 *     3 times the old.  If the old bounds do not contain the new bounds
			 *     new data will always be requested (with or without considering
			 *     resFactor).
			 */
			resFactor: null,

			/**
			 * Property: response
			 * {<OpenLayers.Protocol.Response>} The protocol response object returned
			 *      by the layer protocol.
			 */
			response: null,

			/**
			 * Constructor: OpenLayers.Strategy.BBOX
			 * Create a new BBOX strategy.
			 *
			 * Parameters:
			 * options - {Object} Optional object whose properties will be set on the
			 *     instance.
			 */

			/**
			 * Method: activate
			 * Set up strategy with regard to reading new batches of remote data.
			 *
			 * Returns:
			 * {Boolean} The strategy was successfully activated.
			 */
			activate: function() {
				var activated = OpenLayers.Strategy.prototype.activate.call(this);
				if(activated) {
					this.layer.events.on({
						"moveend": this.update,
						"refresh": this.update,
						"visibilitychanged": this.update,
						scope: this
					});
					this.update();
				}
				return activated;
			},

			/**
			 * Method: deactivate
			 * Tear down strategy with regard to reading new batches of remote data.
			 *
			 * Returns:
			 * {Boolean} The strategy was successfully deactivated.
			 */
			deactivate: function() {
				var deactivated = OpenLayers.Strategy.prototype.deactivate.call(this);
				if(deactivated) {
					this.layer.events.un({
						"moveend": this.update,
						"refresh": this.update,
						"visibilitychanged": this.update,
						scope: this
					});
				}
				return deactivated;
			},

			/**
			 * Method: update
			 * Callback function called on "moveend" or "refresh" layer events.
			 *
			 * Parameters:
			 * options - {Object} Optional object whose properties will determine
			 *     the behaviour of this Strategy
			 *
			 * Valid options include:
			 * force - {Boolean} if true, new data must be unconditionally read.
			 * noAbort - {Boolean} if true, do not abort previous requests.
			 */
			update: function(options) {
				var mapBounds = this.getMapBounds();
				if (mapBounds !== null && ((options && options.force) ||
				  (this.layer.visibility && this.layer.calculateInRange() && this.invalidBounds(mapBounds)))) {
					this.calculateBounds(mapBounds);
					this.resolution = this.layer.map.getResolution();
					this.triggerRead(options);
				}
			},

			/**
			 * Method: getMapBounds
			 * Get the map bounds expressed in the same projection as this layer.
			 *
			 * Returns:
			 * {<OpenLayers.Bounds>} Map bounds in the projection of the layer.
			 */
			getMapBounds: function() {
				if (this.layer.map === null) {
					return null;
				}
				var bounds = this.layer.map.getExtent();
				if(bounds && !this.layer.projection.equals(
						this.layer.map.getProjectionObject())) {
					bounds = bounds.clone().transform(
						this.layer.map.getProjectionObject(), this.layer.projection
					);
				}
				return bounds;
			},

			/**
			 * Method: invalidBounds
			 * Determine whether the previously requested set of features is invalid.
			 *     This occurs when the new map bounds do not contain the previously
			 *     requested bounds.  In addition, if <resFactor> is set, it will be
			 *     considered.
			 *
			 * Parameters:
			 * mapBounds - {<OpenLayers.Bounds>} the current map extent, will be
			 *      retrieved from the map object if not provided
			 *
			 * Returns:
			 * {Boolean}
			 */
			invalidBounds: function(mapBounds) {
				if(!mapBounds) {
					mapBounds = this.getMapBounds();
				}
				var invalid = !this.bounds || !this.bounds.containsBounds(mapBounds);
				if(!invalid && this.resFactor) {
					var ratio = this.resolution / this.layer.map.getResolution();
					invalid = (ratio >= this.resFactor || ratio <= (1 / this.resFactor));
				}
				return invalid;
			},

			/**
			 * Method: calculateBounds
			 *
			 * Parameters:
			 * mapBounds - {<OpenLayers.Bounds>} the current map extent, will be
			 *      retrieved from the map object if not provided
			 */
			calculateBounds: function(mapBounds) {
				if(!mapBounds) {
					mapBounds = this.getMapBounds();
				}
				var center = mapBounds.getCenterLonLat();
				var dataWidth = mapBounds.getWidth() * this.ratio;
				var dataHeight = mapBounds.getHeight() * this.ratio;
				this.bounds = new OpenLayers.Bounds(
					center.lon - (dataWidth / 2),
					center.lat - (dataHeight / 2),
					center.lon + (dataWidth / 2),
					center.lat + (dataHeight / 2)
				);
			},

			/**
			 * Method: triggerRead
			 *
			 * Parameters:
			 * options - {Object} Additional options for the protocol's read method
			 *     (optional)
			 *
			 * Returns:
			 * {<OpenLayers.Protocol.Response>} The protocol response object
			 *      returned by the layer protocol.
			 */
			triggerRead: function(options) {
				if (this.response && !(options && options.noAbort === true)) {
					this.layer.protocol.abort(this.response);
					this.layer.events.triggerEvent("loadend");
				}
				this.layer.events.triggerEvent("loadstart");
				this.response = this.layer.protocol.read(
					OpenLayers.Util.applyDefaults({
						filter: this.createFilter(),
						callback: this.merge,
						scope: this
				}, options));
			},

			/**
			 * Method: createFilter
			 * Creates a spatial BBOX filter. If the layer that this strategy belongs
			 * to has a filter property, this filter will be combined with the BBOX
			 * filter.
			 *
			 * Returns
			 * {<OpenLayers.Filter>} The filter object.
			 */
			createFilter: function() {

				var filter;
				var filterIDs = [];
				if (this.layer.features.length>0){
					for (var i=0;i<this.layer.features.length;i++){
						//fids.push();
						if (this.layer.features[i].fid){	//else is a new object
							var id = this.layer.features[i].fid.split(".")[1];
							var x = new OpenLayers.Filter.Comparison({
								type: OpenLayers.Filter.Comparison.EQUAL_TO,
								property: 'OID',
								value: id
							});
							filterIDs.push(x);
						}
					}
				}
				if (this.layer.deletedFeatures){
					if (this.layer.deletedFeatures.length>0){
						for (var i=0;i<this.layer.deletedFeatures.length;i++){
							//fids.push();
							var id = this.layer.deletedFeatures[i].fid.split(".")[1];
							var x = new OpenLayers.Filter.Comparison({
								type: OpenLayers.Filter.Comparison.EQUAL_TO,
								property: 'OID',
								value: id
							});
							filterIDs.push(x);
						}
					}
				}
				if (filterIDs.length>0){


					var filterOR = new OpenLayers.Filter.Logical({
						type: OpenLayers.Filter.Logical.OR,
						filters: filterIDs
					});
					var filterNOT = new OpenLayers.Filter.Logical({
						type: OpenLayers.Filter.Logical.NOT,
						filters: [filterOR]
					});

					var filterBBOX = new OpenLayers.Filter.Spatial({
						type: OpenLayers.Filter.Spatial.BBOX,
						value: this.bounds,
						projection: this.layer.projection
					});
					filter = new OpenLayers.Filter.Logical({
						type: OpenLayers.Filter.Logical.AND,
						filters: [filterNOT,filterBBOX]
					});
				}else{
					filter = new OpenLayers.Filter.Spatial({
						type: OpenLayers.Filter.Spatial.BBOX,
						value: this.bounds,
						projection: this.layer.projection
					});
				}
				if (this.layer.filter) {
					filter = new OpenLayers.Filter.Logical({
						type: OpenLayers.Filter.Logical.AND,
						filters: [this.layer.filter, filter]
					});
				}
				return filter;
			},

			/**
			 * Method: merge
			 * Given a list of features, determine which ones to add to the layer.
			 *     If the layer projection differs from the map projection, features
			 *     will be transformed from the layer projection to the map projection.
			 *
			 * Parameters:
			 * resp - {<OpenLayers.Protocol.Response>} The response object passed
			 *      by the protocol.
			 */
			merge: function(resp) {
				var features = resp.features;
				if(features && features.length > 0) {
					var remote = this.layer.projection;
					var local = this.layer.map.getProjectionObject();
					if(!local.equals(remote)) {
						var geom;
						for(var i=0, len=features.length; i<len; ++i) {
							geom = features[i].geometry;
							if(geom) {
								geom.transform(remote, local);
							}
						}
					}
					this.layer.addFeatures(features);
				}
				this.response = null;
				this.layer.events.triggerEvent("loadend");
			},

			CLASS_NAME: "OpenLayers.Strategy.BBOXUnique"
		})

	}
};

//END of mygis.Map

/** All printing related functions
 @class Printing
 @static
 **/
mygis.Printing = {
	templates: {},
	templateConfig: {
		generic: "",
		stats: config.folderPath+"Scripts/printing/statResults.html?"+Date.UTC(new Date())
	},
	printWindow: function(template,model){
		if (!mygis.Printing.templates[template]){
			mygis.Printing.initTemplate(template,model);
		}else{
			var path=config.folderPath+"Scripts/printing/print.html?"+Date.UTC(new Date());
			var w = window.open(path,"_blank");
			w.onload=function(){
				w.document.write(mygis.Printing.templates[template](model));
				w.document.close();
				setTimeout(function(){w.print();},1000);
			};
			
		}
		
		
	},
	initTemplate: function(template,model){
		$.get(mygis.Printing.templateConfig[template]).
			then(function(src){
				mygis.Printing.templates[template]=Handlebars.compile(src);
				var w = window.open(config.folderPath+"Scripts/printing/print.html","_blank");
				w.onload=function(){
					w.document.write(mygis.Printing.templates[template](model));
					w.document.close();
					setTimeout(function(){w.print();},1000);
				};
				//w.focus();
				
			});
	},
	models: {
		printModel: function(){
			var me={
				parentDirectory:config.folderPath+"Scripts/printing",
				pageTitle: strings.Printing.statsWindowTitle,
				appLogo: $(".domainLogoWrapper2 a img").attr("src"),
				appTitle: $(".domainStaticText2 div div").html().trim(),
				results: [
					/*
					header
					subheader
					sumValue,
					minValue,
					maxValue
					avgValue
					*/
				]
			};
			return me;
		}
	}
};

/**
	All UI related functions. These methods either retrieve or set something to the DOM.

	@class UI
	@static
**/
mygis.UI = {
	/**
		Contains methods meant to be overriden by specific apps
		@class UI.Hooks
		@static
	*/
	Hooks: {
		/**
		*	Fired when an info window is shown
		*	@method infoWindowShown
		*/
		infoWindowShown: function(){}
	},
	
	/**
		Contains methods used in the interface of the Media Manager
		@class UI.MediaManager
		@static
	**/
	MediaManager: {

		/**
			Sorts the files displayed according to the control ID.
			Element classes:
				-No class: no sorting
				-'desc'	sorted desc
				-'asc' sorted asc
			The function cycles through the states as each button is pressed.

			@method sortBy
			@param {String} controlID The ID of the activating element. Accepts one of:
				-userFiles_nameSort
				-userFiles_typeSort
				-userFiles_dateSort
				-userFiles_inuseSort
				-userFiles_sizeSort
		**/
		sortBy: function(controlID){
			var columnName = "";
			var status="";
			var elementClasses = $("#"+controlID).attr("class").split(" ");
			var sortClass="";
			var newSortClass = "";
			if (elementClasses.length>1){
				sortClass = elementClasses[1];
			}
			switch (controlID){
				case "userFiles_nameSort":
					columnName="fileNAME";
					break;
				case "userFiles_typeSort":
					columnName="fileTYPE";
					break;
				case "userFiles_dateSort":
					columnName = "fileINSERT";
					break;
				case "userFiles_inuseSort":
					columnName = "fileINUSE";
					break;
				case "userFiles_sizeSort":
					columnName = "fileSIZE"
					break;
			}
			switch (sortClass){
				case "desc":
					newSortClass="asc";
					break;
				case "asc":
					newSortClass="";
					break;
				default:
					newSortClass="desc";
					break;

			}
			if (columnName){
				$("#userFilesList").jqxGrid('sortby',columnName,newSortClass);
				if (newSortClass){
					if (sortClass){
						document.getElementById(controlID).ex_RemoveClassName(sortClass);
					}
					document.getElementById(controlID).ex_AddClassName(newSortClass);
				}else{
					document.getElementById(controlID).ex_RemoveClassName(sortClass);
				}
			}
		},

		/**
		 *	Clears the "only images" filter and forgets it
		 *	@method clearFilterImages
		 */
		clearFilterImages: function(){
			var grid=$('#userFilesList');
			try{
			grid.jqxGrid('clearfilters');
			}catch(err){}
			grid.removeData("imageFilter");
			grid.removeData("imageFilterDataField");
		},

		/**
		 *	Adds an "only images" filter and remembers it
		 *	@method filterImages
		 */
		filterImages: function(){
			var grid=$('#userFilesList');
			grid.jqxGrid('clearfilters');
			var filtergroup = new $.jqx.filter();
			var datafield = "fileTYPE";
			var filtertype = "stringfilter";
			var condition= "EQUAL";
			var operator= 1;
			var filter;
			for (var i=0;i<4;i++){
				var filtervalue;
				switch (i){
					case 0:
						filtervalue = ".PNG";
						break;
					case 1:
						filtervalue = ".JPG";
						break;
					case 2:
						filtervalue = ".JPEG";
						break;
					case 3:
						filtervalue = ".GIF";
						break;
				}
				filter = filtergroup.createfilter(filtertype, filtervalue, condition);
				filtergroup.addfilter(operator, filter);
				filter = filtergroup.createfilter(filtertype, filtervalue.toLowerCase(), condition);
				filtergroup.addfilter(operator, filter);
			}
			grid.jqxGrid('addfilter', datafield, filtergroup, true);
			grid.data("imageFilter",filtergroup);
			grid.data("imageFilterDataField",datafield);
		},

		/**
			Filters the displayed items in the file list by the input text

			@method filterBy
		**/
		filterBy: function(){
			/**
				@param {String} filtertype One of 'numericfilter', 'stringfilter', 'datefilter' or 'customfilter'
				@param {String} condition
				Possible conditions for string filter:
					'EMPTY', 'NOT_EMPTY', 'CONTAINS', 'CONTAINS_CASE_SENSITIVE','DOES_NOT_CONTAIN', 'DOES_NOT_CONTAIN_CASE_SENSITIVE', 'STARTS_WITH', 'STARTS_WITH_CASE_SENSITIVE', 'ENDS_WITH', 'ENDS_WITH_CASE_SENSITIVE', 'EQUAL', 'EQUAL_CASE_SENSITIVE', 'NULL', 'NOT_NULL'
				Possible conditions for numeric filter:
					'EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'NULL', 'NOT_NULL'
				Possible conditions for date filter:
					'EQUAL', 'NOT_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'NULL', 'NOT_NULL'

				To create a custom filter, you need to call the createfilter function and pass a custom callback function as a fourth parameter.
				If the callback's name is 'customfilter', the Grid will pass 3 params to this function - filter's value, current cell value to evaluate and the condition.
				operator - 0 for "AND" and 1 for "OR"
			*/
			//clearTimeout(internalConfig.mediaManagerSearchTimer);

			var inputElem = $("#userFiles_SearchInput");
			if (inputElem.data("oldVal") != inputElem.val()){
				inputElem.data("oldVal",inputElem.val());
				var filtervalue = inputElem.val();
				var grid=$('#userFilesList');
				grid.jqxGrid('clearfilters');
				var parentElem = document.getElementById("userFiles_Search");

				if (filtervalue){

					if (!parentElem.ex_HasClassName("populated")){
						parentElem.ex_AddClassName("populated");
					}


					var filtergroup = new $.jqx.filter();
					var datafield = "fileNAME";
					var filtertype = "stringfilter";
					var condition= "CONTAINS";
					var operator= 0;

					var filter = filtergroup.createfilter(filtertype, filtervalue, condition);


					filtergroup.addfilter(operator, filter);

					// datafield is the bound field.
					// adds a filter to the grid.
					//$('#userFilesList').jqxGrid('addfilter', datafield, filtergroup);
					// to add and apply the filter, use this:
					grid.jqxGrid('addfilter', datafield, filtergroup, true);


				}else{
					parentElem.ex_RemoveClassName("populated");
				}
				if (grid.data("imageFilter")){
					grid.jqxGrid('addfilter', grid.data("imageFilterDataField"), grid.data("imageFilter"), true);
				}
			}

		},

		/**
			Adds/removes a class when input is focused/unfocused

			@method toggleFilterFocus
			@param {Boolean} on Whether the input is focused or not.
		**/
		toggleFilterFocus: function(on){
			var parentElem = document.getElementById("userFiles_Search");
			if (on){
				if (!parentElem.ex_HasClassName("focused")){
					parentElem.ex_AddClassName("focused");
				}
			}else{
				if (parentElem.ex_HasClassName("focused")){
					parentElem.ex_RemoveClassName("focused");
				}
			}
		},

		/**
			This function is called whenever a file is selected in the grid.
			@method fileSelected
			@param {Object} event The event parameters
		**/
		fileSelected: function(event){
			$("#userFiles_SelectedActions").show();
			$("#userFiles_SortContainer").hide();
			var rowindexes = $("#userFilesList").jqxGrid('getselectedrowindexes');
			if (rowindexes.length>1){
				document.getElementById("userFiles_replace").ex_AddClassName("disabled");
				document.getElementById("userFiles_download").ex_AddClassName("disabled");
			}
		},

		/**
			This function is called whenever a file is unselected in the grid.
			It checks the selected rows count, to manipulate some controls
			@method fileUnselected
			@param {Object} event The event parameters
		**/
		fileUnselected: function(event){
			var rowindexes = $("#userFilesList").jqxGrid('getselectedrowindexes');
			if (rowindexes.length==0){
				$("#userFiles_SelectedActions").hide();
				$("#userFiles_SortContainer").show();
			}else if(rowindexes.length==1){
				document.getElementById("userFiles_replace").ex_RemoveClassName("disabled");
				document.getElementById("userFiles_download").ex_RemoveClassName("disabled");
			}
		},

		/**
			Creates a popup window to preview the full image

			@method fullImgPreview
			@param {Element} elem
		**/
		fullImgPreview: function(elem){
			var imageSource = elem.src;
			var fullSource = imageSource.substring(0,imageSource.indexOf("&qSize"));
			var newImg = $("<img />");
			newImg.attr("src",fullSource);
			newImg.attr("class","imagePreviewer");
			var newImgCont = $("<div />");
			var popupCont = $("<div />");
			var mywidth,myheight;
			newImgCont.attr("style","display: table-cell; text-align: center; vertical-align: middle; width: 900px; height: 360px;");
			popupCont.append(newImgCont);
			newImg.load(function(){
				mywidth = this.width;
				myheight = this.height;
				newImgCont.append(newImg);
				popupCont.dialog({
					width: 900,	//mywidth,
					height: 410,//myheight,
					modal: true,
					draggable: false,
					resizable: false
				});//.siblings('div.ui-dialog-titlebar').remove();
				newImgCont.focus();
			});


		},

		/**
			Deletes a user's files.
			Will only succeed if:
				-The current user is the file owner
			If a file is in use, it will only nullify the owner's id.
			Otherwise, it will delete the record.
			@method deleteFiles
		**/
		deleteFiles: function(){
			var grid = $("#userFilesList");
			var rowindexes = grid.jqxGrid('getselectedrowindexes');
			var fileIDs=[];
			var rowdata;
			for (var i=0;i<rowindexes.length;i++){
				rowdata = grid.jqxGrid('getrowdata', rowindexes[i]);
				fileIDs.push(rowdata.fileID);
			}
			if (fileIDs.length>0){
				var customUrl = config.mgreq+"?qtype=RemoveUserFile&qContents="+fileIDs.join(",");
				$.ajax({
							type:"GET",
							url: customUrl,
							success: function(data){
								try{
									var realResults = eval(data);
									mygis.UI.MediaManager.refreshFileList();
									if (realResults.iotype=="success"){
										console.log("success");
									}else{
										console.log(realResults.iomsg);
									}
								}catch(err){
									console.log(err.message);
								}
							}
						});
			}
		},

		/**
			Detach a file from a layer object

			@method detachFile
			@param {String} tablename
			@param {String} OID
			@param {String} fileID
		**/
		detachFile: function(tablename,OID,fileID){
			mygis.Utilities.blockUI();
			var params = mygis.Utilities.format("{0}%23{1}%23{2}",fileID,tablename,OID);
			var customUrl = config.mgreq+"?qtype=Detachfile&qContents="+params;
			$.ajax({
				type:"GET",
				url: customUrl,
				success: function(data){
					try{
						var realResults = eval(data);
						mygis.Utilities.unblockUI();
						propertiesVisibility("",false);	//This to force user to reselect the object
						//var realResults = eval(data);
						if (realResults.iotype=="success"){
							displaySuccess("File detached. Please reselect the object to see the new results");

						}else{
							displayError(realResults.iomsg);
						}
					}catch(err){
						console.log(err.message);
					}
				}
			});
		},

		/**
			Replaces the file attached to the object with another.

			@method replaceFile
			@param {String} tablename
			@param {String} OID
			@param {String} fileID
			@param {String} newFileID
		**/
		replaceFile: function(tablename,OID,fileID,newFileID){
			mygis.Utilities.blockUI();
			var params = mygis.Utilities.format("{0}%23{1}%23{2}%23{3}",fileID,tablename,OID,newFileID);
			var customUrl = config.mgreq+"?qtype=ReplaceAttached&qContents="+params;
			$.ajax({
				type:"GET",
				url: customUrl,
				success: function(data){
					try{
						var realResults = eval(data);
						mygis.Utilities.unblockUI();
						propertiesVisibility("",false);	//This to force user to reselect the object
						//var realResults = eval(data);
						if (realResults.iotype=="success"){
							displaySuccess("File replaced. Please reselect the object to see the new results");
						}else{
							displayError(realResults.iomsg);
						}
					}catch(err){
						console.log(err.message);
					}
				}
			});
		},

		/**
			This function is used to late-bind all handlers for the Media Manager window
			@method bindManagerHandlers
		**/
		bindManagerHandlers: function(){
			$("#userFiles_uploadNew").bind('click',function(){
				if ($("#fileUploaderCont").parent().attr("id")=="VariousPopUps"){
					$("#userFilesSpaceCont").append($("#fileUploaderCont"));
				}
				if (document.getElementById("userFiles_uploadNew").ex_HasClassName("done")){
					$("#fileUploaderCont").hide();
					mygis.UI.MediaManager.refreshFileList();
					document.getElementById("userFiles_uploadNew").ex_RemoveClassName("done");
					$("#userFiles_uploadNew").html(strings.MediaManager.btnAttachFile);
				}else{
					$("#fileUploaderCont").show();
					$("#fileUploaderCont .ruFileInput").trigger("click");
					$("#userFiles_uploadNew").trigger("click");
					
					document.getElementById("userFiles_uploadNew").ex_AddClassName("done");
					$("#userFiles_uploadNew").html(strings.MediaManager.btnAttachComplete);
				}
				return false;
			});
			$("#userFiles_nameSort").bind('click',function(){
				mygis.UI.MediaManager.sortBy("userFiles_nameSort");
				return false;
			});
			$("#userFiles_typeSort").bind('click',function(){
				mygis.UI.MediaManager.sortBy("userFiles_typeSort");
				return false;
			});
			$("#userFiles_sizeSort").bind('click',function(){
				mygis.UI.MediaManager.sortBy("userFiles_sizeSort");
				return false;
			});
			$("#userFiles_dateSort").bind('click',function(){
				mygis.UI.MediaManager.sortBy("userFiles_dateSort");
				return false;
			});
			$("#userFiles_inuseSort").bind('click',function(){
				mygis.UI.MediaManager.sortBy("userFiles_inuseSort");
				return false;
			});
			$("#userFiles_refreshList").bind("click",function(){
				mygis.UI.MediaManager.refreshFileList();
				return false;
			});
			var search=$("#userFiles_SearchInput");
			search.data("oldVal","");
			search.bind('propertychange keyup input paste',mygis.UI.MediaManager.filterBy);
			search.bind('focus',function(){mygis.UI.MediaManager.toggleFilterFocus(true);});
			search.bind('blur',function(){mygis.UI.MediaManager.toggleFilterFocus(false);});
			$("#userFiles_delete").bind("click",mygis.UI.MediaManager.deleteFiles);
			$("#userFiles_download").bind("click",function(){mygis.UI.MediaManager.downloadFile();});
			$("#userFiles_CANCEL").bind("click",mygis.UI.MediaManager.closeWindow);
			$("#userFiles_OK").bind("click",mygis.UI.MediaManager.acceptWindow);
		},

		/**
			Refreshes the file list from server.

			@method refreshFileList
		**/
		refreshFileList: function(){
			var fileContainer = $("#userFilesList");
			fileContainer.jqxGrid('clearselection');
			mygis.UI.MediaManager.fileUnselected();	//to refresh the controls
			//fileContainer.jqxGrid('clear');
			/*
			var fileSource = createFileList();
			fileContainer.jqxGrid({
				source:fileSource
			});
			*/
			fileContainer.jqxGrid('updatebounddata');
			var myurl = config.mgreq+"?qtype=GetUserSpace";
			$.ajax({
				url: myurl,
				type: 'GET',
				success: function(data){
					mygis.UI.MediaManager.setupGaugeValue(parseFloat(data));
				}
			});
		},

		/**
			Sets up the "gauge" feedback about used space.
			@method setupGaugeFeedback
		**/
		setupGaugeFeedback: function(){
			var maxValue = 10;	//TODO PROPER
			var greenEnd = Math.floor(maxValue/2);
			var yellowStart = greenEnd;
			var yellowEnd = Math.floor(maxValue*0.7);
			var orangeStart = yellowEnd;
			var orangeEnd = Math.floor(maxValue*0.9);
			var redStart = orangeEnd;
			var redEnd = maxValue;
			$("#userFilesSpace").jqxGauge({
					ranges: [{ startValue: 0, endValue: greenEnd, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 5, startWidth: 1 },
							 { startValue: yellowStart, endValue: yellowEnd, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 10, startWidth: 5 },
							 { startValue: orangeStart, endValue: orangeEnd, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 },
							 { startValue: redStart, endValue: redEnd, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 16, startWidth: 13 }],
					ticksMinor: { interval: 0.5, size: '5%' },
					ticksMajor: { interval: 1, size: '9%' },
					value: 0,
					colorScheme: 'scheme09',
					animationDuration: 1200,
					width: 80,
					height: 80,
					max: maxValue,
					caption: {
						value: '0 MB',
						position: 'bottom',
						offset: [0, 0],
						visible: true
					} ,
					labels: {
						visible: false
					}
				});
		},

		/**
			Updates the "used space" gauge value
			@method setupGaugeValue
			@param {Number} value The value to set
		**/
		setupGaugeValue: function(value){
			$("#userFilesSpace").jqxGauge({
				caption:{
					value:value+" MB"
				}
			});
			$("#userFilesSpace").jqxGauge({"value": value});
			var maxSpace = 10;	//TODO
			var usedSpace = mygis.Utilities.format(" {0} MB {1} {2} MB",value,"out of",maxSpace);
			$("#currentUsedSpaceSpan").html(usedSpace);
		},

		/**
			This methods handles the pressing of "OK" button in the MediaManager.
			Checks if a function is waiting for input from the MediaManager and if true, forwards the input.
			@method acceptWindow
		**/
		acceptWindow: function(){
			var grid = $("#userFilesList");
			var selections = grid.jqxGrid('getselectedrowindexes');
			if (internalConfig.mmCallback.fn!=null){
				var selectedCount = selections.length;
				var expectedCount = internalConfig.mmCallback.objectCount;
				if (selectedCount<expectedCount && expectedCount>-1){
					alert(mygis.Utilities.format(strings.MediaManager.mm_err_notEnoughSelected,expectedCount));
				}else{
					var retobject;
					retobject = [];
					for (var i =0;i<selections.length;i++){
						retobject.push(grid.jqxGrid('getrowdata',selections[i]));
					}
					$("#userFiles").dialog('close');
					internalConfig.mmCallback.fn.call(retobject,"ok");
					mygis.UI.MediaManager.resetConfig();
				}
			}
		},

		/**
			This method handles the pressing of "Cancel" button in the MediaManager.
			@method closeWindow
		**/
		closeWindow: function(){
			if (internalConfig.mmCallback.fn!=null){
				internalConfig.mmCallback.fn.call(null,null);
				mygis.UI.MediaManager.resetConfig();
			}
			$("#userFiles").dialog('close');

		},

		/**
			This method resets the inter-function communication vars.
			@method resetConfig
		**/
		resetConfig: function(){
			internalConfig.mmCallback.fn=null;
			internalConfig.mmCallback.objectCount=-1;
			internalConfig.mmCallback.object=null;
			internalConfig.mmCallback.oid=null;
			internalConfig.mmCallback.layer=null;
			$("#fileUploaderCont").hide();
		},

		/**
			This is used to trigger a "save as" dialog for the given file id.
			@method downloadFile
			@param {String} fileID
		**/
		downloadFile: function(fileID){
			if (!fileID){
				var grid = $("#userFilesList");
				var rowindexes = grid.jqxGrid('getselectedrowindexes');
				if (rowindexes.length>0){
					var rowdata;
					rowdata = grid.jqxGrid('getrowdata', rowindexes[0]);
					fileID=rowdata.fileID;
				}
			}
			var url = mygis.Utilities.format(config.mgreq+"?qtype=DownloadFile&qContents={0}",fileID);
			window.open(url);
		},

		/**
			Toggles selection of MediaManager files.
			If all items are selected, it unselects everything. Otherwise it selects everything.
			@method toggleSelection
			@param {Element} elem The calling element
		**/
		toggleSelection: function(elem){
			var grid = $("#userFilesList");
			var alreadySelected = grid.jqxGrid('selectedrowindexes');
			var gridLength = grid.jqxGrid('source').records.length;
			var on = alreadySelected.length<gridLength;
			if (on){
				for (var i=0;i<gridLength;i++){
					if (alreadySelected.indexOf(i)==-1)
						grid.jqxGrid('selectrow',i);
				}
				$(elem).html(strings.MediaManager.btnUnselectAll);
			}else{
				grid.jqxGrid('clearselection');
				mygis.UI.MediaManager.fileUnselected();
				$(elem).html(strings.MediaManager.btnSelectAll);
			}
		}
	},

	/**
	 * Macro creation functions
	 * @class UI.Macros
	 * @static
	 */
	Macros:{

		/**
		 * Creates a new Macro
		 * @method createNew
		 * @param {Integer} id The macro id
		 * @param {String} name The macro name. This is used for the button text if isButton=true
		 * @param {Boolean} isButton whether this macro should be attached to a button
		 * @param {String} commands The various commands to execute
		 * @param {Object} options Any additional options to pass
		 */
		createNew: function(id,name,isButton,commands,parentSelector,cont_css,btn_css,options,contClass,btnClass){
			/*
			 * example
			 * command 1: mygis.UI.toggleLayerEditable(0);
			 * command 2: router('markerButton',document.getElementById("markerButton"));
			 */
			if (isButton){
				var parent = $(parentSelector);
				var btn = $("<a />");
				var btnLink = $("<span class='"+btnClass+"' />");
				btn.attr("id","macro_"+id+"_cont");
				btn.attr("class",contClass);
				
				//console.log("btnClass: "+btnClass);
				btnLink.attr("id","macro_"+id);
				btnLink.append(name);
				btn.bind("click",new Function(commands));
				btn.append(btnLink);
				//btnLink.attr("class",btnClass);
				btn.attr("style",cont_css);
				btnLink.attr("style",btn_css);
				parent.append(btn);
				internalConfig.macroButtons.push("macro_"+id);
			}else{
				if (!mygis.Macros){
					mygis.Macros = {};
				}
				mygis.Macros[name]=new Function(commands);
				mygis.Macros[name]();	//and execute it
			}
		},

		/**
		 *	Clears any previously placed macro buttons
		 *	@method clearButtons
		 */
		clearButtons: function(){
			$.each(internalConfig.macroButtons,function(i,v){
				var item = $("#"+v);
				var cont = $("#"+v+"_cont");
				item.remove();
				cont.remove();
			});
			internalConfig.macroButtons.length=0;
		},

		/**
		 *	Retrieves a list of macros
		 *	@method getList
		 */
		getList: function(){
			var retvalue;
			var myurl = config.folderPath+"mgreq.ashx?qtype=getMacros&qContents="+currentMapID;
			var source =
			{
				datatype: "json",
				datafields: [
					{ name: "macroID" },
					{ name: "mapID"},
					{ name: "appID" },
					{ name: "name" },
					{ name: "commands" },
					{ name: "parentSelector"},
					{ name: "cont_css"},
					{ name: "btn_css"},
					{ name: "options"},
					{ name: "contClass"},
					{ name: "btnClass"}, 
					{ name: "isButton"}
				],
				id: 'macroIDSource',
				url: myurl
			};
			retvalue = new $.jqx.dataAdapter(source,{async:false});
			retvalue.dataBind();
			return retvalue;
		},

		/**
		 *	Initializes the macros
		 *	@method init
		 */
		init: function(){
			try{
			mygis.UI.Macros.clearButtons();
			var source = mygis.UI.Macros.getList();
			for (var i=0;i<source.records.length;i++){
				var rec = source.records[i];
				mygis.UI.Macros.createNew(rec.macroID,rec.name,mygis.Utilities.stringToBoolean(rec.isButton),rec.commands,rec.parentSelector,rec.cont_css,rec.btn_css,rec.options,rec.contClass, rec.btnClass);
			}
			}catch(err){console.log(err.message);}
		}
	},

	/**
	 * Functions related to providing user help, like help baloons, tips etc
	 * @class UI.Help
	 * @static
	 */
	Help: {

		/**
		 * Creates a popup containing help text
		 * @method createPopup
		 * @param {String} id The popup's container id
		 * @param {String} html The popup's contents. Any valid html string
		 * @param {String} headerText The popup's title
		 * @param {Boolean} displayHeader Whether to display the popup's header or not
		 * @param {Boolean} displayClose Whether to display the close button or not
		 * @param {Boolean} movable Whether the popup is movable or not
		 * @param {String,Array} position The starting position
		 * @param {Array} size width,height of the dialog
		 */
		createPopup: function(id,html,headerText,displayHeader,displayClose,movable,position,size){
			var cont = $("<div />");
			cont.attr("id",id);
			var txt = $("<div />");
			txt.html(html);
			cont.append(txt);
			if (!displayClose){
				cont.dialog({
					autoOpen: true,
					modal: true,
					resizable: false,
					width: size[0],
					height: size[1],
					title: headerText,
					closeOnEscape: false,
					draggable: movable,
					close: function(event, ui){
						$(this).dialog('destroy').remove();
					},
					position: position||"center"
				}).siblings('div.ui-dialog-titlebar').remove()
			}else{
				cont.dialog({
					autoOpen: true,
					modal: true,
					resizable: false,
					width: size[0],
					height: size[1],
					title: headerText,
					closeOnEscape: false,
					draggable: movable,
					close: function(event, ui){
						$(this).dialog('destroy').remove();
					},
					position: position||"center"
				});
			}
		},

		showManual: function(override){
			var show=false;
			var src="";
			switch(currentAppName){
				case "ToBeParks":
					show=true;
					src="/mgManual.pdf";
					break;
				case "psyhat":
					show=true;
					src="/psyhatManual.pdf";
					break;
				case "epic":
					show=true;
					src="/epicManual.pdf";
					break;
				case "ecoplatform":
					show=true;
					src="/ecoflowManual.pdf";
					break;
			}
			if (show){
				if ($("#mygis_manual").children().length>0){
					$("#mygis_manual").dialog('show');
				}else{
					var superCont = $("<div />");

					var cont = $("<iframe />");
					cont.attr("id","mygis_manual");
					cont.attr("src",src);
					cont.css({
						"width":"100%",
						"height": "100%"
					});
					superCont.append(cont);
					superCont.dialog({
						modal: true,
						autoOpen: false,
						width: 900,
						height: 500,
						title: strings.HelpSystem.manual,
						resizable: true
					});

					superCont.dialog('open');
				}
			}else{
				displayNotify(msg_errFeatureNotImplemented);
			}
		},
		
		shortcutsReset: function(){
			$("#pageHelpActions a[id^='pageHelp']").attr("class","");
			QuerySettingsVisibility(false);
		},
		
		shortcutStart: function(){
			mygis.UI.Help.shortcutsReset();
			mygis.UI.toggleActiveList(internalConfig.layerTabIndex);
			$("#pageHelpStartHere").attr("class","active");
		},

		shortcutMaps: function(){
			//$("#bottomTabContainer").jqxTabs("select",internalConfig.mapTabIndex);
			/*
			mygis.UI.Help.shortcutsReset();
			mygis.UI.toggleActiveList(internalConfig.mapTabIndex);
			$("#pageHelpChangeMap").attr("class","active");
			*/
			if ($("#mapsPanel").is(":visible")){
				$("#mapsPanel").slideUp('fast');
				$("#mapsPanelOverlay").hide().unbind('click');
				//$("#appTabs").unbind('click');
			}else{
				$("#mapsPanelOverlay").show().click(function(){
					mygis.UI.Help.shortcutMaps();
				});
				/*
				setTimeout(function(){
					$("#appTabs").click(function(){
					mygis.UI.Help.shortcutMaps();
					});
				},1000);
				*/
				$("#mapsPanel").slideDown({
					duration: 'slow',
					complete: function(){
						$("#mapsAnalysis")[0].ex_AddClassName("active");
						$("#mapsList").jqxListBox('width',243);
						$("#mapsList").jqxListBox('width',244);
						
					}
				});
				$("#mapsPanel").css("left",$("#mapDescription").offset().left-7);
			}
			return false;
			
			
		},

		shortcutSearch: function(){
			//$("#bottomTabContainer").jqxTabs("select",internalConfig.searchTabIndex);
			mygis.UI.Help.shortcutsReset();
			mygis.UI.toggleActiveList(internalConfig.searchTabIndex);
			$("#pageHelpSearchMap").attr("class","active");
			//$("#searchSettings").show();
			//$("#btnSearchSettings").attr("class","active");
			//showQueryDialog();
		},

		tutorial:function(action,caller){
			var targetElem;
			var actionX=0;
			var actionY=0;
			var cbFunction;
			var initialized=false;
			switch(action){
				case "changeBG":
					if (!internalConfig.helpTips.switchBG_animPlaying){
						//$("#bottomTabContainer").jqxTabs('select',internalConfig.layerTabIndex);
						internalConfig.helpTips.switchBG_animPlaying=true;
						var grid = $("#layersList");
						var rowid = grid.jqxGrid('getrowid',grid.jqxGrid('source').localdata.length-1);
						var colnumber = 1;
						if (Sys.Services.AuthenticationService.get_isLoggedIn()){
							colnumber = 7;
						}else{
							colnumber = 5;
						}
						targetElem = $(mygis.Utilities.format("#row{0}layersList div:nth-child({1})",rowid,colnumber));
						actionY=10;
						initialized=true;
						cbFunction= function(){
							singleQTip("switchBG",[targetElem]);
							internalConfig.helpTips.switchBG_animPlaying=false;
						};
					}
					break;
			}
			if(initialized){
				var source_offset = $(caller).offset();
				var source_top = source_offset.top;
				var source_left = source_offset.left;
				var target_offset = targetElem.offset();
				var target_top = target_offset.top+actionY;
				var target_left = target_offset.left+actionX;

				mygis.UI.Help.animateCursor([source_top,source_left],[target_top,target_left],cbFunction);
			}
		},

		animateCursor: function(from,to,callback){
			var div = $("<div class='tutorialCursor' />");
			$("body").append(div);
			div.css({"top": from[0]+"px","left": from[1]+"px"});
			div.animate({
				"top": to[0]+"px",
				"left": to[1]+"px"
			},{
				duration: 4000,
				complete: function(){
					div.remove();
					callback();
				}
			});
		}
	},

	/**

		@method attachFileToRecord
		@param {String} fid The object identifier (Tablename.OID)
	**/
	attachFileToRecord: function (fid){
		internalConfig.mmCallback.fn=mygis.UI.attachFileToRecordResult;
		internalConfig.mmCallback.objectCount=1;
		internalConfig.mmCallback.object=fid;
		showMediaManager();
	},
	
	layerCloneInit: function(event){
		var originalList = $("#layersList");
		var clonedList = $("#layerlistClone");
		var outerRenderer = function(row,datafield,value){
			var class1="";
			var class2="";
			var class3="";
			var title="";
			var action="";
			var retvalue = "";
			var retvalue = "";
			switch (datafield){
				case "Visible":
					class1 = "layer_visible";
					class2 = mygis.Utilities.stringToBoolean(value)?"pressed":"";
					//class3 = Boolean(this.owner.getrowdata(row).Locked)?"disabled":"";
					title = strings.LayerControl.columnVisible;
					action = "router('tlvm',"+row+");";	//"mygis.UI.toggleLayerSelectable("+(row)+");";
				break;
			}
			retvalue = '<a href="#" onclick="'+action+'return false;" class="'+class1+' '+class3+' '+class2+'" title="'+title+'"></a>';;	//temp
			return retvalue;
		}
		var outerColumns = [
			{text: '',datafield:'Visible', width: 20,cellsrenderer: outerRenderer},
			{text: 'Folder', datafield:'Name', editable:false}
		];
		var outerSource = layerSource.getrecords();
		var folders={
			"Unknown": []
		};
		$.each(outerSource,function(x,y){
			if (y.folderName){
				if (!folders[y.folderName]){
					folders[y.folderName]=[];
				}
				folders[y.folderName].push(y);
			}else{
				folders["Unknown"].push(y);
					
			}
		});
		var maxCount=0;
		var minCount=1;
		//outerSource=[];
		var innerSource =[];
		$.each(folders,function(x,y){
			if (folders[x].length>0){
				if (folders[x].length>maxCount){maxCount=folders[x].length;}
				if (folders[x].length<minCount){minCount=folders[x].length;}
				innerSource.push({
					"Visible": true, 
					"Name": x
				});
			}
		});
		 var source = { datafields: [
			{ name: 'Visible'},
			{ name: 'Name', type: 'string' }
			],
			id: 'asdf2',
			localdata: innerSource
		};
		var nestedGrids = new Array();
		
		var adapter = new $.jqx.dataAdapter(source, { autoBind: true });
		clonedList.jqxGrid({
			width: 241,
			height: '100%',
			source: adapter,
			rowdetails: true,
			autorowheight: true,
			autoheight: true, 
			initrowdetails: mygis.UI.layerNestedCloneInit(nestedGrids,folders),
			rowdetailstemplate: { rowdetails: "<div id='layerClonedGrid' style='margin: 10px;'></div>",rowdetailsheight:(maxCount*29)+10, rowdetailshidden: true },
			columns: outerColumns,
			showheader: false,
			showgroupsheader: false,
			theme: 'pk_mg'
		});
		
	},
	
	layerNestedCloneInit: function(nestedGrids,outerSource){
		var groupsrenderer = function (text, group, expanded,properties) {
			return "" + group + " ("+properties.rows.length+")";
		}
		return function(index, parentElement, gridElement, record){
			var id = record.Name;
			var grid = $($(parentElement).children()[0]);
			nestedGrids[index] = grid;
			var layersByFolder = [];
			for(var i=0;i<outerSource[id].length;i++){
				layersByFolder.push(outerSource[id][i]);
			}
			var layerInnerSource = { datafields: [
					{ name: "mapID" },
					{ name: "layerID" },
					{ name: "layerNAME" },
					{ name: "layerDESCRIPTION" },
					{ name: "layerTABLE" },
					{ name: "layerORDER" },
					{ name: "layerEXTENTS"}, 
					{ name: "hidden"},
					{ name: "Editable"},
					{ name: "Selectable"},
					{ name: "layerMinScale" },
					{ name: "layerMaxScale" },
					{ name: "manualVisibility" },
					{ name: "layerGeomType" },
					{ name: "folderName"}
				],
				id: 'asdf3',
				localdata: layersByFolder
			}
			var nestedGridAdapter = new $.jqx.dataAdapter(layerInnerSource);
			nestedGridAdapter.dataBind();
			layergridSource = {
				localdata: mygis.UI.buildGridSource(nestedGridAdapter,'layers',false),
				datatype: 'array'
			};
			if (grid != null) {
				grid.jqxGrid({
					source: layergridSource, 
					width: 200, 

					columns: [
						//{text: '', datafield: 'Locked', width: 26, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false},
						{text: '',datafield:'Visible', width: 13,cellsrenderer: mygis.UI.layerInnerCellRenderer()},
						{text: '',datafield:'Image', width: 26, cellsrenderer: mygis.UI.layerGraphicCellRenderer(),editable:false},
						{text: strings.LayerControl.columnName, datafield:'Name', cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false},
						{text: '', datafield: 'Selectable', width: 16, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
					],
					autorowheight: true,
					//autoheight: true, 
					height:'90%',
					theme: 'pk_mg',
					rowdetails: false,
					sortable: true,
					groupable: true,
					showheader: false,
					showgroupsheader: false,
					editable: false,
					selectionmode: 'none',
					groupsrenderer: groupsrenderer,
					scrollbarsize: 5,
					rendered: layerGridRendered
				});
				grid.find('.layerLegendGraphic').live({
					mouseenter: layerStyleFullZoom,
					mouseleave: layerStyleFullZoomOff
				});
			}
		};
	},
	
	layerGraphicCellRenderer: function(){
		return function (row, datafield, value) {
			//return '<img style="margin-left: 5px;" height="60" width="50" src="' + value + '"/>';
			//console.log('IR1 - datafield: '+datafield + '\r\n'+'value: '+value);
			//if (value=="none" || value==99999){console.log("gotcha1");}
			if (value){
				try{
					var tname=layerSource.records[row].layerTABLE;
					var style=layerStyles[tname].namedLayers[tname].userStyles[0];
					var validCondition=false;
					var externalGraphic="";
					if (style.rules.length==1 || style.rules[0].name=="Large"){
						var symbolizer=layerStyles[tname].namedLayers[tname].userStyles[0].rules[0].symbolizers[0];
						if (symbolizer.externalGraphic){
							externalGraphic=symbolizer.externalGraphic;
							validCondition=true;
						}
					}
					if (validCondition){
						var newGraphicUrl=externalGraphic.replace(config.namespace,config.mapserver);
						var position = newGraphicUrl.length-4; 
						newGraphicUrl= newGraphicUrl.substr(0,position)+"_legend"+newGraphicUrl.substr(position);
						var result='<div class="layerLegendGraphic normalLayer" style="background-image:url('+newGraphicUrl+');"><img style="pointer-events: none;width: 20px; height: 20px;" src="' + newGraphicUrl + '"/></div>';
						$.ajax({
							type: 'HEAD',
							url: newGraphicUrl,
							async: false,
							success: function(){
							  result= '<div class="layerLegendGraphic normalLayer" style="background-image:url('+newGraphicUrl+');"><img style="pointer-events: none;width: 20px; height: 20px;" src="' + newGraphicUrl + '"/></div>';
							},
							error: function() {
							  result= '<div class="layerLegendGraphic normalLayer" style="background-image:url('+value+');"><img style="pointer-events: none;" src="' + value + '"/></div>';
							}
						  });
						  return result;
						
					}else{
						return '<div class="layerLegendGraphic normalLayer" style="background-image:url('+value+');"><img style="pointer-events: none;" src="' + value + '"/></div>';
					}
				}catch(err){
					return '<div class="layerLegendGraphic normalLayer" style="background-image:url('+value+');"><img style="pointer-events: none;" src="' + value + '"/></div>';
				}
				
				//return '<div class="layerLegendGraphic" style="background-image:url('+value+');"></div>';
				
			}else{
				//console.log("gotcha2");
				var value2=config.folderPath+'Images/layerList/tilecache-layer.png';
				return '<div class="layerLegendGraphic background" style="background-image: url('+value2+');"><img style="pointer-events: none;" src="' + value2 + '"/></div>';
			}
		}
	},
	
	buildSelectionListSource: function(dataAdapter){
		var data=dataAdapter.records;
		var records=[];
		$.each(data,function(i,v){
			if (!(Boolean(v.hidden)===true)){
				//v.label=v.layerNAME;
				//v.value=v.layerTABLE;
				records.push(v);
			}
		});
		var retvalue={
			localdata: records,
			datatype: 'array'
		};
		var dataAdapter = new $.jqx.dataAdapter(retvalue);
		dataAdapter.dataBind();
		return dataAdapter;
	},
	
	/**
	  *Gets a layer's checkbox status in the "legend" panel
	  *That checkbox might actually reflect the current visibility status of the layer, 
	  *or the user has unsaved changes. 
	  *Used because the panel refreshes often, and the user might not have applied changes yet.
	  * @method getLayerCheckStatus
	  * @param item {Object}
	  */
	getLayerCheckStatus: function(item){
		var status=false;
		var found=false;
		if (internalMemory.unsavedLayerChanges.length>0){
			var i=0;
			var items=internalMemory.unsavedLayerChanges;
			while (!found && i < items.length){
				var check = items[i];
				if (item.layerID==check.layerID){
					found=true;
					status=!mygis.Utilities.stringToBoolean(check.hidden);
				}
				i++;
			}
		}
		if (!found){
			status=!mygis.Utilities.stringToBoolean(item.hidden);
		}
		
		return status;
	},
	
	applyLayerChanges: function(){
		$("#applyLayersCont").hide('slide',{direction: 'down'},300);
		mygis.Utilities.blockUI();
		$.each(internalMemory.unsavedLayerChanges,function(i,v){
			var i=0;
			var found=false;
			var items = layerSource.records
			while (!found && i < items.length){
				var check=items[i];
				if (v.layerID==check.layerID){
					found=true;
					check.hidden=v.hidden;
					check.manualVisibility=true;
				}
				i++;
			}
		});
		internalMemory.unsavedLayerChanges.length=0;
		var mapItem = $("#mapsList").jqxListBox('getSelectedItem').originalItem;
		loadMapSequence(mapItem);
		mygis.UI.updateLayerGrid();
	},
	
	cancelLayerChanges: function(){
		$("#applyLayersCont").hide('slide',{direction: 'down'},300);
		internalMemory.unsavedLayerChanges.length=0;
		mygis.UI.updateLayerGrid(true);
	},
	
	buildGridSource: function(dataAdapter,mode,includeBG){
		var data = dataAdapter.records;
		switch (mode)
		{
			case "layers":
				var source = new Array();
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					var label = item.layerNAME;
					var row = {};
					row["#"]=i+1;
					row["Name"]=label;
					row["Visible"]=mygis.UI.getLayerCheckStatus(item);	//!mygis.Utilities.stringToBoolean(item.hidden);
					//console.log(item.layerNAME+" visible: "+row["Visible"]);
					if (item.mygisImageSrc){
						row["Image"]=item.mygisImageSrc;
					}else{
						var img = mygis.UI.getSingleLegend(item.layerTABLE,item.layerGeomType);
						row["Image"]=img.src;
					}
					row["Type"]=strings.LayerControl.typeData;
					row["Savable"]=item.Savable;
					row["Editable"]=item.Editable;
					row["Selectable"]=item.Selectable;
					//row["Locked"]=item.Locked;
					row["manualVisibility"]=item.manualVisibility;
					row["folderName"]=item.folderName?item.folderName:strings.LayerControl.noFolderName;
					source.push(row);
				}
				//if (includeBG){
					for (var i=0;i<digimap.layers.length;i++){
						var layer = digimap.layers[i];
						if (layer.isBaseLayer){
							for (var bg in backgrounds){
								if (backgrounds[bg].hasOwnProperty("name")){
									var newObj = {};
									newObj["#"]=99999;
									newObj["Name"]=backgrounds[bg].name;
									newObj["Visible"]= layer.visibility && (layer.name==backgrounds[bg].name);
									newObj["Image"]="";
									newObj["Type"]=strings.LayerControl.typeBackground;
									newObj["Savable"]=false;
									newObj["Editable"]=false;
									newObj["Selectable"]=false;
									newObj["manualVisibility"]=layer.manualVisibility;
									newObj["folderName"]=strings.LayerControl.labelBackground;
									source.push(newObj);
								}else{
									for (var sub in backgrounds[bg]){
										var newObj = {};
										newObj["#"]=99999;
										newObj["Name"]=backgrounds[bg][sub].name;
										newObj["Visible"]= layer.visibility&& (layer.name==backgrounds[bg][sub].name);
										newObj["Image"]="";
										newObj["Type"]=strings.LayerControl.typeBackground;
										newObj["Savable"]=false;
										newObj["Editable"]=false;
										newObj["Selectable"]=false;
										newObj["manualVisibility"]=layer.manualVisibility;
										newObj["folderName"]=strings.LayerControl.labelBackground;
										source.push(newObj);
									}
								}
								
							}
						}
					}
				//}
				return source;
		}
	},
	
	layerInnerCellRenderer: function(){
		return function(row,datafield,value){
			var class1="";
			var class2="";
			var class3="";
			var title="";
			var action="";
			var retvalue = "";
			switch (datafield){
				case "#":
					class1="layer_options";
					if (value!=99999){
						action="router('codingTLD',"+(value-1)+");"; //"toggleLayerDetails("+(value-1)+",this);";
						title = strings.LayerControl.columnProperties;
					}else{
						action="router('cycleBG',['"+this.owner.getrowdata(row).Name+"',"+row+"]);";
						title = strings.LayerControl.columnCycle;
					}
					
					break;
				case "Name":
					var layerID = this.owner.getrowdata(row)["#"];
					var rowheight = 21;
					var rowindex = row - layerSource.records.length;
					var action = mygis.Utilities.format("switchBG_{0}",rowindex);
					if (layerID==99999){
						retvalue=mygis.Utilities.format("<div title='{0}' class='imageVerticalContainer2' style='font-size: 11px;height: {1}px;text-align:left;'>{0}</div>",value,rowheight);
					}else{
						retvalue=mygis.Utilities.format("<div title='{0}' class='imageVerticalContainer2' style='font-size: 11px;height: {1}px;'>{0}</div>",value,rowheight);
					}
					break;
				case "Visible":
					var layerID = this.owner.getrowdata(row)["#"];
					if (layerID==99999){
						class1 = "layer_visible background";
					}else{
						class1 = "layer_visible";
					}
					class2 = value?"pressed":"";
					if (value){
						class3 = "jqx-checkbox-default jqx-checkbox-default-pk_mg jqx-rc-all jqx-rc-all-pk_mg jqx-checkbox-check-checked";
					}else{
						class3 = "jqx-checkbox-default jqx-checkbox-default-pk_mg jqx-fill-state-normal jqx-fill-state-normal-pk_mg jqx-rc-all jqx-rc-all-pk_mg";
					}
					title = strings.LayerControl.columnVisible;
					action = "router('tlvm',"+row+");return true;";	
					break;
				case "Savable":
					class1= "layer_savable";
					class2 = Boolean(value)?"pressed":"";
					action="router('codingSaveLayer',"+(value-1)+");";
					title = strings.LayerControl.saveChanges;
					break;
				case "Editable":
					class1 = "layer_editable";
					class2 = mygis.Utilities.stringToBoolean(value)?"pressed":"";
					class3 = mygis.Utilities.stringToBoolean(this.owner.getrowdata(row).Locked)?"disabled":"";
					title = strings.LayerControl.columnEditable;
					action = "router('codingTLE',"+row+");";	//"mygis.UI.toggleLayerEditable("+(row)+");";
					break;
				case "Selectable":
					class1 = "layer_selectable";
					class2 = mygis.Utilities.stringToBoolean(value)?"pressed":"";
					//class3 = Boolean(this.owner.getrowdata(row).Locked)?"disabled":"";
					title = strings.LayerControl.columnSelectable;
					action = "router('codingTLS',"+row+");";	//"mygis.UI.toggleLayerSelectable("+(row)+");";
					break;
				case "Locked":
					class1 = "layer_locked";
					class2 = mygis.Utilities.stringToBoolean(value)?"pressed":"";
					title = strings.LayerControl.columnLocked;
					break;
				case "Type":
					class1 = "layer_type";
					class2 = value==strings.LayerControl.typeData?"layer_type_data":"layer_type_bg";
					title = value==strings.LayerControl.typeData?strings.LayerControl.typeData:strings.LayerControl.typeBackground;
					break;
				case "folderName":
					console.log("value: "+value);
					retvalue=mygis.Utilities.format("<div class='imageVerticalContainer2' style='font-size: 11px;height: {1}px;'>{0}</div>",value,20);
					break;
			}
			if (datafield!="Name" && datafield!="folderName"){
				if (datafield=="#" && value==99999){
					return "";
				}else{
					return '<a href="#" onclick="'+action+'return false;" class="'+class1+' '+class3+' '+class2+'" title="'+title+'"></a>';
				}
			}else{
				return retvalue;			
			}
		}
	},

	/**

		@method replaceFileInRecord
		@param {String} tablename
		@param {String} OID
		@param {String} fileID
	**/
	replaceFileInRecord: function(tablename,OID,fileID){
		internalConfig.mmCallback.fn=mygis.UI.replaceFileInRecordResult;
		internalConfig.mmCallback.objectCount=1;
		internalConfig.mmCallback.object={
			called_table: tablename,
			called_oid: OID,
			called_fileID: fileID
		};
		showMediaManager();
	},

	/**
		This method is called after the user closes the Media Manager to attach a file.

		@method attachFileToRecordResult
		@param {String} result The operation's result
	**/
	attachFileToRecordResult: function(result){
		var resultObj=this;
		resultObj = resultObj[0];
		if (!result || result!="ok"){
			if (result){
				displayError(result);
			}
		}else{
			mygis.Utilities.blockUI();
			var customurl = config.mgreq+"?qtype=AttachFileToFeature&qContents="+resultObj.fileID+"%23"+internalConfig.mmCallback.object;
			$.ajax({
				type:"GET",
				url: customurl,
				success: function(data){
					try{
						mygis.Utilities.unblockUI();
						propertiesVisibility("",false);	//This to force user to reselect the object
						var realResults = eval(data);
						if (realResults.iotype=="success"){
							displaySuccess("File attached. Please reselect the object to see the new results");
						}else{
							displayError(realResults.iomsg);
						}
					}
					catch(err){
						displayError(err.message);
					}
				}
			});

		}
	},

	/**
		This method is called after the user closes the Media Manager to replace an attached file.

		@method replaceFileInRecordResult
		@param {String} result The operation's result
	**/
	replaceFileInRecordResult: function(result){
		var resultObj=this;

		resultObj = resultObj[0];
		if (!result || result!="ok"){
			if (result){
				displayError(result);
			}
		}else{
			var config = internalConfig.mmCallback.object;
			var tablename=config.called_table;
			var oid=config.called_oid;
			var fid=config.called_fileID;
			var newFid=resultObj.fileID;
			mygis.UI.MediaManager.replaceFile(tablename,oid,fid,newFid);
		}
	},

	/**
		This method builds an "available images" grid for use in object info.
		@method objectImageGrid
		@param {String} OID Object ID
		@param {String} tablename The layer.tableNAME
		@param {String} type The generic type: 'Images' or 'Files'
	**/
	objectImageGrid: function(OID,tablename,type){
		var fid = tablename+"."+OID;
		var imageSource=mygis.UI.getObjectGridSource(type,fid);
		var suffix = type=="Images"?"image":"file";
		var className = imageSource.records.length?"imagegrid":"imagegrid norecords";
		var grid = $("<div id='"+fid.replace(".","_")+mygis.Utilities.format("__{0}grid",suffix)+"' class='"+className+"' />");
		

		$.each(imageSource.records,function(i,v){
			var panel = $("<div />");
			var panelTitle = $("<div />");
			var panelContents = $("<div />");
			var panelActions = $("<div />");
			panel.attr("class","objectFilePanel");
			panelTitle.attr("class","objectFileTitle");
			panelContents.attr("class","objectFileContents");
			panelActions.attr("class","objectFileActions");
			
			panel.append(panelContents);
			panel.append(panelActions);
			panel.append(panelTitle);

			if (!v.imageFRIENDLY || v.imageFRIENDLY==""){
				panelTitle.append(v.imageNAME);
			}else{
				panelTitle.append(v.imageFRIENDLY);
			}
			if (type=="Images"){
				var action = "router('infopopup_previewImg',this);";
				retobject = mygis.Utilities.format('<div style="" title="{3}"><img onclick="{0}" style="margin: 4px;" src="{1}GetImage.ashx?qType=userFile&qContents={2}&qSize=45" /></div>',
							action,
							config.folderPath,
							v.imageID,
							v.imageNAME);
			}else{
				var cname = "";
				var extParts = v.imageNAME.split(".");
				var ext = extParts[extParts.length-1].toLowerCase();
				switch(ext){
					case "doc":
					case "docx":
						cname = "doc";
						break;
					case "xls":
					case "xlsx":
						cname = "xls";
						break;
					case "ppt":
					case "pptx":
						cname = "ppt";
						break;
					case "pdf":
						cname = "pdf";
						break;
					default:
						cname = "unknown";
						break;
				}
				retobject = mygis.Utilities.format('<div title="{0}"><div class="MMLargeFile {1}" /></div>',
						v.imageNAME,
						cname);
			}

			panelContents.html(retobject);

			var imageButtons = $("<div />");
			var imgBtnDownload = $("<a />");
			var imgBtnReplace = $("<a />");
			var imgBtnDelete = $("<a />");
			var disabledClass = !Sys.Services.AuthenticationService.get_isLoggedIn()?" disabled":"";
			imageButtons.attr("class","objectFileActionCont");
			imgBtnDownload.attr("class","btnTool imageDownload");
			imgBtnDelete.attr("class","btnTool imageDelete"+disabledClass);
			imgBtnReplace.attr("class","btnTool imageReplace"+disabledClass);

			imageButtons.append(imgBtnDownload);
			imageButtons.append(imgBtnReplace);
			imageButtons.append(imgBtnDelete);
			imgBtnDownload.attr("onclick",mygis.Utilities.format("router('infoPopup_download',{0});",v.imageID));
			imgBtnDelete.attr("onclick",mygis.Utilities.format("router('infoPopup_detach',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
			imgBtnReplace.attr("onclick",mygis.Utilities.format("router('infoPopup_replace',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
			panelActions.append(imageButtons);

			grid.append(panel);
		});
		return grid;
	},

	/**
		Builds a jqxDataAdapter source for the given grid type.
		This is used in object info (images and file tab accordingly)
		@method getObjectGridSource
		@param {String} type 'Images' or 'Files"
		@param {String} key The object primary key
		@return {Object} jqxDataAdapter
	**/
	getObjectGridSource: function(type,key){
		var myurl = mygis.Utilities.format(config.mgreq+"?qtype=GetObject{0}&qContents={1}",type,key);
		var retSource;
		var source;
		switch(type){
			case "Images":
				source = {
					datatype: "json",
					datafields:[
						{ name: "imageID" },
						{ name: "imageNAME" },
						{ name: "imageFRIENDLY" }
					],
					id: 'ImagesSource',
					url: myurl
				};
				break;
			case "Files":
				source = {
					datatype: "json",
					datafields:[
						{ name: "imageID" },
						{ name: "imageNAME" },
						{ name: "imageFRIENDLY" }
					],
					id: 'FilesSource',
					url: myurl
				};
				break;
		}
		mygis.Utilities.blockUI();
		retSource = new $.jqx.dataAdapter(source,{async:false});
		retSource.dataBind();
		mygis.Utilities.unblockUI();
		return retSource;
	},
	
	/**
		Builds the layout for images inside info popup
		@method getInfoImageGrid
		@param (Array) data The image records
		@param (String) id A unique identifier to attach to the returned object. Expects a tablename{dot}featureID form.
	*/
	getInfoImageGrid: function(data,id){
		var grid = $("<div id='"+id.replace(".","_")+mygis.Utilities.format("__{0}grid","image")+"' class='imagegrid' />");
		var tablename=id.split(".")[0];
		var OID=id.split(".")[1];
		$.each(data,function(i,v){
			grid.append(mygis.UI.buildImageCell(v,id));
		});
		return grid;
	},
	
	/**
		Builds the layout for files inside info popup
		@method getInfoFileGrid
		@param (Array) data The image records
		@param (String) id A unique identifier to attach to the returned object. Expects a tablename{dot}featureID form.
	*/
	getInfoFileGrid: function(data,id){
		var grid = $("<div id='"+id.replace(".","_")+mygis.Utilities.format("__{0}grid","image")+"' class='imagegrid' />");
		var tablename=id.split(".")[0];
		var OID=id.split(".")[1];
		$.each(data,function(i,v){
			grid.append(mygis.UI.buildFileCell(v,id));
		});
		return grid;
	},

	/**
	* Creates html for a single image block
	* @method buildImageCell
	* @param v {Object} Image data
	* @param id (String) tablename.OID
	*/
	buildImageCell: function(v,id){
		var tablename=id.split(".")[0];
		var OID=id.split(".")[1];
		var panel = $("<div />");
		var panelTitle = $("<div />");
		var panelContents = $("<div />");
		var panelActions = $("<div />");
		panel.attr("class","objectFilePanel");
		panelTitle.attr("class","objectFileTitle");
		panelContents.attr("class","objectFileContents");
		panelActions.attr("class","objectFileActions");
		
		panel.append(panelTitle);
		panel.append(panelContents);
		panel.append(panelActions);
		

		if (!v.imageFRIENDLY || v.imageFRIENDLY==""){
			panelTitle.append(v.imageNAME);
		}else{
			panelTitle.append(v.imageFRIENDLY);
		}
		var action = "router('infopopup_previewImg',this);";
		retobject = mygis.Utilities.format('<div style="" title="{3}"><img onclick="{0}" style="margin: 4px;" src="{1}GetImage.ashx?qType=userFile&qContents={2}&qSize=45" /></div>',
					action,
					config.folderPath,
					v.imageID,
					v.imageNAME);
		panelContents.html(retobject);

		var imageButtons = $("<div />");
		var imgBtnDownload = $("<a />");
		var imgBtnReplace = $("<a />");
		var imgBtnDelete = $("<a />");
		var disabledClass = !Sys.Services.AuthenticationService.get_isLoggedIn()?" disabled":"";
		imageButtons.attr("class","objectFileActionCont");
		imgBtnDownload.attr("class","btnTool imageDownload");
		imgBtnDelete.attr("class","btnTool imageDelete"+disabledClass);
		imgBtnReplace.attr("class","btnTool imageReplace"+disabledClass);

		imageButtons.append(imgBtnDownload);
		imageButtons.append(imgBtnReplace);
		imageButtons.append(imgBtnDelete);
		imgBtnDownload.attr("onclick",mygis.Utilities.format("router('infoPopup_download',{0});",v.imageID));
		imgBtnDelete.attr("onclick",mygis.Utilities.format("router('infoPopup_detach',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
		imgBtnReplace.attr("onclick",mygis.Utilities.format("router('infoPopup_replace',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
		panelActions.append(imageButtons);
		return panel;
	},
	
	/**
	* Creates html for a single file block
	* @method buildFileCell
	* @param v {Object} File data
	* @param id (String) tablename.OID
	*/
	buildFileCell: function(v,id){
		var tablename=id.split(".")[0];
		var OID=id.split(".")[1];
		var panel = $("<div />");
		var panelTitle = $("<div />");
		var panelContents = $("<div />");
		var panelActions = $("<div />");
		panel.attr("class","objectFilePanel");
		panelTitle.attr("class","objectFileTitle");
		panelContents.attr("class","objectFileContents");
		panelActions.attr("class","objectFileActions");
		
		panel.append(panelTitle);
		panel.append(panelContents);
		panel.append(panelActions);
		

		if (!v.imageFRIENDLY || v.imageFRIENDLY==""){
			panelTitle.append(v.imageNAME);
		}else{
			panelTitle.append(v.imageFRIENDLY);
		}
		var cname = "";
		var extParts = v.imageNAME.split(".");
		var ext = extParts[extParts.length-1].toLowerCase();
		switch(ext){
			case "doc":
			case "docx":
				cname = "doc";
				break;
			case "xls":
			case "xlsx":
				cname = "xls";
				break;
			case "ppt":
			case "pptx":
				cname = "ppt";
				break;
			case "pdf":
				cname = "pdf";
				break;
			default:
				cname = "unknown";
				break;
		}
		var action="router('infopopup_previewFile',{elem:this,id:"+v.imageID+"});";
		retobject = mygis.Utilities.format('<div title="{1}" onclick="{0}"><div class="MMLargeFile {2}" /></div>',
				action,
				v.imageNAME,
				cname);
		panelContents.html(retobject);
		var imageButtons = $("<div />");
		var imgBtnDownload = $("<a />");
		var imgBtnReplace = $("<a />");
		var imgBtnDelete = $("<a />");
		var disabledClass = !Sys.Services.AuthenticationService.get_isLoggedIn()?" disabled":"";
		imageButtons.attr("class","objectFileActionCont");
		imgBtnDownload.attr("class","btnTool imageDownload");
		imgBtnDelete.attr("class","btnTool imageDelete"+disabledClass);
		imgBtnReplace.attr("class","btnTool imageReplace"+disabledClass);

		imageButtons.append(imgBtnDownload);
		imageButtons.append(imgBtnReplace);
		imageButtons.append(imgBtnDelete);
		imgBtnDownload.attr("onclick",mygis.Utilities.format("router('infoPopup_download',{0});",v.imageID));
		imgBtnDelete.attr("onclick",mygis.Utilities.format("router('infoPopup_detach',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
		imgBtnReplace.attr("onclick",mygis.Utilities.format("router('infoPopup_replace',['{0}','{1}',{2}]);",tablename,OID,v.imageID));
		panelActions.append(imageButtons);
		return panel;
	},
	/**
		Retrieves the user input from the "editFieldBox" dialog and appends it to the correct feature.

		@method updateObjectField
		@for UI
	**/
	updateObjectField: function(){
		var newValue = $("#fieldEditor").attr("value");
		var recordOID = $("#editRecordNo").html().split("#")[1];
		var recordLayer = $("#editLayerName").html();
		var recordField = $("#fieldColumnName").html();
		var feature = cosmeticLayer.getFeatureByFid(recordLayer+"."+recordOID);
		if (feature){
			feature.data[recordField]=newValue;
			feature.modified=true;
			feature.layer.events.triggerEvent("afterfeaturemodified",{
				feature: feature,
				modified: feature.modified
			});
			$("#editFieldBox").dialog('close');
		}else{
			displayError("Feature "+recordLayer+"."+recordOID+" not found!");
		}
	},

	/**
		Clear the current field value in the "editFieldBox" dialog.

		@method clearObjectField
	**/
	clearObjectField: function(){
		$("#fieldEditor").attr("value","");
	},


	/**
		Closes the "editFieldBox" dialog

		@method cancelObjectEditing
	**/
	cancelObjectEditing: function(){
		$("#editFieldBox").dialog('close');
	},
	
	createCustomHotSearch: function(queryname,querylabel,params){
		var myurl=config.mgreq+"?qtype="+queryname+"&qContents="+(params);
		$(document).bind('finishedLoading',function(){
			$.ajax({
				type:"GET",
				url: myurl,
				success: function(data){
					var response = eval(data);
					if (typeof response=="object"){
						var qItem = new Object();
						qItem.text=querylabel;
						qItem.value=-1;
						qItem.isInitialized=true;
						qItem.linkedResults=response;
						qItem.isDBQuery=true;
						qItem.isMapSelect=false;
						querySource.push(qItem);
						mygis.UI.updateQueryList();		
					}
				}
			});
		});
	},
	
	/**
	*	Creates a predefined quick search window

	*	@method createHotSearch
	*	@param {String} layername The layer to search
	*	@param {String} fieldname The field that participates in the filter
	*	@param {String} searchType Has one of two possible values:
			distinct: Distinct values
			input: User input
	*	@param {String} searchOperator The type of comparison:
			EQ: equal
			LIKE: approximately equal
			NEQ: not equal
			GEQ: greater or equal
			GT: greater than
			LT: less than
			LEQ: less or equal
	*	@param {String} searchLayout Only applies if searchType is distinct. One of the following:
			checkbox: lists distinct values as checkboxes
			dropdown: lists distinct values as dropdown list
	*	@param {String} searchMode Has one of two possible values:
			auto: performs search on change
			buttons: creates two buttons for search
	*	@param {String} windowTitle The title displayed in the window
	*	@param {String} [windowIcon] The url of an image to display in the windowTitle
	**/
	createHotSearch: function(layername,fieldname,searchType,searchOperator,searchLayout,searchMode,windowTitle,windowIcon){
		/*
		*	Create the basic structure, a div with 2 containing divs
		*/
		var result = $("<div />");
		var titleCont = $("<div class='divTitle' />");
		var contentsCont = $("<div class='divContents' />");

		var resultObj = $("<div />");
		/*
		*	Encapsulate some get_from_db functions
		*/
		var getFieldType = function(layername,search_field){
			var customUrl = config.mgreq+"?qtype=GetLayerFields&qContents="+escape(layername.replace(/ /g,"_"));
			var retvalue;
			$.ajax({
					type:"GET",
					url: customUrl,
					async: false,
					success: function(data){
						var realResults = eval(data);
						$.each(realResults,function(index,value){
							if (value.fieldNAME==search_field){
								retvalue = value.fieldTYPE;
							}
						});
					}
			});
			return retvalue;
		};
		var getDistinctValues = function(layername,search_field){
			var retvalue = [];
			var customUrl = mygis.Utilities.format(config.mgreq+"?qtype=GetLayerDistinct&qContents={0}${1}",escape(layername.replace(/ /g,"_")),search_field);
			$.ajax({
					type:"GET",
					url: customUrl,
					async: false,
					success: function(data){
						var realResults = eval(data);
						$.each(realResults,function(index,value){
								row=new Object();
								row["name"]=(value&&(value!=""))?value:"-";;
								row["value"]=(value&&(value!=""))?value:"{NULL}";
								retvalue.push(row);
							});
					}
			});
			return retvalue;
		};
		switch(searchType){
			case "distinct":
				var fieldValues = getDistinctValues(layername,fieldname);
				switch(searchLayout){
					case "checkbox":
						var source = {
							datatype: "local",
							localdata: fieldValues
						};
						var listSource = new $.jqx.dataAdapter(source,{
							async: false
						});
						listSource.dataBind();
						var hiddenValues = $("<input class='lname' type='hidden' />");
						hiddenValues[0].value=layername+"#"+fieldname;
						resultObj.append(hiddenValues);
						$.each(listSource.records,function(i,v){
							var row = $("<div class='qsListItem' />");
							var check = $("<input type='checkbox' onchange='router(\"tHotSearch\",this);' />");
							var checkTitle = $("<a href='#' class='qsListLink' />");
							checkTitle.append(v.name);
							row.append(check);
							row.append(checkTitle);
							row.appendTo(resultObj);
						});
						break;
					case "dropdown":

						break;
				}
				break;
			case "input":

				var fieldType = getFieldType(layername,fieldname);
				switch(fieldType){

					default:
						var fieldTitle = $("<span />");
						fieldTitle.append("test caption");

						var fieldInput = $("<input type='text' class='userInput' />");

						resultObj.append(fieldInput);
						if (searchOperator=="BETWEEN"){
							resultObj.append(fieldInput.clone());
						}
						break;
				}
				break;

		}

		contentsCont.append(resultObj);
		var winTitle = $("<span />");
		winTitle.append(windowTitle);

		var winImg = $("<img />");
		if (windowIcon){
			winImg[0].src=windowIcon;
			titleCont.append(winImg);
		}
		titleCont.append(winTitle);

		/*
		*	Append the final structure
		*/
		result.append(titleCont);
		result.append(contentsCont);
		internalConfig.hotSearches.push(result);
		var finalResult = $("<div />");
		$.each(internalConfig.hotSearches,function(i,v){
			finalResult.append(v.html());
		});

		var numOfItems = finalResult.find(">div").length/2;
		$("#filterContents").empty();
		$("#filterContents").append(finalResult);
	},

	/**
		Used to apply the HotSearch item to the display map objects as cql filter.

		@method toggleHotSearchItem
		@param {Element} elem The toggling element
	**/
	toggleHotSearchItem: function(elem){
		var row = $(elem).parent();

		var hidden = row.parent().find(".lname")[0];
		var values = hidden.value.split("#");
		var layername = values[0];
		var fieldname = values[1];
		var op = "IN"; //TODO
		var op = "=";
		var qValues=[];

		/**
		*	Get the checked elements, and then find the anchor links in those rows to get the text
		*/
		var qValueLinks = row.parent().find('input:checked');
		for (var i=0;i<qValueLinks.length;i++){
			var link = $(qValueLinks[i]).parent().find(".qsListLink");

			qValues.push("'"+link.html()+"'");
		}


		if (qValues.length==0){
			internalConfig.myCustomFilters[layername].fieldname=null;
		}else{
			if (internalConfig.myCustomFilters[layername]==null){
				internalConfig.myCustomFilters[layername]={};
			}
			var resultFilter = "";
			$.each(qValues,function(i,v){
				if (resultFilter!=""){
					resultFilter += " OR ";
				}
				resultFilter += mygis.Utilities.format("{0} {1} {2}",fieldname,op,v);
			});
			if (resultFilter!=""){
					internalConfig.myCustomFilters[layername][fieldname]=resultFilter;
			}

		}
		if ($("#filterContents .qsListItem input:checked").length){
			customFiltered=true;	//TODO
		}else{
			customFiltered=false;	//TODO
		}

		loadMapSequence();
	},

	/**
	 * Initializes the window for the Hot Searches
	 * @method initHotSearches
	 */
	initHotSearches: function(){
		//console.log('initHotSearches');
		if (QSSource){
			if (QSSource.records.length!=0){
				var atLeastOne=false;
				if ($("#filterContents").children().length==0){
					$.each(QSSource.records,function(qsourceIndex,qsValue){
						if (qsValue.searchType=='customSQL'){
							//("pong");
							mygis.UI.createCustomHotSearch(qsValue.customFn,qsValue.windowTitle,qsValue.fieldFill);
						}else{
							atLeastOne=true;
							mygis.UI.createHotSearch(qsValue.layername,qsValue.fieldname,qsValue.searchType,qsValue.searchOperator,qsValue.searchLayout,qsValue.searchMode,qsValue.windowTitle,qsValue.windowIcon);
						}
					});
				}
				if (atLeastOne){
					document.getElementById("panel3Out").ex_RemoveClassName("collapsed");
					document.getElementById("rpanelCollapseBtn").ex_AddClassName("active")
					propertiesVisibility("filterContents",true);
					$("#filterTabButton").show();
					$("#filterTabButton").bind('click',function(){propertiesVisibility("filterAnalysis",!document.getElementById("filterTabButton").ex_HasClassName("active"));});
				}
			}
		}else{
			document.getElementById("panel3Out").ex_AddClassName("collapsed");
		}

	},
	/**
		Checks to see if there are unsaved features and calls mygis.Drawing.Exporting.saveDigitizing if true.

		@method gatherUnsaved
	**/
	gatherUnsaved: function(){
		if (featuresUnsaved.length>0 || featuresDeleted.length>0 || !mygis.Utilities.isEmptyObject(featuresModified)){
			mygis.Drawing.Exporting.saveDigitizing();
		}
	},

	/**
		Checks to see if there are unsaved features and calls mygis.Utilities.checkAuthorization if true.

		@method startSaving
	**/
	startSaving: function(params){
		if (featuresUnsaved.length>0 || featuresDeleted.length>0 || !mygis.Utilities.isEmptyObject(featuresModified)){
			mygis.Utilities.checkAuthorization('digitize',layerSource.records[layerCurrentEditing].layerID);
		}
	},

	/**
		Resets the "select", navigation and digitizing controls to their initial, unpressed state.

		@method resetControls
	**/
	resetControls: function(){
		mygis.Map.clearFeedback();
		$("#mapContainer").attr("class","olMap");	//reset
		mygis.UI.clearInfoButtons();
		//----Disable select controls:-----
		for (var i in infoControls){
			infoControls[i].deactivate();
		}
		$("#layerSelectionListCont").hide();

		//----Disable navigation controls:-----
		for (var i in naviControls){
			if (i!="navigation"){
			naviControls[i].deactivate();
			}
		}
		for (var i=0;i<4;i++){
			switch(i)
			{
				case 0:
					cname = "#dragPanBtn";
					break;
				case 1:
					cname = "#zoomBoxBtn";
					break;
				case 2:
					cname = "#zoomOutBtn";
					break;
				case 3:
					cname = "#toggleInfoBtn";
					break;
			}
			$(cname)[0].ex_RemoveClassName("selected");
		}

		//----Disable digitizing controls:-----
		mygis.UI.stopDigitize();
		
		mygis.Map.hideSearchPanel();

	},

	/**
		Activates the given OpenLayers Control, after resetting the interface.

		@method activateOLControl
		@param {Object} control An OpenLayers Control
		@param {Element} object the activated dom object
	**/
	activateOLControl: function(control,object){
		mygis.UI.resetControls();
		control.activate();
		if (object){
			if (!object.ex_HasClassName("btnTool_selected")){
				object.ex_AddClassName("btnTool_selected");
			}
			
		}

	},

	/**
		Toggles the given "selectModeTools_XXX" toolbar

		@method selectToolbar
		@param {String} name
		@param {Boolean} on Ignores the current state and turns it on
	**/
	selectToolbar: function(name,on){
		var toolbar;
		var splitList = name?name.split(","):[];

		for (var i=0;i<3;i++){
			toolbar = "selectModeTools_"+i.toString();
			if (splitList.indexOf(i.toString())==-1 || !on){
				document.getElementById(toolbar).ex_RemoveClassName("on");
				$("#"+toolbar).parent().hide();
			}else{
				document.getElementById(toolbar).ex_AddClassName("on");
				$("#"+toolbar).parent().show();

			}

		}

	},
	//JK CHANGES - also activates circle btn
	/**
		Handles activation of:
			-selectObject
			-selectRect
			-selectCircle
			-selectClear

		@method activateSelectCtrl
		@param {Element} elem The toggling element
	**/
	activateSelectCtrl: function(elem){
		var showTip=false;
		mygis.UI.stopDigitize();
		document.getElementById("mode_TopSelect").ex_RemoveClassName("drawer");
		if (!elem.ex_HasClassName("disabled")){
			//mygis.UI.Help.shortcutSearch();
			switch(elem.id){
				case "infoTool":
					document.getElementById("mode_TopSelect").ex_AddClassName("drawer");
					mygis.UI.toggleSelectBtn('info');
					elem.ex_AddClassName("selected");
					$("#layerSelectionListCont").attr("class","");
					$("#layerSelectionHeaderLabel").html(strings.MapTools.infoToolExplain);
					showTip=false;
					document.getElementById("mapContainer").ex_AddClassName("selectMode");
					break;
				case "selectObject":
					if (layerCurrentEditing>-1){
						mygis.UI.activateOLControl(drawControls.modify);
					}else{
						mygis.UI.toggleSelectBtn('point');
					}
					elem.ex_AddClassName("selected");
					document.getElementById("mapContainer").ex_AddClassName("selectMode");
					$("#layerSelectionListCont").attr("class","pointSelect");
					$("#layerSelectionHeaderLabel").html(strings.MapTools.otherToolExplain);
					showTip=true;
					break;
				case "selectRect":
					if (layerCurrentEditing>-1){
						//We have to re-init, re-add the control as box mode...
						mygis.UI.activateOLControl(drawControls.modify);
					}else{
						mygis.UI.toggleSelectBtn('rectangle');
					}
					elem.ex_AddClassName("selected");
					$("#layerSelectionListCont").attr("class","rectSelect");
					$("#layerSelectionHeaderLabel").html(strings.MapTools.otherToolExplain);
					document.getElementById("mapContainer").ex_AddClassName("selectMode");
					showTip=true;
					break;
									
				case "selectCircle":
					if (layerCurrentEditing>-1){
						//We have to re-init, re-add the control as circle mode...
						mygis.UI.activateOLControl(drawControls.modify);
					}else{
						mygis.UI.toggleSelectBtn('circle');
					}
					$("#layerSelectionListCont").attr("class","circleSelect");
					elem.ex_AddClassName("selected");
					$("#layerSelectionHeaderLabel").html(strings.MapTools.otherToolExplain);
					showTip=true;
					break;
					//JK CHANGES END
				case "selectClear":
					mygis.Map.clearSelection();
					var containerDiv = $("#infoAnalysisContents");
					containerDiv.empty();
					$("#queryExpanders").die().empty();
					$("#layerSelectionHeaderLabel").html(strings.MapTools.otherToolExplain);
					break;
			}
			if (showTip){
				displayNotify(strings.Info.selectDeselect);
			}
		}
	},

	/**
		Adds a modified feature to the proper array and notifies the UI.

		@method featureModified
	**/
	featureModified: function(event){
		if (event.modified){
			var f = event.feature;
			if (f.fid){
				featuresModified[f.fid]=f;
			}

			mygis.UI.notifyUnsavedLayer(layerCurrentEditing);
		}
	},

	/**
		Applies the local style and updates the layer grid

		@method applyLocalStyle
	**/
	applyLocalStyle: function(){
		customStyleApplied=true;
		//collapseLayerDetails();
		mygis.UI.updateLayerGrid();
	},

	/**
		Cancel the applied local style for a given layer
		@method cancelApplyLocalStyle
	**/
	cancelApplyLocalStyle: function(){
		customStyleApplied=false;
		digimap.layers[1].mergeNewParams({
			sld_body: null,
			layers: mygis.Utilities.getVisibleLayerString(currentAppName)
		});
		mygis.UI.updateLayerGrid();
		//collapseLayerDetails();
	},

	/**
		@TODO TODO

		@method resetLocalStyle
	**/
	resetLocalStyle: function(){

	},

	/**
		Toggles point mode in Layer Properties - Change style
		@method togglePointMode
	**/
	togglePointMode: function(elem){
		var checked;
		if (elem){
			checked = $(elem);
		}else{
			checked = $('input[name=PointMode]:checked','#pointModeContainer');
		}
		var checkMode=checked.val();
		if (checkMode==0){
			$("#modeOptions_0").css("display","block");
			$("#modeOptions_1").css("display","none");

			var fontSelect = document.getElementById("pointFontFamily");
			var font = fontSelect.options[fontSelect.selectedIndex].value;

			mygis.UI.populatePointIcons('font',font);
		}else{
			$("#modeOptions_0").css("display","none");
			$("#modeOptions_1").css("display","block");
			mygis.UI.populatePointIcons('library');
			//setMarkerStyleTree();
		}
	},

	/**
		Initializes the styler properties for the given layer
		@method initializeStyler
		@param {String} layername The given layer
		@param {Object} The original data source item
	**/
	initializeStyler: function(layername,layerRecord){

		var style = layerStyles[layername].namedLayers[layername].userStyles[0];
		var markerStyle,lineStyle,polyStyle;
		var rules = style.rules.length;
		switch (rules){
			case 3:	//typical;
				markerStyle = style.rules[0].symbolizer.Point;
				lineStyle = style.rules[1].symbolizer.Line;
				polyStyle = style.rules[2].symbolizer.Polygon;
				break;
			case 1:	//default
				var symbolizer = style.rules[0].symbolizer;
				for (var name in symbolizer){
					switch (name.toString()){
						case "Point":
							markerStyle = symbolizer[name];
							break;
						case "Line":
							lineStyle = symbolizer[name];
							break;
						case "Polygon":
							polyStyle = symbolizer[name];
							break;
					}
				}
				break;
			default:	//thematic?

				break;
		}
		$("#markerChooseStyle").hide();
		$("#polylineChooseStyle").hide();
		$("#polygonChooseStyle").hide();
		switch (layerRecord.layerGeomType){
			case "Point":
				//$("#pointStyleButton").show();
				//$("#lineStyleButton").hide();
				//$("#polygonStyleButton").hide();
				toggleStylerButton('Point');
				break;
			case "Line":
				//$("#pointStyleButton").hide();
				//$("#lineStyleButton").show();
				//$("#polygonStyleButton").hide();
				toggleStylerButton('Line');
				break;
			case "Polygon":
				//$("#pointStyleButton").hide();
				//$("#lineStyleButton").hide();
				//$("#polygonStyleButton").show();
				toggleStylerButton('Polygon');
				break;
			case "Mixed":
				//$("#pointStyleButton").show();
				//$("#lineStyleButton").show();
				//$("#polygonStyleButton").show();

				break;

		}
		/*----Point Initializing----*/
		var ms = markerStyle;
		var actual;
		if (ms){
			$("#markerPreview").attr("class","");
			$("#markerPreview").html("<img style='width: 100%; height: 100%;' src='"+ms.externalGraphic+"' />");
			document.getElementById("pointGraphicUrl").value = ms.externalGraphic;
			if (ms.pointRadius){
				actual=parseFloat(ms.pointRadius)*2;
			}else{
				actual=8;
			}
			$('#markerSizeSlider').slider('value',actual);
			markerSizeText.set_value(actual.toString());
		}
		/*----End of Point----*/

		/*----Line Initializing----*/
		var ls = lineStyle;
		if (ls){
			var actual;
			if (ls.strokeOpacity){
				actual=parseFloat(ls.strokeOpacity);
			}else{
				actual=1.0;
			}
			$('#lineStrokeOpacitySlider').slider('value',actual);
			lineOpacityText.set_value(actual.toString());
			if (ls.strokeWidth){
				actual=parseFloat(ls.strokeWidth);
			}else{
				actual = 1.0;
			}
			$('#lineStrokeWeightSlider').slider('value',actual);
			lineWeightText.set_value(actual.toString());

			$('#polylineStrokeColor').mSetInputColor(ls.strokeColor);
			mygis.UI.updateLinePreview(true);
		/*----End of Line----*/
		}

		/*----Polygon Initializing----*/
		var ps = polyStyle;
		var actual;
		if (ps){
			if (ps.strokeOpacity){
				actual = parseFloat(ps.strokeOpacity);
				$('#polygonStrokeOpacitySlider').slider('value',actual);
				polygonStrokeOpacityText.set_value(actual.toString());
			}
			if (ps.fillOpacity){
				actual = parseFloat(ps.fillOpacity);
				$('#polygonFillOpacitySlider').slider('value',actual);
				polygonFillOpacityText.set_value(actual.toString());
			}
			if (ps.strokeWidth){
				actual=parseFloat(ps.strokeWidth);
			}else{
				actual=1.0;
			}
			$('#polygonStrokeWeightSlider').slider('value',actual);
			polygonStrokeWeightText.set_value(actual.toString());
			$("#polygonStrokeColor").mSetInputColor(ps.strokeColor);
			$("#polygonFillColor").mSetInputColor(ps.fillColor);
			mygis.UI.updatePolyPreview(true);
			/*----End of Polygon----*/
		}
	},

	/**
	 *	Applies the style changes to the selected layer
	 * @method getStyleChanges
	 */
	getStyleChanges: function(){
		if (finishApplicationLoad){
			var rowIndex = $('#layersList').jqxGrid('getselectedrowindex');
			var layername = layerSource.records[rowIndex].layerTABLE;
			var geomType = layerSource.records[rowIndex].layerGeomType;
			var styleToApply = mygis.Drawing.Styling.createSLD(layername,geomType);
			var pointRule,lineRule,polygonRule;
			//styleToApply.namedLayers[layername].userStyles[0].isDefault=1;

			switch(geomType){
				case 'Point':
					pointRule = styleToApply.namedLayers[layername].userStyles[0].rules[0].symbolizer;
					break;
				case 'Line':
					lineRule = styleToApply.namedLayers[layername].userStyles[0].rules[0].symbolizer;
					break;
				case 'Polygon':
					polygonRule = styleToApply.namedLayers[layername].userStyles[0].rules[0].symbolizer;
					break;
				case 'Mixed':
					pointRule = styleToApply.namedLayers[layername].userStyles[0].rules[0].symbolizer;
					lineRule = styleToApply.namedLayers[layername].userStyles[0].rules[1].symbolizer;
					polygonRule = styleToApply.namedLayers[layername].userStyles[0].rules[2].symbolizer;
					break;
			}
			if (pointRule){
			/*-----POINTS-----*/
				var selectedItem = document.getElementById("pointGraphicUrl").value; //markerStyleList.get_selectedItem();
				var newValue;
				var newSize;
				if (selectedItem){
					newValue = selectedItem;
					newSize = markerSizeText.get_value();
					if (newValue){
						switch(newValue.substring(0,4)){
							case "ttf:":
								//
								pointRule.Point.graphicName=newValue;
								pointRule.Point.externalGraphic = null;
								break;
							case "http":
								pointRule.Point.externalGraphic = newValue;
								break;
							default:
								pointRule.Point.externalGraphic = "http://"+window.location.host+newValue;
								break;
						}
						//pointRule.Point.externalGraphic = newValue.indexOf("http")==0?newValue:"http://"+window.location.host+newValue;
						pointRule.Point.graphicWidth = newSize;	//
						pointRule.Point.graphicHeight = newSize;	//
						pointRule.Point.pointRadius = newSize / 2;
						pointRule.Point.fillColor = document.getElementById("pointColor").value;
						pointRule.Point.strokeColor = document.getElementById("pointBorderColor").value;
						pointRule.Point.strokeWidth = pointBorderText.get_value();
					}
				}
				/*--END OF POINTS---*/
			}

			if (lineRule){
				/*----LINES-----*/
				var color=document.getElementById("polylineStrokeColor").value;
				var lineOpacity = lineOpacityText.get_value();
				var lineWeight = lineWeightText.get_value();

				lineRule.Line.strokeWidth = lineWeight;
				lineRule.Line.strokeOpacity = lineOpacity;
				lineRule.Line.strokeColor = color;
				/*---END OF LINES----*/
			}

			if (polygonRule){
				/*----POLYGONS----*/
				var strokeColor = document.getElementById("polygonStrokeColor").value;
				var fillColor = document.getElementById("polygonFillColor").value;
				var strokeOpacity = polygonStrokeOpacityText.get_value();
				var fillOpacity = polygonFillOpacityText.get_value();
				var strokeWidth = polygonStrokeWeightText.get_value();

				polygonRule.Polygon.fillColor = fillColor;
				polygonRule.Polygon.fillOpacity= fillOpacity;
				polygonRule.Polygon.strokeColor = strokeColor;
				polygonRule.Polygon.strokeOpacity = strokeOpacity;
				polygonRule.Polygon.strokeWidth = strokeWidth;
				/*----END OF POLYGONS----*/
			}
			//var xxx = styleToApply.namedLayers[layername].userStyles[0];
			//styleToApply.namedLayers[layername].userStyles[layername]=xxx;
			return [styleToApply,layername];
		}else{
			return null;
		}
	},

	/**

		@method saveLayerStyle
		@param {String} layername The layer's table name
	**/
	saveLayerStyle: function(layername){
		if (!layername){
			var rowIndex = $('#layersList').jqxGrid('getselectedrowindex');
            layername = layerSource.records[rowIndex].layerTABLE;
		}
		var xmlstyle = mygis.Map.getSingleAppliedStyle(layername);
		var postObject=new Object();
		var injectIndex = xmlstyle.indexOf("<sld:FeatureTypeStyle");
		xmlstyle = xmlstyle.substring(0,injectIndex)+"<sld:Name>"+layername+"</sld:Name>"+xmlstyle.substring(injectIndex);
		postObject["layer"]=layername;
		postObject["sld"]=xmlstyle;
		postObject["layerID"]=mygis.Utilities.mggetLayerID(layername);
		mygis.Utilities.blockUI();
		$.ajax({
			type: 'POST',
			url: config.mgreq+"?qtype=updateStyle",
			data: postObject,
			success: function(data){
				mygis.Utilities.unblockUI();
				try{
					var realResults = eval(data);
					if (realResults.iotype=="success"){
						displaySuccess("Style updated");
					}else{
						displayError(realResults.iomsg);
					}
				}catch(err){
					displayError(err.message);
				}
			}
		});
	},

	/**
		Applies the style change to the map
		@method previewLayerStyle
	**/
	previewLayerStyle: function(){
		if (finishApplicationLoad){
			var changeTo = mygis.UI.getStyleChanges();
			var styleToApply=changeTo[0];
			var layername=changeTo[1];
			layerStyles[layername]=styleToApply;
			var sldString = mygis.Map.getCustomAppliedStyle();

			//sldString = sldString.replace(/\%23/g,"#");
			//sldString = unescape( encodeURIComponent( sldString ));
			//sldString =escape(sldString);
			//mygis.Query.highlightSelection(null,sldString);


			digimap.layers[1].mergeNewParams({
				sld_body: sldString,
				layers: null
			});

			//digimap.layers[2].setVisibility(false);
		}
	},

	/**
		Cancels the style change from the map
		@method clearPreviewLayer
	**/
	clearPreviewLayer: function(){
		if (selectionWMSLayer){
			selectionWMSLayer.mergeNewParams({
					sld_body: null
				});

			digimap.layers[1].setVisibility(true);
		}
	},

	/**
		Applies the given scale constraint to a layer

		@method toggleLayerConstraint
		@param {String} mode Accepted values: From/To
	**/
	toggleLayerConstraint: function(mode){
		var row= $("#visible"+mode);
		var btn= row.find(".visible"+mode+"Btn")[0];
		var input = row.find(".layerVisibleInput")[0];
		var layer = layerSource.records[$('#layersList').jqxGrid('getselectedrowindex')];
		var actualValue = input.value.replace(/\./g,"");
		if (btn.ex_HasClassName("pressed")){
			btn.ex_RemoveClassName("pressed");
			layer.manualVisibility=true;
		}else{
			if (actualValue){
				btn.ex_AddClassName("pressed");
				layer.manualVisibility=false;
				if (mode=="From"){
					layer.layerMinScale=parseFloat(actualValue);
				}else{
					layer.layerMaxScale=parseFloat(actualValue);
				}
			}else{
				displayError(strings.LayerControl.visibleRangeNotFilled);
			}
		}
		mygis.Map.checkScaleConstraints();
		expandLayerDetails(null,true);
	},

	/**
		Creates the "editableInfo" window for new digitized objects
		@method createEditableInfo
	**/
	createEditableInfo: function(){
		//console.log('createEditableInfo');
		if ($("#editDigitize").children().length==0){
			loadFragment("editDigitize",function(){
				$("#editDigitize").dialog({
						autoOpen: false,
						modal: true,
						resizable: false,
						width: 900,
						height: 510,
						title: "New object",
						closeOnEscape: false
				});
				var titleBar = $("#ui-dialog-title-editDigitize").parent();
				titleBar.css({
					"background":"url('"+config.folderPath+"Images/Administration/header/icon-48-cpanel.png') #F6A828 no-repeat 14px 5px",
					"background-size":"auto 18px"
				});
			});
		}
	},

	/**
		Creates or hides the "editableInfo" window
		@method toggleEditableInfo
	**/
	toggleEditableInfo: function(){
		mygis.UI.createEditableInfo();
		var btn = $("#mapFinalToolbar").find('.showInfoOnEdit')[0];
		showInfoOnEdit=!showInfoOnEdit;
		if (!showInfoOnEdit){
			//$("#editableInfo").dialog('close');
			$("#editDigitize").dialog('close');

			btn.ex_RemoveClassName('btnTool_selected');
		}else{
			btn.ex_AddClassName('btnTool_selected');
		}
	},

	/**
		Shows the "editableInfo" window
		@method showEditableInfo
	**/
	showEditableInfo: function(){
		if (showInfoOnEdit) {
			//$("#editableInfo").dialog('open');
			console.log('showEditableInfo');
			mygis.Admin.UI.dialogConfig.checkfn=mygis.Drawing.Editing.checkValidInfo;
			mygis.Admin.UI.dialogConfig.callbackfn=mygis.Drawing.Editing.digiPopupResult;
			mygis.Admin.UI.dialogConfig.windowTitle="#editDigitize";
			mygis.Admin.UI.dialogConfig.objectCount=1;
			$("#editDigitize").dialog('open');
		}

	},

	/**
		Used to fix bugs in "editableInfo" window in the UI (namely tabs)
		@method fixEditableInfo
	**/
	fixEditableInfo: function(){
		var infoWin = $("#editableInfo");
		if (infoWin){
			var detachCont = infoWin.find(".infoDetachCont")[0];

			if ($(detachCont).is(":empty")){
				//console.log($(detachCont).is(":empty"));
				setTimeout(mygis.UI.fixEditableInfo,500);
			}else{
				$(detachCont).removeData();
				var titleBar = $("#ui-dialog-title-editableInfo").parent();
				titleBar.css({
					"background":"url('"+config.folderPath+"Images/file_edit.png') #F6A828 no-repeat 12px 2px",
					"background-size":"auto 25px"
				});
				titleBar.find(".ui-dialog-titlebar-close").css({"visibility":"hidden"});	//when ready from code
				var dialogWindow = titleBar.parent();
				var dialogContent=$(dialogWindow.find("#editableInfo")[0]);
				
				dialogContent.css({"padding":"0","margin-left":"-5px","overflow":"hidden"});
				
				var mapCont = $("#mapContainer");
				
				var dialogX = 935;
				var dialogY = 120;
				var dialogHeight =
				infoWin.dialog("option","position",[dialogX,dialogY]);

			}
		}else{
			setTimeout(mygis.UI.fixEditableInfo,500);
		}
	},

	/**
		Activates naviControls.navigation or naviControls.zoomBox

		@method activateControl
		@param {String} name Keyword for the control to activate.
	**/
	activateControl: function(name){
		var cname;
		mygis.UI.stopDigitize();
		$("#mapContainer").attr("class","olMap");	//reset
		//document.getElementById("mapContainer").("selectMode");
		switch(name)
		{
			case "drag":
				mygis.UI.activateOLControl(naviControls.navigation);

				$("#dragPanBtn")[0].ex_AddClassName("selected");
				break;
			case "zoomBox":
				//digimap.controls[6].activate();
				mygis.UI.activateOLControl(naviControls.zoomBox);
				document.getElementById("mapContainer").ex_AddClassName("zoomMode");
				$("#zoomBoxBtn")[0].ex_AddClassName("selected");
				break;
			case "zoomOut":
				document.getElementById("mapContainer").ex_AddClassName("zoomModeOff");
				break;
		}
		

		
	},

	/**
		Toggles the map overview visibility
		@method toggleOverview
	**/
	toggleOverview: function(){
		var overview = $("#customOverview");
		if (overview.is(":visible")){
			overview.hide();
			$("#toggleOverviewBtn")[0].ex_RemoveClassName("selected");
		}else{
			overview.show();
			$("#toggleOverviewBtn")[0].ex_AddClassName("selected");
		}
	},

	/**
		Toggles the WMSGetFeatureInfo tool.

		@method toggleInfoBtn
		@deprecated We now use toggleInfoBtn_V2 instead
	**/
	toggleInfoBtn: function(){

		var isInfoActive=false;
		if (infoControls){
			if (infoControls.click.active){
				isInfoActive=true;
			}
		}
		mygis.UI.clearInfoButtons();
		if (!isInfoActive){
			infoControls.click.events.unregister("getfeatureinfo",this, mygis.Map.showInfo2);
			digimap.removeControl(infoControls.click);
			infoControls.click=new OpenLayers.Control.WMSGetFeatureInfo({
				url: config.mapserver+'wms',
				title: 'Identify features by clicking',
				drillDown: true,
				infoFormat:"text/html",
				maxFeatures: 10,
				layers: [digimap.layers[1]],
				vendorParams: {
					EXCEPTIONS: 'XML'
				}
			});
			infoControls.click.events.register("getfeatureinfo", this, mygis.Map.showInfo2);
			digimap.addControl(infoControls.click);
			mygis.UI.activateOLControl(infoControls.click);
			document.getElementById("mapContainer").ex_AddClassName("selectMode");
			$("#toggleInfoBtn")[0].ex_AddClassName("selected");
			mygis.UI.stopDigitize();
		}else{
			infoControls.click.deactivate();
			mygis.Map.clearSelection();
			$("#toggleInfoBtn")[0].ex_RemoveClassName("selected");
		}
	},

	/**
		Toggles the "select feature" tool, according to some parameters.

		@method toggleInfoBtn_V2
		@param {Boolean} topLayer If true, switches the appropriate controls on/off to act as info tool
	**/
	toggleInfoBtn_V2: function(topLayer){
		mygis.UI.resetControls();
		infoControls.select.activate();	//just to prevent clearing
		if (topLayer){
			document.getElementById("mode_TopSelect").ex_AddClassName("drawer");
		}else{
			document.getElementById("mode_TopSelect").ex_RemoveClassName("drawer");
		}
		document.getElementById("mode_InfoSelect").ex_AddClassName("drawer");
		document.getElementById("mode_InfoStore").ex_AddClassName("drawer");

		document.getElementById("mode_AddSelect").ex_RemoveClassName("drawer");
		document.getElementById("mode_SubtractSelect").ex_RemoveClassName("drawer");
		if (topLayer){
			//document.getElementById("toggleDrillInfoBtn").ex_AddClassName("selected");
		}else{
			document.getElementById("toggleInfoBtn").ex_AddClassName("selected");
		}
		document.getElementById("mapContainer").ex_AddClassName("selectMode");
		mygis.UI.toggleSelectBtn('point');
	},
	
	/**
		Recreates the appropriates GetFeature control and reattaches it to the map.

		@method addSelectBtn
		@param {Boolean} boxmode
	**/
	addSelectBtn: function(boxmode,singleMode){
		var layerToSelect = [];
		var namespaces = [];
		var previouslyActive;
		var previouslyBox;
		for (var i=0;i<layerSource.records.length;i++){
			var checkname = layerSource.records[i].layerTABLE;
			if (mygis.Map.layerHasProperty(checkname,'selectable')&&!(Boolean(layerSource.records[i].hidden)===true)){
				layerToSelect.push(checkname);
				namespaces.push(config.namespace+checkname.split("_")[0]);
			}
		}
		previouslyActive = infoControls.select.active;
		previouslyBox = infoControls.select.box;
		digimap.removeControl(infoControls.select);
		infoControls.select.destroy();
		infoControls.select = new OpenLayers.Control.GetFeature({
			protocol: new OpenLayers.Protocol.WFS({
				version: "1.0.0",
				url:  config.mapserver+"wms",
				featureType: layerToSelect,
				featureNS: config.namespace+"MyGIS",
				geometryName: "Geometry",
				srsName: digimap.projection.getCode()
			}),
			box: boxmode,
			hover: false,
			click: !boxmode,
			single: singleMode,
			multipleKey: "ctrlKey",
			toggleKey: "ctrlKey",
			clickTolerance: digimap.getZoom()<=10? 55: 15
		});
		infoControls.select.request = mygis.OLOverrides.mygis_Control.mygis_GetFeature.mygis_request;
		infoControls.select.selectBestFeature = mygis.OLOverrides.mygis_Control.mygis_GetFeature.mygis_selectBestFeature_v2;
		digimap.addControl(infoControls.select);
		infoControls.select.events.register("featuresselected",this,mygis.UI.selectionMultipleFeaturesSelected);
		infoControls.select.events.register("featureselected", this, mygis.UI.selectionFeatureSelected);
		infoControls.select.events.register("featureunselected", this, mygis.UI.selectionFeatureUnselected);
		if (previouslyActive){
			if (boxmode){
				document.getElementById("selectRect").ex_AddClassName("selected");
			}else if (!singleMode){
				document.getElementById("selectObject").ex_AddClassName("selected");
			}
			infoControls.select.activate();
		}else{
			mygis.UI.activateOLControl(infoControls.select);
		}
		//mygis.Map.setSelectableLayers(layerSource.records,$("#layerSelectionList"));	//shouldn't be needed: somewhere after map load it resets.
		$("#layerSelectionListCont").show();
	},
	
	//JK CHANGE - ADD CIRCLE tool
	/**
		Recreates the appropriates GetFeature control and reattaches it to the map.

		@method addSelectCircleBtn
		@param {Boolean} circlemode
	**/
	addSelectCircleBtn: function(circlemode){
		var layerToSelect = [];
		var namespaces = [];
		var previouslyActive;
		var previouslyCircle;
		for (var i=0;i<layerSource.records.length;i++){
			var checkname = layerSource.records[i].layerTABLE;
			if (mygis.Map.layerHasProperty(checkname,'selectable')){
				layerToSelect.push(checkname);
				namespaces.push(config.namespace+checkname.split("_")[0]);
			}
		}
		previouslyActive = infoControls.select.active;
		previouslyBox = infoControls.select.circle;
		digimap.removeControl(infoControls.select);
		infoControls.select.destroy();
		infoControls.select = new OpenLayers.Control.GetFeature({
			protocol: new OpenLayers.Protocol.WFS({
				version: "1.1.0",
				url:  config.mapserver+"wms",
				featureType: layerToSelect,
				featureNS: config.namespace+"MyGIS",
				geometryName: "Geometry",
				srsName: digimap.projection.getCode()
			}),
			circle: circlemode,
			hover: false,
			click: true,
			single: false,
			multipleKey: "ctrlKey",
			toggleKey: "ctrlKey",
			clickTolerance: digimap.getZoom()<=10? 55: 15
		});
		infoControls.select.request = mygis.OLOverrides.mygis_Control.mygis_GetFeature.mygis_request;
		infoControls.select.selectBestFeature = mygis.OLOverrides.mygis_Control.mygis_GetFeature.mygis_selectBestFeature_v2;
		digimap.addControl(infoControls.select);
		infoControls.select.events.register("featuresselected",this,mygis.UI.selectionMultipleFeaturesSelected);
		infoControls.select.events.register("featureselected", this, mygis.UI.selectionFeatureSelected);
		infoControls.select.events.register("featureunselected", this, mygis.UI.selectionFeatureUnselected);
		if (previouslyActive){
			if (circlemode){
				document.getElementById("selectCircle").ex_AddClassName("selected");
			}else{
				document.getElementById("selectObject").ex_AddClassName("selected");
			}
			infoControls.select.activate();
		}else{
			mygis.UI.activateOLControl(infoControls.select);
		}
	},
	//JK CHANGES END
	
	/**
		Should be called when multiple features are selected (server-side).
		Shows the appropriate info results and toggles some UI elements.

		@method selectionMultipleFeaturesSelected
		@param (Object} e An object containing the selected features.
	**/
	selectionMultipleFeaturesSelected: function(e){
		//console.log("Multiple: "+e.object.modifiers.multiple);
		var multiple = e.object.modifiers.multiple;
		var toggle = e.object.modifiers.toggle;
		document.getElementById("selectClear").ex_RemoveClassName("disabled");
		$("#layerSelectionListCont").hide();
		//if (!mygis.UI.isActiveSelectMode("mode_AddSelect")&& !mygis.UI.isActiveSelectMode("mode_SubtractSelect")){
		if (!multiple && !toggle){
			selectionLayer.removeAllFeatures();
			selectionLayer.addFeatures(e.features);
		}
		var layersTotal = [];
		for (var i=0;i<selectionLayer.features.length;i++){
			layersTotal.push(selectionLayer.features[i].type);
		}
		var layerUnique = mygis.Utilities.arrayUnique(layersTotal);
		if (mygis.UI.isActiveSelectMode("mode_TopSelect")){
			//router('expandSelect',{layername: layerUnique[0],results: selectionLayer.features, isMapSelect: true,fid: selectionLayer.features[0].fid});
			var featData = selectionLayer.features[0].data;
			mygis.Query.popupInfo(featData,layerUnique[0]);
		}else{
			mygis.UI.setupSelectResults(layerUnique,selectionLayer.features);
		}
	},

	/**
		Should be called when a single feature is selected (server-side).


		@method selectionFeatureSelected
		@param (Object} e An object containing the selected features.
	**/
	selectionFeatureSelected: function(e){
		$("#layerSelectionListCont").hide();
		if (mygis.UI.isActiveSelectMode("mode_SubtractSelect")){
			selectionLayer.removeFeatures([selectionLayer.getFeatureByFid(e.feature.fid)]);
		}else{
			if(e.object.modifiers.multiple){
				selectionLayer.addFeatures([e.feature]);
			}
		}
	},

	/**
		Should be called when a single feature is unselected (server-side)

		@method selectionFeatureUnselected
	**/
	selectionFeatureUnselected: function(e){
		try{
		mygis.UI.queryResultsReset();
		var multiple = e.object.modifiers.multiple;
		if (!mygis.UI.isActiveSelectMode("mode_AddSelect") && !mygis.UI.isActiveSelectMode("mode_SubtractSelect")){
			selectionLayer.removeFeatures([selectionLayer.getFeatureByFid(e.feature.fid)]);
			var containerDiv = $("#infoAnalysisContents");
			containerDiv.empty();
			$("#queryExpanders").die().empty();
		}
		}catch(err){
			//console.log(err)
		}
	},

	/**
		Should be called when a single feature is edited.
		Updates the UI to reflect the new info.

		@method editFeatureSelected
	**/
	editFeatureSelected: function(e){
		var layerUnique = [layerSource.records[layerCurrentEditing].layerTABLE];
		e.feature.type = layerUnique;
		mygis.UI.setupSelectResults(layerUnique,[e.feature]);
	},

	/**
		Activates the proper "select" tool

		@method toggleSelectBtn
		@param {String} mode Accepted values: point,rectangle
	**/
	toggleSelectBtn: function(mode){
		var boxmode;
		var singleMode=false;
		switch (mode){
			// JK CHANGES - support circle button
			case "info":
				circlemode=false;
				boxmode=false;
				singleMode=true;
				break;
			case "point":
				circlemode=false
				boxmode=false;
				break;
			case "rectangle":
				circlemode=false
				boxmode=true;
				break;
			case "circle":
				circlemode=true;
				boxmode=false;
			break;
			
		}
		var alreadyActive = infoControls.select.active;
		if (!document.getElementById("mapContainer").ex_HasClassName("selectMode")){
			document.getElementById("mapContainer").ex_AddClassName("selectMode");
		}
		if (alreadyActive){
			document.getElementById("infoTool").ex_RemoveClassName("selected");

			document.getElementById("selectObject").ex_RemoveClassName("selected");
			document.getElementById("selectRect").ex_RemoveClassName("selected");
			document.getElementById("selectCircle").ex_RemoveClassName("selected");
		}
		if (circlemode==true){
			mygis.UI.addSelectCircleBtn(circlemode);
		}else{
			mygis.UI.addSelectBtn(boxmode,singleMode);
		}
		
		//JK CHANGES END
	},

	/**
		Pushes the select result into the "infoLeftList" list

		@method setupSelectResults
		@param {Object} layers The resulting layers
		@param {Object} features The uncategorized features
	**/
	setupSelectResults: function(layers,features){
		var qItem = new Object();
		qItem.text=strings.Info.mapSelectionDefaultQText;

		qItem.value=mygis.UI.isActiveSelectMode("mode_InfoStore")?-1:-999;	//defaultSelectMap
		qItem.isInitialized=true;
		qItem.linkedResults={"layers":layers,"features":features};
		qItem.isDBQuery=false;
		qItem.isMapSelect=true;

		mygis.UI.pushSelectInQueries(qItem,mygis.UI.isActiveSelectMode("mode_InfoStore"));

		var leftList = $("#infoLeftList");
		var itemCount = leftList.jqxListBox('getItems').length;
		var lastSelection = leftList.jqxListBox('getItemByValue',-999);
		leftList.jqxListBox('selectIndex',lastSelection.index);
		//var defaultIndex = mygis.Utilities.getQueryByValue(999,true);

		//leftList.jqxListBox('selectIndex',mygis.UI.isActiveSelectMode("mode_InfoSelect")?itemCount-1:defaultIndex);
		mygis.UI.queryResultsRun();
	},

	/**
		Updates the "last searched" item in the "infoLeftList" list

		@method pushSelectInQueries
		@param {Object} qItem The item to insert
		@param {Boolean} If true, creates a new item in the list instead
	**/
	pushSelectInQueries: function(qItem,createNew){
		var index = mygis.Utilities.getQueryByValue(qItem.value,true);
		if (createNew || index==-1){
			if (createNew){
				//qItem.text = new Date().toString(Date.CultureInfo.formatPatterns.sortableDateTime) +": " + strings.Info.mapSelectionQText;
				qItem.text = strings.Info.mapSelectionQText+new Date().toString("hh:mm:ss");
			}
			querySource.push(qItem);
		}else{
			querySource[index].linkedResults=qItem.linkedResults;
		}
		mygis.UI.updateQueryList();
	},

	/**
	 *	Removes a query from the search list
	 *	@method removeSavedQuery
	 */
	removeSavedQuery: function(){
		var qIndex = $("#infoLeftList").jqxListBox('getSelectedIndex');
		if (qIndex>-1){
			querySource.splice(qIndex,1);
			mygis.UI.updateQueryList();

		}
	},
	
	/**
		* Resets the results pane
		* @method queryResultsReset
	*/
	queryResultsReset: function(){
		$("#totalResultsCount").html("("+0+")");
		$("#queryExpanders").die().empty();
		$("#showWithinBtn").hide();
		$("#showQueryStatsBtn").hide();
		if (!document.getElementById("panel3Out").ex_HasClassName("collapsed")){
			document.getElementById("panel3Out").ex_AddClassName("collapsed");
			document.getElementById("rpanelCollapseBtn").ex_RemoveClassName("active");
			document.getElementById("panel2").ex_RemoveClassName("rightExpanded");
		}
	},

	/**
	 * Draws the selected query's results
	 * @method queryResultsRun
	 */
	queryResultsRun: function(){
		mygis.UI.queryResultsReset();
		var originalSource = $("#infoLeftList").jqxListBox('source');	//$("#infoLeftList").jqxListBox('source')._source.localdata;
		var item = $("#infoLeftList").jqxListBox('getSelectedItem');
		if(!item){
			item=$("#infoLeftList").jqxListBox('getItem',0);
		}
		var mode= 0; //mygis.UI.isActiveSelectMode("mode_ResultsList")?0:1;		//0: jqxNavigation, 1: jqxTabs 
		if (resultGridButtons.is(":empty")){
			loadFragment("resultGridButtons",null,resultGridButtons);
		}
		expandResultDetails();
		if (originalSource[item.index].isDBQuery){
			var containerDiv = $("#infoAnalysisContents");
			var results = originalSource[item.index].linkedResults;
			containerDiv.empty();
			$("#queryExpanders").die().empty();
			var struct = mygis.UI.buildQueryExpanders(originalSource[item.index].linkedResults);
			struct.appendTo(containerDiv);
			var numOfItems = struct.find(">div").length/2;
			var calcHeight = $("#layerPropertiesWrapper").height()-30;
			$("#queryExpanders").accordion({ fillSpace:true,  heightStyle: 'auto', active: false, collapsible: true });		
			$("#queryExpanders").data("querySource",item);
			document.getElementById("selectClear").ex_RemoveClassName("disabled");
		}else if(originalSource[item.index].isMapSelect){
			var containerDiv = $("#infoAnalysisContents");
			var results = originalSource[item.index].linkedResults;
			containerDiv.empty();
			$("#queryExpanders").die().empty();
			var struct = mygis.UI.buildSelectExpanders(results.layers,results.features,results);
			struct.appendTo(containerDiv);
			var numOfItems = struct.find(">div").length/2;
			var calcHeight = $("#layerPropertiesWrapper").height()-30;
			$("#queryExpanders").accordion({ fillSpace:true, heightStyle: 'auto', active: false, collapsible: true });
			$("#queryExpanders").data("querySource",item);
		}else{
			alert("Error!");
			console.log("Not mapselect, not db query. wtf is it?");
		}
		$("#totalResultsCount").html("("+$("#queryExpanders .featureTab").length+")");
		if($("#queryExpanders .featureTab").length>0){
			$("#showWithinBtn").show();
			$("#showQueryStatsBtn").show();
		}
	},
	
	
	/**
	 *	Filters search results
	 *	@method filterSearchResults
	 */
	filterSearchResults: function(){
		var inputElem = $("#infoAnalysis_SearchInput");
		var mode=mygis.UI.isActiveSelectMode("mode_ResultsList")?0:1;		//0: jqxNavigation, 1: jqxTabs
		if (inputElem.data("oldVal") != inputElem.val()){
			inputElem.data("oldVal",inputElem.val());
			var filtervalue = inputElem.val();
			var parentElem = document.getElementById("infoAnalysisHeader");
			if (filtervalue){
				parentElem.ex_AddClassName("populated");
				if (mode==0){
					mygis.UI.filterListResults(filtervalue);
				}
			}else{
				parentElem.ex_RemoveClassName("populated");
				if (mode==0){
					mygis.UI.clearFilterListResults();
				}
			}
		}
	},

	/**
	 *	Makes input element for search results focused
	 *	@method toggleSearchFilterFocus
	 */
	toggleSearchFilterFocus: function(on){
		var parentElem = document.getElementById("infoAnalysisHeader");
		if (on){
			if (!parentElem.ex_HasClassName("focused")){
				parentElem.ex_AddClassName("focused");
			}
		}else{
			if (parentElem.ex_HasClassName("focused")){
				parentElem.ex_RemoveClassName("focused");
			}
		}
	},

	/**
	 *	Filter search results when display mode = list
	 *	@method filterListResults
	 *	@param {String} filter The filter to apply
	 */
	filterListResults: function(filter){
		//var filter = "";	//todo
		filter = filter.toUpperCase();
		var tabs = $("#infoAnalysisContents .featureTabCont");
		$.each(tabs,function(ind,elem){
			var headerElem = $(elem).parent().parent().parent().find(".jqx-widget-header .jqx-expander-header-content");
			var headerText = headerElem.html();
			headerText = headerText.substring(0,headerText.indexOf("("));
			var results = $(elem).find(".featureTab");
			var counter = 0;
			$.each(results,function(resIndex,result){
				var compare = $(result).find(".featureTabTitle").html().toUpperCase();
				if (compare.indexOf(filter)!=-1){
					counter++;

					result.ex_RemoveClassName("collapsed");	//if previously collapsed
				}else{
					result.ex_AddClassName("collapsed");
				}
			});
			headerElem.html(mygis.Utilities.format("{0} ({1})",headerText,counter));
		});
	},

	/**
	 * Clears search results when display mode = list
	 * @method clearFilterListResults
	 */
	clearFilterListResults: function(){
		var tabs = $("#infoAnalysisContents .featureTabCont");
		$.each(tabs,function(ind,elem){
			var headerElem = $(elem).parent().parent().parent().find(".jqx-widget-header .jqx-expander-header-content");
			var headerText = headerElem.html();
			headerText = headerText.substring(0,headerText.indexOf("("));
			var results = $(elem).find(".featureTab");
			var filtered = $(elem).find(".featureTab.collapsed");
			$.each(filtered,function(resIndex,result){
				result.ex_RemoveClassName("collapsed");
			});
			headerElem.html(mygis.Utilities.format("{0} ({1})",headerText,results.length));
		});
	},

	/**
		Creates a tabbed (jqxTabs) array of grids (jqxGrids) to display the selected info.
		The info was gathered by a map tool.

		@method buildSelectTabs
		@param {Object} resultItem The object containing the specific results.
	**/
	buildSelectTabs: function(resultItem){
		expandResultDetails();
		var qText = resultItem.text;
		var layers=resultItem.linkedResults.layers;
		var features=resultItem.linkedResults.features;
		var newdata = {};
		var rightList = $("#infoRightCol");
		var rightTabs = $("<ul />");
		rightTabs.attr("id","infoRightTabsQ");
		rightList.removeData().empty();
		rightList.die();
		rightList.append(rightTabs);

		if (rightList.children().length>1){
			rightList.children().slice(1).remove();
		}

		for (var i =0;i<layers.length;i++){
			var gSource = [];
			var lname = layers[i];
			for (var j=0;j<features.length;j++){
				var f=features[j];
				if (f.type==lname){
					gSource.push(f);
				}
			}

			var newdiv = $("<div />");
			var newdivHeader = $("<li />");
			var newdivContent = $("<div />");
			var windowTitle;
			newdivContent.attr("class","resultGridButtons");
			newdivContent.html(resultGridButtons.html());
			rightTabs.append(newdivHeader);
			newdiv.attr("id","queryTab_"+i);
			newdiv.append(newdivContent);
			windowTitle = lname;
			newdivHeader.html(windowTitle);
			newdiv.data('result',gSource);

			newdiv.data('windowTitle',windowTitle);

			rightList.append(newdiv);
		}

		rightList.jqxTabs({
			width: '100%',
			height: '100%',
			theme: 'pk_mg_white',
			scrollable: true,
			scrollPosition:'right',
			selectionTracker: true
		});
		rightList.live('selected', infoTabClickedM);
		//console.log("binding infoTabClicked");
		infoTabClickedM(null,0,false,true);
	},

	/**
		Creates a jqxNavigation menu of expanders (jqxExpander) to display the selected info.
		The info was gathered by a map tool.

		@method buildSelectExpanders
		@param {Array} layers Array of strings containing the layer names
		@param {Array} features Array of feature objects
	**/
	buildSelectExpanders: function(layers,features,results){
		var struct = $("<div id='queryExpanders' />");

		for (var i =0;i<layers.length;i++){
			var layerTitle = $("<div />");
			var layerContents = $("<div />");
			var featureGrid = $("<div />");
			var lname = layers[i];
			featureGrid.attr("class","featureTabCont");
			layerTitle.html(mygis.Utilities.getFriendlyName(lname));
			var gSource = [];
			for (var j=0;j<features.length;j++){
				var f=features[j];

				if (f.type==lname){
					var classes="featureTab";
					if (layerCurrentEditing>-1){
						if (layerSource.records[layerCurrentEditing].layerTABLE==lname){
							classes += " editMode";
						}
					}
					var featureTab = $("<div />");
					featureTab.attr("class",classes);
					gSource.push(f.data);
					var counter = 0;
					var firstLine = $("<a class='firstLine featureTabExpand' />");
					var secondLine = $("<div class='secondLine' />");
					var restContent = $("<div class='restContent' />")
					$.each(f.data,function(prop,value){
						if (counter==0){

							var title = $("<span class='featureTabTitle' />");
							
							firstLine.click(
								function(layer,results,fid){
									return function(){
										
										router('expandSelect',{layername: layer,results: results, isMapSelect: true,fid: fid});
										return false;
									}
								}(lname,results,f.fid));
							firstLine.mouseover(
								function(feat){
									return function(){
										router('markHoverResult',{feature: feat});
									}
								}(f));
								/*
							firstLine.mouseleave(
								function(){
									return function(){
										mygis.Map.markFeatures();
										clearTimeout(internalConfig.zoomToFeat);
										internalConfig.zoomToFeat=setTimeout(function(){
											digimap.zoomToExtent(internalMemory.lastZoom);
										},1000);
									}
								}());
								*/
							title.append(value);
							firstLine.append(title);
						}
						counter+=1;
					});
					featureTab.append(firstLine);
					featureGrid.append(featureTab);
				}
			}
			featureGrid.data("gridSource",gSource);
			layerTitle.html(layerTitle.html()+"   ("+gSource.length+")");
			layerContents.append(featureGrid);
			struct.append(layerTitle);
			struct.append(layerContents);
			
			
		}
		return struct;
	},

	/**
		Creates a jqxNavigation menu of expanders (jqxExpander) to display the selected info.
		The info was gathered by a database search.
		@method buildQueryExpanders
		@param {Array} linkedResults
		* linkedResult[X].Fields: the field names
		* linkedResult[X].TableName: the layer name
		* linkedResult[X].Rows: the records
		* linkedResult[X].Rows[Y].Cells[Z]: cellobjects
	**/
	buildQueryExpanders: function(linkedResults){
		var struct = $("<div id='queryExpanders' />");
		$.each(linkedResults,function(i,result){
			var layerTitle = $("<h3 />");
			var layerContents = $("<div />");
			var featureGrid = $("<div />");
			var lname = result.TableName;
			featureGrid.attr("class","featureTabCont");
			layerTitle.html(mygis.Utilities.getFriendlyName(lname));
			var gSource = [];
			$.each(result.Rows,function(rowIndex,rowObject){
				var featureTab = $("<div class='featureTab' />");


				var firstLine = $("<a class='firstLine featureTabExpand' />");
				var secondLine = $("<div class='secondLine' />");
				var restContent = $("<div class='restContent' />")
				gSource.push(rowObject);
				var counter = 0;
				var feature = null;
				$.each(rowObject.Cells, function(cellIndex,cellObject){
					if (counter==0){
						var title = $("<span class='featureTabTitle' />");
						
						firstLine.click(
								function(layer,results,fid){
									return function(){
										router('expandSelect',{layername: layer,results: results, isMapSelect: false,fid: fid});
										return false;
									}
								}(lname,rowObject.Cells,rowObject.Cells[0].ColumnName=="OID"?rowObject.Cells[0].Value:rowObject.Cells[1].Value));	//look up in the first 2 fields for id field
						title.append(cellObject.Value);
						firstLine.append(title);
					}
					var currentCell=rowObject.Cells[counter];
					if (currentCell.ColumnName=="GeometryText"){
						var wkt= new OpenLayers.Format.WKT();
						feature = wkt.read(currentCell.Value);
						if (feature){
							feature.geometry = feature.geometry.transform(new OpenLayers.Projection("EPSG:4326"),selectionLayer.projection);
						}
					}
					counter+=1;
				});
				if (feature){
					firstLine.mouseover(
						function(feat){
							return function(){
								router('markHoverResult',{feature: feat});
							}
						}(feature));
					firstLine.mouseleave(
								function(){
									return function(){
										mygis.Map.markFeatures();
										clearTimeout(internalConfig.zoomToFeat);
										internalConfig.zoomToFeat=setTimeout(function(){
											digimap.zoomToExtent(internalMemory.lastZoom);
										},1000);
									}
								}());
				}
				featureTab.append(firstLine);
				featureGrid.append(featureTab);
			});

			featureGrid.data("gridSource",gSource);
			layerTitle.html(layerTitle.html()+"   ("+gSource.length+")");
			layerContents.append(featureGrid);
			struct.append(layerTitle);
			struct.append(layerContents);
		});
		return struct;
	},

	/**
		Router function used for the toggling of all "drawer" style buttons.
		@method toggleDrawerButton
		@param {Element} elem The toggling element
	**/
	toggleDrawerButton: function(elem){
		var btnCont = $(elem).parent();
		btnCont.toggleClass("drawer");
		switch (btnCont.attr("id"))
		{
			case "mode_TopSelect":
				mygis.UI.addSelectBtn(infoControls.select.box);
				break;

			case "mode_AddSelect":
				if (mygis.UI.isActiveSelectMode("mode_AddSelect")){
					document.getElementById("mode_SubtractSelect").ex_RemoveClassName("drawer");
				}
				break;
			case "mode_SubtractSelect":
				if (mygis.UI.isActiveSelectMode("mode_SubtractSelect")){
					document.getElementById("mode_AddSelect").ex_RemoveClassName("drawer");
				}
				break;
			case "mode_ResultsList":
				var resultList =$("#infoLeftList");
				var item = resultList.jqxListBox('getSelectedIndex');
				if (item>-1){
					resultList.jqxListBox('clearSelection');
					resultList.jqxListBox('selectIndex',item);
				}

				break;
			case "mode_NewLayerDB":
			case "mode_NewLayerStyle":
			case "mode_NewLayerAdvanced":
				var parent = btnCont.parent()[0];
				if (parent.ex_HasClassName("expanded")){
					parent.ex_RemoveClassName("expanded");
				}else{
					parent.ex_AddClassName("expanded");
				}
				break;

		}

	},

	/**
		Checks if an element with the given id has the class 'drawer'.
		If true, it's considered active.
		Used for the 'drawer' style buttons.
		@method isActiveSelectMode
		@param {String} name The id of the element to check.
		@return {Boolean} The active status for the selected control
	**/
	isActiveSelectMode: function(name){
		var retvalue=false;
		var elem = document.getElementById(name);
		if (elem){
			retvalue = elem.ex_HasClassName("drawer");
		}else{
			console.log(name);
		}
		return retvalue;
	},

	/**
		This is used to toggle expand status for the select result tabs.
		@method toggleSelectTab
		@param {Element} elem The toggling element.
	**/
	toggleSelectTab: function(elem){
		//var tab = $(elem).parent().parent();
		var tab = $(elem).parent();
		if (tab[0].ex_HasClassName("expanded")){
			tab[0].ex_RemoveClassName("expanded");
		}else{
			tab[0].ex_AddClassName("expanded");
		}
		/*
		var hiddenDiv = tab.find(".restContent");
		if (hiddenDiv.is(":visible")){
			hiddenDiv.hide(1000);
		}else{
			hiddenDiv.show(1000);
		}
		*/
	},
	//JK CHANGES - also reset circle btn
	/**
		Resets status for "select" buttons, namely:
		toggleInfoBtn
		selectObject
		selectRect
		selectCircle
		selectClear
		@method clearInfoButtons
	**/
	clearInfoButtons: function(){
		for (var i in infoControls){
			infoControls[i].deactivate();
		}
		//document.getElementById("infoPoint").ex_RemoveClassName("btnTool_selected");
		//document.getElementById("infoRect").ex_RemoveClassName("btnTool_selected");
		document.getElementById("infoTool").ex_RemoveClassName("selected");
		document.getElementById("toggleInfoBtn").ex_RemoveClassName("selected");
		document.getElementById("selectObject").ex_RemoveClassName("selected");
		document.getElementById("selectRect").ex_RemoveClassName("selected");
		document.getElementById("selectCircle").ex_RemoveClassName("selected");
		//JK CHANGES END
		document.getElementById("selectClear").ex_RemoveClassName("selected");
		mygis.Map.clearSelection();
	},

	/**
		This should return an image containing the legend for all visible elements.
		TODO.
		@method ToggleFullLegend
		@deprecated
	**/
	ToggleFullLegend: function(){
		var layers = mygis.Utilities.getVisibleLayerString(currentAppName,true);
		document.getElementById("testLegend").src=config.mapserver+"wms"+
		"?layer="+layers+
		"&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH="+internalConfig.legendWidth+"&HEIGHT="+internalConfig.legendWidth;
		$("#testLegend").dialog();

	},

	/**
		Creates an image element with the layer's style as the image source.
		The image created SHOULD be 20 x 20 pixels wide.
		@method getSingleLegend
		@param {String} layername The layer TABLE name.
		@return {Element} The image element.
	**/
	getSingleLegend: function(layername,geomType){
		var img = document.createElement("img");
		layername = mygis.Utilities.nameToUnderscore(layername);
		var specificRule;
		switch (geomType){
			case "Point":
				specificRule= mygis.Utilities.format("&RULE={0} - Points",layername);
				break;
			case "Line":
				specificRule= mygis.Utilities.format("&RULE={0} - Lines",layername);
				break;
			case "Polygon":
			case "Mixed":
				specificRule= mygis.Utilities.format("&RULE={0} - Polygons",layername);
				break;
			default:
				specificRule="";
				break;
		}



		img.src = config.mapserver+"wms"+
		"?layer="+layername+
		"&REQUEST=GetLegendGraphic&transparent=true&VERSION=1.0.0&FORMAT=image/png&WIDTH="+internalConfig.legendWidth+"&HEIGHT="+internalConfig.legendWidth;
		if (customStyleApplied){
			img.src+="&SLD_BODY="+escape(mygis.Map.getSingleAppliedStyle(layername));
		}
		var testSrc=mygis.Utilities.format("{0}wms?layer={1}{2}&REQUEST=GetLegendGraphic&transparent=true&VERSION=1.0.0&FORMAT=image/png&WIDTH="+internalConfig.legendWidth+"&HEIGHT="+internalConfig.legendWidth,
										   config.mapserver,layername,specificRule
										   );
		if (customStyleApplied){
			testSrc+="&SLD_BODY="+escape(mygis.Map.getSingleAppliedStyle(layername));
		}
		var xxx = function(layername){
			return function(newImg){
				mygis.Utilities.updateLayerSource("layerTABLE",layername,"mygisImageSrc",newImg.src);
			}
		};
		checkImage(testSrc,xxx(layername));

		return img;
	},

	/**
		Toggles the selected layer's "visible" property.
		@method toggleLayerVisibleProperty
		@param {Element} elem The activating element. Does not affect the layer grid's selected item.
	**/
	toggleLayerVisibleProperty: function(elem){
		var rowindex = $('#layersList').jqxGrid('getselectedrowindex');
		mygis.UI.toggleLayerVisible(null,rowindex);
		if (elem.ex_HasClassName('pressed')){
			elem.ex_RemoveClassName('pressed');
		}else{
			elem.ex_AddClassName('pressed');
		}
	},
	
	toggleInfoGroup: function(){
		var container=$("#dialog-extend-fixed-container");
		if (container.hasClass("collapsed")){
			container.removeClass("collapsed");
		}else{
			container.addClass("collapsed");
		}
	},
	
	toggleLayerGroup: function(groupName){
		var layerlist=$('#layersList');
		var groupCount=layerlist.jqxGrid('getrootgroupscount');
		var i=0;
		var found=false;
		while (!found && i<groupCount){
			var group = layerlist.jqxGrid('getgroup',i);
			if (group.group==groupName){
				found=true;
				var items = group.subrows;
				var countVisible=0;
				$.each(items,function(j,v){
					if (v.Visible){
						countVisible++;
					}
				});
				var visibility=true;
				if (countVisible==items.length){	//hide
					visibility=false;
				}
				$.each(items,function(j,v){
					var rowIndex = v["#"]-1;
					mygis.UI.preToggleLayerVisible(null,rowIndex,visibility,true);
				});
			}
			i++;
		}
		mygis.UI.updateLayerGrid(true);
	},
	
	preToggleLayerVisible: function(layername,rowIndex,visible,pauseUpdate){
		var layerlist = $('#layersList');
		if (layername){
			var layerID;
			layerSource.records.forEach(function(element,index,array){
				if (array[index].layerNAME==layername){
					if (index){
						layerID=index;
					}
				}
			});

		}else{
			var layerID =rowIndex;
		}
		var found=false;
		var item = $.extend({},layerSource.records[layerID]);
		if (layerID>layerSource.records.length-1){	//it's a bg layer. toggle it instantly, too much hassle to do otherwise.
			mygis.UI.toggleLayerVisible(layername,rowIndex,visible);
			found=true;
		}else if (internalMemory.unsavedLayerChanges.length>0){	//if we have unsaved changes, check if it's there...
			var i=0;
			var items=internalMemory.unsavedLayerChanges;
			while (!found && i < items.length){
				var check = items[i];
				if (item.layerID==check.layerID){
					found=true;
					if (undefined != visible){
						check.hidden = !visible;
					}else{
						check.hidden=!Boolean(check.hidden);
					}
					if(!pauseUpdate){
						mygis.UI.updateLayerGrid(true);
					}
					$("#applyLayersCont").show('slide',{direction: 'down'},300);
				}
				i++;
			}
		}
		if (!found){
			item.manualVisibility=true;
			if (undefined != visible){
				item.hidden=!visible;
			}else{
				item.hidden=!Boolean(item.hidden);
			}
			internalMemory.unsavedLayerChanges.push(item);
			if (!pauseUpdate){
				mygis.UI.updateLayerGrid(true);
			}
			$("#applyLayersCont").show('slide',{direction: 'down'},300);
		}
	},

	/**
		Toggles a given layer's visibility
		@method toggleLayerVisible
		@param {String} [layername] If defined, takes precedence over rowIndex
		@param {Integer} rowIndex The layer's index
		@param {Boolean} visible The visible status to set.
	**/
	toggleLayerVisible: function(layername,rowIndex, visible){
		$('#initialLoad').find(".mygis_logo").hide();
		$('#initialLoad').find(".mygis_loader").attr({"style":"margin-top:140px;"});
		//mygis.Utilities.blockUI();
		//$('#initialLoad').find(".mygis_loader").attr({"style":"display: block;margin-top:140px;"});
		//$("#initialLoad").show();
		var mapItem = $("#mapsList").jqxListBox('getSelectedItem').originalItem;
		var layerlist = $('#layersList');
		if (layername){
			var layerID;
			layerSource.records.forEach(function(element,index,array){
				if (array[index].layerNAME==layername){
					if (index){
						layerID=index;
					}
				}
			});
		}else{
			var layerID =rowIndex;
		}
		if (layerID>layerSource.records.length-1){
			var name = layergridSource.localdata[layerID].Name;
			if (name==digimap.layers[0].name){
				var layerToChange = digimap.getLayersByName(name)[0];
				layerToChange.manualVisibility= true;
				if (digimap.baseLayer==layerToChange){
					layerToChange.setVisibility(!layerToChange.visibility);

				}else{
					digimap.baseLayer.setVisibility(false);
					digimap.setBaseLayer(layerToChange);

				}
			}else{
				mygis.Map.switchBackground(mygis.Utilities.getBGIdentifier(name),0);
			}
			
			//mygis.Utilities.unblockUI();
		}else{
			if (undefined != visible){
				layerSource.records[layerID].hidden=!visible;
			}else{
				layerSource.records[layerID].hidden=!Boolean(layerSource.records[layerID].hidden);
			}
			layerSource.records[layerID].manualVisibility=true;
			loadMapSequence(mapItem);

		}

		mygis.UI.updateLayerGrid();



		//layerlist.jqxGrid('showrowdetails',layerID);

	},

	/**
		Toggles a layer "selectable" property.

		@method toggleLayerSelectable
		@param {Integer} index The layer index to toggle
	**/
	toggleLayerSelectable: function(index,preventUpdate){
		var rowIndex = index!=null?index:$('#layersList').jqxGrid('getselectedrowindex');
		if (rowIndex<layerSource.records.length){
			layerSource.records[rowIndex].Selectable = !layerSource.records[rowIndex].Selectable;
			var previouslyActive = infoControls.select.active;
			var previouslyBox = infoControls.select.box;
			if (previouslyActive && !preventUpdate){
				mygis.UI.addSelectBtn(previouslyBox);
				/*
				if (boxmode){
					document.getElementById("selectRect").ex_AddClassName("selected");
				}else{
					document.getElementById("selectObject").ex_AddClassName("selected");
				}
				infoControls.select.activate();
				*/
			}
			mygis.UI.updateLayerGrid(preventUpdate);
			/*
			if (!preventUpdate){
				mygis.UI.updateLayerGrid();
			}
			*/

		}
	},

	/**
		Toggles a layer as editable.
		@method toggleLayerEditable
		@param {Integer} index The layer index to toggle
	**/
	toggleLayerEditable: function(index){
		var rowIndex = index!=null?index:$('#layersList').jqxGrid('getselectedrowindex');
		if (rowIndex<layerSource.records.length){
			var item = layerSource.records[rowIndex];
			var isEditable = item.Editable;
			if (unsavedChanges){
				showConfirmationDialog(strings.Editing.loseChanges,function(){
					mygis.UI.clearUnsavedLayer(layerCurrentEditing);
					mygis.UI.toggleLayerEditable(index);
				});
				return false;
			}else{

				mygis.UI.clearEditable();	//this is to have only one editable at a time
				if (!isEditable){

					item.Editable = true;
					layerCurrentEditing=rowIndex;
					for (var i=0;i<layerSource.records.length;i++){

						if (layerSource.records[i].Selectable && i!=rowIndex){
							memory.LayerControl.selectableBeforeEdit.push(i);
							layerSource.records[i].Selectable=false;
						}
					}
					mygis.Drawing.Editing.editLayer(item.layerTABLE);
					if (!layerSource.records[index].hidden){
						mygis.UI.toggleLayerVisible(null,index,false);
						layerToReset=index;
					}
					mygis.UI.switchEditMode(document.getElementById("editModeDrag"));	//reset it
					//$("#fDock1").jqxNavigationBar('expandAt',internalConfig.selectionToolbarIndex);
					//$("#fDock1").jqxNavigationBar('expandAt',internalConfig.digitizingToolbarIndex);
					mygis.UI.activateSelectCtrl(document.getElementById("selectObject"));
					$("#bottomTabContainer").jqxTabs('enableAt',internalConfig.editTabIndex);
					//$("#bottomTabContainer").jqxTabs('select',internalConfig.editTabIndex);
				}else{
					item.Editable = false;
					//layerCurrentEditing = -1;
					//$("#bottomTabContainer").jqxTabs('select',internalConfig.layerTabIndex);
					$("#bottomTabContainer").jqxTabs('disableAt',internalConfig.editTabIndex);
					mygis.UI.activateControl('drag');
					cosmeticLayer.destroyFeatures();
					window.location.reload();	//"fix"
					cosmeticLayer = new OpenLayers.Layer.Vector("Cosmetic Layer",{
						preFeatureInsert: function(feature) {
							var y=feature.geometry.getCentroid().y;
					   }
					});
					mygis.Utilities.nudgeMap();

				}


				mygis.UI.updateLayerGrid();
			}

		}
	},

	/**
		Activates the proper ModifyFeature control based on the selected edit mode,
		or deletes the feature if delete is active.
		@method switchEditMode
		@param {Element} elem The toggling element
	**/
	switchEditMode: function(elem){
		if (!elem.ex_HasClassName("disabled")){
			if (elem.id=="editModeDelete"){
				var positiveConfirm=function(){

					mygis.Drawing.Editing.mg_removeFeature();
				};
				showConfirmationDialog(strings.Editing.deleteObject,positiveConfirm);
			}else{


				var parent = $(elem).parent();
				var children = parent.find("a");
				for (var i=0;i<children.length;i++){
					children[i].ex_RemoveClassName("pressed");
				}
				switch (elem.id){
					case "editModeDrag":
						featureEditMode=0;
						drawControls.modify.mode = OpenLayers.Control.ModifyFeature.DRAG;
						break;
					case "editModeRotate":
						featureEditMode=1;
						drawControls.modify.mode = OpenLayers.Control.ModifyFeature.ROTATE;
						break;
					case "editModeResize":
						featureEditMode=2;
						drawControls.modify.mode = OpenLayers.Control.ModifyFeature.RESIZE;
						break;
					case "editModeReshape":
						featureEditMode=3;
						drawControls.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
						break;
				}

				elem.ex_AddClassName("pressed");
				if (cosmeticLayer.selectedFeatures.length>0){
					//var clone = mygis.Utilities.arrayUnique(cosmeticLayer.selectedFeatures);
					var clone = [];
					while(cosmeticLayer.selectedFeatures.length>0){
						clone.push(cosmeticLayer.selectedFeatures[0]);
						drawControls.modify.selectControl.unselect(cosmeticLayer.selectedFeatures[0]);
					}

					for (var k=0;k<clone.length;k++){
						drawControls.modify.selectControl.select(clone[k]);
					}

				}
			}
		}
	},

	/**
		Goes through the layer list and clears any previous "editable" status
		@method clearEditable
	**/
	clearEditable: function(){

		//mygis.UI.clearCosmetic();
		for (var i=0;i<layerSource.records.length;i++){
			layerSource.records[i].Editable = false;
		}
		if (layerToReset>-1){
			mygis.UI.toggleLayerVisible(null,layerToReset,true);
			layerToReset = -1;
		}
		var previouslySelected = memory.LayerControl.selectableBeforeEdit;
		for (var i=0;i<previouslySelected.length;i++){
			layerSource.records[previouslySelected[i]].Selectable=true;
		}
		memory.LayerControl.selectableBeforeEdit=[];
		//document.getElementById("selectObject").ex_AddClassName("disabled");
		document.getElementById("selectClear").ex_AddClassName("disabled");
	},

	/**
		Updates the layer list source
		@method updateLayerGrid
	**/
	updateLayerGrid: function(ignoreSecondLevel){
		var layerlist=$('#layersList');
		layergridSource = {
			localdata: mygis.UI.buildGridSource(layerSource,'layers'),
			datatype: 'array'
		};
		layerlist.jqxGrid({
				source: layergridSource
			});
		layerlist.jqxGrid('refreshdata');
		fixLayerList();
		
		if (!ignoreSecondLevel){
			mygis.UI.initLayerSelectionList(false);
			mygis.UI.initLayerWithinSelectionList(false);
			router('dragPanBtn');	//shortest way to reset.
			mygis.Map.moveEnd();
		}
		//console.log('updateLayerGrid fired');
	},

	
	initLayerSelectionList: function(initial){
		var layerSelectionList=$("#layerSelectionList");
		if (initial){
			layerSelectionList.jqxListBox({
				width: 239,
				source: mygis.UI.buildSelectionListSource(layerSource),
				checkboxes: true, 
				height: 128,
				theme: 'pk_mg',
				displayMember: 'layerNAME',
				valueMember: 'layerTABLE',
				autoItemsHeight: true,
				renderer: function(index,label,value){
					var data = $("#layerSelectionList").jqxListBox('source').records;
					var datarecord = data[index];
					if(datarecord){
						var tip;
						switch(datarecord.layerGeomType){
							case "Point":
								tip = strings.LayerControl.layergrid_colPoints;
								break;
							case "Line":
								tip = strings.LayerControl.layergrid_colLines;
								break;
							case "Polygon":
								tip = strings.LayerControl.layergrid_colPolygons;
								break;
						}
						return "<span class='"+datarecord.layerGeomType+"' title='"+tip+"'></span><span class='label' title='"+label+"'>"+label+"</span>";
					}
				}
			});
			layerSelectionList.bind("rendered",function(){
				var horizontalScrollBarId = '#horizontalScrollBar' + 'layerSelectionList';
				var horizontalScrollBar = $('#layerSelectionList').find(horizontalScrollBarId);
				var bottomRightId = '#bottomRight'+ 'layerSelectionList';
				var bottomRight = $('#layerSelectionList').find(bottomRightId);
				// Horizontal scrollbar is visible
				if (horizontalScrollBar.css('visibility') === 'visible') {
					horizontalScrollBar.css('visibility', 'hidden');
					bottomRight.css('visibility', 'hidden');
					$('#layerSelectionList').css('height', $('#layerSelectionList').height() - 17);
				}
			});
			try{selectionLayers.unbind('checkChange');}catch(err){}
			
		}else{
			layerSelectionList.unbind('checkChange');
			layerSelectionList.jqxListBox({
					source: mygis.UI.buildSelectionListSource(layerSource)
			});
		}
		layerSelectionList.unbind('checkChange');
		mygis.Map.setSelectableLayers(layerSource.records,layerSelectionList);
		mygis.Map.determineSelectionToggleStatus("#layerSelectionList");
		layerSelectionList.bind('checkChange',function(event){
			var args = event.args;
			var checked = args.checked;
			var item = args.item;
			var index = mygis.Utilities.mggetLayerIndex(item.originalItem.layerTABLE);
			mygis.UI.toggleLayerSelectable(index,true);
			var previouslyActive = infoControls.select.active;
			var previouslyBox = infoControls.select.box;
			if (previouslyActive){
				mygis.UI.addSelectBtn(previouslyBox);
			}
			if (internalConfig.updateLayerList){
				clearTimeout(internalConfig.updateLayerList);
			}
			internalConfig.updateLayerList=setTimeout(function(){
				mygis.UI.updateLayerGrid(true);
			},1000);
			
			mygis.Map.determineSelectionToggleStatus("#layerSelectionList");
			
		});
	},
	
	initLayerWithinSelectionList: function(initial){
		var selectionWithinLayers = $("#layerWithinSelectionList");
		if (initial){
			selectionWithinLayers.jqxListBox({
				width: 310,
				source: mygis.UI.buildSelectionListSource(layerSource),
				checkboxes: true, 
				height: 282,
				theme: 'pk_mg',
				displayMember: 'layerNAME',
				valueMember: 'layerTABLE',
				renderer: function(index,label,value){
					var data = $("#layerWithinSelectionList").jqxListBox('source').records;
					var datarecord = data[index];
					var tip;
					switch(datarecord.layerGeomType){
						case "Point":
							tip = strings.LayerControl.layergrid_colPoints;
							break;
						case "Line":
							tip = strings.LayerControl.layergrid_colLines;
							break;
						case "Polygon":
							tip = strings.LayerControl.layergrid_colPolygons;
							break;
					}
					return "<span class='"+datarecord.layerGeomType+"' title='"+tip+"'></span><span class='label' title='"+label+"'>"+label+"</span>";
				}
			});
			try{selectionWithinLayers.unbind('checkChange');}catch(err){}
		}else{
			selectionWithinLayers.unbind('checkChange');
			selectionWithinLayers.jqxListBox({
					source: mygis.UI.buildSelectionListSource(layerSource)
			});
		}
		mygis.Map.setSelectableLayers(layerSource.records,selectionWithinLayers);
		mygis.Map.determineSelectionToggleStatus("#layerWithinSelectionList");
		selectionWithinLayers.bind('checkChange',function(event){
			var args = event.args;
			var checked = args.checked;
			var item = args.item;
			mygis.Map.determineSelectionToggleStatus("#layerWithinSelectionList");
		});
		
		
	},
	/**
		Updates the query list source("#infoLeftList")
		@method updateQueryList
	**/
	updateQueryList: function(){
		var leftList = $("#infoLeftList");
		leftList.die();
		var itemRenderer = function(index, label, value){
			retobject = mygis.Utilities.format(
				"<div class='queryListItem'><a class='queryDeleteBtn' href='#' title='{1}'></a><a class='queryRunBtn' href='#' title='{2}'></a><span title='{0}'>{0}</span></div>",label,strings.QBuilder.deleteQuery,strings.QBuilder.runQuery);
			return retobject;
		};
		
		leftList.jqxListBox({
			width: 244,
			height: '100%',
			theme: 'pk_mg',
			source: jQuery.extend(true, {}, querySource),	//clone source
			displayMember: "text",
			renderer: itemRenderer,
			valueMember: "value"
		});

		leftList.live('select', queryResultsSelect);
		leftList.live('click',queryResultsClick);
		//leftList.bind('mouseover',queryResultsMouseOver);
		//leftList.bind('mouseout',queryResultsMouseOut);
		$(".queryRunBtn").live('click',function(){
			showConfirmationDialog(strings.QBuilder.runQueryConfirm ,function(){
				mygis.UI.queryResultsRun();
			});
			return false;
		});
		$(".queryDeleteBtn").live('click',function(){
			router('searchDelete');
			return false;
		});
	},

	/**
		Zooms to layer extents
		Layer extents is a database property that must be set for its layer record.
		@method zoomToLayer
		@param {Integer} index The layer index in the layerSource
	**/
	zoomToLayer: function(index){
		var index2 = $('#layersList').jqxGrid('getselectedrowindex');
		var lay= layerSource.records[index2].layerEXTENTS.split("$");
		var x,y,mx,my;

		x = parseFloat(lay[0].replace(",","."));
		y = parseFloat(lay[1].replace(",","."));
		mx = parseFloat(lay[2].replace(",","."));
		my = parseFloat(lay[3].replace(",","."));
		digimap.zoomToExtent([x,y,mx,my],false);
	},

	/**
		Moves a layer custom X places
		@method moveLayerCustom
		@param {Integer} oldindex The layer old position
		@param {Integer} newindex The layer new position
	*/
	moveLayerCustom: function(oldindex,newindex){
		if (newindex>=0 && newindex<=layerSource.records.length-1){
			var layerlist=$('#layersList');
			layerlist.jqxGrid('hiderowdetails',oldindex);
			var params=[];
			params.push(oldindex);
			params.push(newindex);
			MakeTimeout(function(cl_params){
				layerSource.records = mygis.Utilities.arrayMove(layerSource.records,cl_params[0],cl_params[1]);
				mygis.UI.updateLayerGrid();
				loadMapSequence();
				layerlist.jqxGrid('refreshdata');

			},params,0);
		}
	},

	/**
		Moves a layer up according to the value in #moveLayerStep
		@method moveLayerUp
		@param {Integer} index The layer index
	*/
	moveLayerUp: function(index){
		var layerlist=$('#layersList');
		//layerlist.jqxGrid('hiderowdetails',index);
		//var step_value=document.getElementById("moveLayerStep"+index).value;
		var index2 = layerlist.jqxGrid('getselectedrowindex');
		var step_value=document.getElementById("moveLayerStep").value;
		MakeTimeout(function(i){
			layerSource.records = mygis.Utilities.arrayMove(layerSource.records,i,i-step_value);
			mygis.UI.updateLayerGrid();
			loadMapSequence();

			//expandLayerDetails();
		},index2,0);

	},

	/**
		Moves a layer down according to the value in #moveLayerStep
		@method moveLayerDown
		@param {Integer} index The layer index
	*/
	moveLayerDown: function(index){
		var layerlist=$('#layersList');
		//layerlist.jqxGrid('hiderowdetails',index);
		//var step_value=document.getElementById("moveLayerStep"+index).value;
		var index2 = layerlist.jqxGrid('getselectedrowindex');
		var step_value=document.getElementById("moveLayerStep").value;
		MakeTimeout(function(i){
			layerSource.records = mygis.Utilities.arrayMove(layerSource.records,i,i+step_value);
			mygis.UI.updateLayerGrid();
			loadMapSequence();
			//expandLayerDetails();
		},index2,0);
	},

	/**
		Removes a layer from the map
		::TODO:: - display a save notification

		@method mg_removeLayer
		@param {Integer} index The layer index
	*/
	mg_removeLayer: function(index){
		var positiveConfirm=function(){
			var layerlist=$('#layersList');
			//layerlist.jqxGrid('hiderowdetails',index);
			var index2 = layerlist.jqxGrid('getselectedrowindex');
			layerlist.jqxGrid('clearSelection');

			MakeTimeout(function(i){
				layerRemovedSource.push(layerSource.records.splice(i,1));
				mygis.UI.resetLayerAvailableActions();
				mygis.UI.updateLayerGrid();
				loadMapSequence();
				//expandLayerDetails();
			},index2,0);
		};
		showConfirmationDialog(strings.ConfirmBox.msg_lc_removemap,positiveConfirm);
	},

	/**
		Handles the layer grid grouping. Still needs work ::TODO::
		@method layerGrouping
	*/
	layerGrouping: function(element){
		var value=element.value;
		if (value=="Name"){
			$('#layersList').jqxGrid('removegroup', 'Type');
		}else{
			$('#layersList').jqxGrid('addgroup', 'Type');
		}
	},

	/**
		Creates the projection tooltip

		@method setProjectionTip
	*/
	setProjectionTip: function(){
		var proj = digimap.getProjection()
		$("#map_projection_node").html(proj);
		params = [];
		var msg;
		switch (proj){
			case mygis.Utilities.projections.wgs84:
				msg = mygis.Utilities.format("Projection: {0}<br/>Ellipsoid: {1}<br/>Datum: {2}","longlat","WGS 1984","WGS 1984");

				break;
			case mygis.Utilities.projections.google:
				msg = mygis.Utilities.format("Projection: {0}<br/>Spheroid: {1}<br/>Datum: {2}","simple mercator","WGS 1984","WGS 1984");
				break;
		}
		params.push(msg);
		singleQTip('projection',params);
	},

	/**
	* Stops digitizing, unselecting the related tools and performing various clean-up code.
		@method stopDigitize
	 */
	stopDigitize: function(){

		mygis.UI.clearmygis();
        mygis.UI.clearDrawingMode();
		if (layerCurrentEditing>-1){
			mygis.UI.clearUnsavedLayer();
		}
	},

	/**
	* The handler for the right click of an object
	* @param event the right click event
	@method objRClickHandler
	 */
	objRClickHandler: function(event){
		cmenu.close();
		rightClickedObj=this;
		event.pixel=mygis.Utilities.latlngToPoint(digimap, event.latLng,digimap.getZoom());
		current=event;

		//inp.value = this.title;

		objcmenu.open(event,"hackMe");


	},

	/**
	* 	Creates a map context menu
	* 	@param caller The caller for the menu (map, map object, etc)
		@method createContextMenu
	 */
	 createContextMenu: function(caller){
		switch(caller){
			case "map":
				cmenu = new contextMenu($(digiContainer));
				cmenu.add(strings.MapRMenu.zoomin, 'zoomIn',
					function(){
						var center = digimap.getLonLatFromLayerPx(new OpenLayers.Pixel(current.layerX,current.layerY));
						digimap.setCenter(center,digimap.getZoom() + 1);
						internalMemory.lastZoom=digimap.getExtent();
						cmenu.close();
				});
				cmenu.add(strings.MapRMenu.zoomout, 'zoomOut',
					function(){
						var center = digimap.getLonLatFromLayerPx(new OpenLayers.Pixel(current.layerX,current.layerY));
						digimap.setCenter(center,digimap.getZoom() - 1);
						internalMemory.lastZoom=digimap.getExtent();
						cmenu.close();
				});
				cmenu.add(strings.MapRMenu.center, 'centerHere',
					function(){
						var center = digimap.getLonLatFromLayerPx(new OpenLayers.Pixel(current.layerX,current.layerY));
						digimap.setCenter(center);
						internalMemory.lastZoom=digimap.getExtent();
						cmenu.close();
				});
				digimap.div.oncontextmenu = function(event){
					current = event;
					cmenu.open(event);
					return false;
				}
				break;
			case "mapObject":
				objcmenu = new contextMenu($(digiContainer));

				objcmenu.add('','objectTitleRMenu',
					function(){
						if(rightClickedObj.overlaytype=="marker"){
							rightClickedObj.setDraggable(!rightClickedObj.getDraggable());
						}else{
							rightClickedObj.setOptions({editable: !rightClickedObj.getEditable()});
						}
				});

				objcmenu.add(strings.ObjRMenu.edit,'objR_edit',
					function(){
						if(rightClickedObj.overlaytype=="marker"){
							rightClickedObj.setDraggable(!rightClickedObj.getDraggable());
						}else{
							rightClickedObj.setOptions({editable: !rightClickedObj.getEditable()});
						}
				});
				objcmenu.add(strings.ObjRMenu.deleteMe,'objR_deleteMe',
					function(){
						mygis.UI.deleteObject(rightClickedObj);
				});
				objcmenu.add(strings.ObjRMenu.styleMe,'objR_styleMe',
					function(){
						mygis.UI.editObjectStyle(rightClickedObj.overlaytype);
				});
				objcmenu.add(strings.ObjRMenu.zoomin,'objR_zoomIn',
					function(){
						digimap.setCenter(current.latLng);
						digimap.setZoom(digimap.getZoom() + 1);
						objcmenu.close();
				});
				objcmenu.add(strings.ObjRMenu.zoomout,'objR_zoomOut',
					function(){
						digimap.setCenter(current.latLng);
						digimap.setZoom(digimap.getZoom() - 1);
						objcmenu.close();
				});
				objcmenu.add(strings.ObjRMenu.fitBounds,'objR_fitBounds',
					function(){
						digimap.fitBounds(rightClickedObj.bounds);
						objcmenu.close();
				});
				break;
		}
	 },

	/**
	@method editObjectStyle
	@deprecated
	*/
	editObjectStyle: function(type){
		switch (type){
			case "marker":
				$("#markerChooseStyle").dialog({ modal: true,resizable: false, title: strings.ObjRMenu.styleMe,width: 380}).show();
				break;
			case "polyline":
				$("#polylineChooseStyle").dialog({ modal: true,resizable: false, title: strings.ObjRMenu.styleMe }).show();
				break;
			case "rectangle":
			case "polygon":
				$("#polygonChooseStyle").dialog({ modal: true,resizable: false, title: strings.ObjRMenu.styleMe }).show();
				break;
		}
	},

	/**
		Updates a small preview box to show the new style
		@method selectMarkerStyle
		@param {Boolean} disablePreview If true, does not apply style to map
	*/
	selectMarkerStyle: function(disablePreview){
		var sItem = markerStyleList.get_selectedItem();
		var sItemUrl = sItem.get_value();
		if (sItemUrl){
			$("#markerPreview").html("<img style='width: 100%; height: 100%;' src='"+sItemUrl+"' />");
		}
		if (!disablePreview){
			mygis.UI.previewLayerStyle();
		}
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changeLayerOpacity
	*/
	changeLayerOpacity: function(event,ui){
		var curr=ui.value;
		curr = curr*100;
		layerOpacityText.set_value(curr+"%");
		mygis.UI.previewLayerStyle();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changePointBorder
	*/
	changePointBorder: function(event,ui){
		var curr=ui.value;
		pointBorderText.set_value(curr);
		mygis.UI.previewLayerStyle();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changePointOpacity
	*/
	changePointOpacity: function(event,ui){
		var curr=ui.value;
		curr = curr*100;
		pointOpacityText.set_value(curr+"%");
		mygis.UI.previewLayerStyle();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changeMarkerSize
	*/
	changeMarkerSize: function(event,ui){
		var curr=ui.value;
		markerSizeText.set_value(curr);
		mygis.UI.previewLayerStyle();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changeLineOpacity
	*/
	changeLineOpacity: function(event,ui){
		var curr=ui.value;
		lineOpacityText.set_value(curr);
		mygis.UI.updateLinePreview();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changeLineWeight
	*/
	changeLineWeight: function(event,ui){
		var curr=ui.value;
		lineWeightText.set_value(curr);
		mygis.UI.updateLinePreview();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changePolyStrokeOpacity
	*/
	changePolyStrokeOpacity: function(event,ui){
		var curr=ui.value;
		polygonStrokeOpacityText.set_value(curr);
		mygis.UI.updatePolyPreview();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changePolyFillOpacity
	*/
	changePolyFillOpacity: function(event,ui){
		var curr=ui.value;
		polygonFillOpacityText.set_value(curr);
		mygis.UI.updatePolyPreview();
	},

	/**
		Updates the corresponding input box based on the UI slider
		@method changePolyWeight
	*/
	changePolyWeight: function(event,ui){
		var curr=ui.value;
		polygonStrokeWeightText.set_value(curr);
		mygis.UI.updatePolyPreview();
	},

	/**
		Updates a small preview box to show the new style
		@method updateLinePreview
		@param {Boolean} disablePreview If true, does not apply style to map
	*/
	updateLinePreview: function(disablePreview){
		var color=document.getElementById("polylineStrokeColor").value;
		var lineOpacity = lineOpacityText.get_value();
		var lineWeight = lineWeightText.get_value();
		$("#polylinePreview").css({
			"background-color":color,
			"opacity":lineOpacity,
			//"height":lineWeight+"px",
			"height":2+"px",
			"margin-top":((38-2)/2)+"px",
			"margin-bottom":((38-2)/2)+"px"
		});
		if (!disablePreview){
			mygis.UI.previewLayerStyle();
		}
	},

	/**
		Updates a small preview box to show the new style
		@method updatePolyPreview
		@param {Boolean} disablePreview If true, does not apply style to map
	*/
	updatePolyPreview: function(disablePreview){
		var strokeColor = document.getElementById("polygonStrokeColor").value;
		var fillColor = document.getElementById("polygonFillColor").value;
		var strokeOpacity = polygonStrokeOpacityText.get_value();
		var fillOpacity = polygonFillOpacityText.get_value();
		var strokeWidth = polygonStrokeWeightText.get_value();
		var borderColor = mygis.Utilities.hexToRGB(strokeColor);
		fillColor = mygis.Utilities.hexToRGB(fillColor);
		var rgbaString = "rgba("
							+borderColor[0]+","
							+borderColor[1]+","
							+borderColor[2]+","
							+strokeOpacity+")";
		var rgbaString2 = "rgba("
							+fillColor[0]+","
							+fillColor[1]+","
							+fillColor[2]+","
							+fillOpacity+")";
		$("#polygonPreview").css({
			"background-color":rgbaString2,
			"border-color": rgbaString,
			//"border-width": strokeWidth+"px"
			"border-width": 5+"px"
		});
		if (!disablePreview){
			mygis.UI.previewLayerStyle();
		}
	},

	/**
	@method populateMarkerIcons
	@deprecated
	*/
	populateMarkerIcons: function(level,sublevel){
		var listItem;
		var items;
		var err=false;
		markerStyleList.trackChanges();
		$("#markerPreview").empty();
		items = markerStyleList.get_items();
		items.clear();
		switch (level)
		{
			case "Default":

				listItem= new Telerik.Web.UI.RadListBoxItem();
				listItem.set_text("Default");
				listItem.set_value(mygis.Drawing.Styling.pointStyle.defaultIcon);
				listItem.set_imageUrl(mygis.Drawing.Styling.pointStyle.defaultIcon);
				items.add(listItem);
				break;
			case "Google":
				var gurl = "http://maps.google.com/mapfiles/kml/";
				var folder, filename,finalurl;
				switch (sublevel)
				{
					case "Palette 2":
						folder = "pal2/";
						break;
					case "Palette 3":
						folder = "pal3/";
						break;
					case "Palette 4":
						folder = "pal4/";
						break;
					case "Palette 5":
						folder = "pal5/";
						break;
				}
				for (var i=0;i<64;i++){
					filename="icon"+i.toString();
					finalurl = gurl+folder+filename+".png";
					listItem= new Telerik.Web.UI.RadListBoxItem();
					listItem.set_text(filename);
					listItem.set_value(finalurl);
					listItem.set_imageUrl(finalurl);
					items.add(listItem);
				}
				break;
			case "My uploads":
			case "My maps":
				listItem= new Telerik.Web.UI.RadListBoxItem();
				listItem.set_text(strings.Login.notLoggedIn);
				items.add(listItem);
				err=true;
				break;

		}
		if (items.get_count()>=1 && !err){
			items.getItem(0).select();
			items.getItem(0).scrollIntoView();
		}
		markerStyleList.commitChanges();
	},

	/**
	Updates the UI to use the new point style.
	Called when the point style is based on a font.
	@method setPointFont
	@param {String} charcode A formatted string containing the image coordinates for the selected font.
	@param {Element} elem The element to modify
	*/
	setPointFont: function(charcode,elem){
		var coords = charcode.split("_");
		var cellvalue = $("#pointIcons").jqxGrid('getcellvalue',coords[0],"_"+coords[1]);
		var fontSelect = document.getElementById("pointFontFamily");
		var font = fontSelect.options[fontSelect.selectedIndex].value;
		var pointPreview = $("#markerPreview");
		var bgposition = $(elem).css('background-position');
		pointPreview.empty();
		pointPreview.attr("class",font);
		pointPreview.css("background-position",bgposition);
		//displaySuccess("code: "+cellvalue);
		document.getElementById("pointGraphicUrl").value = "ttf://"+font+"#"+cellvalue;
		mygis.UI.previewLayerStyle();
	},

	/**
	Updates the UI to use the new point style.
	Called when the point style is based on existing url.

	@method setPointImg
	@param {String} params A #-separated string containing the layername and the url
	@param {Element} elem
	*/
	setPointImg: function(params,elem){
		var parts = params.split("#");
		var layername = parts[0];
		var url = parts[1];
		var img = $("<img />");
		img.attr("src",url);
		img.attr("class","geolink");
		var pointPreview = $("#markerPreview");
		pointPreview.attr("class","");
		pointPreview.empty();
		pointPreview.append(img);
		document.getElementById("pointGraphicUrl").value = url;
		mygis.UI.previewLayerStyle();
	},

	/**
	Populates the "choose icon style" grid according to the callingMode
	@method populatePointIcons
	@param {String} callingMode one of 'primitive', 'font', 'library'
		-Primitive: Point icon is one of 'circle','square' etc
		-Library: Point icon is taken from the MyGIS library ::TODO::
		-Font: Point icon is taken from a system font. Currently only Wingdings supported
	@param {String} params Additional params for the callingMode
	*/
	populatePointIcons: function(callingMode,params){
		var mode;
		var colNumber = $('#pointColumns').jqxNumberInput('getDecimal');	//SET THIS TO SOMETHING ELSE FOR LARGER GRID
		var thegrid = $("#pointIcons");
		var pointSource=[];
		var fontSelect = document.getElementById("pointFontFamily");
		var font = fontSelect.options[fontSelect.selectedIndex].value;
		var librarySelect = document.getElementById("pointMyIconFolders");
		var library = librarySelect.options[librarySelect.selectedIndex].value;
		var renderer;
		switch (callingMode){
			case "primitive":
				mode='image';
				break;
			case "font":
				mode='image';
				pointSource = buildFontSource(font,colNumber);
				break;
			case "library":
				mode='image';
				pointSource = buildLibrarySource(library,colNumber);
				break;
		}
		var imagerenderer=function(row,datafield,value){
			var class1="";
			var class2="";
			var action="";
			var posX,posY;
			var extraStyle="";
			switch (callingMode){
				case "primitive":

					break;
				case "font":
					class1='fontlink';
					class2=params;
					action="mygis.UI.setPointFont('"+row.toString()+datafield+"',this);return false;";	//setPointFont('2_4');
					switch(params){
						case "Wingdings":
							var col=parseInt(datafield.split("_")[1]);
							var picrow = parseInt((((row)*colNumber)+col) / 16);
							var piccol = (((row)*colNumber)+col)%16;

							posX=(5+(47*piccol))*-1;
							posY=0 +(34*(picrow)*-1);

							break;
					}
					break;
				case "library":
					class1='geolink';
					posX=0;
					posY=0;
					if (value){
						var imgsrc=value.split("#")[1];
						extraStyle=mygis.Utilities.format("background-image: url('{0}');",imgsrc);
					}
					action="mygis.UI.setPointImg('"+value+"',this);return false;";
					break;
			}
			var returnString = mygis.Utilities.format(
				'<a href="#" onclick="{0}return false;" class="{1} {2}" style="background-position: {3}px {4}px;{5}"></a>',
				action,class1,class2,posX,posY,extraStyle
			);
			return returnString;
		};
		renderer = mode=='image'?imagerenderer:null;
		var pointgridSource = {
			localdata: pointSource,
			datatype: 'array'
		};
		var columnArray=[];
		for (var i=1;i<=colNumber;i++){
			var colItem = new Object();
			colItem.text="";
			colItem.datafield="_"+i.toString();
			colItem.width=40;
			colItem.cellsrenderer = renderer;
			columnArray.push(colItem);
		}
		thegrid.jqxGrid({
			source: pointgridSource,
			width: (40*colNumber)+20,
			height: 200,
			autoheight: false,
			theme: 'pk_mg',
			enableanimations: true,
			rowdetails: false,
			sortable: true,
			groupable: false,
			showheader: false,
			showgroupsheader: false,
			//initrowdetails: initrowdetails,
			editable: false,
			selectionmode: 'singlecell',
			columns:columnArray,
			rowsheight: 34
		});
	},

    /**
     Toggles editing for map objects
	 @method toggleEditMode
	 @param {Boolean} force_off Ignores the previous state and toggles it off.
     */
    toggleEditMode: function(force_off,params){

		var continueDigi=true;
		var positiveConfirm = function(){
			mygis.Map.createNewLayer("test");
			displayNotify(msg_errFeatureNotImplemented);
			continueDigi=false;
			mygis.UI.continueEditMode(continueDigi,params);};

		if (!(layerCurrentEditing>-1)){
			//showConfirmationDialog(strings.Editing.noEditingForDigi,positiveConfirm); //TODO
			displayError(strings.Editing.noEditingForce);
		}else{
			mygis.UI.continueEditMode(continueDigi,params);
		}

    },

	/**
		Continues after toggleEditMode (confirmation window)

		@method continueEditMode
		@param {Boolean} continueDigi True if we want the digitizing to continue. False code (error handling?) is still TODO
		@param {Array} Array of strings. Only 1st object is used, to mark the activated tool.
	**/
	continueEditMode: function(continueDigi,params){
		if (continueDigi){
			var valid=false;
			var insertType=layerSource.records[layerCurrentEditing].layerGeomType;
			var activateType=params[0];
			if (insertType=="Mixed" || !insertType){
				valid=true;
			}else{
				switch(true){
					case (insertType=='Point' && activateType=='marker'): valid=true; break;
					case (insertType=='Line' && activateType=='polyline'): valid=true; break;
					case (insertType=='Polygon' && (activateType=='polygon' || activateType=='rectangle')): valid=true;break;
				}
			}
			if (!valid){
				displayError(strings.Editing.wrongLayerType+insertType);
			}else{
				mygis.UI.activateTool(params);
			}
		}
	},

	/**
		Pushes a feature from the cosmetic layer to featuresUnsaved and attaches any user-input data to that feature.

		@method cosmeticPush
		@param {Object} feature
	*/
    cosmeticPush: function(feature){
		featuresUnsaved.push(feature);
		mygis.UI.notifyUnsavedLayer(layerCurrentEditing);
	},

	/**
	 *	Pops a feature from the cosmetic layer
	 *	@method cosmeticPop
	 *	@param {Object}	feature
	 */
	cosmeticPop: function(feature){
		featuresUnsaved.pop();
		cosmeticLayer.removeFeatures([feature]);
	},

	/**
		Flashes a generic save icon, to notify the user that he needs to save
		@method notifyUnsaved
		@deprecated
	*/
	notifyUnsaved: function(){
		var elem=document.getElementById('mapAction_Save');
		elem.ex_RemoveClassName('disabled');
		clearInterval(saveFlasher);
		saveFlasher = setInterval(function(){
			var elem=document.getElementById('mapAction_Save');
			if (elem.ex_HasClassName('flash')){
				elem.ex_RemoveClassName('flash');
			}else{
				elem.ex_AddClassName('flash');
			}
		},500);
	},

	/**
		Updates the layer grid to show that the layer needs to be saved
		@method notifyUnsavedLayer
		@param {Integer} index The layer index to notify about.
	*/
	notifyUnsavedLayer: function(index){
		layerSource.records[index].Savable=true;
		unsavedChanges=true;
		//mygis.UI.updateLayerGrid();
	},

	/**
		Clears all unsaved objects for the given layer index
		@method clearUnsavedLayer
		@param {Integer} index The layer index to clear
	*/
	clearUnsavedLayer: function(index){
		//layerSource.records[index].Savable=null;
		unsavedChanges=false;
		featuresUnsaved=[];
		featuresModified = {};
		featuresDeleted = [];

		cosmeticLayer.destroyFeatures();
		layerCurrentEditing=-1;
		//mygis.UI.updateLayerGrid();
	},

	/**
		Stops the flashing "save" button next to the layer
		@method disableNotifyUnsaved
		@deprecated
	*/
	disableNotifyUnsaved: function(){
		var elem=document.getElementById('mapAction_Save');

		clearInterval(saveFlasher);
		if (elem.ex_HasClassName('flash')){
			elem.ex_RemoveClassName('flash');
		}
		elem.ex_AddClassName("disabled");
	},

    /**
		Resets digitizing tools to "unpressed" state.
		@param exceptme The tool to except from this process
		@method clearmygis
     */
    clearmygis: function(exceptme){
        var object;
        var myname;
        for (var i=0; i<6; i++)
        {
            switch (i)
            {
                case 0:
                    myname = "marker";
                    break;
                case 1:
                    myname = "polyline";
                    break;
                case 2:
                    myname = "polygon";
                    break;
                case 3:
                    myname = "circle";
                    break;
                case 4:
                    myname = "rectangle";
                    break;
                case 5:
                    myname = "drive";
                    break;

            }
            if (myname !=exceptme)
            {
                object = document.getElementById(myname+"Button");
                if (object){
                    if (object.ex_HasClassName("btnTool_selected")){
                    object.ex_RemoveClassName("btnTool_selected");
                }
                }
            }
        }
    },

	/**
		Deactivates all digitizing controls
		@method clearDrawingMode
	**/
    clearDrawingMode: function(){

		for(key in drawControls) {
			var control = drawControls[key];
			control.deactivate();

		}
		//mygis.UI.clearUnsavedLayer(layerCurrentEditing);
    },

    /**
     * Handles toggling of a map tool
		@param toolname The tool's name
		@param object The actual DOM object containing the tool
		@method setTool
     */
    setTool: function(toolname,object){
		var params = [];
		params.push(toolname);
		params.push(object);
        //drawingManager.setDrawingMode(null);
        if (object.ex_HasClassName("btnTool_selected")){
            object.ex_RemoveClassName("btnTool_selected");
            mygis.UI.clearDrawingMode();
        }else{
			mygis.UI.toggleEditMode(true,params);	//toggle off editing
        }
    },

	/**
	Activates a digitizing tool
	@method activateTool
	@param {String} params The tool to activate
	*/
	activateTool: function(params){

		var toolname = params[0];
		var object = params[1];
		
		digimap.removeControl(drawControls[toolname]);
		switch(toolname){
			case "marker":
				drawControls.marker = new OpenLayers.Control.DrawFeature(cosmeticLayer,
					OpenLayers.Handler.Point,{
						featureAdded: function(feature){
							feature.overlaytype = "marker";
							mygis.UI.increaseMarkers(feature);
							mygis.Utilities.blockUI();
							var layername = layerSource.records[layerCurrentEditing].layerTABLE;
							$.ajax({
								type: "GET",
								url: config.mgreq+"?qtype=GetLayerFields&qContents="+escape(layername.replace(/ /g,"_")),
								success: function(data){
									
									var datacolumns = mygis.Query.resultLayerDetails(data);
									var newWindow=true;
									mygis.Utilities.unblockUI();
									mygis.Query.popupInfo(datacolumns,layername,newWindow);
								}
							});
						},
						handlerOptions:{
							stopDown:false,
							stopUp: false
						}
					});
				break;
			case "polyline":
				drawControls.polyline = new OpenLayers.Control.DrawFeature(cosmeticLayer,
					OpenLayers.Handler.Path,{
						featureAdded: function(feature){
							feature.overlaytype = "polyline";
							mygis.UI.increasePolylines(feature);
						},
						handlerOptions:{
							stopDown:false,
							stopUp: false
						}
					});
				break;
			case "polygon":
				drawControls.polygon = new OpenLayers.Control.DrawFeature(cosmeticLayer,
					OpenLayers.Handler.Polygon,{
						featureAdded: function(feature){
							feature.overlaytype = "polygon";
							mygis.UI.increasePolygons(feature);
						},
						handlerOptions:{
							stopDown:false,
							stopUp: false
						}
					});
				break;
			case "rectangle":
				drawControls.rectangle =  new OpenLayers.Control.DrawFeature(cosmeticLayer,
					OpenLayers.Handler.RegularPolygon, {
						featureAdded: function(feature){
							feature.overlaytype = "rectangle";
							mygis.UI.increasePolygons(feature);
						},
						handlerOptions:{
							stopDown:false,
							stopUp: false
						}
					});
				break;
		}
		digimap.addControl(drawControls[toolname]);
		var prev=layerCurrentEditing;
		mygis.UI.activateOLControl(drawControls[toolname],object);	//this resets any current layer editing, so..
		layerCurrentEditing=prev;	//...restore it
		naviControls["navigation"].activate();
		drawControls[toolname].deactivate();
		drawControls[toolname].activate();
		document.getElementById("mapContainer").ex_AddClassName("digitizeMode");
	},

    /**
     Toggles the main toolbar
	 @method toggleToolbar
	 @deprecated
     */
    toggleToolbar: function(){
        if (!toolbarToggling)
        {
            toolbarToggling = true;
            if ($("#mapToolbar").is(":visible")){
                //$("#mapToolbar").hide("slide", { direction: "up"}, 1000, function(){toolbarToggling=false;});
				$("#mapToolbar").hide();
				toolbarToggling=false;
                document.getElementById("mapAction_Tools").setAttribute("class", "");
                document.getElementById("mapAction_Tools").setAttribute("className", "");
				showCosmetic(false);//toggleRadControl('layers', 'layersButton');
            }else{
                //closeToolbars("mapToolbar");
				//toggleRadControl('layers', 'layersButton');
				showCosmetic(true);
				//$("#mapToolbar").show("slide", { direction: "up" }, 1000, function() { toolbarToggling = false; });
				$("#mapToolbar").show();
				toolbarToggling = false;
                document.getElementById("mapAction_Tools").setAttribute("class", "pressed");
                document.getElementById("mapAction_Tools").setAttribute("className", "pressed");

           }
       }

       return false;
    },

    /**
     Toggles the search bar
	 @method toggleToolbar2
	 @deprecated
     */
    toggleToolbar2: function(){
        if (!toolbarToggling)
        {
            toolbarToggling = true;
            var sender = document.getElementById("toggleToolbar2");
            if ($("#searchbar").is(":visible")){
                $("#searchbar").hide("slide", { direction: "left"}, 1000, function(){toolbarToggling=false;});
                document.getElementById("toggleToolbar2").setAttribute("class","pressed");
                document.getElementById("toggleToolbar2").setAttribute("className","pressed");
            }else{
                //closeToolbars("searchbar");
                $("#searchbar").show("slide", { direction: "left"}, 1000, function(){toolbarToggling=false;});
                document.getElementById("toggleToolbar2").setAttribute("class","");
                document.getElementById("toggleToolbar2").setAttribute("className","");

           }
       }
       return false;
    },

    /**
     Toggles the misc bar
	 @method toggleToolbar3
	 @deprecated
     */
    toggleToolbar3: function(){
        if (!toolbarToggling)
        {
            toolbarToggling = true;
            var sender = document.getElementById("toggleToolbar3");
            if ($("#miscbar").is(":visible")){
                $("#miscbar").hide("slide", { direction: "left"}, 1000, function(){toolbarToggling=false;});
                document.getElementById("toggleToolbar3").setAttribute("class","pressed");
                document.getElementById("toggleToolbar3").setAttribute("className","pressed");
            }else{
                //closeToolbars("searchbar");
                $("#miscbar").show("slide", { direction: "left"}, 1000, function(){toolbarToggling=false;});
                document.getElementById("toggleToolbar3").setAttribute("class","");
                document.getElementById("toggleToolbar3").setAttribute("className","");

           }
       }
       return false;
    },

    /**
     Closes all toolbars
	 @method closeToolbars
     @param {String} exceptme Except this
     */
    closeToolbars: function(exceptme){
        for (var i=0;i<2;i++)
        {
            var barname;
            var btnname = "toggleToolbar" + (i+1).toString();
            switch (i)
            {
                case 0:
                    barname = "mapToolbar";
                    break;
                case 1:
                    barname = "searchbar";
                    break;
            }
            if (barname!=exceptme)
            {
                if ($("#"+barname).is(":visible")){
                    $("#"+barname).hide();
                    document.getElementById(btnname).setAttribute("class","pressed");
                    document.getElementById(btnname).setAttribute("className","pressed");
                }
            }
        }
    },

     /**
     Increases the marker counter
	 @method increaseMarkers
	 @param {Object} feature The feature to insert
     */
    increaseMarkers: function(feature){
        countMarkers ++;
		mygis.UI.cosmeticPush(feature);
    },

	/**
	 *	Decreases the marker counter
	 *	@method decreaseMarkers
	 *	@param {Object} feature The feature to remove
	 */
	decreaseMarkers: function(feature){
		countMarkers --;
		mygis.UI.cosmeticPop(feature);
	},

    /**
     Increases the polygon counter
	 @method increasePolygons
	 @param {Object} feature The feature to insert
     */
    increasePolygons: function(feature){
        countPolygons ++;
		mygis.UI.cosmeticPush(feature);

    },

	/**
	 *	Decreases the polygon counter
	 *	@method decreasePolygons
	 *	@param {Object} feature The feature to remove
	 */
	decreasePolygons: function(feature){
		countPolygons --;
		mygis.UI.cosmeticPop(feature);
	},

    /**
     Increases the polyline counter
	 @method increasePolylines
	 @param {Object} feature The feature to insert
     */
    increasePolylines: function(feature){
        countPolylines ++;
		mygis.UI.cosmeticPush(feature);

    },

	/**
	 *	Decreases the polyline counter
	 *	@method decreasePolylines
	 *	@param {Object} feature The feature to remove
	 */
	decreasePolylines: function(feature){
		countPolylines --;
		mygis.UI.cosmeticPop(feature);
	},

	/**
		Scales the map according to the scale select element value.

		@method scaleTo
		@param {String} scaleText The manual scaleText (Contains text in the form 1:XXXXX
	**/
	scaleTo: function(scaleText){
		var element = document.getElementById("olScale_wrapper");
		var previousHandler = element.onchange;
		element.onchange = null;
		element.selectedIndex=0;
		element.onchange = previousHandler;
		var scalevalue = scaleText.substring(scaleText.indexOf(":")+1);
		scalevalue = scalevalue.replace(/\./g,'');
		digimap.zoomToScale(scalevalue);

	},

	/**
	 * Adds stylesheets to the page
	 * @method initializeStyleSheets
	 */
	initializeStyleSheets: function(){
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.base.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.classic.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.energyblue.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.pk_mg.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.pk_mg_white.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/jqwidgets/styles/jqx.pk_mg_jm.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/css/jqxcalendar-overrides.css"});		//JK CHANGE - ADD CSS
		//mygis.Utilities.add_sheet({url:config.folderPath+"Scripts/linkSelect/css/jquery.linkselect.min.css"});
		mygis.Utilities.add_sheet({url:config.folderPath+"GetAppStyle.ashx",title:'myappcust'});
		mygis.UI.createThemeChooser();
	},

	/**
	 * Creates a list with the available published themes
	 * @method createThemeChooser
	 */
	createThemeChooser: function(){
		//var customUrl = config.mgreq+"?qtype=GetAvailableThemes";
		var customUrl = config.folderPath+"mgreq.ashx?qtype=GetAvailableThemes";
		$.ajax({
					type:"GET",
					url: customUrl,
					success: function(data){
						try{
							var results = data;
							if (results.length>0){
								var sel = $("<select />");
								var dummyOption = $("<option />");
								//sel.append(dummyOption);
								sel.attr("id","themeChooser");
								$("#bottomPane").append(sel);
								var el = sel[0];
								el.options[0] = new Option(strings.Coding.promptThemeChoose,'-1');
								el.options[0].setAttribute("class","selectPrompt");
								$.each(results, function () {
									el.options[el.options.length] = new Option(this.name, this.value);
								});
								sel.bind("change",mygis.UI.handleThemeChoose);
							}
						}catch(err){}


					}
		});
	},

	/**
	 * Switches to the selected theme
	 * @method handleThemeChoose
	 */
	handleThemeChoose: function(){
		var selIndex = parseInt($("#themeChooser").val());
		if (selIndex>-1){
			mygis.Utilities.previewCustomization(selIndex);
		}else{
			mygis.Utilities.enableCustomization();
		}
	},

	/**
		Creates a new "map preview" in the "Build Search" window

		@method createCriteriaMap
	**/
	createCriteriaMap: function(){
		if (!criteriaMap){
			criteriaMap = new OpenLayers.Map("criteriaMap",{
				fractionalZoom: true,
				controls: [
					/*
					new OpenLayers.Control.Attribution({
						template: 'Copyright MyGIS 2012, ${layers}'
					}),*/
					new OpenLayers.Control.Navigation({
						handleRightClicks: true,
						autoActive:true,
						dragPanOptions: {enableKinetic: false}
					})
				]
			});


			var selectElem = document.getElementById("criteriaMapBgSelect");
			var selectBackgrounds = [];
			var arrItem = new Object();
			arrItem["name"]=strings.Coding.noBackground;
			arrItem["value"]="";
			selectBackgrounds.push(arrItem);
			criteriaMap.countBackgrounds=0;
			for (var i=0;i<digimap.layers.length;i++){
				var item = digimap.layers[i];

				if (item.isBaseLayer){
					var arrItem = new Object();
					arrItem["name"]=strings.LayerControl.labelBackground+item.name;
					arrItem["value"]=item.name;
					selectBackgrounds.push(arrItem);
					criteriaMap.addLayer(item.clone());
					criteriaMap.countBackgrounds+=1;
				}
			}
			mygis.Utilities.populateSelect(selectElem,selectBackgrounds,true);
			selectElem.selectedIndex = 1;
			selectElem.onchange = function(){
				var sel=document.getElementById("criteriaMapBgSelect");
				if (sel.selectedIndex>0){
					criteriaMap.baseLayer.setVisibility(false);
				    criteriaMap.setBaseLayer(criteriaMap.layers[sel.selectedIndex-1]);
					criteriaMap.baseLayer.setVisibility(true);
				}else{
					criteriaMap.baseLayer.setVisibility(false);
				}
			}

			criteriaMap.setCenter(digimap.getCenter(), digimap.getZoom());
		}
	},

	/**
		Updates the map preview in "Build Search" window to display the given layer

		@method updateCriteriaMap
		@param {Element} select The select element containing the layername
	**/
	updateCriteriaMap: function(select,layername){
		var changeTo = select.selectedIndex;
		if (lastCritIndex!=changeTo){
			lastCritIndex=changeTo;
			var getTop = wmsHighlight?-2:-1;
			/*
			if (criteriaMap.layers.length>criteriaMap.countBackgrounds){

				criteriaMap.layers[criteriaMap.layers.length+getTop].destroy();
			}
			*/
			if (changeTo>0){
				var layername = select.options[changeTo].value;
				layername=mygis.Utilities.nameToUnderscore(layername);
				//layername = currentAppName+"_"+layername;
				if ((getTop==-2 && criteriaMap.layers.length<criteriaMap.countBackgrounds+2)||criteriaMap.layers.length==criteriaMap.countBackgrounds){
					var layer = mygis.Map.getMapServerLayer(layername,"",currentMapMaxExtent);
					criteriaMap.addLayer(layer);
				}else{
					criteriaMap.layers[criteriaMap.layers.length+getTop].mergeNewParams({
						layers:layername
					});
				}
				criteriaMap.layers[criteriaMap.layers.length+getTop].setVisibility(true);
			}else{
				criteriaMap.layers[criteriaMap.layers.length+getTop].setVisibility(false);
			}
		}
	},

	/**
		Returns a comma-separated string of layer names contained the "Build Search" window.

		@method getCriteriaLayerString
		@return {String}
	**/
	getCriteriaLayerString: function(){
		var fullLayerString="";
		var fullLayers=[];
		var layername;
		var searchContainer = $("#criteriaPanels");

		var selectArray = searchContainer.find(".dbTableName");
		$.each(selectArray,function(i,v){
			if (v.selectedIndex>0){
				layername = v.options[v.selectedIndex].value;
				layername=mygis.Utilities.nameToUnderscore(layername);
				//layername = currentAppName+"_"+layername;
				fullLayers.push(layername);
			}
		});
		fullLayerString = fullLayers.join(",");
		return fullLayerString;
	},

	/**
		Populates a hidden "distinct values" list in the current row ("Build Search" window).

		@method dbPopulateDistinct
		@param {Element} element The calling element
	**/
	dbPopulateDistinct: function(element){
		var thisRow = $(element).parent();
		var selectFrom = thisRow.find(".dbFieldName")[0];
		var fieldname = selectFrom.options[selectFrom.selectedIndex].value;
		var checkstring = fieldname;
		if (checkstring.substr(checkstring.length-2)=="%s"){
			checkstring = checkstring.split("%")[0];
		}

		var tableSelect = thisRow.parent().find(".dbTableName")[0];
		var layername = tableSelect.options[tableSelect.selectedIndex].value;
		var selectTo = thisRow.find(".dbValueDistinct")[0];
		if (layername && fieldname){
			var customUrl = config.mgreq+"?qtype=GetLayerDistinct&qContents="+escape(layername.replace(/ /g,"_")+"$"+checkstring);
			$.ajax({
					type:"GET",
					url: customUrl,
					success: function(data){
						var datacolumns = [];
						var row;
						try{
							var realResults = eval(data);
							$.each(realResults,function(index,value){
								row=new Object();
								row["name"]=value;
								row["value"]=value;
								datacolumns.push(row);
							});
							mygis.Utilities.populateSelect(selectTo,datacolumns);
							$(selectTo).css({"display":"inline"});
							thisRow.find(".dbFieldValue")[0].value="";
						}catch(err){
							displayError(data);
						}
					}
			});
		}
	},

	/**
		Fills in the current "where" clause in the "Build Search" window from the hidden "distinct values" list.
		@method dbGetFromDistinct
		@param {Element} element The calling element
	**/
	dbGetFromDistinct: function(element){
		var thisRow = $(element).parent();
		thisRow.find(".dbFieldValue")[0].value=element.options[element.selectedIndex].value;
	},

	/**
		Retrieves column data for the given row in "Build Search" window
		@method dbFieldPopulate
		@param {Element} element The calling element
	**/
	dbFieldPopulate: function(element){
		var container = $("#databaseAnalysis");
		var tableRow = $(element).parent();
		var currentPanel = tableRow.parent();
		var secondRow = currentPanel.find(".criteriaSecondRow");
		var selectTo = secondRow.find(".dbFieldName");
		var critButton = tableRow.find('.andButton')[0];
		if (secondRow.length>1){
			secondRow.slice(1).remove();	//remove any additional "where"
		}
		secondRow.find(".dbValueDistinct").css({"display":"none"});
		//mygis.UI.updateCriteriaMap(element);
		if (element.selectedIndex>0){
			critButton.ex_RemoveClassName('disabled');
			var layername = element.options[element.selectedIndex].value;
			//mygis.UI.updateCriteriaMap(layername);

			var customUrl = config.mgreq+"?qtype=GetLayerFields&qContents="+escape(layername.replace(/ /g,"_"));
			$.ajax({
					type:"GET",
					url: customUrl,
					success: function(data){

						var datacolumns = mygis.Query.resultLayerDetails(data);	//[];
						$.each(selectTo,function(i,v){
							mygis.Utilities.populateSelect(v,datacolumns);
						});
					}
			});
		}else{
			critButton.ex_AddClassName("disabled");
			secondRow.css({"display":"none"});
			critButton.ex_RemoveClassName("pressed");
		}
	},
	
	dbQueryResults: function(data,queryname,dbQuery){
		mygis.Utilities.unblockUI();
		var response = eval(data);
		if (typeof response=="object"){
			//$("#bottomTabContainer").jqxTabs('select',internalConfig.searchTabIndex);
			var qItem = new Object();
			qItem.text=queryname;
			displaySuccess(strings.QBuilder.feed_SearchSuccess+'"'+qItem.text+'"');
			qItem.value=-1;
			qItem.isInitialized=true;
			qItem.linkedResults=response;
			qItem.isDBQuery=true;
			qItem.isMapSelect=false;
			querySource.push(qItem);
			mygis.UI.updateQueryList();

			try{$("#databaseAnalysis").dialog('close');}catch(err){}
			var leftList = $("#infoLeftList");
			var itemCount = leftList.jqxListBox('getItems').length;
			var lastSelection = leftList.jqxListBox('getItemByValue',-999);
			if (lastSelection&&!dbQuery){
				leftList.jqxListBox('selectIndex',lastSelection.index);
			}else{
				leftList.jqxListBox('selectIndex',itemCount-1);
			}
			
			mygis.UI.queryResultsRun();
		}else{
			alert(response);
		}
	},

	/**
		Routing function that handles buttons in the "Build Search" window.

		@method dbCriteriaClick
	**/
	dbCriteriaClick: function(element){
		var container = $("#criteriaPanels");
		var containerChildren = container.children();
		var innertext = element.className.split(" ")[0];

		switch (innertext){
			case "bAnd":
			case "bOr":
			case "bXor":
			case "bNot":
				var actionRow = $(element).parent();
				var prevPressed = actionRow.find(".pressed")[0];
				if (prevPressed!=element){
					prevPressed.ex_RemoveClassName("pressed");
				}
				element.ex_AddClassName("pressed");
				mygis.UI.dbCriteriaUpdateDescription();
				break;
			//adds a new panel
			case "addPanel":
				var actionRow = $(element).parent();
				var currentPanel = actionRow.parent();
				var getACopy = currentPanel.clone(true);
				getACopy.find(".closePanel").css({"display":"inline"});
				//remove any additional "Where" rows
				getACopy.find(".criteriaSecondRow").slice(1).remove();				
				//JK CHANGES - give new id to new panel, its calendar and its button - change the calendar binding and hide the button
				if (window.lines_id.length < 1) {
					window.lines_id=[[0,false,false,false]];
					id=0;}
				else if (window.lines_id!=[[0,false,false,false]]){			
					var id = window.lines_id[window.lines_id.length-1][0]+1;
					window.lines_id.push([id, window.lines_id[id-1][1], window.lines_id[id-1][2], window.lines_id[id-1][3]]);
				}
				getACopy.find(".criteriaSecondRow")[0].id = 'second_row_'+id.toString();
				getACopy.find(".cal_button")[0].id = 'cal_button_'+id.toString();							
				//JK CHANGES - END
				//reset to initial state
				getACopy.find(".dbFieldName")[0].selectedIndex=-1;
				getACopy.find(".dbFieldOperator")[0].selectedIndex=-1;
				getACopy.find(".dbFieldValue")[0].value="";
				getACopy.find(".dbValueDistinct").css({"display":"none"});
				getACopy.find(".criteriaWrapperLegend").html(strings.QBuilder.panelTitle);
				container.append(getACopy);
				//JK - CHANGES - hide the new calendar
				$('#second_row_'+id.toString()+'>.cal_button').hide()
				//JK CHANGES - END
				break;
			case "andButton":
			//duplicates second row
			case "critDuplicate":
				var actionRow = $(element).parent();
				var currentPanel = actionRow.parent().parent();
				var criteriaRow = $(currentPanel.find(".criteriaSecondRow")[0]);				
				var currentIndex = containerChildren.index(currentPanel);
				if (innertext=="andButton" && !element.ex_HasClassName("disabled")){
					if (element.ex_HasClassName("pressed")){	//if a "where" row has already been added...
						var getACopy = criteriaRow.clone(true);
						//JK CHANGES - give new id to new second row, calendar and button, initialize button if valid
						if (window.lines_id.length < 1) {
							window.lines_id=[[0,false,false,false]];
							id=0;}
						else if (window.lines_id!=[[0,false,false,false]]){	
							var id = window.lines_id[window.lines_id.length-1][0]+1;
							window.lines_id.push([id, window.lines_id[id-1][1], window.lines_id[id-1][2], window.lines_id[id-1][3]]);
						}
						getACopy[0].id = 'second_row_'+id.toString();						
						getACopy.find(".cal_button")[0].id = 'cal_button_'+id.toString();
						//JK CHANGES - END
						//reset to initial state
						getACopy.find(".dbFieldName")[0].selectedIndex=-1;
						getACopy.find(".dbFieldOperator")[0].selectedIndex=-1;
						getACopy.find(".dbFieldValue")[0].value="";
						getACopy.find(".dbValueDistinct").css({"display":"none"});
						getACopy.find(".criteriaMOD").css({"display":"block"});
						getACopy.find(".critRemove").css({"display":"inline"});
						currentPanel.append(getACopy);
						//JK - CHANGES - hide the new calendar
						$('#second_row_'+id.toString()+'>.cal_button').hide()						
						//JK CHANGES - END
					}else{
						criteriaRow.css({"display":"block"});
						element.ex_AddClassName("pressed");
					}

				}else{
					var thisRow = actionRow.parent();
					var getACopy = thisRow.clone(true);
					//JK CHANGES - give new id to new second row, calendar and button
					if (window.lines_id.length < 1) {
							window.lines_id=[[0,false,false,false]];
							id=0;}
					else if (window.lines_id!=[[0,false,false,false]]){
							var id = window.lines_id[window.lines_id.length-1][0]+1;
							window.lines_id.push([id, window.lines_id[id-1][1], window.lines_id[id-1][2], window.lines_id[id-1][3]]);
						}
					getACopy[0].id = 'second_row_'+id.toString();					
					getACopy.find(".jqxdatetime")[0].id = 'datetime_'+id.toString();
					getACopy.find(".cal_button")[0].id = 'cal_button_'+id.toString();																	
					//JK CHANGES - END
					//clone doesn't clone selectedIndex, so do it manually
					getACopy.find(".dbFieldName")[0].selectedIndex=thisRow.find(".dbFieldName")[0].selectedIndex;
					getACopy.find(".dbFieldOperator")[0].selectedIndex=thisRow.find(".dbFieldOperator")[0].selectedIndex;
					getACopy.find(".criteriaMOD").css({"display":"block"});
					getACopy.find(".dbValueDistinct").css({"display":"none"});
					getACopy.find(".critRemove").css({"display":"inline"});					
					getACopy.insertAfter(thisRow);
					//JK CHANGES -   re-initialize calendar
					mygis.Utilities.datetime_input_field(document.getElementById('second_row_'+id.toString()));
					//JK CHANGES - END
				}
				break;
				
			case "search":
				var toSend=document.getElementById("criteriaURL").value;
				/*
				//JK CHANGES - fix the query input for dates				
				//we will check the toSend string to see if there are matches with the datetime objects, and if so, we modify the string
				//so that we will know to fix the query to sql as needed
				//to do that, we split the string with the $,%b,# operators that separate input fields and after that we check for datetimes
				//the new string is created during the checking process and the &dt& is added just before the date
				//this will be interpreted later and passed correctly to the sql
				var newfield="";
				var field=toSend.split('$');				
				for (i=0;i<field.length;i++){field[i] = field[i].split('%b')};
				for (i=0;i<field.length;i++){for(j=0;j<field[i].length;j++){field[i][j] = field[i][j].split('#')}};				
				for(i=0;i<window.trigger_calendar.length;i++){
					for (j=0;j<field.length;j++){
						for (k=0;k<field[j].length;k++){
							for (l=0;l<field[j][k].length;l++){
								if(window.trigger_calendar[i][1] == field[j][k][l]){field[j][k][l+2]='&dt&'+field[j][k][l+2]}
								newfield+=field[j][k][l]+'#'
							};
							newfield = newfield.slice(0, -1);
							newfield+='%b';
						};
						newfield = newfield.slice(0, -2);
						newfield+='$';
					};
					newfield = newfield.slice(0, -1);
				};
				toSend = newfield;
				//JK CHANGES - END
				*/
				var queryname = document.getElementById("critFriendlyName").value;
				if (toSend){
					var myurl = config.mgreq+"?qtype=DirectQuery&qContents="+escape(toSend);
					mygis.Utilities.blockUI();
					$.ajax({
							type:"GET",
							url: myurl,
							success: function(data){
								mygis.UI.dbQueryResults(data,queryname,true);
							}
					});
				}else{
					displayError("No query yet");
				}
				break;
			//removes a panel
			case "closePanel":
				var addPanel = $(element).parent().parent();				
				//remove panel
				addPanel.remove();
				mygis.UI.dbCriteriaUpdateDescription();
				//JK CHANGES - remove old id from our array
				var id_to_rm = parseInt(addPanel.find(".criteriaSecondRow")[0].id.replace("second_row_",""));
				for (i = 0; i < window.lines_id.length; i++){if(window.lines_id[i][0]==id_to_rm){index=i}}
				window.lines_id.splice(index, 1);
				//fix crit-del-error - re-bind buttons and calendars if needed
				for (i=0; i<window.lines_id.length; i++){
				test=[i,true,true,true,1];
				for(j= 0; j<window.lines_id[i].length; j++){if (window.lines_id[i][j]!=test[j]){test[4]=0;}}
				if (test[4] == 1) {mygis.Utilities.datetime_input_field(document.getElementById('second_row_'+i.toString()));}}
				//JK CHANGES - END
				break;
			//removes crit row
			case "critRemove":
				var actionRow = $(element).parent().parent();				
				actionRow.remove();
				mygis.UI.dbCriteriaUpdateDescription();
				//JK CHANGES - remove old id from our array
				var id_to_rm = parseInt(actionRow[0].id.replace("second_row_",""));
				for (i = 0; i < window.lines_id.length; i++){if (window.lines_id[i][0]==id_to_rm){index=i}}
				window.lines_id.splice(index, 1);
				//fix crit-del-error - re-bind buttons and calendars if needed
				for (i=0; i<window.lines_id.length; i++){
				test=[i,true,true,true,1];
				for(j= 0; j<window.lines_id[i].length; j++){if (window.lines_id[i][j]!=test[j]){test[4]=0;}}
				if (test[4] == 1) {mygis.Utilities.datetime_input_field(document.getElementById('second_row_'+i.toString()));}}			
				//JK CHANGES - END
				break;
		}
	},

	/**
		Resets the "Build Search" window to its initial state

		@method dbCriteriaReset
	**/
	dbCriteriaReset: function(){
		var container = $("#criteriaPanels");
		var containerChildren = container.children();
		if (containerChildren.length>1){$('.cal_button').hide();
			containerChildren.slice(1).remove();	//remove any additional "panels"
		}
		var topPanel = $(containerChildren[0]);
		var getCriteria = topPanel.find(".criteriaSecondRow");
		if (getCriteria.length>1){
			getCriteria.slice(1).remove();	//remove any additional "where"
		}

		//Reset the second row:
		var secondRow = topPanel.find(".criteriaSecondRow");

		//do something with mod buttons
		var fieldName = secondRow.find(".dbFieldName")[0];
		var fieldOP = secondRow.find(".dbFieldOperator")[0];
		var fieldVal = secondRow.find(".dbFieldValue")[0];

		fieldVal.value="";
		fieldOP.selectedIndex = 0;
		fieldName.selectedIndex =0;
		//Fire the "disable" triggers:
		mygis.UI.dbSelectChanged(fieldOP);
		mygis.UI.dbSelectChanged(fieldName);
		secondRow.css({"display":"none"});

		//Reset the first row:
		var firstRow = topPanel.find(".criteriaFirstRow");
		var tableSelect = firstRow.find(".dbTableName")[0];
		var addCritBtn = firstRow.find(".andButton")[0];

		addCritBtn.ex_RemoveClassName("pressed");
		tableSelect.selectedIndex = 0;
		mygis.UI.dbFieldPopulate(tableSelect);

		mygis.UI.dbCriteriaUpdateDescription();
		wmsHighlight = null;
		//JK CHANGES - reset the flags and clear calendars
		window.trigger_calendar = []
		window.lines_id = [[0,false,false,false]]
		//JK CHANGES - END
	},

	/**
		Handler for selects change in "Build search" dialog.
		Visual changes only.

		@method dbSelectChanged
		@param {Element} element The calling element
	**/
	dbSelectChanged: function(element){
		var secondRow = $(element).parent().parent();
		var innerText = element.className.split(" ")[0];
		var target="";
		id = parseInt(secondRow[0].id.replace("second_row_",""));
		switch (innerText){
			case "dbFieldName":
				target=".dbFieldOperator";
				secondRow.find(".dbValueDistinct").css({"display":"none"});

				//JK CHANGES - if its a datetime object, create a flag to check later
				for(i=0;i<window.trigger_calendar.length ;i++){
					if(window.trigger_calendar[i][0] == element.selectedIndex){window.lines_id[id][1]=true;}
					else{window.lines_id[id][1]=false;}
				}
				//JK CHANGES - END
				break;

			case "dbFieldOperator":
				target=".dbFieldValue";
				//JK CHANGES, add the datetime field if needed
				try{
				if(window.lines_id[id][1]==true)
				{
					//add calendar later
					window.lines_id[id][2]=true;
				};}
				catch (err){}
				//JK CHANGES - END
				break;
		}
		var targetElement = secondRow.find(target)[0];
		if (element.selectedIndex>0){
			$(targetElement).removeAttr("disabled");
			//JK CHANGES - flag change
			if (innerText == 'dbFieldOperator'){window.lines_id[id][3]=true;}
			else {window.lines_id[id][2]=true;}
			//JK CHANGES - END
		}else{
			$(targetElement).attr("disabled","disabled");
			//JK CHANGES - flag change
			if (innerText == 'dbFieldOperator'){window.lines_id[id][3]=false;}
			else {window.lines_id[id][2]=false}
			//JK CHANGES - END
		}

		//JK CHANGES - delete or create, hide and show the calendar and cal button
		try
		{
			//if no datetime object was encountered, remove the calendar and its button
			if (window.lines_id[id][1]==false || window.lines_id[id][3] == false){mygis.Utilities.rm_datetime_input_field(secondRow[0]);}
			//else, if both fields are ready, create the calendar and show button
			else if (window.lines_id[id][2] == true){mygis.Utilities.datetime_input_field(secondRow[0]);}
		}
		catch(err){}
		//JK CHANGES - END

	},

	/**
		Updates the "Build Search" description and modifies a hidden input to contain a crafted String.
		Expected value of qUrl at the end:
			TABLE_1
			--OR--
			TABLE_1 $ ... $ TABLE_N
			--OR--
			TABLE_1 # FIELD_1 # OP_1 # VALUE % Q_OP # FIELD_2 # OP_2 # VALUE_2
			--etc--

		@method dbCriteriaUpdateDescription
	**/
	dbCriteriaUpdateDescription: function(){
		$("#critSearchDescription").empty();
		var resultText="";
		var qUrl="";
		var panels = $("#criteriaPanels").children();
		var queries = [];
		$.each(panels,function(i,singlePanel){
			var panelText = "";
			var whereText = "";

			var panelQ = "";
			var panelQW = "";

			var atLeastOneWhere = false;
			var selectedTable = $(singlePanel).find(".dbTableName")[0];
			if (selectedTable.selectedIndex>0){
				panelText += "<span class='sqlKeyword'>";
				panelText += strings.QBuilder.keywordSELECT;	// "SHOW";
				panelText += "</span>";
				panelText += mygis.Utilities.format(" {0} ",strings.QBuilder.keywordALL); //" ALL ";
				panelText += "<span class='sqlKeyword'>";
				panelText += mygis.Utilities.format("{0} ",strings.QBuilder.keywordFROM);	//"FROM ";
				panelText += "</span>";
				panelText += selectedTable.options[selectedTable.selectedIndex].text;
				//panelQ += currentAppName+"_"+mygis.Utilities.nameToUnderscore(selectedTable.options[selectedTable.selectedIndex].value);	//GET TABLE
				panelQ += mygis.Utilities.nameToUnderscore(selectedTable.options[selectedTable.selectedIndex].value);	//GET TABLE

				var whereClauses = $(singlePanel).find(".criteriaSecondRow");
				$.each(whereClauses,function(j,singleWhere){

					var fieldName = $(singleWhere).find(".dbFieldName")[0];
					var fieldOp = $(singleWhere).find(".dbFieldOperator")[0];
					var fieldValue = $(singleWhere).find(".dbFieldValue")[0];
					if (fieldName.selectedIndex > 0 && fieldOp.selectedIndex > 0 && fieldValue.value != ""){
						if (j>0 && atLeastOneWhere){	//we need to add MOD clause
							var fieldMOD = $(singleWhere).find(".criteriaMOD").find(".pressed")[0];
							var fieldMODtext = $(fieldMOD).html();
							var fieldMODvalue = fieldMOD.className.split(" ")[0];
							whereText += "<span class='sqlKeyword'>";
							whereText += fieldMODtext + " ";
							whereText +="</span>";
							panelQW += "%"+fieldMODvalue;	//GET MOD
						}
						if (!atLeastOneWhere){
							whereText += "<span class='sqlKeyword'>";
							whereText += mygis.Utilities.format("{0} ",strings.QBuilder.keywordWHERE); //"WHERE ";
							whereText +="</span>";
							atLeastOneWhere = true;
						}
						whereText += fieldName.options[fieldName.selectedIndex].text;
						whereText += " ";
						whereText += "<span class='sqlKeyword'>";
						whereText += fieldOp.options[fieldOp.selectedIndex].text;
						whereText +="</span>";
						whereText += " ";
						whereText += "<span class='sqlValue'>";
						whereText += fieldValue.value;
						whereText +="</span>";
						whereText += " ";

						var formattedInput;
						var formattedField;
						var checkstring = fieldName.options[fieldName.selectedIndex].value;
						if (checkstring.substr(checkstring.length-2)=="%s" && checkstring[0]!="\"" && checkstring[checkstring.length-1]!="\""){
							formattedInput = mygis.Utilities.format("\"{0}\"",fieldValue.value);
						}else{
							formattedInput=fieldValue.value;
						}
						if (checkstring.substr(checkstring.length-2)=="%s"){
							formattedField=checkstring.split("%")[0];
						}else{
							formattedField=checkstring;
						}

						panelQW += mygis.Utilities.format("#{0}#{1}#{2}",
								formattedField,
								fieldOp.options[fieldOp.selectedIndex].value,
								formattedInput
								);
					}
				});
				if (atLeastOneWhere){
					panelText += " "+whereText;

					panelQ += panelQW;
				}
			}
			if (panelText){
				if (resultText){
					resultText += "<br />";
					resultText += "<span class='sqlKeyword'>";
					resultText += strings.QBuilder.keywordALSO;	//"ALSO";
					resultText += "</span>";
					resultText += "<br />";

					qUrl += "$";
				}
				resultText += panelText;
				qUrl += panelQ;
				queries.push(panelQ);
			}
		});
		if (resultText){
			document.getElementById("criteriaURL").value=qUrl;
			$("#critSearchDescription").html(resultText);
			//mygis.Query.highlightAll(queries);	//BUG WITH STRING VALUES
		}
	},

	/**
		Handler for the row selection in grids (#infoAnalysis)
		Used to only select a single row.

		@method dbResultsSelect
		@param {Element} The calling element
	**/
	dbResultsSelect: function(element){
		var tab=$(element).parent().parent().parent();
		var grid=$(tab.find(".jqx-grid")[0]);
		var alreadySelected = grid.jqxGrid('selectedrowindexes');
		var gridLength = grid.jqxGrid('source').records.length;
		var on = alreadySelected.length<gridLength;
		if (on){

			grid.unbind('rowclick');
			for (var i=0;i<gridLength;i++){
				if (alreadySelected.indexOf(i)==-1)
					grid.jqxGrid('selectrow',i);
			}
			grid.bind('rowclick',infoGridRowClick);
			$(element).html(strings.Info.btnSelectNone);
		}else{
			grid.jqxGrid('clearselection');
			$(element).html(strings.Info.btnSelectAll);
		}
	},

	/**
		Handler for the "Results on Map" button in #infoAnalysis.
		Highlights the grid's selected features on the map

		@method dbResultsOnMap
		@param {Element} the calling element
	**/
	dbResultsOnMap: function(element){
		var tab=$(element).parent().parent().parent();
		var grid=$(tab.find(".jqx-grid")[0]);
		var gridName = grid.data('gridTableName').trim();
		var alreadySelected = grid.jqxGrid('selectedrowindexes');
		var resultString="";
		gridName = mygis.Utilities.nameToUnderscore(gridName);
		//gridName = currentAppName+"_"+gridName;
		var count=0;
		resultString = gridName+"#";
		for (var i=0;i<alreadySelected.length;i++){
			count +=1;
			if (count>1){
				resultString +="%bOr#";
			}
			var item=grid.jqxGrid('getrowdata',alreadySelected[i]);
			resultString += mygis.Utilities.format("OID#EQ#{0}",item.OID);
		}
		if (resultString[resultString.length-1]!="#"){
			mygis.Query.highlightSelection([resultString]);
			$("#infoAnalysis").dialog('close');
		}else{
			displayError(strings.Info.err_AtLeastOne);
		}
	},

	/**
		Shows the "exportMapAs" dialog

		@method showExportMap
		@param {Element} elem
	**/
	showExportMap: function(elem){
		$("#exportMapAs").dialog({width: 450,resizable: false});
	},


	/**
		Checks the response after saving and either displays an error message or refresh the layer control.

		@method saveDigiResults
		@param {Object} The response received
	**/
	saveDigiResults: function(response){
		var responseParts =response.split("$");
		var responseType = responseParts[0];
		var responseMessage = responseParts[1];
		switch (responseType)
		{
			case "success":
				displaySuccess(responseMessage);
				mygis.UI.clearUnsavedLayer(layerCurrentEditing);
				digimap.layers[1].redraw(true);
				mygis.UI.activateControl('drag');
				mygis.Utilities.nudgeMap();
				if (Sys.Services.AuthenticationService.get_isLoggedIn()){
					mygis.User.Hooks.loadUserLayerRights();
				};
				break;
			case "error":
				displayError(responseMessage);
				break;
		}

	},

	/**
		Gets the current map's scale and applies it to an input contained in the same "parent" as the calling element.

		@method getMgScale
		@param {Element} element The calling element
	**/
	getMgScale: function(element){
		var currentScale = Math.round(digimap.getScale());
		var container=$(element).parent();
		container.find("input")[0].value=mygis.Utilities.addCommas(currentScale);
	},

	/**
	 * Resets the loading feedback div
	 * @method resetLoadFeedback
	 */
	resetLoadFeedback: function(){
		$("#mygis_loadFeedback").empty();
	},

	/**
	 * Appends text to the loading feedback div
	 * @method feedback
	 * @param {String} text The text to append
	 */
	feedback: function(text,error){
		var elem = $(mygis.Utilities.format("<p>{0}</p>",text));
		var feedCont = $("#mygis_loadFeedback");
		var feedChildren = feedCont.children();
		var completed = error?"cross":"checked";
		if (feedChildren.length>0){
			$(feedChildren[feedChildren.length-1]).attr("class",completed);
		}
		feedCont.append(elem);
		feedCont.scrollTo(elem);


	},

	/**
	 * Toggles the actively displayed list
	 * @method toggleActiveList
	 * @param {Integer} index The triggering tab index
	 */
	toggleActiveList: function(index){
		if (index!=0){
			$.each($("#sidePanel .subPanel"),function(i,v){
				v.ex_RemoveClassName("active");
			});
		}
		switch (index){
			case internalConfig.mapTabIndex:
				$("#mapsAnalysis")[0].ex_AddClassName("active");
				$("#mapsList").jqxListBox('width',243);
				$("#mapsList").jqxListBox('width',244);
				break;
			case internalConfig.layerTabIndex:
				$("#layersAnalysis")[0].ex_AddClassName("active");
				break;
			case internalConfig.searchTabIndex:
				$("#objectsAnalysis")[0].ex_AddClassName("active");
				break;
		}
		fixLayerList();
	},

	/**
	 * Toggles the available buttons for layer list, according to selection
	 * @method toggleLayerAvailableActions
	 */
	toggleLayerAvailableActions: function(){
		var layerlist=$('#layersList');
		var selection = layerlist.jqxGrid('getselectedrowindexes');
		mygis.UI.resetLayerAvailableActions();
		if (selection.length>1){
			document.getElementById("btnLayer_Remove").ex_RemoveClassName("disabled");
		}else if(selection.length==1){
			document.getElementById("btnLayer_Remove").ex_RemoveClassName("disabled");
			document.getElementById("btnLayer_Up").ex_RemoveClassName("disabled");
			document.getElementById("btnLayer_Down").ex_RemoveClassName("disabled");
			document.getElementById("btnLayer_ZoomFull").ex_RemoveClassName("disabled");
			document.getElementById("btnLayer_ViewMetaData").ex_RemoveClassName("disabled");
			document.getElementById("btnLayer_EditStyle").ex_RemoveClassName("disabled");
		}
	},

	/**
	 * Resets the layer available actions to their initial state
	 * @method resetLayerAvailableActions
	 */
	resetLayerAvailableActions: function(){
		var hasRemoved = layerRemovedSource.length>0;
		if (!Sys.Services.AuthenticationService.get_isLoggedIn()){
			document.getElementById("btnLayer_New").ex_AddClassName("disabled");
		}else{
			document.getElementById("btnLayer_New").ex_RemoveClassName("disabled");
		}
		if (!hasRemoved){
			document.getElementById("btnLayer_Add").ex_AddClassName("disabled");
		}else{
			document.getElementById("btnLayer_Add").ex_RemoveClassName("disabled");
		}
		document.getElementById("btnLayer_Up").ex_AddClassName("disabled");
		document.getElementById("btnLayer_Down").ex_AddClassName("disabled");
		document.getElementById("btnLayer_Remove").ex_AddClassName("disabled");
		document.getElementById("btnLayer_ZoomFull").ex_AddClassName("disabled");
		document.getElementById("btnLayer_ViewMetaData").ex_AddClassName("disabled");
		document.getElementById("btnLayer_EditStyle").ex_AddClassName("disabled");
	},

	/**
	 * Toggles the available buttons for search list, according to selection
	 * @method toggleSearchAvailableActions
	 */
	toggleSearchAvailableActions: function(){
		var searchList=$('#infoLeftList');
		mygis.UI.resetSearchAvailableActions();
		var item = searchList.jqxListBox('getSelectedItem');
		if (item){
			document.getElementById("btnPlaySearch").ex_RemoveClassName("disabled");
			document.getElementById("btnRemoveSearch").ex_RemoveClassName("disabled");
		}
	},

	/**
	 * Resets the search available actions to their initial state
	 * @method resetSearchAvailableActions
	 */
	resetSearchAvailableActions: function(){
		document.getElementById("btnPlaySearch").ex_AddClassName("disabled");
		document.getElementById("btnRemoveSearch").ex_AddClassName("disabled");
	}
};


// END of mygis.UI

/**
	Contains methods to handle direct DB searches.

	@class mygis.Query
	@static
**/
mygis.Query = {

	/**
		Highlights the given layer based on the queryArray

		@method highlightSelection
		@param {Array} queryArray An array containing the encoded "query" for the features to search.
		@param {String} [manualSLD] If specified, applies that SLD instead of the query one.
	**/
	highlightSelection: function(queryArray,manualSLD){
		var sld;
		if (manualSLD){
			//sld = '<?xml version="1.0" encoding="utf-8"?>'+manualSLD.replace(/#/g,"%23");
			sld = '<?xml version="1.0" encoding="utf-8"?>'+manualSLD;
		}else{
			sld = '<?xml version="1.0" encoding="utf-8"?>'+mygis.Query.getSLDBody(queryArray).replace(/#/g,"%23");
		}
		sld= sld.replace(/Wingdings%23/g,"Wingdings#");
		var wms_url=config.mapserver+"wms";
		if (!selectionWMSLayer){
			selectionWMSLayer= new OpenLayers.Layer.WMS(
						"HighlightWMS",
						wms_url,
						{
							//map:currentMapPath,
							'format':'png',
							EXCEPTIONS:'BLANK',
							//CRS:'EPSG:4326',//CRS:'EPSG:4121',
							FORMAT:'image/png',
							transparent: true,
							sld_body: sld
						},
						{
							'visibility': true,
							'isBaseLayer': false,
							'alpha':true
							,singleTile:false,ratio: 1
						}
			);
			digimap.addLayer(selectionWMSLayer);
		}else{
			selectionWMSLayer.mergeNewParams({
				sld_body: sld
			});
		}
		if (!selectionFlasher.timer && !manualSLD &&selectionWMSLayer){
			selectionFlasher.count=0;
			selectionFlasher.timer = setInterval(function(){
				selectionFlasher.count+=1;
				if (selectionFlasher.count>10){
					clearInterval(selectionFlasher.timer);
					selectionFlasher.timer=null;
				}else{
					selectionWMSLayer.setVisibility(!selectionWMSLayer.getVisibility());
				}

			},500);
		}

	},
	
	queryWithinWindow: function(){
		$("#layerWithinSelectionListCont").toggle();
		try{
			$("#statsAnalysis").dialog('close');
		}catch(err){}
	},
	
	getLayersWithin: function(){
		var results=[];
		var items=$("#layerWithinSelectionList").jqxListBox('getCheckedItems');
		$.each(items,function(x,item){
			results.push(item.value);
		});
		return results;
	},
	
	getRowPK: function(row){
		var retvalue=null;
		$.each(row.Cells,function(x,cell){
			if (cell.ColumnName=="OID"){
				retvalue=cell.Value;
			}
		});
		return retvalue;
	},
	
	getLayersOutside: function(){
		var results=[];
		var dataSource=$("#queryExpanders").data("querySource").originalItem.linkedResults;
		var isMapQuery=dataSource.layers;
		if (isMapQuery){	//it's a map query
			$.each(dataSource.layers,function(x,lname){
				var ins={
					layer: lname,
					ids: []
				}
				$.each(dataSource.features,function(y,feat){
					var featLayer= feat.fid.split(".")[0];
					if (lname==featLayer){
						ins.ids.push(feat.data.OID);
					}
				});
				results.push(ins);
			});
		}else{
			var ins;
			for (var i = 0; i < dataSource.length; i++) {
				var item = dataSource[i];
				ins={
					layer: item.TableName,
					ids: []
				}
				$.each(item.Rows,function(x, row){
					ins.ids.push(mygis.Query.getRowPK(row));
				});
				results.push(ins);
			}
		}
		return results;
	},
	
	queryWithinExecute: function(){
		
		var data = {
			layersFrom: mygis.Query.getLayersOutside(),
			layersSearch: mygis.Query.getLayersWithin()
		};
		var myurl = config.mgreq+"?qtype=QueryWithin&qContents=";
		var myDate = new Date().toString("hh:mm:ss");
		var friendlyName = strings.QBuilder.friendlyNameDef+myDate;
		$("#layerWithinSelectionListCont").hide();
		mygis.Utilities.blockUI();
		$.ajax({
			type:"POST",
			url: myurl,
			data: JSON.stringify(data),
			success: function(data){
				mygis.UI.dbQueryResults(data,friendlyName,true);
			}
		});
	},
	
	queryStatsWindow: function(){
		if ($("#statsAnalysis").children().length==0){
			loadFragment("statsAnalysis",mygis.Query.queryStatsShow);
		}else{
			mygis.Query.queryStatsShow(true);
		}
		
	},
	
	queryStatsPrint: function(){
		var model = new mygis.Printing.models.printModel();
		$.each($("#statsResultCont .result"),function(x,result){
			var tableCells =  $(result).find("table tr td");
			var newRow={
				header: $($(result).find(".fieldName")[0]).html(),
				subheader: $($(result).find(".fieldName.sub")[0]).html(),
				sumValue: $(tableCells[0]).html(),
				minValue: $(tableCells[1]).html(),
				maxValue: $(tableCells[2]).html(),
				avgValue: $(tableCells[3]).html()
			}
			model.results.push(newRow);
		});
		mygis.Printing.printWindow('stats',model);
	},
	
	queryStatsShow: function(secondRun){
		$("#layerWithinSelectionListCont").hide();
		var target = $("#panel3Out");
		$("#statsAnalysis").dialog({
			modal: false,
			resizable: false,
			width: 900,
			height: 510, 
			position: {
				my: 'right top',
				at: 'left top',
				of: target
			},
			dialogClass: 'queryStatsWindowPopup',
			title: strings.QBuilder.statsTitle,
			open: function(){
				$('#statsCont').layout({
					south__size: 430
					,south__resizable: false
					,south__closable:false
					,applyDefaultStyles: true
				});
				mygis.Query.statsActions=$('#statsActions').layout({
					east__size:      900
					,east__resizable: false
					,east__closable:false
					,east__initHidden: true
					,	spacing_open: 0
					,	spacing_closed: 0
				});
				$('#statsCriteria').layout({
					east__size:      430
					,east__resizable: false
					,east__closable:false
					,	spacing_open: 0
					,	spacing_closed: 0
				});
				mygis.Query.statsBackToSelection();
				try{
					$("#statsFieldList").jqxListBox('clear');
				}catch(err){}
				mygis.Query.buildStatSource();
			}
		});
	},
	
	buildStatSource: function(){
		var dataSource=$("#queryExpanders").data("querySource").originalItem.linkedResults;
		var source=new Array();
		var isMapQuery=dataSource.layers;
		if (isMapQuery){	//it's a map query
			for (var ind in dataSource.layers){
				try{
				var row = {};
				var layer = dataSource.layers[ind];
				row["name"]=layer;
				row["value"]=mygis.Utilities.getFriendlyName(layer);
				row["ids"]=[];
				var count=0;
				var titles="";
				$.each(dataSource.features,function(y,feat){
					var featLayer= feat.fid.split(".")[0];
					if (layer==featLayer){
						var firstField=$.keys(feat.data)[0];
						if (titles){
							titles+=", ";
						}
						titles+=feat.data[firstField];
						row.ids.push(layer+"."+feat.data.OID);
						count++;
					}
				});
				//row["flavorName"]=mygis.Utilities.getFriendlyName(layer)+" ("+count+")";
				row["flavorName"]="<b>"+mygis.Utilities.getFriendlyName(layer)+"</b>"+" ("+titles+")";
				if (row.ids.length>0){
					source.push(row);
				}
				}catch(err){}
			}
		}else{	//it's a db query
			for (var i = 0; i < dataSource.length; i++) {
				try{
				var item = dataSource[i];
				if (item.Rows.length>0){
					var row = {};
					row["name"]=item.TableName;
					row["value"]=mygis.Utilities.getFriendlyName(item.TableName);
					row["ids"]=[];
					row["flavorName"]="<b>"+mygis.Utilities.getFriendlyName(item.TableName)+"</b>"+" ("+item.Rows.length+")";
					$.each(item.Rows,function(x, myrow){
						row.ids.push(item.TableName+"."+mygis.Query.getRowPK(myrow));
					});
					source.push(row);
				}
				}catch(err){}
			}
		}
		var listbox=$("#statsLayerList");
		listbox.jqxListBox({
			width: '100%', 
			source: source, 
			checkboxes: true, 
			height: '100%'
		});
		listbox.on('checkChange',function(event){
			var args=event.args;
			mygis.Query.statsClearFields();
			var fieldList={};
			var checkedItems = listbox.jqxListBox('getCheckedItems');
			var firstItem=true;
			var dataSource = $("#queryExpanders").data("querySource").originalItem.linkedResults;
			var isMapQuery=dataSource.layers;
			if (isMapQuery){
				var layers="";
				$.each(checkedItems,function(x,item){
					if (layers.length>0){
						layers+=","
					}
					layers+=item.originalItem.name;
				});
				if (layers.length>0){
					OpenLayers.Request.GET({
						url: config.mapserver+"wfs?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName="+layers,
						success: function(data){
							var results = mygis.Query.getWFSAttributes(data);
							var firstItem=true;
							$.each(results,function(x,item){
								var newList=[];
								var result=this;
								$.each(item.fields,function(y,field){
									if (!mygis.Utilities.isUnwantedField(field.Name)){
										var compatibleType="";
										var wanted=false;
										switch (field.DataType){
											case "int":
												compatibleType="System.Int32";
												wanted=true;
												break;
											case "double":
												compatibleType="System.Double";
												wanted=true;
												break;
											case "string":
												compatibleType="System.String";
												break;
										}
										if (firstItem && wanted){
											if (fieldList[field.Name]){
												fieldList[field.Name].layerName+="#"+result.layerName;
												console.log(field.Name+' relogged, layerName: '+fieldList[field.Name].layerName);
											}else{
												fieldList[field.Name]={
													"name":field.Name,
													"dataType": compatibleType,
													"layerName": result.layerName
												}
												console.log(field.Name+' logged, layerName: '+fieldList[field.Name].layerName);
											}
											
										}
									}
									
								});
							});
							mygis.Query.createStatFieldList(fieldList);
						}
					});
				}
			}else{	//it's a DB query
				$.each(checkedItems,function(x,item){
					$.each(dataSource,function(y,sourceItem){
						if (sourceItem.TableName==item.originalItem.name){
							var newList=[];
							$.each(sourceItem.Fields,function(z,field){
							
								var wanted = false;
								switch(field.DataType){
									case "System.Int32":
									case "System.Double":
										wanted=true;
										break;
								}
								if (firstItem && wanted){
									if (fieldList[field.Name]){
										fieldList[field.Name].layerName+="#"+item.originalItem.name;
									}else{
										fieldList[field.Name]={
											"name":field.Name,
											"dataType": field.DataType,
											"layerName": item.originalItem.name
										}
									}
								} 
							});
						}
					});
					//firstItem=false;
				});
				mygis.Query.createStatFieldList(fieldList);
			}
		});
		
	},
	
	createStatFieldList: function(fieldList){
		var fieldArray=[];
		$.each(fieldList,function(x,field){
			if(!mygis.Utilities.isUnwantedField(field.name)){
				fieldArray.push({
					"name":field.name,
					"value":field.name,
					"fieldType":field.dataType,
					"layerName":field.layerName
				});
			}
		});
		var fieldBox=$("#statsFieldList");
		try{fieldBox.jqxListBox('clear');}catch(err){}
		fieldBox.jqxListBox({
			width: '100%', 
			source: fieldArray, 
			checkboxes: true, 
			height: '100%',
			renderer: function (index, label, value) {
				try{
				var mySource = this.source;
				var dataRecord = mySource[index];
				var humanType="";
				switch (dataRecord.fieldType){
					case "System.String":
						humanType=strings.QBuilder.datatypeText;
						break;
					case "System.Int32":
					case "System.Double":
						humanType=strings.QBuilder.datatypeNumeric;
						break;
				}
				var output="<div class='fieldName'>"+value+"</div>";
				//output+="<div class='fieldType'>"+humanType+" ("+dataRecord.fieldType+")"+"</div>";
				return output;
				}catch(err){}
			}
		});
		fieldBox.on('checkChange',function(event){
			var checkedItems=$("#statsFieldList").jqxListBox('getCheckedItems');
			if (checkedItems.length>0){
				$("#statsCalculate").removeClass("disabled");
			}else{
				$("#statsCalculate").addClass("disabled");
			}
		});
	},
	
	statsCalculate: function(){
		var data={
			layers: [],
			fields: [],
			ids: []
		};
		var checkedItems = $("#statsLayerList").jqxListBox('getCheckedItems');
		$.each(checkedItems,function(x,item){
			data.layers.push(item.originalItem.name);
			$.each(item.originalItem.ids,function(y,id){
				data.ids.push(id);
			});
			
		});
		var checkedFields = $("#statsFieldList").jqxListBox('getCheckedItems');
		$.each(checkedFields,function(x,item){
			data.fields.push({
				Name:item.originalItem.name,
				DataType:item.originalItem.fieldType,
				layerName: item.originalItem.layerName
			});
		});
		var customUrl = config.mgreq+"?qtype=GetQueryStats&qContents=";
		$("#statsResultCont").die().empty();
		$.ajax({
			type:"POST",
			data: JSON.stringify(data),
			url: customUrl,
			success: function(data){
				var results=eval(data);
				$.each(results,function(x,result){
					var resultSet = $("<div class='result' />");
					var cell = $("<div class='fieldName' />");
					var fieldItem = $("#statsFieldList").jqxListBox('getItemByValue',result.fieldName);
					var flavorText="";
					$.each($("#statsLayerList").jqxListBox('getItems'),function(z,item){
						if (fieldItem.originalItem.layerName.indexOf(item.originalItem.name)>-1){
							if (flavorText){
								flavorText += "<br />";
							}
							flavorText += item.originalItem.flavorName;
						}
					});
					var str=strings.QBuilder.statsFieldNameBefore+" '"+result.fieldName+"' "+strings.QBuilder.statsFieldNameAfter+":";
					cell.append(str);
					var cell2=$("<div class='fieldName sub' />");
					//cell2.append(strings.QBuilder.statResultIn+" "+flavorText);
					cell2.append(flavorText);
					resultSet.append(cell);
					resultSet.append(cell2);
					var table=$("<table />");
					var header= $("<tr />");
					table.append(header);
					//header.append($("<td class='emptyColHeader' />"));
					$.each(result.stats,function(y,stat){
						var friendlyname="";
						switch (stat.statName){
							case "fieldSum":
								friendlyname = strings.QBuilder.statSum;
								break;
							case "fieldMin":
								friendlyname = strings.QBuilder.statMin;
								break;
							case "fieldMax":
								friendlyname = strings.QBuilder.statMax;
								break;
							case "fieldAvg":
								friendlyname = strings.QBuilder.statAvg;
								break;
							case "fieldCount":
								friendlyname = strings.QBuilder.statCount;
								break;
						}
						//var cell=$("<td class='colHeader'>"+friendlyname+"</td>");
						var cell=$("<td class=''><span class='fieldLabel'>"+friendlyname+"</span><span class='fieldValue'>"+mygis.Utilities.addCommas(stat.statValue)+"</span></td>");
						header.append(cell);
					});
					/*
					var row=$("<tr />");
					$.each(result.stats,function(y,stat){
						var cell = $("<td />");
						cell.append(stat.statValue);
						row.append(cell);
						
					});
					table.append(row);
					*/
					resultSet.append(table);
					$("#statsResultCont").append(resultSet);
					
				});
				mygis.Query.statsDisplayResults();
			}
		});
	},
	
	statsClearFields: function(){
		//$("#statsFieldList").die().empty();
		$("#statsResultCont").die().empty();
	},
	
	statsDisplayResults: function(){
		$("#statsPrint").show();
		$("#statsBack").show();
		$("#statsCalculate").hide();
		$("#statsCriteria").hide();
		mygis.Query.statsActions.show('east');
	},
	
	statsBackToSelection: function(){
		$("#statsCriteria").show();
		$("#statsPrint").hide();
		$("#statsBack").hide();
		$("#statsCalculate").show();
		mygis.Query.statsActions.hide('east');
		
	},
	
	
	/**
	 * Retrieves fields from a WFS DescribeFeatureType request
	 * @method getWFSAttributes
	*/
	getWFSAttributes: function(request){
		var format = new OpenLayers.Format.WFSDescribeFeatureType();
		var resp = format.read(request.responseText);
		var featureTypes = resp.featureTypes;
		var results=[];
		for (var i = 0; i < featureTypes.length; i++) {
			var result={
				layerName: featureTypes[i].typeName,
				fields:[]
			};
			for (var j = 0; j < featureTypes[i].properties.length; j++) {
				var field={
					Name: featureTypes[i].properties[j].name,
					DataType: featureTypes[i].properties[j].localType
				};
				result.fields.push(field);
			}
			results.push(result);
		}
		return results;
	},
	

	/**
		Highlights the given layer based on the queryArray

		@method highlightAll
		@param {Array} queryArray An array containing the encoded "query" for the features to search.

	**/
	highlightAll: function (queryArray){
		var sld = '<?xml version="1.0" encoding="utf-8"?>'+mygis.Query.getSLDBody(queryArray).replace(/#/g,"%23");
		var wms_url=config.mapserver+"wms";
		var addFlag = false;
		if (!wmsHighlight){
			addFlag=true;

			wmsHighlight= new OpenLayers.Layer.WMS(
						"HighlightWMS",
						wms_url,
						{
							//map:currentMapPath,
							//'layers': 'chios_MUNICIPALITIES',	//mygis.Utilities.getVisibleLayerString(currentAppName),
							'format':'png',
							EXCEPTIONS:'BLANK',
							//CRS:'EPSG:4326',//CRS:'EPSG:4121',
							FORMAT:'image/png',
							transparent: true,
							sld_body: sld
						},
						{
							'visibility': true,
							'isBaseLayer': false,
							'alpha':true
							,singleTile:false,ratio: 1
						}
			);
			criteriaMap.addLayers([wmsHighlight]);
		}else{
			wmsHighlight.mergeNewParams({
				sld_body: sld
			});
		}
	},

	/**
		Creates an sld string based on multiple query strings
		@method getSLDBody
		@param {Array} queryArray The array containing query strings
		@return {String} The sld for the query
	**/
	getSLDBody: function(queryArray){
		var sld ={
			version: "1.0.0",
			namedLayers: new Object()
		};
		for (var i=0;i<queryArray.length;i++){
			var getSingleSld = mygis.Query.getTableFilter(queryArray[i]);
			sld.namedLayers[getSingleSld.name]=getSingleSld;

		}
		var frmt = new OpenLayers.Format.SLD();
		return frmt.write(sld);
	},


	/**
		Combines an array of OpenLayers.Filter to a single filter

		@method getCombinedFilter
		@param {String} combination How to combine the filters.
				Valid values:
					-bAnd
					-bOr
					-bNot
		@param {Array} filters Array of OpenLayers.Filter
		@return {Object} The combined filter.
	**/
	getCombinedFilter: function(combination,filters){
		var retvalue;
		var combType;
		switch (combination)
		{
			case "bAnd":
				combType = OpenLayers.Filter.Logical.AND;
				break;
			case "bOr":
				combType = OpenLayers.Filter.Logical.OR;
				break;
			case "bNot":
				combType = OpenLayers.Filter.Logical.NOT;
				break;
		}
		retvalue = new OpenLayers.Filter.Logical({
			type: combType,
			filters: filters
		});
		return retvalue;
	},

	/**
		Creates an SLD style to apply for the given layer

		@method getTableFilter
		@param {String} querystring Sample querystring: TABLE_1 # FIELD_1 # OP_1 # VALUE % Q_OP # FIELD_2 # OP_2 # VALUE_2
		@return {Object} An SLD style to apply for the given layer
	**/
	getTableFilter: function(querystring){
		var retvalue;
		var tableName;
		var conditions = querystring.split("%");
		var filters_AND = [];
		var OR_FLAG=false;
		//var filters_OR = [];
		var finalFilters = [];
		var singleFilter;
		var single;
		for (var i=0;i<conditions.length;i++){
			var qParts=conditions[i].split("#");
			var mod_op;
			var prop,op,val;
			if (i==0){
				tableName=qParts[0];
			}else{
				mod_op = qParts[0];
			}

			prop = qParts[1];
			op = qParts[2];
			val = qParts[3];
			if (val){
				if (val.indexOf("\\")==0){
					val=val.substring(3,val.length-6);
				}
			}
			if (prop!=null&&op!=null&&val!=null){
				singleFilter = mygis.Drawing.Styling.getSLDFilter(op,prop,val);
			}else{
				singleFilter = null;
			}
			if (i==0){

				if (mygis.Query.peek(conditions,i+1)=="bOr"){
					finalFilters.push(singleFilter);
				}else{
					filters_AND.push(singleFilter);
				}
			}else{
				switch(mod_op){
					case "bNot":
						var negFilter = mygis.Query.getCombinedFilter(mod_op,[singleFilter]);
						filters_AND.push(negFilter);
						break;
					case "bAnd":
						filters_AND.push(singleFilter);
						break;
					case "bOr":
						if (filters_AND.length>0){
							finalFilters.push(mygis.Query.getCombinedFilter("bAnd",filters_AND));
						}
						if (i==conditions.length-1 || mygis.Query.peek(conditions,i+1)=="bOr"){
							finalFilters.push(singleFilter);
						}else{
							filters_AND=[];
							filters_AND.push(singleFilter);
						}
						OR_FLAG = true;
						break;

				}

			}

		}
		if (conditions.length==1){
			if (singleFilter){
				singleRule = new OpenLayers.Rule({
					symbolizer: mygis.Query.getSLDSymbolizer(),
					filter: singleFilter
				});
			}else{
				singleRule = new OpenLayers.Rule({
					symbolizer: mygis.Query.getSLDSymbolizer()
				});
			}
		}else{
			if (filters_AND.length>0 && OR_FLAG){
				finalFilters.push(mygis.Query.getCombinedFilter("bAnd",filters_AND));
			}
			var resultFilter = OR_FLAG?mygis.Query.getCombinedFilter("bOr",finalFilters):mygis.Query.getCombinedFilter("bAnd",filters_AND);
			singleRule = new OpenLayers.Rule({
				symbolizer: mygis.Query.getSLDSymbolizer(),
				filter: resultFilter
			});
		}
		var namedLayer = {
			name: tableName,
			userStyles: []
		};
		namedLayer.userStyles[0]={
			rules: []
		};
		namedLayer.userStyles[0].rules.push(singleRule);
		retvalue = namedLayer;
		return retvalue;
	},

	/**
		Creates default sld-style properties for Point, Line, Polygon

		@method getSLDSymbolizer
		@return {Object} An object containing the styles.
	**/
	getSLDSymbolizer: function(){
		var retvalue = new Object();
		//retvalue["Point"]=mygis.Drawing.Styling.getOLStyle('selectPoint');
		//retvalue["Line"]=mygis.Drawing.Styling.getOLStyle('selectLine');

		//retvalue["Polygon"]=mygis.Drawing.Styling.getOLStyle('selectPolygon');
		retvalue['Polygon']= {fillColor: '#FF0000', stroke: false},
        retvalue['Line']= {strokeColor: '#FF0000', strokeWidth: 2},
        retvalue['Point']= {graphicName: 'square', fillColor: '#FF0000', pointRadius: 5}
		return retvalue;
	},

	/**
		Used to check in an array of conditions (Containing #-separated strings) if the specified index exists.

		@method peek
		@param {Array} conditions The array to check
		@param {Integer} The index to check
		@return {String} Either the condition at the specified index, or null if none exist.
	**/
	peek: function(conditions,index){
		try{
			var items = conditions[index].split("#");
			return items[0];
		}catch(err){return "";}
	},

	/**
		Gets the columns for a given layer.

		@method getLayerDetails
		@param {Integer} index The layer index to get
		@param {String} forID Currently only accepting "editableInfo"
	**/
	getLayerDetails: function(index,forID){

		var layername = layerSource.records[index].layerTABLE;
		$.ajax({
			type: "GET",
			url: config.mgreq+"?qtype=GetLayerFields&qContents="+escape(layername.replace(/ /g,"_")),
			success: function(data){
				var datacolumns = mygis.Query.resultLayerDetails(data);
				if (forID=="editableInfo"){
					var firstField=false;
					var fieldCount=0;
					var section1 = $("#editableInfo").find(".infoFields");
					var section2 = $("#editableInfo").find(".infoImages");
					var section3 = $("#editableInfo").find(".infoFiles ");
					var section4 = $("#editableInfo").find(".infoLinks ");
					var DBFields=$("<div />");
					var DBImages=$("<div />");
					var DBFiles=$("<div />");
					var DBLinks=$("<div />");

					var imageFields=0;
					var fileFields = 0;
					var linkFields = 0;

					section1.empty();
					section2.empty();
					section3.empty();
					section4.empty();
					$.each(datacolumns,function(i,v){
						var skipField=false;
						if (v.name.endsWith("__")){
							skipField=true;
							var nameParts = v.name.substring(2).split("_");
							var type=nameParts[0];
							switch (type){
								case 'IMG':
									imageFields +=1;
									break;
								case 'LNK':
									linkFields +=1;
									break;
								case 'FILE':
									fileFields +=1;
									break;
							}
						}
						if (v.name=="Geometry" || v.name=="OID" || v.name=="Center_X" || v.name=="Center_Y")skipField=true;
						if (!skipField){

							var newLine = $("<div />");
							var newHead = $("<span />");
							var newValue = $("<input type='text' />");
							newHead.html(v.name);
							newHead.addClass("featureHCell");
							newValue.addClass("featureVCell");
							newLine.append(newHead);
							newLine.append(newValue);
							DBFields.append(newLine);
							if (!firstField){
								firstField = true;
								//newValue.attr("disabled","disabled");
							}else{

							}
							fieldCount+=1;
						}
					});
					section1.append(DBFields);
					var existingImgTitle = mygis.Utilities.format("{0} {1} {2}", "Up to",imageFields,"image fields have already been created");
					var existingLinkTitle = mygis.Utilities.format("{0} {1} {2}", "Up to",linkFields,"link fields have already been created");
					var existingFileTitle = mygis.Utilities.format("{0} {1} {2}", "Up to",fileFields,"file fields have already been created");

					var imagePrompt=$("<div />").append(existingImgTitle);
					var linkPrompt=$("<div />").append(existingLinkTitle);
					var filePrompt=$("<div />").append(existingFileTitle);

					DBImages.append(imagePrompt);
					DBFiles.append(filePrompt);
					DBLinks.append(linkPrompt);

					var actionbar=$("<div class='uploadActionBar' />");
					var actionBtnAdd=$("<a href='#' class='addNew' onclick='displayError(\'Not authorized\');return false;' />");
					actionBtnAdd.html("Add new");

					for (var i=0;i<imageFields;i++){
						var newLine = $("<div />");
						var newHead = $("<span />");
						var newValue = $("<input type='file' accept='image/jpg,image/gif' />");
						newHead.html("Add image");
						newHead.addClass("featureHCell");
						newValue.addClass("featureVCell");
						newLine.append(newHead);
						newLine.append(newValue);
						//DBImages.append(newLine);
					}
					for (var i=0;i<linkFields;i++){
						var newLine = $("<div />");
						var newHead = $("<span />");
						var newValue = $("<input type='text' />");
						newHead.html("Add link");
						newHead.addClass("featureHCell");
						newValue.addClass("featureVCell");
						newLine.append(newHead);
						newLine.append(newValue);
						DBLinks.append(newLine);
					}
					for (var i=0;i<fileFields;i++){
						var newLine = $("<div />");
						var newHead = $("<span />");
						var newValue = $("<input type='file' accept='image/jpg,image/gif' />");
						newHead.html("Add image");
						newHead.addClass("featureHCell");
						newValue.addClass("featureVCell");
						newLine.append(newHead);
						newLine.append(newValue);
						//DBFiles.append(newLine);
					}
					/*
					var iframeUploader=$("<iframe />");
					iframeUploader.attr("src","/customUpload.aspx");
					iframeUploader.attr("height","256px");
					iframeUploader.attr("width","280px");
					DBImages.append(iframeUploader);
					*/
					section2.append(DBImages);
					section3.append(DBFiles);
					section4.append(DBLinks);
					section2.append(actionbar.clone());
					section3.append(actionbar.clone());
					section4.append(actionbar.clone());
				}
				if (forID=="editDigitize"){
					mygis.Drawing.Editing.fillDigiPopup(datacolumns,layername);
				}
			}
		});
	},

	/**
		Returns an array of the layer's columns

		@method resultLayerDetails
		@param {String} json data to parse
		@return {Array}
	**/
	resultLayerDetails: function(data){
		var datacolumns = {};//[];
		var row;
		var realResults = eval(data);
		$.each(realResults,function(index,value){
			row=new Object();
			row["name"]=value.fieldNAME;
			row["originalType"]=value.fieldTYPE;
			row["fieldLists"]=value.fieldLISTS;
			if (
				value.fieldTYPE.indexOf("char")>-1 ||
				value.fieldTYPE.indexOf("nchar")>-1 ||
				value.fieldTYPE.indexOf("varchar")>-1 ||
				value.fieldTYPE.indexOf("nvarchar")>-1 ||
				value.fieldTYPE.indexOf("Text")>-1)
			{
			row["value"]=value.fieldNAME+"%s";
			}
			else{
				row["value"]=value.fieldNAME;
			}


			datacolumns[value.fieldNAME]=row;//datacolumns.push(row);
		});
		return datacolumns;

	},
	
	getInfoStructure: function(id){
		var container = $([
		"<div id='"+id+"' class='infoCont'>",
		"	<div class='layoutContainer'>", 
		"		<div class='ui-layout-north'>",
		"			<div class='mainImageCont'></div>",
        "			<a href='#' class='showInfoImagesBtn'></a>",
		"		</div>",
		"		<div class='ui-layout-center'>",
		"			<h3 class='infoImagesLabel'>"+strings.Info.section2+"</h3>",
		"			<div class='popupimageContainer' style='display:none'></div>",
		"			<h3 class='infoFieldsLabel'>"+strings.Info.section1+"</h3>",
		"			<div class='popupFieldContainer'></div>",
		"			<h3 class='infoFilesLabel'>"+strings.Info.section3+"</h3>",
		"			<div class='popupFileContainer' style='display:none'></div>",
		"		</div>",
		"		<div class='ui-layout-east'></div>",
		"	</div>",
		"</div>"
		].join("\n"));
		return container;
	},
	
	/**
	  *	Displays data in a "popup info" window
	  *	@method popupInfo
	  * @param results (Array)
	  * @param layername (String)
	  * @param newWindow (Boolean): whether this is an empty window (blank object)
	  **/
	popupInfo: function(results,layername,newWindow){
		var that=results;
		//loadFragment("infoDetachContWrapper2",function(){
			var oldResults;
			var id = results.OID;
			oldResults= jQuery.extend({}, that);
			if (newWindow){
				results={};
				$.each(oldResults,function(i,v){
					results[i]="";
				});
				results.OID=-1;
				id=results.OID;
			}else{
				var layerID=mygis.Utilities.mggetLayerID(layername);
				var datacolumns = mygis.Query.resultLayerDetails(internalMemory.layerFields[layerID]);
				oldResults = jQuery.extend(true,oldResults,datacolumns);
				var objectID=results.OID;
				if (mygis.Drawing.Exporting.checkRights(objectID,layerID)){
					var transformedResults=jQuery.extend({},oldResults);
					$.each(transformedResults,function(i,v){
						if (results[i]){
							transformedResults[i]=results[i];
						}
					});
					results=jQuery.extend({},transformedResults);
				}
			}
			
			if ($("#detached"+layername+"_"+id).length>0){
				$("#detached"+layername+"_"+id).dialogExtend("restore");
			}else{
				var container = mygis.Query.getInfoStructure("detached"+layername+"_"+id);	//$("#infoDetachContWrapper2");
				var fieldsCont = container.find(".popupFieldContainer");
				var imagesCont = container.find(".popupimageContainer");
				var filesCont = container.find(".popupFileContainer");
				
				fieldsCont.empty();
				imagesCont.empty();
				filesCont.empty();
				//$(".mainImageCont").attr("style","");
				fieldsCont.append(mygis.Query.buildInfoFields(results,layername));
				console.log(location.toString());
				fieldsCont.append($([
				"<div class='addthis_toolbox addthis_default_style' data-url='"+location.toString()+"'>",
				"	<a class='addthis_button_facebook_like'  fb:like:layout='button_count'></a>",
				"	<a class='addthis_button_twitter' style='cursor:pointer'></a>",
				"	<a class='addthis_button_email' style='cursor:pointer'></a>",
				"</div>"
				].join("\n")));
				var fid = layername+"."+id;
				var images=[];
				var files=[];
				if (!newWindow){
					images = mygis.UI.getObjectGridSource('Images',fid).records;//mygis.UI.objectImageGrid(id,layername,'Images');
					files = mygis.UI.getObjectGridSource('Files',fid).records; //mygis.UI.objectImageGrid(id,layername,'Files');
				}
				var windowTitle = results[$.keys(results)[0]];
				if (windowTitle==-1 || undefined==windowTitle || windowTitle==""){
					windowTitle=strings.Editing.newObjTitle
				}
				var params={
					hasImages: images.length>0,
					hasFiles: files.length>0,
					title: windowTitle +"<div class='dialogSub'>"+strings.Info.infoWindowSubPart1+mygis.Utilities.getFriendlyName(layername)+strings.Info.infoWindowSubPart2+"</div>",
					layer: layername,
					oid: id,
					newWindow: newWindow,
					fieldInfo: oldResults
				};
				
				if (images.length>0){
					var src=mygis.Utilities.format(
						"url('{0}GetImage.ashx?qType=userFile&qContents={1}&qSize=430')",
						config.folderPath,
						images[0].imageID);
					container.find(".mainImageCont").css("background-image",src);
					container.find(".showInfoImagesBtn").html(strings.Info.infoImagesBtn +"("+images.length+")");
					imagesCont.append(mygis.UI.getInfoImageGrid(images,fid));
					imagesCont.data("images",images);
				}
				if (files.length>0){
					filesCont.append(mygis.UI.getInfoFileGrid(files,fid));
					filesCont.data("files",files);
				}
				
				
				mygis.Query.infoDetach(container,layername+"_"+id,params);
			}
			
		//},"#infoDetachContWrapper2");
	},
	
	/**
	  *	Used to display a preview of an image file (inside info popup)
	  *	@method infoImgPreview
	  **/
	infoImgPreview: function(params){
		var imageSource = params.src;
		var fullSource = imageSource.substring(0,imageSource.indexOf("&qSize"));
		var newImg = $("<img />");
		newImg.attr("src",fullSource);
		newImg.attr("class","imagePreviewer");
		var layout = $(params).closest(".layoutContainer");
		var container = layout.find(".ui-layout-east");
		var previewCont = $("<div class='imgPreview' />");
		previewCont.append(newImg);
		container.html(previewCont);
		var layoutObj=layout.parent().data('outerLayout');
		var dialog=layout.closest(".ui-dialog-content");
		try{
			layoutObj.hide('east');
		}catch(err){}
		var prevWidth=dialog.width();
		$("#"+dialog.attr("id")).dialog("option", "width", 938);
		layoutObj.resizeAll();
		layoutObj.sizePane('east',prevWidth-20);
		layoutObj.show("east");
	},
	
	infoFilePreview: function(params){
		var fileSrc= mygis.Utilities.format(config.mgreq+"?qtype=DownloadFile&qContents={0}",params.id);
		var layout = $(params.elem).closest(".layoutContainer");
		var container = layout.find(".ui-layout-east");
		var previewCont = $("<div class='imgPreview' />");
		//previewCont.append(newImg);
		container.html(previewCont);
		var layoutObj=layout.parent().data('outerLayout');
		var dialog=layout.closest(".ui-dialog-content");
		var prevWidth=dialog.width();
		var prevHeight=dialog.height();
		PDFJS.workerSrc=config.folderPath+"Scripts/lib/pdf.worker.js";
		PDFJS.getDocument(fileSrc).then(function(pdf){
			pdf.getPage(1).then(function(page) {
				var viewport = page.getViewport(0.5);
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				var renderContext = {
				  canvasContext: ctx,
				  viewport: viewport
				};

				page.render(renderContext).then(function(){
				//set to draw behind current content
				ctx.globalCompositeOperation = "destination-over";

				//set background color
				ctx.fillStyle = "#ffffff";

				//draw background / rect on entire canvas
				ctx.fillRect(0,0,canvas.width,canvas.height);
				var img = canvas.toDataURL();
				previewCont.html('<img class="imagePreviewer" src="'+img+'"/>');
				$("#"+dialog.attr("id")).dialog("option", "width", 938);
				layoutObj.resizeAll();
				layoutObj.sizePane('east',prevWidth-20);
				layoutObj.show("east");
				});
			});
		});
	},
	
	/**
	  * Returns only the map select data that match fid
	  * @method breakupMapData
	  * @remarks This is used because map select returns features, mixed up from all layers
	  **/
	breakupMapData: function(results,lname,fid){
		var features = results.features;
		var data = {};
		for (var j=0;j<features.length;j++){
			var f=features[j];
			if (f.fid==fid){
				data=f.data;
			}
		};
		return data;
	},
	
	/**
	  * Homogenizes the structure of "results" to be the same as the one from map select.
	  * @method breakupQueryData
	  * @remarks 
	  * From:
		object:{
			[0]: {
				ColumnName: String,
				Value: Value
			},
			[1]: {....}
		}
		To:
		object: {
			String: value,
			String: value,
			...
		}
		**/
	breakupQueryData: function(results){
		var data={};
		$.each(results,function(cellIndex,cellObject){
			data[cellObject.ColumnName]=cellObject.Value;
		});
		return data;
	},
	
	/**
	  * Builds the info popup window's structure (north/south/east layout)
	  * @method buildInfoStructure
	  **/
	buildInfoStructure: function(element,hasImages,hasFiles,newWindow){
		var outerLayout=element.find(".layoutContainer").layout( {
			north__applyDefaultStyles:false,
			north__size: 150,
			north__closable: false,
			north__resizable: false,
			north__initClosed: !hasImages,
			north__initHidden: !hasImages,
			east__applyDefaultStyles: true,
			east__size: 300,
			east__initHidden: true,
			east__closable: true,
			east__resizable: true,
			onclose: function(pane,elem){
				if (pane=="east"){
					$(elem).closest(".ui-dialog-content").dialog("option", "width", 469);
				}
			},
			spacing_closed: 0
		}); 
		var container = element.find(".layoutContainer");
		container.linkify();
		container.togglepanels();
		if (newWindow){
			container.find(".mainImageCont").addClass("editable")
					.bind("click",mygis.Drawing.Editing.handlerAttachImage);
		}
		if(!hasImages){
			container.find(".infoImagesLabel").hide();
		}
		if(!hasFiles){
			container.find(".infoFilesLabel").hide();
		}
		container.find(".infoFieldsLabel").trigger('click');
		element.data('outerLayout',outerLayout);
	},
	
	/**
	  * Creates the HTML markup for the fields in the info popup window
	  * @method buildInfoFields
	  **/
	buildInfoFields: function(data,layername){
		var container = $("<div class='infoFieldsCont' />");
		var innerCont=   $("<table class='infoFieldsInnerCont' />");//$("<div class='infoFieldsInnerCont' />");
		var layerID = mygis.Utilities.mggetLayerID(layername);
		$.each(data,function(i,v){
			if (mygis.Drawing.Editing.isValidOutputIntern(i)){
				var newLine = $("<tr />");//$("<div />");
				var newHead = $("<td />");//$("<span />");
				var newValue = $("<td />");//$("<span />");
				var fieldInfo = internalMemory.layerFields[layerID][i];
				newHead.html(fieldInfo.friendlyName.replace(/_/g,' '));	//i
				newHead.attr("data-originalName",i);
				newHead.attr("data-description",fieldInfo.description);
				newValue.html(v);
				newHead.addClass("featureHCell");
				newValue.addClass("featureVCell edit_area");
				newLine.append(newHead);
				newLine.append(newValue);
				innerCont.append(newLine);
			}
			
		});
		container.append(innerCont);
		container.append("<a href='#' class='infoPopup_editBtn' style='display:none;' />");
		container.append("<a href='#' class='infoPopup_deleteBtn' style='display:none;' />");
		return container;
	},
	
	/**
	  * Clones the "info window" and displays it in a popup
	  * @method infoDetach
	  **/
	infoDetach: function(jQueryElement,uniqueIndex,params){
		if ($("#detached"+uniqueIndex).length>0){
			$("#detached"+uniqueIndex).dialogExtend("restore");
		}else{
			var clone = jQueryElement;	//jQueryElement.clone(false);
			/*
			var contDiv = $("<div class='infoCont' />");
			contDiv.appendTo("body");
			contDiv.attr("id","detached"+uniqueIndex);
			contDiv.append(clone.html());
			*/
			clone.appendTo("body");
			contDiv=clone;
			if (params.fieldInfo){
				var cells=contDiv.find(".infoFieldsCont tr .featureVCell");
				var allData = params.fieldInfo;
				$.each(cells,function(i,cell){
					var fieldName = $(cell).prev().attr('data-originalName');
					var data = allData[fieldName];
					$(cell).data("fieldInfo",data);
				});
			}
			var minizable=true;
			if (params.newWindow){
				minizable=false;
			}else if (mygis.Drawing.Exporting.checkRights(params.oid,mygis.Utilities.mggetLayerID(params.layer))){
				minizable=false;
			}
			contDiv.dialog(
				{//position: [135,123],
				width: 469,	//(!(params.hasImages||params.hasFiles))?375:750,
				height: 650,
				resizable: true, 
				modal: params.newWindow,
				autoResize: true,
				title: params.title,
				close: function(){
					internalMemory.dialogLeft-=10;
					internalMemory.dialogTop-=10;
					$(this).remove();
				},
				position: { 
					my: ("center+"+ internalMemory.dialogLeft + " center+" + internalMemory.dialogTop), at: "center center" },
				open: function(){
					internalMemory.dialogLeft+=10;
					internalMemory.dialogTop+=10;
					
					var titleBar = $("#detached"+uniqueIndex).parent().find(".ui-dialog-titlebar");
					var dialogWindow = titleBar.parent();
					var dialogContent=$("#detached"+uniqueIndex);
					titleBar.css({
							"background":"#F6A828 no-repeat 12px 2px"
							});
					//titleBarSpan.attr("style","padding: 2px 0;font-size:11px !important");
					$('.ui-widget-overlay').bind('click', function () { $(this).siblings('.ui-dialog').find('.ui-dialog-content').dialog('close'); });
					mygis.Query.buildInfoStructure($("#detached"+uniqueIndex),params.hasImages||params.newWindow,params.hasFiles||params.newWindow,params.newWindow);
					if (Sys.Services.AuthenticationService.get_isLoggedIn()){
						mygis.Drawing.Editing.checkInfoPopupButtons(params.layer,params.oid,params.fieldInfo);
					}
					if(params.newWindow){
						mygis.Drawing.Editing.editInfoFields(params.fieldInfo);
					}
					mygis.UI.Hooks.infoWindowShown();
				},
				beforeClose: function(event){
					if (params.newWindow){
						mygis.Drawing.Exporting.checkDigitizing(event);
						return false;
					}
				}
			}).dialogExtend({
				minimizable: minizable,
				beforeMinimize: function(){
					$("#dialog-extend-fixed-container").show();
					$("#panel1 .ui-layout-center").animate({
						scrollTop: 0
					},0);
				},
				minimize : function(evt) {
					$("#dialog-extend-fixed-title").show();
				},
				restore: function(evt){
					if ($("#dialog-extend-fixed-container .ui-dialog").length==0){
						$("#dialog-extend-fixed-title").hide();
						$("#dialog-extend-fixed-container").hide();
					}
				}
			});
		}
		
	}
};

// END of mygis.Query

/**
	Utility functions.

	@class Utilities
	@static
**/
mygis.Utilities = {

	/**
	 * Updates a single property of a layer
	 * @method updateLayerSource
	 * @param {String} searchProperty Finds a record by this property
	 * @param {Mixed} searchValue The searchProperty must be equal to this value
	 * @param {String} replaceProperty Replaces this property...
	 * @param {Mixed} replaceValue ...with this value
	 */
	updateLayerSource: function(searchProperty,searchValue,replaceProperty,replaceValue){
		var counter =0;
		var found =false;
		while (!found && counter<layerSource.records.length){
			var item = layerSource.records[counter];
			if (item[searchProperty]==searchValue){
				found=true;
			}else{
				counter++;
			}
		}
		if (found){
		layerSource.records[counter][replaceProperty]=replaceValue;
		if (internalConfig.updateLayerSource){
			clearTimeout(internalConfig.updateLayerSource);
		}
		internalConfig.updateLayerSource = setTimeout(function(){
			mygis.UI.updateLayerGrid();
		},5000);
		}else{
			console.log(searchProperty+" not found. Search value: "+searchValue);
		}

	},


	isUnwantedField: function(name){
		var retvalue=false;
		switch (name){
			case "OID":
			case "Geometry":
			case "GeometryText":
				retvalue=true;
				break;
		}
		if(name.endsWith("__")){
			retvalue=true;
		}
		return retvalue;
	},
	
	/**
	 * Populates a given select element with the list of available backgrounds
	 * @method populateBGselect
	 * @param {jQuery Element} selectElement The select element to populate
	 * @param {String} initialSelect Select this background name if found
	 */
	populateBGselect: function(selectElement,initialSelect){
		selectElement.empty();
		for (var bg in backgrounds){
			if (backgrounds[bg].hasOwnProperty("name")){	//1-level
				var opt = $("<option />");
				opt.attr("value",bg);
				opt.html(backgrounds[bg].name);
				if (bg.toString()==initialSelect){
					opt.attr("selected","selected");
				}
				selectElement.append(opt);
			}else{	//2-level
				for (var sub in backgrounds[bg]){
					var opt = $("<option />");
					opt.attr("value",bg+'.'+sub);
					opt.html(backgrounds[bg][sub].name);
					if ((bg+'.'+sub)==initialSelect){
						opt.attr("selected","selected");
					}
					selectElement.append(opt);
				}
				
			}
		}
	},

	/**
	 * Searches for the background identifier by (localized) name
	 * @method getBGIdentifier
	 * @param {String} name The background's localized name
	 * @returns {String} The background identifier
	 */
	getBGIdentifier: function(name){
		var retvalue = "";
		for (var bg in backgrounds){
			if (backgrounds[bg].hasOwnProperty("name")){ //1-level
				if (backgrounds[bg].name==name){
					retvalue=bg.toString();
				}
			}else{
				for (var sub in backgrounds[bg]){
					if (backgrounds[bg][sub].name==name){
						retvalue=bg+"."+sub;
					}
				}
			}
			
		}
		return retvalue;
	},

	/**
	 * Enables app customization theme
	 * @method enableCustomization
	 */
	enableCustomization: function(){
		mygis.Utilities.disableCustomization();
		mygis.Utilities.add_sheet({url:config.folderPath+"GetAppStyle.ashx?ut="+new Date().getTime(),title:'myappcust'});
	},

	/**
	 * Disables app customization theme
	 * @method disableCustomization
	 */
	disableCustomization: function(){
		mygis.Utilities.remove_sheet("myappcust");
	},

	/**
	 * Previews a specific app customization theme
	 * @method previewCustomization
	 */
	previewCustomization: function(styleID){
		mygis.Utilities.disableCustomization();
		mygis.Utilities.add_sheet({
			url:config.folderPath+"GetAppStyle.ashx?st="+styleID+"&ut="+new Date().getTime(),
			title:'myappcust'});
	},

	/**
	 * Adds a whole stylesheet or appends to an existing stylesheet.
	 * @method add_sheet
	 * @param {Object} options
	 * options.url - location of the stylesheet - when this is supplied _options.str_ and _options.title_ should not be set and a new LINK element is always created
	 * options.str - text content of the stylesheet - when this is supplied _options.url_ is not used. A STYLE element is used.
	 * options.title - the ID of the added stylesheet (if you pass `foo` the ID will be `foo-stylesheet`), when the stylesheet exists the content is appended and no new stylesheet is created.
	 * @returns a reference to the stylesheet
	 */
	add_sheet: function(opts) {
		var tmp = false, is_new = true;
		if(opts.str) {
			if(opts.title) { tmp = $("style[id='" + opts.title + "-stylesheet']")[0]; }
			if(tmp) { is_new = false; }
			else {
				tmp = document.createElement("style");
				tmp.setAttribute('type',"text/css");
				if(opts.title) { tmp.setAttribute("id", opts.title + "-stylesheet"); }
			}
			if(tmp.styleSheet) {
				if(is_new) {
					document.getElementsByTagName("head")[0].appendChild(tmp);
					tmp.styleSheet.cssText = opts.str;
				}
				else {
					tmp.styleSheet.cssText = tmp.styleSheet.cssText + " " + opts.str;
				}
			}
			else {
				tmp.appendChild(document.createTextNode(opts.str));
				document.getElementsByTagName("head")[0].appendChild(tmp);
			}
			return tmp.sheet || tmp.styleSheet;
		}
		if(opts.url) {
			tmp			= document.createElement('link');
			tmp.rel		= 'stylesheet';
			tmp.type	= 'text/css';
			tmp.media	= "all";
			tmp.href	= opts.url;
			if (opts.title){
				tmp.id		= opts.title;
			}

			document.getElementsByTagName("head")[0].appendChild(tmp);
			return tmp.styleSheet;

		}
		return null;
	},

	/**
	 * Removes a css style sheet when it has the given id
	 * @method remove_sheet
	 * @param {String} id The style id
	 */
	remove_sheet: function(id){
		var elem = document.getElementById(id);
		if (elem){
			document.getElementsByTagName("head")[0].removeChild(elem);
		}
	},

	/**
	 * Merges the properties of 2 objects
	 * @method mergeOptions
	 * @param {Object} src The source object
	 * @param {Object} target The target object
	 */
	mergeOptions: function (src,target){
		var obj3 = {};
		for (var attrname in src) { obj3[attrname] = src[attrname]; }
		for (var attrname in target) { obj3[attrname] = target[attrname]; }
		return obj3;
	},


	/**
		Blocks UI interaction.

		@method blockUI
		@param {Boolean} blanket If true, blankets the whole page
	**/
	blockUI: function(blanket){

		try{
		if (!internalConfig.uiBlocked){
			if (blanket){
				$('#initialLoad').find(".mygis_logo").show();
				$('#initialLoad').find(".mygis_loader").attr({"style":"display: none;margin-top:0px;"});
				$.blockUI({
					message: $('#initialLoad')
				});
			}else{
				$('#initialLoad').find(".mygis_logo").hide();
				$('#initialLoad').find(".mygis_loader").attr({"style":"display: block;margin-top:140px;"});
				$.blockUI({
					message: $('#initialLoad'),
					css: {
						backgroundColor: 'transparent'
					},
					overlayCSS: {
						opacity:0
					}
				});
			}
			internalConfig.uiBlocked=true;
		}
		}catch(err){

			console.log(err.message);

		}

	},

	/**
		Unblocks the UI
		@method mygis.Utilities.unblockUI

	**/
	unblockUI: function(){
		$.unblockUI();
		internalConfig.uiBlocked=false;
	},

	/**
	 * Due to a bug in $.blockUI, this is used to reset the blocking div
	 * @method resetBlockUI
	 */
	resetBlockUI: function(){
		var parent = $("#VariousPopUps");
		var cont = $("<div />");
		cont.attr("id","initialLoad");
		cont.attr("style","display:none");
		var logo = $("<div />");
		logo.attr("class","mygis_logo");
		var logoImg = $("<img />");
		logoImg.attr("src",config.folderPath+"GetImage.ashx?qType=GetAppLogo");
		var feedback = $("<div />");
		feedback.attr("id","mygis_loadFeedback");
		logo.append(logoImg);
		logo.append(feedback);
		var loader = $("<div />");
		var loaderImg = $("<img />");
		loader.attr("class","mygis_loader");
		loaderImg.attr("src",config.folderPath + "Images/mygis_loader.gif");
		loader.append(loaderImg);
		cont.append(logo);
		cont.append(loader);
		parent.append(cont);
	},

	/**
		Categorizes an array of features based on feature.type

		@method categorizeFeatures
		@param {Array} features
		@return {Object} Hashtable with the features. Key is the layername.
	**/
	categorizeFeatures: function(features){
		var retvalue = {};
		for (var i=0;i<features.length;i++){
			var item = features[i];
			if (!retvalue[item.type]){
				retvalue[item.type]=[];
			}
			retvalue[item.type].push(item);

		}
		return retvalue;
	},

	/**
		Searches for a given layerTable in the layerSource

		@method mggetLayerIndex
		@param {String} layertable The layerTable property to search for
		@return {Integer} If found, the item's index, otherwise -1
	**/
	mggetLayerIndex: function(layertable){
		var retvalue=-1;
		var i=0;
		var found=false;
		while (!found && i<layerSource.records.length)
		{
			var item = layerSource.records[i];
			if (item.layerTABLE==layertable){
				found=true;
				retvalue = i;
			}else{
				i++;
			}
		}
		return retvalue;
	},

	/** Searches for a given layerTable in the layerSource
	 *  @method mggetLayerID
	 *  @param {String} layertable The layerTable property to search for
	 *  @return {Integer} If found, the layer ID, otherwise -1
	 */
	mggetLayerID: function(layertable){
		var retvalue = -1;
		var i=0;
		var found=false;
		while (!found && i<layerSource.records.length)
		{
			var item = layerSource.records[i];
			if (item.layerTABLE==layertable){
				found=true;
				retvalue = item.layerID;
			}else{
				i++;
			}
		}
		return retvalue;
	},

	/**
		Searches the stored queries for the given value

		@method getQueryByValue
		@param value The value to search for
		@param {Boolean} [returnIndex] If true, only the index of the item will be returned, otherwise the item itself.
		@return {Mixed}
	**/
	getQueryByValue: function(value,returnIndex){
		var i=0;
		var found=false;
		var retvalue;
		while (!found && i<querySource.length){
			var item;
			item = querySource[i];
			if (item.value==value){
				found=true;
				retvalue=item;
			}else{
				i++;
			}
		}
		if (returnIndex&&!found){
			return -1;
		}else if(returnIndex){
			return i;
		}else{
			return item;
		}
	},

	/**
		Checks to see if the current user has authorization for the given operation, as a quick-check.
		Use this only for UI purposes.

		@method checkAuthorization
		@param {String} operation
		@param {String} params Any additional parameters to pass server-side
	**/
	checkAuthorization: function(operation,params){
		var mycallback = function(closureData){
			return function(data){
				var realResults = eval(data);
				if (realResults.type=="success"){
					switch (realResults.operation){
						case "digitize":
							mygis.Drawing.Exporting.saveDigitizing();
							break;
					}
				}else{
					displayError(realResults.message);
				}
			}
		};
		$.ajax({
			url:config.mgreq+"?qtype=isAuthorized&qContents="+operation+"&qParams="+params,
			type: "GET",
			success: mycallback()
		});
	},

	/**
		Checkes the layerSource for a given layerTable name, and returns the friendly name.

		@method getFriendlyName
		@param {String} layerTable the given layerTable to search
		@return {String} The friendly layerNAME if found, or layerTable if not found
	**/
	getFriendlyName: function(layerTable){
		var i=0;
		var found=false;
		var retvalue = layerTable;
		while (!found && i<layerSource.records.length){
			var item = layerSource.records[i];
			if (item.layerTABLE==layerTable){
				found=true;
				retvalue = item.layerNAME;
			}else{
				i++;
			}
		}
		return retvalue;
	},

	/**
		Returns a new array with only unique values

		@method arrayUnique
		@param {Array} The array to search
		@return {Array} The array with the unique items
	**/
	arrayUnique: function(array) {
		var o = new Object(), i, l = array.length, r = [];
		for(i=0; i<l;i+=1) o[array[i]] = array[i];
		for(i in o) r.push(o[i]);
		return r;
	},

	/**
		Moves an item in an array

		@method arrayMove
		@param {Array} arrayObj The array to reorder
		@param {Integer} old_index The index to move from
		@param {Integer} new_index The index to move to
	**/
	arrayMove: function(arrayObj,old_index,new_index){
		while (old_index < 0) {
			old_index += arrayObj.length;
		}
		while (new_index < 0) {
			new_index += arrayObj.length;
		}
		if (new_index >= arrayObj.length) {
			var k = new_index - arrayObj.length;
			while ((k--) + 1) {
				arrayObj.push(undefined);
			}
		}
		arrayObj.splice(new_index, 0, arrayObj.splice(old_index, 1)[0]);
		return arrayObj; // for testing purposes
	},

	/**
		Checks if a string is a number

		@method isNumeric
		@param {String} input
		@return {Boolean}
	**/
	isNumeric: function(input){
		var inp=input.toString();
		return (inp - 0) == inp && inp.length > 0;
	},

	/**
		Checks if an object has any custom properties defined.
		@method isEmptyObject
		@param {Object} obj The object to check
		@return {Boolean} True if the Object does not have any properties of its own defined.
	**/
	isEmptyObject: function(obj){
		for(var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			  return false;
			}
		}
		return true;
	},

	/**
		Populates select list from array of items given as objects

		@method populateSelect
		@param {Element} el The select element to populate
		@param {Array} items Objects of this form: { name: 'text', value: 'value' }
		@param {Boolean} [noFirst] If not defined or false, a new blank Option will be inserted before the items.
	**/
	populateSelect: function(el, items, noFirst) {
		el.options.length = 0;
		if (!$.isEmptyObject(items) && (!noFirst)){
			el.options[0] = new Option('', '');
		}

		var i=0 //JK CHANGE - variable for counting
		$.each(items, function () {
			//JK CHANGES - find the index numbers of datetime fields
			i++;
			try{
			if ((this.originalType == "datetime") || (this.originalType == "date")) {
				el.options[el.options.length] = new Option(this.name, this.value); //JK - this was original code line
				if (window.trigger_calendar.length == 0){window.trigger_calendar.push ([i.toString(),this.name]);}
				else{
					for (i=0;i<window.trigger_calendar.length;i++){
						if (window.trigger_calendar[i][1]!=this.name)
						{window.trigger_calendar.push ([i.toString(),this.name]);} //the index number of those objects is added to the list	
					}
				}
			}
			else{
			//JK CHANGES - END
			el.options[el.options.length] = new Option(this.name, this.value);
			//JK CHANGES - the rest of the 'try' loop
			}}
			catch(err)
			{
			el.options[el.options.length] = new Option(this.name, this.value);
			}
			//JK CHANGES - END
		});

	},

	/**
		Returns only the custom defined propertied in an Object

		@method array_keys
		@param {Object} input
		@param {String} [search_value] If defined, it will only return an array with this key if found
		@return {Object}
	**/
	array_keys: function(input,search_value,argStrict){
		var search = typeof search_value !== 'undefined', tmp_arr = [], strict = !!argStrict, include = true, key = '';
		if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
			return input.keys(search_value, argStrict);
		}
		for (key in input)
		{
			if (input.hasOwnProperty(key))
			{
				include = true;
				if (search)
				{
					if (strict && input[key] !== search_value){
						include = false;
					}
					else {
						if (input[key] != search_value){
							include = false;
						}
					}
				}
				if (include){
					tmp_arr[tmp_arr.length] = key;
				}
			}
		}
		return tmp_arr;
	},

	/**
		Converts a given string to its boolean equivalent

		@method stringToBoolean
		@param (String) string
		@return {Boolean}
	**/
	stringToBoolean: function(string){
			switch(string){
					case "True": case "true": case "yes": case "1": return true;
					case "False": case "false": case "no": case "0": case null: return false;
					default: return Boolean(string);
			}
	},

	/**
		Formats an OpenLayers LonLat object to a comma separated string.
		@method formatLonlats
		@return {String} The formatted string
	**/
	formatLonlats: function(lonLat){
		//lonLat = lonLat.transform(new OpenLayers.Projection(mygis.Utilities.projections.google), new OpenLayers.Projection(mygis.Utilities.projections.wgs84));
		//lonLat = lonLat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		//var lat = lonLat.lon;	//GOOGLE SWITCH
		//var lon = lonLat.lat;	//GOOGLE SWITCH
		var lat = lonLat.lon; //GOOGLE SWITCH
		var lon = lonLat.lat; //GOOGLE SWITCH
		var ns = OpenLayers.Util.getFormattedLonLat(lat);
		var ew = OpenLayers.Util.getFormattedLonLat(lon,'lon');
		ns=ns.substring(0,ns.length-2);
		ew=ew.substring(0,ew.length-2);
		var outputx = mygis.Utilities.format("<div class='coord'>X: {0} ({1}°)</div>",ns,(Math.round(lat * 10000) / 10000));
		var outputy = mygis.Utilities.format("<div class='coord'>Y: {0} ({1}°)</div>",ew,(Math.round(lon * 10000) / 10000));
		//var outputx = mygis.Utilities.format("<div class='coord'>X: {0}</div>",ns);
		//var outputy = mygis.Utilities.format("<div class='coord'>Y: {0}</div>",ew);
		return outputx+outputy;
	},

	/**
		Unbinds the global (window) mousedown handlers
		and saves them to window.globalHandlers
		@method unbindGlobalHandlers
	**/
	unbindGlobalHandlers: function(){

		var myevents = $(document).data('events').mousedown;
		var handlers = [];
		$.each(myevents,function(i,v){
			handlers.push(v.handler);
		});
		window.globalHandlers = handlers;
		$(document).unbind('mousedown');

	},

	/**
		Reattaches all handlers which were unbound by unbindGlobalHandlers
		@method rebindGlobalHandlers
	**/
	rebindGlobalHandlers: function(){

		if (window.globalHandlers){
			if (window.globalHandlers.length>0){
				$.each(window.globalHandlers,function(i,v){
					$(document).bind('mousedown',v);
				});
				window.globalHandlers = [];
			}
		}

	},

	/**
		Formats a string containing a number into proper "grouped" format.
		@method addCommas
		@param {String} nStr
		@return {String} The formatted string
	**/
	addCommas: function(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + '.' + '$2');
		}
		return x1 + x2;
	},

	/**
		Converts a parsed JSON object to html table

		@method ConvertJsonToTable
		@param {Object} parsedJson
		@param {String} [tableId] The ID for the generated table
		@param {String} [tableClassName] A class name for the generated table
		@param {String} [linkText] Text that should be linked.
		@return {String} String containing an html table.
	**/
	ConvertJsonToTable: function (parsedJson, tableId, tableClassName, linkText){
		//Patterns for links and NULL value
		var italic = '<i>{0}</i>';
		var link = linkText ? '<a href="{0}">' + linkText + '</a>' :
							  '<a href="{0}">{0}</a>';

		//Pattern for table
		var idMarkup = tableId ? ' id="' + tableId + '"' :
								 '';

		var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
										   '';

		var tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

		//Patterns for table content
		var th = '<thead>{0}</thead>';
		var tb = '<tbody>{0}</tbody>';
		var tr = '<tr>{0}</tr>';
		var thRow = '<th>{0}</th>';
		var tdRow = '<td>{0}</td>';
		var thCon = '';
		var tbCon = '';
		var trCon = '';

		if (parsedJson)
		{
			var isStringArray = typeof(parsedJson[0]) == 'string';
			var headers;

			// Create table headers from JSON data
			// If JSON data is a simple string array we create a single table header
			if(isStringArray)
				thCon += thRow.format('value');
			else
			{
				// If JSON data is an object array, headers are automatically computed
				if(typeof(parsedJson[0]) == 'object')
				{
					headers = mygis.Utilities.array_keys(parsedJson[0]);

					for (i = 0; i < headers.length; i++)
						thCon += thRow.format(headers[i]);
				}
			}
			th = th.format(tr.format(thCon));

			// Create table rows from Json data
			if(isStringArray)
			{
				for (i = 0; i < parsedJson.length; i++)
				{
					tbCon += tdRow.format(parsedJson[i]);
					trCon += tr.format(tbCon);
					tbCon = '';
				}
			}
			else
			{
				if(headers)
				{
					var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
					var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

					for (i = 0; i < parsedJson.length; i++)
					{
						for (j = 0; j < headers.length; j++)
						{
							var value = parsedJson[i][headers[j]];
							var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

							if(isUrl) // If value is URL we auto-create a link
								tbCon += tdRow.format(link.format(value));
							else
							{
								if(value)
									tbCon += tdRow.format(value);
								else // If value == null we format it like PhpMyAdmin NULL values
									tbCon += tdRow.format(italic.format(value).toUpperCase());
							}
						}
						trCon += tr.format(tbCon);
						tbCon = '';
					}
				}
			}
			tb = tb.format(trCon);
			tbl = tbl.format(th, tb);

			return tbl;
		}
		return null;
	},

	/**
		Replaces spaces with underscores in a given string.
		@method nameToUnderscore
		@param {String} name The string to convert
		@return {String} The formatted string
	**/
	nameToUnderscore: function(name){
		if (name.indexOf(" ")>0){
			var nameparts = name.split(" ");
			name = nameparts.join("_");
		}
		return name;
	},

	/**
		Returns a comma-separated string of visible layers

		@method getVisibleLayerString
		@param {String} appname The current applicatio nname
		@param {Boolean} legend If this will be used to ask for a geoserver getlegend request.
		@return {String} The comma-separated string of layers
	**/
	getVisibleLayerString: function(appname,legend){
		var fullLayerString="";
		var recs = layerSource.records;
		var fullLayers=[];
		for (var i=recs.length-1;i>=0;i--)
		{
			if (!(Boolean(recs[i].hidden)===true)){
				layername = recs[i].layerTABLE;
				layername=mygis.Utilities.nameToUnderscore(layername);
				//layername = appname+"_"+layername;
				fullLayers.push(layername);
			}

		}
		var separator=legend?"+":",";
		fullLayerString = fullLayers.join(separator);
		return fullLayerString;
	},


	/**
		Acts like String.Format() in VB.NET

		@method format
	 	@param {String} str The format string
	*/
	format: function(str){
		for(i = 1; i < arguments.length; i++){
			var searchme = '\\{' + (i - 1) + '}';
			str = str.replace(new RegExp(searchme, 'g'), arguments[i]);
		}
		return str;
	},

    /**
		Used to round coordinates up to 6 decimals
		@method roundVal
		@param {Number} val The coordinate to round
    */
    roundVal: function(val) {
        if (val.toString().length < 9) {
            return val;
        } else {
            var dec = 6;
            var result = Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
            return result;
        }
    },

    /**
		Checks if "ENTER" was pressed to perform search
		@method checkKeypress
		@param {Event} e
    */
    checkKeypress: function(e) {
        var keynum;
        if (window.event) // IE
        {
            keynum = e.keyCode
        }
        else if (e.which) // Netscape/Firefox/Opera
        {
            keynum = e.which
        }
        if (keynum == 13) {
            mygis.Map.showAddress(document.getElementById("searchBtn").value);
            return false;
        }
    },

    /**
		A more consistent method of detecting MouseOut like IE does
		@method isMouseLeaveOrEnter
		@param {event} e
		@param {Function} handler
    */
    isMouseLeaveOrEnter: function(e, handler) {
        if (e.type != 'mouseout' && e.type != 'mouseover') return false;
        var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
        while (reltg && reltg != handler) reltg = reltg.parentNode;
        return (reltg != handler);
    },

    /**
    * A function to convert a point on the map to relative pixel coordinates.
    * @param map The map object
    * @param latlng The point on the map
    * @param z The zoom level
    */
    latlngToPoint: function(map, latlng, z) {
        var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
        //var scale = Math.pow(2, z);
        //var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
        var pixelCoordinate = normalizedPoint;
        return pixelCoordinate;
    },

    /**
    * Converts the number in degrees to the radian equivalent
    * @param angle
    */
    deg2rad: function(angle) {
        return (angle / 180) * Math.PI;
    },

	/**
		Converts a circle to polygon (incomplete)
		@method circle2polygon
		@TODO TODO
	*/
    circle2polygon: function(centerpoint, radius) {
        var lat1 = mygis.Utilities.deg2rad(centerpoint.lat());
        var long1 = mygis.Utilities.deg2rad(centerpoint.lng());
        var d_rad = radius / 6378137;
        var radial;
        var lat_rad;
        var dlon_rad;
        var lon_rad;
        for (var i = 0; i <= 360; i++) {
            radial = mygis.Utilities.deg2rad(i);
            lat_rad = Math.asin
        }
    },

	/**
		Creates a random number from minVal to maxVal
		@method randomXToY
		@param {Number} minVal
		@param {Number} maxVal
		@param {Boolean} [floatVal] If defined, the returned number contains up to floatVal decimals.
		@return The created random number
	*/
    randomXToY: function(minVal, maxVal, floatVal) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
    },

	/**
		Converts a given opacity value to its hex equivalent.

		@method opacityToHex
		@param {Number} degOpacity The opacity (0-1)
		@return The hex equivalent
	**/
	opacityToHex: function(degOpacity){
		/*
		Opacity is a value between 0-1.
		In order to use it for kml, we need to convert it to 0-255.
		degOpacity : 1
		x              : 255
		*/
		var retvalue;
		if (degOpacity<=1 && degOpacity>=0){
			var preHex = Math.floor(degOpacity*255);
			retvalue = preHex.toString(16);
			if (retvalue.length==1){
				retvalue = "0"+retvalue;
			}
		}
		return retvalue;
	},

	/**
		Cuts the "#" character from a CSS hex color
		@method cutHex
		@param {String} hexValue a hex CSS-color
		@return The cut string
	**/
	cutHex: function(hexValue){
		return (hexValue.charAt(0)=="#") ? hexValue.substring(1,7):hexValue;
	},

	/**
		Converts a css color from hex to rgb
		@method hexToRGB
		@param {String} hexValue a hex CSS-color
		@return {Array} An array containing the rgb colors
	**/
	hexToRGB: function(hexValue){
		var retArray = [];
		var r,g,b;
		var h = mygis.Utilities.cutHex(hexValue);
		r = parseInt(h.substring(0,2),16);
		g = parseInt(h.substring(2,4),16);
		b = parseInt(h.substring(4,6),16);
		retArray.push(r);
		retArray.push(g);
		retArray.push(b);
		return retArray;
	},

	/**
	 * Converts an rgba value to hex color, stripping the opacity parameter
	 * @method rgbaToHex
	 * @param {String} rgbaValue A css rgba value. example: 'rgba(100,230,100,0.4)'
	 */
	rgbaToHex : function(rgbaValue){
		var colorStart = rgbaValue.indexOf('rgba(')+5;
		var colorEnd = rgbaValue.indexOf(')');
		var colors = rgbaValue.substring(colorStart,colorEnd).split(',');
		var r = parseInt(colors[0]).toString(16);
		var g = parseInt(colors[1]).toString(16);
		var b = parseInt(colors[2]).toString(16);
		return "#"+r+g+b;
	},

	/**
	 * Gets the opacity component of a css rgba value
	 * @method getOpacityRGBA
	 * @param {String} rgbaValue A css rgba value. example: 'rgba(100,230,100,0.4)'
	 */
	getOpacityRGBA: function(rgbaValue){
		if (rgbaValue.indexOf("#")==0){
			return 1;
		}else{
			var colorStart = rgbaValue.indexOf('rgba(')+5;
			var colorEnd = rgbaValue.indexOf(')');
			var colors = rgbaValue.substring(colorStart,colorEnd).split(',');
			return colors[3];
		}
	},

	/**
	 * Returns a jqx.dataAdapter object with the bound localdata
	 * Used in jqx widgets (grid,list) etc
	 * @method getLocalGridSource
	 * @param {Array} localdata array of objects
	 */
	getLocalGridSource: function(localdata){
		var source = {
			datatype: "local",
			localdata: localdata
		};
		var gridSource = new $.jqx.dataAdapter(source,{
			async: false
		});
		gridSource.dataBind();
		return gridSource;
	},

	/**
		Contains the used projections in MyGIS

		@class Utilities.projections
		@static
	**/
	projections: {
		/**
			The google projection
			@property google
			@type String
		**/
		google: "EPSG:900913",
		/**
			The WGS84 projection
			@property WGS84
			@type String
		**/
		wgs84: "EPSG:4326"
	},

	/**
		Used to attach the Google Places Api to the proper input element

		@method googleAutoComplete
	**/
	googleAutoComplete: function(){

		$("#autoComplete").attr("placeholder",strings.QuickJump.placeholder);
		var pac_input = document.getElementById('autoComplete');

		(function pacSelectFirst(input) {
			// store the original event binding function
			var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

			function addEventListenerWrapper(type, listener) {
				// Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
				// and then trigger the original listener.
				if (type == "keydown") {
					var orig_listener = listener;
					listener = function(event) {
						var suggestion_selected = $(".pac-item-selected").length > 0;
						if (event.which == 13 && !suggestion_selected) {
							var simulated_downarrow = $.Event("keydown", {
								keyCode: 40,
								which: 40
							});
							orig_listener.apply(input, [simulated_downarrow]);
						}

						orig_listener.apply(input, [event]);
					};
				}

				_addEventListener.apply(input, [type, listener]);
			}

			input.addEventListener = addEventListenerWrapper;
			input.attachEvent = addEventListenerWrapper;
		})(pac_input);
		var defaultBounds = new google.maps.LatLngBounds(
		  new google.maps.LatLng(-33.8902, 151.1759),
		  new google.maps.LatLng(-33.8474, 151.2631));

		var input = document.getElementById('autoComplete');
		var options = {
		  bounds: defaultBounds,
		  types: ['(regions)','address']		  /*,
		  //types: ['street_address'],
		  componentRestrictions: {country: 'gr'}
	*/
		};

		autocomplete = new google.maps.places.SearchBox(input, options);
		google.maps.event.addListener(autocomplete, 'places_changed', function() {

		  var place = autocomplete.getPlaces()[0];
		  console.log("types: ");
		  console.log(place.types);
		  //alert(place.name);
		  var foundType=place.types[0];
		  var zoomLevel=digimap.getZoom();
		  switch (foundType){
			case "country":
				zoomLevel=6;
				break;
			case "administrative_area_level_1":
				zoomLevel=8;
				break;
			case "administrative_area_level_2":
				zoomLevel=10;
				break;
			case "administrative_area_level_3":
				zoomLevel=12;
				break;
			case "administrative_area_level_4":
				zoomLevel=14;
				break;
			case "administrative_area_level_5":
				zoomLevel=16;
				break;
			case "street_address":
				zoomLevel=17;
				break;
			case "route":
			case "intersection":
				zoomLevel=17;
				break;
			case "locality":
				zoomLevel=14;
				break;
			
			
		  }
		  if (place.geometry){
			var center = place.geometry.location;
			var point = new OpenLayers.LonLat(center.lng(),center.lat());
			//point.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			
			var pointer = {lon:point.lon ,lat: point.lat};
			point.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			digimap.setCenter(point);
			mygis.Map.markSelectionPoint(pointer,true);
			digimap.zoomTo(zoomLevel);
		  //place.geometry.location?
		  }else{
			feedbackLayer.removeAllFeatures();
		  }
		});
	},

	/**
		Moves the map just a tiny bit to the right to force a refresh of tiles.

		@method nudgeMap
	**/
	nudgeMap: function(){

		var center = digimap.getCenter();
		digimap.panTo(new OpenLayers.LonLat(center.lon+0.0000000001,center.lat));
	},

	testReverseGeo: function(lon,lat){
		var map = new google.maps.Map(document.getElementById("dummyGoogle"),{
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: new google.maps.LatLng(34,23),
			zoom: 15
		  });
		var service = new google.maps.places.PlacesService(map);
		var request = {
			location: new google.maps.LatLng(lat,lon),
			bounds : new google.maps.LatLngBounds(
				google.maps.LatLng(-89.999999,-179.999999),
				google.maps.LatLng(89.999999,179.999999)
			),
			types: ['country']
		};
		var cb = function(results,status){
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var xxx = results[0];
				alert(xxx.name);
			}
		};
		service.search(request,cb);
	},

	//JK CHANGES - NEW FUNCTIONS

	/**
		Creates the calendar field (hidden), shows button to trigger it, hides the 'star' button and does the event bind

		@method datetime_input_field
	**/
	datetime_input_field: function(secondRow){
		try{
			//show the calendar	button
			$('#'+secondRow.id.replace("second_row_","cal_button_")).show()
			//set the button
			but_idname = secondRow.id.replace("second_row_","cal_button_");			
			$('#'+secondRow.id+'>.cal_button').id = but_idname;
			mygis.Utilities.button_set(document.getElementById(but_idname));
			//hide the 'distinct' star when showing button
			$('#'+secondRow.id+' > .dbFieldGetList').hide();			
			//initialize the calendar
			if (!$("#datetime").length==0)
			{
				$("#datetime").jqxCalendar({width: 380, height: 274});				
				//initially populate the field
				if (secondRow.getElementsByClassName("dbFieldValue")[0].value=="")
				{
					new_date = $('#datetime').jqxCalendar('getDate');
					str_new_date= new_date.getDate().toString()+'/'+(new_date.getMonth()+1).toString()+'/'+new_date.getFullYear().toString();
					secondRow.getElementsByClassName("dbFieldValue")[0].value = str_new_date;
					secondRow.getElementsByClassName("dbFieldValue")[0].onchange();
				};
			};
			//hide the calendar initially
			$("#datetime").hide();				
			//bind the calendar for event reporting
			$('#datetime').bind('cellSelected', function (event) {
				if (window.current_row[0] != ""){
				var new_date = event.args.date;
				window.current_row[1]=new_date.getDate().toString()+'/'+(new_date.getMonth()+1).toString()+'/'+new_date.getFullYear().toString();			
				$('.jqxdatetime').hide();
				if (window.current_row[0] != "")
					{
						//populate the proper fields if possible
						if (window.current_row[1] == "")	{
							new_date = $('#datetime').jqxCalendar('getDate');
							window.current_row[1]=new_date.getDate().toString()+'/'+(new_date.getMonth()+1).toString()+'/'+new_date.getFullYear().toString();
							};
						window.current_row[0].getElementsByClassName("dbFieldValue")[0].value = window.current_row[1];
						window.current_row[0].getElementsByClassName("dbFieldValue")[0].onchange();
						//forget the place to populate
						window.current_row = ["",""];
					};
				};
			})
		}
		catch(err) {console.log('calendar error :'+err);}

	},

	/**
		hides the datetime input field, shows the 'star' button again

		@method rm_datetime_input_field
	**/
	rm_datetime_input_field: function(secondRow){
		try{
		//show the 'distinct' star when hiding calendar, and hide the calendar button
		$('#'+secondRow.id+' > .cal_button').hide();
		$('#'+secondRow.id+' > .dbFieldGetList').show();}
		catch (err){}	
		try{
			if(typeof(secondRow)==="number")	//this is a call to remove all instances
			{
				elements = document.getElementsByClassName("criteriaSecondRow");
				for ( var i = 0; i < elements.length; i++ ){
				$('#'+document.getElementById(elements.id.replace("second_row_","cal_button_"))).hide();
				}
			}
			else{					//or just hide the calendar div
			document.getElementById(secondRow.id.replace("second_row_","cal_button_")).style.display = 'none';
			}
		}
		//if not possible, do tell
		catch(err){
			console.log('error at calendar remove: '+err);
		}
	},
	
	/**
		sets the proper reactions to the calendar button

		@method button_set
	**/
	button_set: function(button){
		cal_idname = button.id.replace("cal_button_","datetime_");	
		button.onclick = function()
		{
			//if no calendars are shown, show the correct calendar --test this if we can check for class, when an instance has smth
			try{
				if ($("#datetime")[0].style.display == "none") {
					$("#datetime").show();
					//remeber the row to populate later
					window.current_row[0] = document.getElementById(button.id.replace("cal_button_","second_row_"));				
					}
				else {
					//else hide all calendars
					$('.jqxdatetime').hide();
					if (window.current_row[0] != "")
						{						
							//populate the proper fields if possible
							if (window.current_row[1] == "")	{
								new_date = $('#datetime').jqxCalendar('getDate');
								window.current_row[1]=new_date.getDate().toString()+'/'+(new_date.getMonth()+1).toString()+'/'+new_date.getFullYear().toString();
								};
							window.current_row[0].getElementsByClassName("dbFieldValue")[0].value = window.current_row[1];
							window.current_row[0].getElementsByClassName("dbFieldValue")[0].onchange();
							//forget the place to populate
							window.current_row = ["",""];
						}
					};
			}
			catch (err){}
		}
	}
	//JK CHANGES END - NEW FUNCTIONS
};

//END of mygis.Utilities

