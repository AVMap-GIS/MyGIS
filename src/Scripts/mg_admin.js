
/**
	Methods and classes for the administration back-end of MyGIS
	@class mygis.Admin
	@static
**/
mygis.Admin={
	/**
		Functions and classes for application management
		
		@class mygis.Admin.AppManager
		@static
	**/
	AppManager: {
	
		/**
			This holds the update configuration for the app settings.
			@property updateConfig
			@type {Object}
		**/
		updateConfig: {
		  appID: -1,
			maps: [],
			urls: [],
			styles: [],
			logo: {
				changed: false,
				newValue: null,
				oldValue: null
			},
			logo1: {
				changed: false,
				newValue: null,
				oldValue: null
			},
			logo2: {
				changed: false,
				newValue: null,
				oldValue: null
			},
			appName: {
				changed: false,
				newValue: null,
				oldValue: null
			},
			appAlias: {
				changed: false,
				newValue: null,
				oldValue: null
			},
			appText: {
				changed: false,
				newValue: null,
				oldValue: null
			}
		},
		
		/**
		 * Functions for the apps in the app manager
		 *
		 * @class mygis.Admin.AppManager.Apps
		 * @static
		 */
		Apps: {
				
				/**
				 * Shows a dialog window for inserting new app
				 * @method showAddNewApp
				 */
				showAddNewApp: function(){
						var myconfig = mygis.Admin.UI.dialogConfig;
						myconfig.checkfn = mygis.Admin.AppManager.Apps.addNewAppCheck;
						myconfig.callbackfn = mygis.Admin.AppManager.Apps.createNewApp;
						myconfig.objectCount = 1;
						myconfig.windowTitle = "#addAppNamePop";
						$(myconfig.windowTitle).dialog({
								autoOpen: true,
								modal: true,
								resizable: false,
								width: 480,
								height: 130, 
								title: strings.AppManager.addApp_WindowTitle,
								closeOnEscape: false
						});
						var titleBar = $("#ui-dialog-title-addAppNamePop").parent();
						titleBar.css({
							"background":"url('"+config.folderPath+"Images/Administration/menu/icon-16-component.png') #F6A828 no-repeat 12px 8px",
							"background-size":"auto 18px"
							});
						
				},
				
				/**
				 * Used for client-validation when inserting new app name
				 * @method addNewAppCheck
				 */
				addNewAppCheck: function(){
						var retvalue = false;
						var checkValue = $("#addAppNameInp").val();
						if (!checkValue){
								alert(strings.AppManager.addApp_err_NotFilled);
						}else{
								var wrongSymbols = ['`','~','!','@','#','$','%','^','&','*','-','+','=','[',']','{','}','\\','|',':',';','"','\'','<','>',',','.','/','?'];
								var atLeastOne =false;
								for (var i=0;i<wrongSymbols.length;i++){
										if (checkValue.indexOf(wrongSymbols[i])>-1){
												atLeastOne=true;
										}
								}
								if (atLeastOne){
										alert(strings.AppManager.addApp_err_InvalidName);
								}else{
										mygis.Admin.UI.dialogConfig.object = checkValue;
										retvalue=true;
								}
						}
						return retvalue;
				},
				
				/**
				* Handles the creation of a new application
				* @method createNewApp
				*/
			 createNewApp: function(result){
						if (result=="ok"){
								var myValue = this;
								mygis.Admin.AppManager.resetConfigObject();
								var myconfig = mygis.Admin.AppManager.updateConfig;
								myconfig.appName.changed=true;
								myconfig.appName.newValue=myValue;
								var toSend=JSON.stringify(myconfig);
								var customUrl = config.mgreq+"?qtype=CreateNewApp&qContents="+toSend;
								var postObject = new Object();
								postObject["qContents"]=toSend;
								mygis.Utilities.blockUI();
								$.ajax({
										type:"POST",
										data: postObject,
										url: customUrl,
										success: function(data){
											try{
												var realResults = eval(data);
												if (realResults.iotype=="success"){
														mygis.Admin.AppManager.Apps.refreshAppGrid();
														displaySuccess(strings.AppManager.addApp_msg_Success);
													
												}else{
													displayError(realResults.iomsg);
												}
												
											}catch(err){
												console.log(err.message);
											}
											mygis.Utilities.unblockUI();
										}
								});
					 }
			 },
				
				/**
				* Handles clicking on an app name in the app grid.
				* Selects the row and goes to "edit mode"
				* @method appClicked
				* @param {Integer} The row index clicked
				*/
			 appClicked: function(index){
					 var grid = $("#myAppGrid");
					 grid.jqxGrid('clearselection');
					 grid.jqxGrid('selectrow',index);
					 mygis.Admin.UI.menuClick(null,"amenu_Apps_Config");
			 },
		 
			 /**
				* Handles the clicking of the checkbox in each row at the App Manager
				* @method singleCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
			 singleCheckClicked: function(elem){
					 var grid = $("#myAppGrid");
					 if (elem.args.value) {
							 grid.jqxGrid('selectrow', elem.args.rowindex);
					 }
					 else {
							 grid.jqxGrid('unselectrow', elem.args.rowindex);
					 }
			 },
			 
			 
				/**
				 * Handles the check button in the App Manager
				 * @method allCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				allCheckClicked: function(elem){
						var grid = $("#myAppGrid");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].appSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].appSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
			
				/**
					Activates/deactivates some buttons when an application is selected
					@method appSelected
					@param {Object} event
				**/
				appSelected: function(event){
						var grid = $("#myAppGrid");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								document.getElementById("amenu_Apps_Manager_edit").ex_AddClassName("disabled");
								document.getElementById("amenu_Apps_Manager_style").ex_AddClassName("disabled");
								document.getElementById("amenu_Apps_Manager_delete").ex_RemoveClassName("disabled");
						}else{
								document.getElementById("amenu_Apps_Manager_edit").ex_RemoveClassName("disabled");
								document.getElementById("amenu_Apps_Manager_style").ex_RemoveClassName("disabled");
								document.getElementById("amenu_Apps_Manager_delete").ex_AddClassName("disabled");
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllApps").checked=true;
						}else{
								document.getElementById("adminSelectAllApps").checked=false;
						}
						
					
				},
				
				/**
					Activates/deactivates some buttons when an application is unselected.
					@method appUnselected
					@param {Object} event
				**/
				appUnselected: function(event){
						var grid = $("#myAppGrid");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("amenu_Apps_Manager_edit").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("amenu_Apps_Manager_style").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_style").ex_AddClassName("disabled");
								}
								document.getElementById("amenu_Apps_Manager_delete").ex_RemoveClassName("disabled");
						}else if (selection.length==1){
								document.getElementById("amenu_Apps_Manager_edit").ex_RemoveClassName("disabled");
								document.getElementById("amenu_Apps_Manager_style").ex_RemoveClassName("disabled");
								if (!document.getElementById("amenu_Apps_Manager_delete").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_delete").ex_AddClassName("disabled");
								}
						}else{
								if (!document.getElementById("amenu_Apps_Manager_edit").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("amenu_Apps_Manager_style").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_style").ex_AddClassName("disabled");
								}
								if (!document.getElementById("amenu_Apps_Manager_delete").ex_HasClassName("disabled")){
										document.getElementById("amenu_Apps_Manager_delete").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllApps").checked=true;
						}else{
								document.getElementById("adminSelectAllApps").checked=false;
						}
				},
		
				
				/**
					Used to create the app grid in the App Manager
					@method createAppGrid
				**/
				createAppGrid: function(){
						mygis.Utilities.blockUI();
						var appContainer = $("#myAppGrid");
						var cellrenderer = function(row,datafield,value){
								var retobject;
								var appID = this.owner.getrowdata(row).appID;
								var action = "router('mm_imgclick',this);";
								switch (datafield){
										case "appSelected":
												var action = 'router("adminAppClick",this);';
												var inpclass = mygis.Utilities.format("row_{0}",row);
												var checked = this.owner.getselectedrowindexes().indexOf(row)>-1 ? ' checked="checked"' : '';
												var titleObj = strings.AppManager.grid_selectBox;
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 30px;'><input class='{1}' type='checkbox' title='{3}' onclick='{0}'{2}/></div>",
																													 action,inpclass,checked,titleObj);
												break;
										case "hasLogo1":
												if (value){
													retobject = mygis.Utilities.format('<div class="imageVerticalContainer"><img onclick="{0}" src="{1}GetImage.ashx?qType=GetAppLogo1&qContents={2}&qSize=112" /></div>',
																action,
																config.folderPath,
																appID);
												}else{
													retobject = "<span style='margin:9px 4px; float: left;'></span>";
												}
												break;
										case "hasLogo2":
												if (value){
													retobject = mygis.Utilities.format('<div class="imageVerticalContainer"><img onclick="{0}" src="{1}GetImage.ashx?qType=GetAppLogo2&qContents={2}&qSize=112" /></div>',
																action,
																config.folderPath,
																appID);
												}else{
													retobject = "<span style='margin:9px 4px; float: left;'></span>";
												}
												break;
										case "appURLS":
												var urls;
												if (value!=""){
														urls = value.split(",");
												}else{
														urls = [];
												}
												
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 120px;'><span >{0}</span></div>",urls.length);
												break;
										case "appMAPS":
												var maps;
												if (value!=""){
														maps = value.split(",");
												}else{
														maps = [];
												}
												
												var titleObj="";
												$.each(maps,function(i,v){
														var mapName = v.split("$")[0];
														if (i>0){
																titleObj+=",";
														}
														titleObj+=mapName;
												})
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 120px;'><span title='{1}'>{0}</span></div>",maps.length,titleObj);
												break;
										case "appName":
												var action = mygis.Utilities.format('router("appNameClick",{0});',row);
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><a href='#' onclick='{1}'>{0}</a></div>",value,action);
												break;
										case "appOwner":
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 100px;'><span >{0}</span></div>",value);
												break;
										case "appPrefix":
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 100px;'><span >{0}</span></div>",value);
												 
												break;
										default:
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><span >{0}</span></div>",value);
												break;
								}
								return retobject;
						}
						var columnrenderer = function(value){
								var retobject;
								switch (value){
								case strings.AppManager.grid_AppOwner:
								case strings.AppManager.grid_AppPrefix:
								case strings.AppManager.grid_AppWelcome:
								case strings.AppManager.grid_AppURLS:
								case strings.AppManager.grid_AppMAPS:
										retobject = mygis.Utilities.format("<a href='#' style='text-align: center;'>{0}</a>",value);				
										break;
								default:
										var action = 'router("adminAllClick",this);';
										var grid = $("#myAppGrid");
										var selection = grid.jqxGrid('getselectedrowindexes');
										var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
										retobject = mygis.Utilities.format("<div style='text-align: center; margin-top: 5px;position: absolute;left: 9px;z-index: 1;'><input id='adminSelectAllApps' type='checkbox' onclick='{0}'{1}/></div>",action,checked);				
										break;
								}
								
								return retobject;
						}
						var appSource = mygis.Admin.AppManager.Apps.createAppGridSource();
						appContainer.jqxGrid({
								source: appSource,
								width: '100%',
								//height: '100%',
								autoheight: true,
								theme: 'pk_mg_jm',
								altrows: true,
								enabletooltips: true,
								columns: [
									{text: '', datafield: 'appSelected', width: 30, renderer: columnrenderer,columntype: 'checkbox'},
									{text: strings.AppManager.grid_AppName, datafield: 'appName', width: 150, cellsrenderer: cellrenderer, editable:false},
									{text: strings.AppManager.grid_AppOwner, datafield: 'appOwner', width: 100, cellsrenderer: cellrenderer, renderer: columnrenderer, editable:false},
									{text: strings.AppManager.grid_AppPrefix, datafield: 'appPrefix', width: 100,cellsrenderer: cellrenderer, renderer: columnrenderer, editable:false},
									{text: strings.AppManager.grid_AppWelcome, datafield: 'appWelcomeText', cellsrenderer: cellrenderer, renderer: columnrenderer, editable:false},
									{text: strings.AppManager.grid_AppURLS, datafield: 'appURLS', width: 120, cellsrenderer: cellrenderer,renderer: columnrenderer},
									{text: strings.AppManager.grid_AppMAPS, datafield: 'appMAPS', width: 120, cellsrenderer: cellrenderer,renderer: columnrenderer}
									/*,
									{text: strings.AppManager.grid_AppURLS, datafield: 'appURLS', width: 140, cellsrenderer: cellrenderer},
									{text: strings.AppManager.grid_AppLogo1, datafield: 'hasLogo1', width: 140,cellsrenderer: cellrenderer},
									{text: strings.AppManager.grid_AppLogo2, datafield: 'hasLogo2', width: 140,cellsrenderer: cellrenderer}*/
								],
								enableanimations: false,
								showheader: true,
								columnsmenu: true,
								editable: true,
								selectionmode: 'none' /*,
								rowsheight: 120*/
						});
						appContainer.bind('rowselect',mygis.Admin.AppManager.Apps.appSelected);
						appContainer.bind('rowunselect',mygis.Admin.AppManager.Apps.appUnselected);
						appContainer.bind('cellendedit',mygis.Admin.AppManager.Apps.singleCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
					Used to create the source of the grid for the App Manager
					@method createAppGridSource
				**/
				createAppGridSource: function(){
					var myurl = config.mgreq+"?qtype=GetMyApps";
					var appSource;
					var source = {
						datatype: "json",
						datafields: [
							{name: "appSelected",type: "boolean"},
							{name: "appID"},
							{name: "appOwner"},
							{name: "appName"},
							{name: "appPrefix"},
							{name: "appWelcomeText"},
							{name: "appURLS"},
							{name: "appMAPS"},
							{name: "hasLogo1",type: "boolean"},
							{name: "hasLogo2",type: "boolean"}
						],
						id: 'myapps',
						url: myurl
					};
					appSource = new $.jqx.dataAdapter(source,{async:false});
					//appSource.dataBind();
					return appSource;
				},
	
				/**
						Refreshes the list of apps from the server
						@method refreshAppGrid
				**/
				refreshAppGrid: function(){
					var appContainer = $("#myAppGrid");
					appContainer.jqxGrid('updatebounddata');
				},
				
				/**
				* Handles the input change in app settings
				* @method inputChanged
				* @param {Object} event The triggering event object
				*/
			 inputChanged: function(event){
					 var elem = event.currentTarget;
					 var myconfig = mygis.Admin.AppManager.updateConfig;
					 var confObj;
					 switch (elem.id){
							 case "editAppName":
											 confObj=myconfig.appName;
											 break;
							 case "editAppAlias":
											 confObj=myconfig.appAlias;
											 break;
							 case "editAppWelcomeText":
											 confObj=myconfig.appText;
											 break;
					 
					 }
					 
					 confObj.changed=true;
					 confObj.newValue = elem.value;
					 mygis.Admin.AppManager.notifyUnsaved();
			 },
			 
			 /**
				* Stores the initial value of an input element in app settings
				* @method inputStore
				* @param {Object} event The triggering event object
				*/
			 inputStore: function(event){
					 var elem = event.currentTarget;
					 var myconfig = mygis.Admin.AppManager.updateConfig;
					 var confObj;
					 switch (elem.id){
							 case "editAppName":
											 confObj=myconfig.appName;
											 break;
							 case "editAppAlias":
											 confObj=myconfig.appAlias;
											 break;
							 case "editAppWelcomeText":
											 confObj=myconfig.appText;
											 break;
					 
					 }
					 if (!confObj.changed){
							 confObj.oldValue=elem.value;
					 }
			 }
		},
		
		/**
		 * Functions for the maps in the app manager
		 *
		 * @class mygis.Admin.AppManager.Maps
		 * @static
		 */
		Maps: {
				
				
				
				/**
				 * Handles the checking of the map list
				 * @method mapCheckClicked
				 * @param {Element} elem The firing element
				 */
				mapCheckClicked: function(elem){
						var grid = $("#adminMapList");
						if (elem.args.value) {
								grid.jqxGrid('selectrow', elem.args.rowindex);
						}
						else {
								grid.jqxGrid('unselectrow', elem.args.rowindex);
						}
				},
				
				/**
				 * Handles the "check all" btn in the map list
				 * @method mapAllCheck
				 * @param {Element} elem The firing element
				 */
				mapAllCheck: function(elem){
						var grid = $("#adminMapList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].mapSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].mapSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Activates/deactivates some buttons when a map is selected
				 * @method mapSelected
				 * @param {Object} event
				 */
				mapSelected: function(event){
						var grid = $("#adminMapList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								for (var i=1;i<3;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	//i=1: Edit, i=2: Default
										if (!elem.ex_HasClassName("disabled")){
												elem.ex_AddClassName("disabled");
										}
								}
								for (var i=3;i<5;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	//i=3: Unpublish, i=4: Remove
										if (elem.ex_HasClassName("disabled")){
												elem.ex_RemoveClassName("disabled");
										}
								}
								
						}else if (selection.length==1){
								for (var i=1;i<5;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	
										if (elem.ex_HasClassName("disabled")){
												elem.ex_RemoveClassName("disabled");
										}
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllMaps").checked=true;
						}else{
								document.getElementById("adminSelectAllMaps").checked=false;
						}
				},
				
				/**
				 * Activates/deactivates some buttons when a map is unselected
				 * @method mapUnselected
				 * @param {Object} event
				 */
				mapUnselected: function(event){
						var grid = $("#adminMapList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								for (var i=1;i<3;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	//i=1: Edit, i=2: Default
										if (!elem.ex_HasClassName("disabled")){
												elem.ex_AddClassName("disabled");
										}
								}
								for (var i=3;i<5;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	//i=3: Unpublish, i=4: Remove
										if (elem.ex_HasClassName("disabled")){
												elem.ex_RemoveClassName("disabled");
										}
								}
								
						}else if (selection.length==1){
								for (var i=1;i<5;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	
										if (elem.ex_HasClassName("disabled")){
												elem.ex_RemoveClassName("disabled");
										}
								}
						}else{
								for (var i=1;i<5;i++){
										var elem = $("#contentSpecificToolbar .sectionButtons a")[i];	
										if (!elem.ex_HasClassName("disabled")){
												elem.ex_AddClassName("disabled");
										}
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllMaps").checked=true;
						}else{
								document.getElementById("adminSelectAllMaps").checked=false;
						}
				},
				
				/**
				 * Resets the currently selected maps and the assosiated controls
				 * @method mapResetSelection
				 */
				mapResetSelection: function(){
						var grid = $("#adminMapList");
						grid.jqxGrid('clearselection');
						mygis.Admin.AppManager.Maps.mapSelected();	//to reset the controls
				},
				
				/**
				 * Creates the grid for the application's maps
				 * @method createAppMapGrid
				 * @param {Integer} appID The application to query
				 */
				createAppMapGrid: function(appID){
						mygis.Utilities.blockUI();
						var mapSource = mygis.Admin.AppManager.Maps.createAppMapGridSource(appID);
						var mapContainer = $("#adminMapList");
						var columnrenderer = function(value){
								var action = 'router("adminMapAllClick",this);';
								var grid = $("#adminMapList");
								var selection = grid.jqxGrid('getselectedrowindexes');
								var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
								retobject = mygis.Utilities.format("<div style='{2}'><input id='adminSelectAllMaps' type='checkbox' onclick='{0}'{1}/></div>",
																									 action,checked,customStyle);
								return retobject;
						};
						var cellrenderer = function(row,datafield,value){
								var retobject;
								switch(datafield){
										case "mapSelected":
												var action = 'router("adminMapClick",this);';
												var inpclass = mygis.Utilities.format("row_{0}",row);
												var checked = this.owner.getselectedrowindexes().indexOf(row)>-1 ? ' checked="checked"' : '';
												var titleObj = strings.AppManager.grid_selectBox;
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 30px;'><input class='{1}' type='checkbox' title='{3}' onclick='{0}'{2}/></div>",
																													 action,inpclass,checked,titleObj);
												break;
										case "mapName":
												var descr = this.owner.getrowdata(row).mapDescription;
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><a href='#' title='{1}'>{0}</a></div>",value,descr);
												break;
										case "defaultLoad":
												var checked = value?" checked":"";
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 80px;line-height:25px;'><div class='btnStarCheck{0}'></div></div>",checked);
												break;
										default:
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><span >{0}</span></div>",value);
												break;
								}
								
								return retobject;
						};
						mapContainer.bind("bindingcomplete",function(event){
								mygis.Admin.AppManager.setConfigMaps($("#adminMapList").jqxGrid('source').records);
								setTimeout(function(){$("#adminMapList").find('a[title]').qtip();},1000);
						});
						if (mapSource.records.length>0){
								mapContainer.jqxGrid({
										source: mapSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text:'asdf',datafield:'mapSelected', width:45,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapControl.col_mapName, datafield: 'mapName', width: 200, cellsrenderer: cellrenderer,editable:false},
												{text: strings.MapControl.col_mapLCount, datafield: 'mapLayerCount',editable:false,cellsrenderer: cellrenderer,width: 80},
												{text: strings.MapControl.col_mapDefault, datafield: 'defaultLoad', editable:false, cellsrenderer: cellrenderer,width: 80},
												{text: strings.MapControl.col_mapCreate, datafield: 'mapCreateDate',editable:false},
												{text: strings.MapControl.col_mapUpdate, datafield: 'mapUpdateDate',editable:false},
												{text: strings.MapControl.col_mapDeveloped, datafield: 'mapDevelopedBy',editable:false},
												{text: strings.MapControl.col_mapOwner, datafield: 'mapOwner',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								mapContainer.jqxGrid({
										source: mapSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text:'asdf',datafield:'mapSelected', width:45,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapControl.col_mapName, datafield: 'mapName', width: 200, cellsrenderer: cellrenderer,editable:false},
												{text: strings.MapControl.col_mapLCount, datafield: 'mapLayerCount',editable:false,cellsrenderer: cellrenderer,width: 80},
												{text: strings.MapControl.col_mapDefault, datafield: 'defaultLoad', editable:false, cellsrenderer: cellrenderer,width: 80},
												{text: strings.MapControl.col_mapCreate, datafield: 'mapCreateDate',editable:false},
												{text: strings.MapControl.col_mapUpdate, datafield: 'mapUpdateDate',editable:false},
												{text: strings.MapControl.col_mapDeveloped, datafield: 'mapDevelopedBy',editable:false},
												{text: strings.MapControl.col_mapOwner, datafield: 'mapOwner',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});		
						}
						mapContainer.bind("rowselect",mygis.Admin.AppManager.Maps.mapSelected);
						mapContainer.bind("rowunselect",mygis.Admin.AppManager.Maps.mapUnselected);
						mapContainer.bind('cellendedit',mygis.Admin.AppManager.Maps.mapCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Creates the source for the application's maps
				 * @method createAppMapGridSource
				 * @param {Integer} appID The application to query
				 */
				createAppMapGridSource: function(appID){
						var retvalue;
						var url = config.mgreq+"?qtype=GetAppMaps&qContents="+appID;
						var source = {
								datatype: "json",
								datafields: [
										{ name: "mapSelected",type: "boolean"},
										{ name: "mapName" },
										{ name: "mapDescription" },
										{ name: "mapLayerCount" },
										{ name: "id" },
										{ name: "defaultLoad",type: "boolean" },
										{ name: "maxExtent"},
										{ name: "appName"},
										{ name: "mapCenter"},
										{ name: "mapZoom"},
										{ name: "mapCreateDate"},
										{ name: "mapUpdateDate"},
										{ name: "mapDevelopedBy"},
										{ name: "mapOwner"}
								],
								id: 'adminMapList',
								url: url
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						//retvalue.dataBind();
						//mygis.Admin.AppManager.setConfigMaps(retvalue.records);
						return retvalue;
				},
		
				/**
				 *
				 * @method addAppMap
				 */
				addAppMap: function(){
						var myconfig = mygis.Admin.UI.dialogConfig;
						myconfig.checkfn = mygis.Admin.AppManager.Maps.addAppMapCheck;
						myconfig.callbackfn = mygis.Admin.AppManager.Maps.addAppMapResult;
						myconfig.objectCount = 1;
						myconfig.windowTitle = "#mapManager";
						
						var mapContainer = $("#adminMapList");
						var records = mapContainer.jqxGrid('source').records;
						var filterList = "";
						for (var i=0;i<records.length;i++){
								if (i>0){
										filterList +="%23";
								}
								filterList += records[i].id;
						}
						showMapManager(filterList);
				},
				
				/**
				 *
				 * @method addAppMapCheck
				 */
				addAppMapCheck: function(){
						var retvalue=false;
						var grid = $("#mapManagerList");
						var myconfig = mygis.Admin.UI.dialogConfig;
						var selections = grid.jqxGrid('getselectedrowindexes');
						var selectedCount = selections.length;
						var expectedCount = myconfig.objectCount;
						if (selectedCount<expectedCount && expectedCount>-1){
							alert(mygis.Utilities.format(strings.MapManager.err_notEnoughSelected,expectedCount));
						}else{
							var retobject;
							retobject = [];
							for (var i =0;i<selections.length;i++){
								retobject.push(grid.jqxGrid('getrowdata',selections[i]));	
							}
							myconfig.object=  retobject;
							retvalue=true;
						}
						return retvalue;
				},
				
				/**
				 *
				 * @method addAppMapResult
				 */
				addAppMapResult: function(result){
						if (result=="ok"){
								var mapsToAdd =[];
								var gridSource=$("#adminMapList").jqxGrid('source').records;
								var myconfig = mygis.Admin.AppManager.updateConfig;
								var sampleAppName = gridSource[0]?gridSource[0].appName:"" ;
								for (var i=0;i<this.length;i++){
										mapsToAdd.push(this[i].id);
										var r = this[i];
										var item = {
												mapSelected: false,
												mapName: r.mapName,
												mapDescription: r.mapDescription,
												mapLayerCount: r.mapLayerCount,
												id: r.id,
												defaultLoad : false,
												maxExtent: r.maxExtent,
												appName: sampleAppName,
												mapCenter: r.mapCenter,
												mapZoom: r.mapZoom,
												mapCreateDate: r.mapCreateDate,
												mapUpdateDate: r.mapUpdateDate,
												mapDevelopedBy: r.mapDevelopedBy,
												mapOwner: r.mapOwner
										};
										//gridSource.push(item);
										$("#adminMapList").jqxGrid('addrow', null, item);
										var confItem = {
												changed: true,
												oldValue: null,
												newValue: JSON.stringify(item)
										};
										myconfig.maps.push(confItem);
								}
								mygis.Admin.AppManager.notifyUnsaved();
								$("#adminMapList").jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Makes the currently selected map the default one
				 * @method mapMakeDefault
				 */
				mapMakeDefault: function(){
						var grid = $("#adminMapList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						var selectedIndex = selection[0];	//shouldn't be more than 1 anyway
						var records = grid.jqxGrid('source').records;
						var changedFlag = false;
						var myconfig = mygis.Admin.AppManager.updateConfig;
						var previousIndex;
						for (var i=0;i<records.length;i++){
								if (records[i].defaultLoad && i!=selectedIndex){
										records[i].defaultLoad = false;
										changedFlag = true;
										previousIndex = i;
								}else if(i==selectedIndex){
										records[i].defaultLoad = true;
										changedFlag = true;
								}
						}
						if (changedFlag){
								grid.jqxGrid('refreshdata');
								mygis.Admin.AppManager.setConfigMaps(records);
								if (previousIndex){
										myconfig.maps[previousIndex].changed=true;
								}
								myconfig.maps[selectedIndex].changed=true;
								mygis.Admin.AppManager.notifyUnsaved();
						}
						mygis.Admin.AppManager.Maps.mapResetSelection();
						
				},
				
				/**
				 * Deletes the association of the selected maps with the app
				 * @method mapUnpublish
				 */
				mapUnpublish: function(){
						var grid = $("#adminMapList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						var records = grid.jqxGrid('source').records;
						var newRecords=[];
						var myconfig = mygis.Admin.AppManager.updateConfig;
						if (selection.length>0){
								/*
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												newRecords.push(records[i]);
										}
								}
								grid.jqxGrid('source').records = newRecords;
								*/
								for (var i=0;i<selection.length;i++){
										grid.jqxGrid('deleterow',selection[i]);
								}
								grid.jqxGrid('refreshdata');
								
								mygis.Admin.AppManager.setConfigMaps(records);
								for (var i=0;i<myconfig.maps.length;i++){
										myconfig.maps[i].changed=true;	//consider all changed
								}
								mygis.Admin.AppManager.notifyUnsaved();
						}
						mygis.Admin.AppManager.Maps.mapResetSelection();
				},
				
				/**
				 * Deletes the association of the selected maps with their layers (thus deleting the map)
				 * @method mapDelete
				 */
				mapDelete: function(){
						displayNotify(msg_errFeatureNotImplemented);
				}
		
		},
		
		/**
		 * Functions for the urls in the app manager
		 *
		 * @class mygis.Admin.AppManager.URLs
		 * @static
		 */
		URLs: {
				/**
				* Shows the "add new app alias" window
				* @method showAddAlias
				* 
				*/
			 showAddAlias: function(){
					 
					 var myconfig = mygis.Admin.UI.dialogConfig;
					 myconfig.callbackfn=mygis.Admin.AppManager.URLs.addAliasResult;
					 myconfig.objectCount=1;
					 myconfig.windowTitle = "#addAppAliasPop";
					 myconfig.checkfn=mygis.Admin.AppManager.URLs.checkAliasValidity;
					 $("#addAppAliasPop").dialog({
							 autoOpen: true,
							 modal: true,
							 resizable: false,
							 width: 480,
							 height: 200, 
							 title: strings.AppManager.addAlias_WindowTitle,
							 closeOnEscape: false
					 });
					 var titleBar = $("#ui-dialog-title-addAppAliasPop").parent();
					 titleBar.css({
						 "background":"url('"+config.folderPath+"Images/Administration/url_add.png') #F6A828 no-repeat 12px 8px",
						 "background-size":"auto 18px"
						 });
			 },
			 
			 /**
				* @method addAliasResult
				* @param {String} result
				*/
			 addAliasResult: function(result){
					 var resultObj = this.toString();
					 if (!result || result!="ok"){
							 if (result){
								 displayError(result);
							 }
					 }else{
							 mygis.Admin.AppManager.URLs.addAppAlias(resultObj);
					 }
			 },
			 
			 /**
				* Validation method for add new alias
				* @method checkAliasValidity
				*/
			 checkAliasValidity: function(){
					 var myconfig = mygis.Admin.UI.dialogConfig;
					 var inp = $("#chooseHost").val();
					 inp = inp.toLowerCase();
					 var expression = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/gi;
					 var regex = expression; //new RegExp(expression);
					 var protocol=$("#chooseProtocol").val();
					 var port = $("#choosePort").val();
					 $("#addAppAlias_err_WrongHostname").css("visibility","hidden");
					 if (!inp.match(regex) || !mygis.Admin.AppManager.URLs.checkPortValidity()){
							 $("#addAppAlias_err_WrongHostname").html(strings.AppManager.addAlias_err_InvalidUrl);
							 $("#addAppAlias_err_WrongHostname").css("visibility","visible");
					 }else{
							 mygis.Utilities.blockUI();
							 var customUrl = config.mgreq+"?qtype=CheckAlias&qContents="+
															 mygis.Utilities.format("{0}://{1}:{2}/",protocol,inp,port);
							 $.ajax({
									 type: "GET",
									 url: customUrl,
									 async: false,
									 success: function(data){
											 mygis.Utilities.unblockUI();
											 try{
													 var realResults = eval(data);
													 if (realResults.iotype=="success"){
															 var protocol=$("#chooseProtocol").val();
															 var port = $("#choosePort").val();
															 var host = $("#chooseHost").val().toLowerCase();
															 myconfig.object = mygis.Utilities.format("{0}://{1}:{2}/",protocol,host,port);
															 console.log("Success!");
													 }else{
															 //Proper: switch according to server answer:
															 console.log(realResults.iomsg);
															 $("#addAppAlias_err_WrongHostname").html(strings.AppManager.addAlias_err_PlatformRejected);
															 $("#addAppAlias_err_WrongHostname").css("visibility","visible");
													 }
											 }catch(err){
													 console.log(err.message);
											 }
									 }
							 });
					 }
					 return (myconfig.object!=null);
			 },
			 
			 /**
				* Checks if the port number in "add alias" window is valid
				* @method checkPortValidity
				* @returns {Boolean} True if it's valid
				*/
			 checkPortValidity: function(){
					 var retvalue = false;
					 var port = $("#choosePort").val();
					 if (port!="0"){
							 var portRegex = /^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/gi;
							 if (port.match(portRegex)){
									 retvalue=true;
							 }
							 if (!retvalue){
									 $("#addAppAlias_err_WrongPort").html(strings.AppManager.addAlias_err_PortNumber);
									 $("#addAppAlias_err_WrongPort").css("visibility","visible");
							 }else{
									 $("#addAppAlias_err_WrongPort").css("visibility","hidden");
							 }
					 }
					 return retvalue;
			 },
			 
			 /**
				* @method addAppAlias
				* @param {String} url
				*/
			 addAppAlias: function(url){
					 var toSend = mygis.Utilities.format("{0}#{1}",mygis.Admin.AppManager.updateConfig.appID,url);
					 var postObject = new Object();
					 postObject["qContents"]=toSend;
					 var customUrl = config.mgreq+"?qtype=AddAppAlias";
					 $.ajax({
							 type:"POST",
							 data: postObject,
							 url: customUrl,
							 success: function(data){
									 try{
											 var realResults = eval(data);
											 if (realResults.iotype=="success"){
													 displaySuccess(strings.AppManager.addAlias_operationSuccess);
													 $("#adminURLList").jqxGrid('updatebounddata');
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
				* Removes the selected app aliases
				* @method urlDelete
				*/
			 urlDelete: function(){
					 var grid = $("#adminURLList");
					 var selection = grid.jqxGrid('getselectedrowindexes');
					 var recordCount = grid.jqxGrid('source').records.length;
					 if (selection.length==recordCount || recordCount==1){
							 displayError(strings.AppManager.deleteAlias_err_NotAll)
					 }else{
							 var message = mygis.Utilities.format(strings.AppManager.deleteAlias_err_YouSure,selection.length);
							 showConfirmationDialog(message,function(){
									 var grid = $("#adminURLList");
									 var selection = grid.jqxGrid('getselectedrowindexes');
									 var urls= [];
									 for (var i=0;i<selection.length;i++){
											 urls.push(grid.jqxGrid('getrowdata',selection[i]).appURL);
									 }
									 var customUrl = config.mgreq+"?qtype=RemoveAppAlias";
									 var postObject = new Object();
									 postObject["qContents"]=urls.join("#");
									 mygis.Utilities.blockUI();
									 $.ajax({
											 type: "POST",
											 data:postObject,
											 url: customUrl,
											 success: function(data){
													 mygis.Utilities.unblockUI();
													 try{
															 var realResults = eval(data);
															 if (realResults.iotype=="success"){
																	 displaySuccess(strings.AppManager.urls_updated);
																	 var grid = $("#adminURLList");
																	 grid.jqxGrid('updatebounddata');
															 }else{
																	 displayError(realResults.iomsg);
															 }
													 }catch(err){
															 console.log(err.message);
													 }
											 }
									 });
							 });
					 }
			 },
		 
			 
			 /**
				* Handles the clicking of the checkbox in each row at the URL Manager
				* @method urlCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
			 urlCheckClicked: function(elem){
					 var grid = $("#adminURLList");
					 if (elem.args.value) {
							 grid.jqxGrid('selectrow', elem.args.rowindex);
					 }
					 else {
							 grid.jqxGrid('unselectrow', elem.args.rowindex);
					 }
			 },
			 
			 /**
				* Handles the "check all" button in the app settings->URLs
				* @method urlAllCheck
				* @param {Element} elem The firing checkbox
				*/
			 urlAllCheck: function(elem){
					 var grid = $("#adminURLList");
					 var records = grid.jqxGrid('source').records;
					 var selection = grid.jqxGrid('getselectedrowindexes');
					 if (elem.checked){
							 for (var i=0;i<records.length;i++){
									 if (selection.indexOf(i)==-1){
											 records[i].urlSelected=true;
											 grid.jqxGrid('selectrow',i)
									 }
							 }
							 grid.jqxGrid('refreshdata');
					 }else{
							 for (var i=0;i<records.length;i++){
									 records[i].urlSelected=false;
									 grid.jqxGrid('unselectrow',i)
							 }
							 grid.jqxGrid('refreshdata');
					 }
			 },
			 
			 /**
				* Activates/deactivates some buttons when a url is selected in the app settings->URLs
				* @method urlSelected
				* @param {Object} event
				*/
			 urlSelected: function(event){
					 var grid = $("#adminURLList");
					 var selection = grid.jqxGrid('getselectedrowindexes');
					 $("#contentSpecificToolbar .sectionButtons a")[1].ex_RemoveClassName("disabled");
					 if (selection.length==grid.jqxGrid('source').records.length){
							 document.getElementById("adminSelectAllUrls").checked=true;
					 }else{
							 document.getElementById("adminSelectAllUrls").checked=false;
					 }
			 },
			 
			 /**
				* Activates/deactivates some buttons when a url is selected in the app settings->URLs
				* @method urlUnselected
				* @param {Object} event
				*/
			 urlUnselected: function(event){
					 var grid = $("#adminURLList");
					 var selection = grid.jqxGrid('getselectedrowindexes');
					 if (selection.length>0){
							 $("#contentSpecificToolbar .sectionButtons a")[1].ex_RemoveClassName("disabled");
					 }else{
							 if (!$("#contentSpecificToolbar .sectionButtons a")[1].ex_HasClassName("disabled")){
									 $("#contentSpecificToolbar .sectionButtons a")[1].ex_AddClassName("disabled");
							 }
					 }
					 if (selection.length==grid.jqxGrid('source').records.length){
							 document.getElementById("adminSelectAllUrls").checked=true;
					 }else{
							 document.getElementById("adminSelectAllUrls").checked=false;
					 }
				},
		
				
				/**
				 * Creates the grid for the application's aliases
				 * @method createAppURLGrid
				 * @param {Integer} appID The application to query
				 */
				createAppURLGrid: function(appID){
						mygis.Utilities.blockUI();
						var urlSource = mygis.Admin.AppManager.URLs.createAppURLGridSource(appID);
						var urlContainer = $("#adminURLList");
						var columnrenderer = function(value){
								var retobject;
								switch (value){
										case strings.AppManager.urlgrid_URL:
												retobject = mygis.Utilities.format("<a href='#' style='text-align: center;'>{0}</a>",value);	
												break;
										default:
												var action = 'router("adminURlAllClick",this);';
												var grid = $("#adminURLList");
												var selection = grid.jqxGrid('getselectedrowindexes');
												var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
												var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 9px;z-index: 1;";
												retobject = mygis.Utilities.format("<div style='{2}'><input id='adminSelectAllUrls' type='checkbox' onclick='{0}'{1}/></div>",
																													 action,checked,customStyle);
												break;
								}
								return retobject;
						}
						var cellrenderer = function(row,datafield,value){
								switch (datafield){
										case "urlSelected":
												var action = 'router("adminAppClick",this);';
												var inpclass = mygis.Utilities.format("row_{0}",row);
												var checked = this.owner.getselectedrowindexes().indexOf(row)>-1 ? ' checked="checked"' : '';
												var titleObj = strings.AppManager.grid_selectBox;
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 30px;'><input class='{1}' type='checkbox' title='{3}' onclick='{0}'{2}/></div>",
																													 action,inpclass,checked,titleObj);
												break;
								}
						}
						urlContainer.bind("bindingcomplete",function(event){
								mygis.Admin.AppManager.setConfigUrls($("#adminURLList").jqxGrid('source').records);
						});
						if (urlSource.records.length>0){
								urlContainer.jqxGrid({
										source: urlSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf',datafield: 'urlSelected',width: 30, renderer: columnrenderer,columntype: 'checkbox'},
												{text: strings.AppManager.urlgrid_URL,datafield: 'appURL'}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								urlContainer.jqxGrid({
										source: urlSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf',datafield: 'urlSelected',width: 30, renderer: columnrenderer,columntype: 'checkbox'},
												{text: strings.AppManager.urlgrid_URL,datafield: 'appURL'}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}
						
						urlContainer.bind('rowselect',mygis.Admin.AppManager.URLs.urlSelected);
						urlContainer.bind('rowunselect',mygis.Admin.AppManager.URLs.urlUnselected);
						urlContainer.bind('cellendedit',mygis.Admin.AppManager.URLs.urlCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Creates the source for the application's aliases
				 * @method createAppURLGridSource
				 * @param {Integer} appID
				 */
				createAppURLGridSource: function(appID){
						var retvalue;
						var url = config.mgreq+"?qtype=GetAppURLs&qContents="+appID;
						var source = {
								datatype: "json",
								datafields: [
									{name: "urlSelected",type: "boolean"},	
									{ name: "appURL" }
								],
								id: 'aliasList',
								url: url
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						//retvalue.dataBind();
						//mygis.Admin.AppManager.setConfigUrls(retvalue.records);
						return retvalue;
				}
		
		
		},
		
		/**
		 * Functions for the styles in the app manager
		 *
		 * @class mygis.Admin.AppManager.Styles
		 * @static
		 */
		Styles: {
				
				/**
				 * The text editor object
				 * @property editor
				 * @type {Object}
				 */
				editor: null,
				
				/**
				 * Previews that style for a few seconds
				 * @method stylePreview
				 * @param {Integer} styleID
				 * @param {Integer} duration	The duration in seconds to keep the preview
				 */
				stylePreview: function(styleID,duration){
						mygis.Utilities.previewCustomization(styleID);
						$("#page_administration").animate({opacity: 0},1000);
						$("#page_effect").css({
									"display":"block",
									"opacity":0
						});
						$("#page_effect").animate({opacity:1},1000,null,function(){
								setTimeout(mygis.Admin.AppManager.Styles.cancelPreview,1000*duration);
						});
				},
				
				/**
				 * Cancels the style preview
				 * @method cancelPreview
				 */
				cancelPreview: function(){
						$("#page_effect").css({
									"display":"none",
									"opacity":1
						});
						$("#page_administration").animate({opacity: 1},1000);
						mygis.Utilities.enableCustomization();	
				},
				
				/**
				* Handles the clicking of the checkbox in each row at the Style Manager
				* @method singleCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
				singleCheckClicked: function(elem){
						var grid = $("#adminStyleList");
						if (elem.args.value) {
								grid.jqxGrid('selectrow', elem.args.rowindex);
						}
						else {
								grid.jqxGrid('unselectrow', elem.args.rowindex);
						}
				},
			 
			 
				/**
				 * Handles the check button in the Style Manager
				 * @method allCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				allCheckClicked: function(elem){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].styleSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].styleSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
			
				/**
					Activates/deactivates some buttons when a style is selected
					@method styleSelected
					@param {Object} event
				**/
				styleSelected: function(event){
						var grid = $("#adminStyleList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("appStyle_Edit").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_Copy").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Copy").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_CopyTo").ex_HasClassName("disabled")){
										document.getElementById("appStyle_CopyTo").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_MakeDefault").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeDefault").ex_AddClassName("disabled");
								}
								
								if (document.getElementById("appStyle_MakePublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakePublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeUnpublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeUnpublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Remove").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Remove").ex_RemoveClassName("disabled");
								}
								
								
						}else{
								if (document.getElementById("appStyle_Edit").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Edit").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Copy").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Copy").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_CopyTo").ex_HasClassName("disabled")){
										document.getElementById("appStyle_CopyTo").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeDefault").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeDefault").ex_RemoveClassName("disabled");
								}
								
								if (document.getElementById("appStyle_MakePublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakePublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeUnpublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeUnpublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Remove").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Remove").ex_RemoveClassName("disabled");
								}
								
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllStyles").checked=true;
						}else{
								document.getElementById("adminSelectAllStyles").checked=false;
						}
						
					
				},
				
				/**
					Activates/deactivates some buttons when a style is unselected.
					@method styleUnselected
					@param {Object} event
				**/
				styleUnselected: function(event){
						var grid = $("#adminStyleList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("appStyle_Edit").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_Copy").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Copy").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_CopyTo").ex_HasClassName("disabled")){
										document.getElementById("appStyle_CopyTo").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_MakeDefault").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeDefault").ex_AddClassName("disabled");
								}
								
								if (document.getElementById("appStyle_MakePublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakePublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeUnpublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeUnpublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Remove").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Remove").ex_RemoveClassName("disabled");
								}
								
								
						}else if (selection.length==1){
								if (document.getElementById("appStyle_Edit").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Edit").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Copy").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Copy").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_CopyTo").ex_HasClassName("disabled")){
										document.getElementById("appStyle_CopyTo").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeDefault").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeDefault").ex_RemoveClassName("disabled");
								}
								
								if (document.getElementById("appStyle_MakePublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakePublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_MakeUnpublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeUnpublish").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("appStyle_Remove").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Remove").ex_RemoveClassName("disabled");
								}
								
						}else{
								if (!document.getElementById("appStyle_Edit").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_Copy").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Copy").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_CopyTo").ex_HasClassName("disabled")){
										document.getElementById("appStyle_CopyTo").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_MakeDefault").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeDefault").ex_AddClassName("disabled");
								}
								
								if (!document.getElementById("appStyle_MakePublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakePublish").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_MakeUnpublish").ex_HasClassName("disabled")){
										document.getElementById("appStyle_MakeUnpublish").ex_AddClassName("disabled");
								}
								if (!document.getElementById("appStyle_Remove").ex_HasClassName("disabled")){
										document.getElementById("appStyle_Remove").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllStyles").checked=true;
						}else{
								document.getElementById("adminSelectAllStyles").checked=false;
						}
				},
				
				/**
				 * Creates the grid for the application's styles
				 * @method createAppStylesGrid
				 * @param {Integer} appID The application to query
				 */
				createAppStylesGrid: function(appID){
						mygis.Utilities.blockUI();
						var styleSource = mygis.Admin.AppManager.Styles.createAppStylesGridSource(appID);
						var styleContainer = $("#adminStyleList");
						var columnrenderer = function(value){
								var action = '';
								var grid = $("#adminStyleList");
								switch (value){
										case strings.AppManager.grid_Style_IsActive:
										case strings.AppManager.grid_Style_Published:
												retobject = mygis.Utilities.format("<div style='text-align: center; width: 100%;height: 100%;'><a href='#'>{0}</a>",value);
												break;
										default:
												var action = 'router("adminStyleAllClick",this);';
												var selection = grid.jqxGrid('getselectedrowindexes');
												var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
												var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
												action = 
												retobject = mygis.Utilities.format("<div style='{2}'><input id='adminSelectAllStyles' type='checkbox' onclick='{0}'{1}/></div>",
																													 action,checked,customStyle);
												break;
								}
								
								return retobject;
						};
						var cellrenderer = function(row,datafield,value){
								var retobject;
								switch(datafield){
										case "layoutName":
												var action = mygis.Utilities.format('router("app_directEditStyle",{0});',row);
												var mystyle = "text-align: left; width: 200px;";
												retobject = mygis.Utilities.format("<div style='{2}'><a href='#' onclick='{0}' style='margin-left: 5px;margin-top: 6px;display:block;font-size:11px;'>{1}</a></div>",action,value,mystyle);
												break;
										case "isActive":
												var checked = value?" checked":"";
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 80px;line-height:25px;'><div class='btnStarCheck{0}'></div></div>",checked);
												break;
										case "isPublished":
												var checked = value?" checked":"";
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 80px;line-height:25px;'><a href='#' class='btnTickCheck{0}'></a></div>",checked);
												break;
										case "id":
												
												var action = mygis.Utilities.format('router("adminStylePreview",{0});',value);
												var mystyle = "text-align: center; width: 200px;";
												var selector = mygis.Utilities.format("<select id='stylePreviewTimer_{6}'><option value='{1}' selected='selected'>{1}{0}</option><option value='{2}'>{2}{0}</option><option value='{3}'>{3}{0}</option><option value='{4}'>{4}{0}</option><option value='{5}'>{5}{0}</option></select>",
																															strings.Coding.seconds,2,5,10,30,60,value);
												if (!value){
														retobject = "";		
												}else{
														retobject = mygis.Utilities.format("<div style='{2}'><a href='#' onclick='{0}' style='margin-top: 6px;width: 100px;display:inline-block;font-size:11px;'>{1}</a>{3}</div>",action,"Προεπισκόπηση",mystyle,selector);
												}
												break;
								}
								
								return retobject;
						};
						styleContainer.bind("bindingcomplete",function(event){
								mygis.Admin.AppManager.Styles.setConfigStyles($("#adminStyleList").jqxGrid('source').records);		
						});
						
						if (styleSource.records.length>0){
								styleContainer.jqxGrid({
										source: styleSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: '', datafield: 'styleSelected', width: 45, renderer: columnrenderer,columntype: 'checkbox'},
												{text: strings.AppManager.grid_Style_Name, datafield: 'layoutName', cellsrenderer: cellrenderer,editable:false},
												{text: strings.AppManager.grid_Style_IsActive, datafield: 'isActive', renderer: columnrenderer, width: 80,editable:false, cellsrenderer: cellrenderer},
												{text: strings.AppManager.grid_Style_Published, datafield: 'isPublished', renderer: columnrenderer, width: 80,editable:false, cellsrenderer: cellrenderer},
												{text: '', datafield: 'id', editable:false, cellsrenderer: cellrenderer,width: 200}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								styleContainer.jqxGrid({
										source: styleSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: '', datafield: 'styleSelected', width: 45, renderer: columnrenderer,columntype: 'checkbox'},
												{text: strings.AppManager.grid_Style_Name, datafield: 'layoutName', cellsrenderer: cellrenderer,editable:false},
												{text: strings.AppManager.grid_Style_IsActive, datafield: 'isActive', renderer: columnrenderer, width: 80,editable:false, cellsrenderer: cellrenderer},
												{text: strings.AppManager.grid_Style_Published, datafield: 'isPublished', renderer: columnrenderer, width: 80,editable:false, cellsrenderer: cellrenderer},
												{text: '', datafield: 'id', editable:false, cellsrenderer: cellrenderer,width: 200}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});		
						}
						styleContainer.bind("rowselect",mygis.Admin.AppManager.Styles.styleSelected);
						styleContainer.bind("rowunselect",mygis.Admin.AppManager.Styles.styleUnselected);
						styleContainer.bind('cellendedit',mygis.Admin.AppManager.Styles.singleCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Creates the source for the application's styles
				 * @method createAppStylesGridSource
				 * @param {Integer} appID The application to query
				 */
				createAppStylesGridSource: function(appID){
						var retvalue;
						var url = config.mgreq+"?qtype=GetAppStyles&qContents="+appID;
						var source = {
								datatype: "json",
								datafields: [
										{ name: "styleSelected",type: "boolean"},
										{ name: "id"},
										{ name: "layoutName"},
										{ name: "isActive",type: "boolean"},
										{ name: "isPublished",type: "boolean"},
										{ name: "headerOn",type: "boolean"},
										{ name: "headerHeight"},
										{ name: "headerBG"},
										{ name: "headerTextColor"},
										{ name: "textBG"},
										{ name: "textRadius"},
										{ name: "theme1_FillSelectBG"},
										{ name: "theme1_FillSelectBorderColor"},
										{ name: "theme1_FillBG"},
										{ name: "theme1_FillBorderColor"},
										{ name: "menuColor"},
										{ name: "menuActiveColor"},
										{ name: "rightPanel_TopBG"},
										{ name: "rightPanel_TabsBG"},
										{ name: "rightPanel_TopColor"},
										{ name: "rightPanel_TabColor"},
										{ name: "rightPanel_TabActiveColor"},
										{ name: "mapHeaderBG"},
										{ name: "mapDescriptionSize"},
										{ name: "mapDescriptionColor"},
										{ name: "mapFooterBG"},
										{ name: "mapFooterFontColor"},
										{ name: "customCSS_enabled",type: "boolean"},
										{ name: "customCSS"}
								],
								id: 'madminStyleList',
								url: url
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						//retvalue.dataBind();
						//mygis.Admin.AppManager.Styles.setConfigStyles(retvalue.records);
						return retvalue;
				},
				
				/**
				* Updates the config object with the source styles
				* @method setConfigMaps
				*/
				setConfigStyles: function(source){
						var finalList = [];
						for (var i=0;i<source.length;i++){
								var item = {
										changed: false,
										newValue: null,
										oldValue : null
								};
								item.oldValue = JSON.stringify(source[i]);
								finalList.push(item);
						}
						mygis.Admin.AppManager.updateConfig.styles=finalList;
				},
				
				/**
				 * Pops up a dialog to edit an application style
				 * @method showEditStyle
				 * @param {Boolean} isNew True if this is a completely new style
				 */
				showEditStyle: function(isNew){
						var windowTitle;
						var myconfig = mygis.Admin.UI.dialogConfig;
						
						if (isNew){
								$("#editStyleActionsTitle").attr('class','newStyle');
								windowTitle = strings.AppManager.window_NewStyle;
						}else{
								$("#editStyleActionsTitle").attr('class','editStyle');
								windowTitle = strings.AppManager.window_EditStyle;
						}
						$("#editActionsTitleElem").html(windowTitle);
						myconfig.checkfn = mygis.Admin.AppManager.Styles.editStyleCheck;
						myconfig.callbackfn = mygis.Admin.AppManager.Styles.editStyleResult;
						myconfig.objectCount = -1;
						myconfig.windowTitle = "#editStylePop";
						
						if (!isNew){
								var grid = $("#adminStyleList");
								var records = grid.jqxGrid('source').records;
								var selection = grid.jqxGrid('getselectedrowindexes');
								var item = records[selection[0]];
								mygis.Admin.AppManager.Styles.setupEditStyleButtons(item);
								myconfig.objectCount = item.id;
								myconfig.callbackfn = mygis.Admin.AppManager.Styles.editStyleUpdateResult;
						}else{
								var item = {
										customCSS: "",
										customCSS_enabled: false,
										headerBG: "#FAA419",
										headerHeight: "60px",
										headerOn: true,
										headerTextColor: "white",
										layoutName: strings.AppManager.addStyle_NewStyleName +" "+new Date().toString(Date.CultureInfo.formatPatterns.fullDateTime),
										mapDescriptionColor: "#FFFFFF",
										mapDescriptionSize: "20px",
										mapFooterBG: "rgba(0, 0, 0, 0.45)",
										mapFooterFontColor: "#FFFFFF",
										mapHeaderBG: "rgba(0, 0, 0, 0.5)",
										menuActiveColor: "#333333",
										menuColor: "#333333",
										rightPanel_TabActiveColor: "#FFFFFF",
										rightPanel_TabColor: "#FFFFFF",
										rightPanel_TabsBG: "#777777",
										rightPanel_TopBG: "#555555",
										rightPanel_TopColor: "#FFFFFF",
										textBG: "rgba(141, 141, 141, 0.4)",
										textRadius: "15px",
										theme1_FillBG: "#FAA419",
										theme1_FillBorderColor: "#FAA419",
										theme1_FillSelectBG: "#FAA419",
										theme1_FillSelectBorderColor: "#FAA419"
								};
								mygis.Admin.AppManager.Styles.setupEditStyleButtons(item);
						}
						
						$("#editStylePop").dialog({
								autoOpen: true,
								modal: true,
								resizable: false,
								width: 900,
								height: 510, 
								title: strings.AppManager.window_StyleManager,
								closeOnEscape: false
						});
						
				},
				
				/**
				 * Sets up the UI (jqx widgets, color pickers, handlers etc
				 * @method setupEditStyleButtons
				 * @param {Object} defaultItem The item that sets up the default parameters
				 */
				setupEditStyleButtons: function(defaultItem){
						$("#saveStyleAs").val(defaultItem.layoutName);
						
						//SET COLORS:
						$("#appSetting_HeaderBG").val(mygis.Utilities.rgbaToHex(defaultItem.headerBG));
						$("#appSetting_HeaderTextBG").val(mygis.Utilities.rgbaToHex(defaultItem.textBG));
						$("#appSetting_HeaderTextColor").val(defaultItem.headerTextColor);
						$("#appSetting_menuBackground").val(mygis.Utilities.rgbaToHex(defaultItem.theme1_FillBG));
						$("#appSetting_menuBackgroundBorder").val(defaultItem.theme1_FillBorderColor);
						$("#appSetting_menuColor").val(defaultItem.menuColor);
						$("#appSetting_menuBackgroundActive").val(mygis.Utilities.rgbaToHex(defaultItem.theme1_FillSelectBG));
						$("#appSetting_menuBackgroundBorderActive").val(defaultItem.theme1_FillSelectBorderColor);
						$("#appSetting_menuΑctiveColor").val(defaultItem.menuActiveColor);
						$("#appSetting_TopBackground").val(mygis.Utilities.rgbaToHex(defaultItem.rightPanel_TopBG));
						$("#appSetting_TopColor").val(defaultItem.rightPanel_TopColor);
						$("#appSetting_MidBackground").val(mygis.Utilities.rgbaToHex(defaultItem.rightPanel_TabsBG));
						$("#appSetting_MidColor").val(defaultItem.rightPanel_TabColor);
						$("#appSetting_MidActiveColor").val(defaultItem.rightPanel_TabActiveColor);
						//these colors need parsing:
						$("#appSetting_mapHeaderBG").val(mygis.Utilities.rgbaToHex(defaultItem.mapHeaderBG));
						$("#appSetting_mapFooterBG").val(mygis.Utilities.rgbaToHex(defaultItem.mapFooterBG));
						//back to colors:
						$("#appSetting_mapDescriptionColor").val(defaultItem.mapDescriptionColor);
						$("#appSetting_mapFooterFontColor").val(defaultItem.mapFooterFontColor);
						
						//now run:
						$("#editStyleContent input[type=hidden]").prop("type","color");
						$("#editStyleContent span.mColorPicker").remove();
						$("#editStyleContent input[type=color]").mColorPicker();
						$("#appSetting_HeaderHeight").jqxNumberInput({
								width: '40px',
								height: '17px',
								inputMode: 'simple',
								min: 1,
								decimal: parseInt(defaultItem.headerHeight),
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_HeaderTextRadius").jqxNumberInput({
								width: '40px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								decimal: parseInt(defaultItem.textRadius),
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_mapHeaderOpacity").jqxNumberInput({
								width: '40px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.mapHeaderBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_mapFooterOpacity").jqxNumberInput({
								width: '40px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.mapFooterBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						
						// -----opacity sliders-----
						$("#appSetting_MidBGOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.rightPanel_TabsBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_TopBGOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.rightPanel_TopBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_menuBGActiveOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.theme1_FillSelectBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_menuBGOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.theme1_FillBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_HeaderTextOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.textBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						$("#appSetting_HeaderOpacity").jqxNumberInput({
								width: '45px',
								height: '17px',
								inputMode: 'simple',
								min: 0,
								max: 100,
								decimal: parseFloat(mygis.Utilities.getOpacityRGBA(defaultItem.headerBG))*100,
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						
						
						// ----------------------
						$("#appSetting_mapDescriptionSize").jqxNumberInput({
								width: '40px',
								height: '17px',
								inputMode: 'simple',
								min: 8,
								max: 40,
								decimal: parseInt(defaultItem.mapDescriptionSize),
								decimalDigits: 0,
								spinButtons: true,
								theme: 'classic'
						});
						mygis.Admin.AppManager.Styles.createEditor();
						mygis.Admin.AppManager.Styles.bindHandlers();
				},
				
				/**
				 * Binds various handlers in the interface
				 * @method bindHandlers
				 */
				bindHandlers: function(){
						$("#appSetting_enableHeader").bind("change",function(){mygis.Admin.AppManager.Styles.toggleSubMenu(this);});
						$("#appSetting_expertModeToggle").bind("change",function(){mygis.Admin.AppManager.Styles.toggleSubMenu(this);});
				},
				
				/**
				 * Checking the validity of the input in the edit style dialog
				 * @method editStyleCheck
				 */
				editStyleCheck: function(){
						var retvalue = false;
						var grid = $("#adminStyleList");
						var myconfig = mygis.Admin.UI.dialogConfig;
						var retobject;
						retobject = [];
						/*
						 *$('#appSetting_HeaderTextRadius').jqxNumberInput('decimal') + 'px'
						 *
						 */
						var item = {
								styleSelected: false,
								id: null,
								layoutName: $("#saveStyleAs").val(),
								isActive: false,
								isPublished: false,
								headerOn: $("#appSetting_enableHeader").is(':checked'),
								headerHeight: $('#appSetting_HeaderHeight').jqxNumberInput('decimal') + 'px',
								headerBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_HeaderBG").val(),
																										$('#appSetting_HeaderOpacity').jqxNumberInput('decimal')
																										),
								headerTextColor: $("#appSetting_HeaderTextColor").val(),
								textBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_HeaderTextBG").val(),
																										$('#appSetting_HeaderTextOpacity').jqxNumberInput('decimal')
																										),
								textRadius: $('#appSetting_HeaderTextRadius').jqxNumberInput('decimal') + 'px',
								theme1_FillSelectBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_menuBackgroundActive").val(),
																										$('#appSetting_menuBGActiveOpacity').jqxNumberInput('decimal')
																										),
								theme1_FillSelectBorderColor: $("#appSetting_menuBackgroundBorderActive").val(),
								theme1_FillBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_menuBackground").val(),
																										$('#appSetting_menuBGOpacity').jqxNumberInput('decimal')
																										),
								theme1_FillBorderColor: $("#appSetting_menuBackgroundBorder").val(),
								menuColor: $("#appSetting_menuColor").val(),
								menuActiveColor: $("#appSetting_menuΑctiveColor").val(),
								rightPanel_TopBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_TopBackground").val(),
																										$('#appSetting_TopBGOpacity').jqxNumberInput('decimal')
																										),
								rightPanel_TabsBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_MidBackground").val(),
																										$('#appSetting_MidBGOpacity').jqxNumberInput('decimal')
																										),
								rightPanel_TopColor: $("#appSetting_TopColor").val(),
								rightPanel_TabColor: $("#appSetting_MidColor").val(),
								rightPanel_TabActiveColor: $("#appSetting_MidActiveColor").val(),
								mapHeaderBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_mapHeaderBG").val(),
																										$('#appSetting_mapHeaderOpacity').jqxNumberInput('decimal')
																										),
								mapDescriptionSize: $('#appSetting_mapDescriptionSize').jqxNumberInput('decimal') + 'px',
								mapDescriptionColor: $("#appSetting_mapDescriptionColor").val(),
								mapFooterBG:
										mygis.Admin.Utilities.getRGBA(
																										$("#appSetting_mapFooterBG").val(),
																										$('#appSetting_mapFooterOpacity').jqxNumberInput('decimal')
																										),
								mapFooterFontColor: $("#appSetting_mapFooterFontColor").val(),
								customCSS_enabled: $("#appSetting_expertModeToggle").is(':checked'),
								customCSS: ""
						};
						retobject.push(item);
						myconfig.object=retobject;
						retvalue = true;
						return retvalue;
				},
				
				/**
				 * Adds a copy of the selected style to the grid
				 * @method saveAsCopy
				 */
				saveAsCopy: function(){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var r = records[selection[0]];
						var myconfig = mygis.Admin.AppManager.updateConfig;
						var item = {
								styleSelected: false,
								id: -1,
								layoutName: (r.layoutName + strings.AppManager.addStyle_CopySuffix + new Date().toString(Date.CultureInfo.formatPatterns.fullDateTime)).substring(0,99),
								isActive: r.isActive,
								isPublished: r.isPublished,
								headerOn: r.headerOn,
								headerHeight: r.headerHeight,
								headerBG: r.headerBG,
								headerTextColor: r.headerTextColor,
								textBG: r.textBG,
								textRadius: r.textRadius,
								theme1_FillSelectBG: r.theme1_FillSelectBG,
								theme1_FillSelectBorderColor: r.theme1_FillSelectBorderColor,
								theme1_FillBG: r.theme1_FillBG,
								theme1_FillBorderColor: r.theme1_FillBorderColor,
								menuColor: r.menuColor,
								menuActiveColor: r.menuActiveColor,
								rightPanel_TopBG: r.rightPanel_TopBG,
								rightPanel_TabsBG: r.rightPanel_TabsBG,
								rightPanel_TopColor: r.rightPanel_TopColor,
								rightPanel_TabColor: r.rightPanel_TabColor,
								rightPanel_TabActiveColor: r.rightPanel_TabActiveColor,
								mapHeaderBG: r.mapHeaderBG,
								mapDescriptionSize: r.mapDescriptionSize,
								mapDescriptionColor: r.mapDescriptionColor,
								mapFooterBG: r.mapFooterBG,
								mapFooterFontColor: r.mapFooterFontColor,
								customCSS_enabled: r.customCSS_enabled,
								customCSS: r.customCSS
						};
						grid.jqxGrid('addrow',null,item);
						var confItem = {
								changed: true,
								oldvalue: null,
								newValue: JSON.stringify(item)
						};
						myconfig.styles.push(confItem);
						mygis.Admin.AppManager.notifyUnsaved();
						grid.jqxGrid('refreshdata');
				},
				
				/**
				 * Handling the result of the edit style dialog if it's a new item
				 * @method editStyleResult
				 * @param {String} result Whether it was successful ("ok") or not
				 */
				editStyleResult: function(result){
						if (result=="ok"){
								var grid = $("#adminStyleList");
								var gridSource = grid.jqxGrid('source').records;
								var myconfig = mygis.Admin.AppManager.updateConfig;
								var dialogConfig = mygis.Admin.UI.dialogConfig;
								for (var i=0;i<this.length;i++){
										var r = this[i];
										var item = {
												styleSelected: false,
												id: -1,
												layoutName: r.layoutName,
												isActive: r.isActive,
												isPublished: r.isPublished,
												headerOn: r.headerOn,
												headerHeight: r.headerHeight,
												headerBG: r.headerBG,
												headerTextColor: r.headerTextColor,
												textBG: r.textBG,
												textRadius: r.textRadius,
												theme1_FillSelectBG: r.theme1_FillSelectBG,
												theme1_FillSelectBorderColor: r.theme1_FillSelectBorderColor,
												theme1_FillBG: r.theme1_FillBG,
												theme1_FillBorderColor: r.theme1_FillBorderColor,
												menuColor: r.menuColor,
												menuActiveColor: r.menuActiveColor,
												rightPanel_TopBG: r.rightPanel_TopBG,
												rightPanel_TabsBG: r.rightPanel_TabsBG,
												rightPanel_TopColor: r.rightPanel_TopColor,
												rightPanel_TabColor: r.rightPanel_TabColor,
												rightPanel_TabActiveColor: r.rightPanel_TabActiveColor,
												mapHeaderBG: r.mapHeaderBG,
												mapDescriptionSize: r.mapDescriptionSize,
												mapDescriptionColor: r.mapDescriptionColor,
												mapFooterBG: r.mapFooterBG,
												mapFooterFontColor: r.mapFooterFontColor,
												customCSS_enabled: r.customCSS_enabled,
												customCSS: r.customCSS
										};
										grid.jqxGrid('addrow',null,item);
										var confItem = {
												changed: true,
												oldvalue: null,
												newValue: JSON.stringify(item)
										};
										myconfig.styles.push(confItem)
								}
								mygis.Admin.AppManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Handling the result of the edit style dialog if it's an existing item
				 * @method editStyleUpdateResult
				 * @param {String} result Whether it was successful ("ok") or not
				 */
				editStyleUpdateResult: function(result){
						if (result=="ok"){
								var grid = $("#adminStyleList");
								var gridSource = grid.jqxGrid('source').records;
								var myconfig = mygis.Admin.AppManager.updateConfig;
								var dialogConfig = mygis.Admin.UI.dialogConfig;
								
								var r = this[0];
								var found =false;
								var counter = 0;
								var itemIndex = -1;
								while (!found && counter<gridSource.length){
										if (gridSource[counter].id==dialogConfig.objectCount){
												found=true;
												itemIndex =counter;
										}
										counter++;
								}
								if (found){
										var item= {
												layoutName: r.layoutName,
												isActive: r.isActive,
												isPublished: r.isPublished,
												headerOn: r.headerOn,
												headerHeight: r.headerHeight,
												headerBG: r.headerBG,
												headerTextColor: r.headerTextColor,
												textBG: r.textBG,
												textRadius: r.textRadius,
												theme1_FillSelectBG: r.theme1_FillSelectBG,
												theme1_FillSelectBorderColor: r.theme1_FillSelectBorderColor,
												theme1_FillBG: r.theme1_FillBG,
												theme1_FillBorderColor: r.theme1_FillBorderColor,
												menuColor: r.menuColor,
												menuActiveColor: r.menuActiveColor,
												rightPanel_TopBG: r.rightPanel_TopBG,
												rightPanel_TabsBG: r.rightPanel_TabsBG,
												rightPanel_TopColor: r.rightPanel_TopColor,
												rightPanel_TabColor: r.rightPanel_TabColor,
												rightPanel_TabActiveColor: r.rightPanel_TabActiveColor,
												mapHeaderBG: r.mapHeaderBG,
												mapDescriptionSize: r.mapDescriptionSize,
												mapDescriptionColor: r.mapDescriptionColor,
												mapFooterBG: r.mapFooterBG,
												mapFooterFontColor: r.mapFooterFontColor,
												customCSS_enabled: r.customCSS_enabled,
												customCSS: r.customCSS
										};
										$.extend(gridSource[itemIndex],item);
										myconfig.styles[itemIndex].changed=true;
										if (myconfig.styles[itemIndex].newValue){
												myconfig.styles[itemIndex].newValue = JSON.stringify(gridSource[itemIndex]);
										}else{
												myconfig.styles[itemIndex].oldValue = JSON.stringify(gridSource[itemIndex]);	
										}
										
								}else{
										console.log("An error occured in editStyleUpdateResult");
								}								
								mygis.Admin.AppManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Selects a row(deselecting others if necessary) and then calls the editing function
				 * @method directStyleEdit
				 * @param {Integer} rowIndex
				 */
				directStyleEdit: function(rowindex){
						var grid = $("#adminStyleList");
						grid.jqxGrid('clearselection');
						grid.jqxGrid('selectrow',rowindex);
						mygis.Admin.AppManager.Styles.styleSelected();
						mygis.Admin.AppManager.Styles.showEditStyle(false);
				},
				
				/**
				 * Switches the active tab to the given index
				 * @method switchToTab
				 */
				switchToTab: function(index){
						var tabHeaders = $("#editStyleLinkTabsRound").find(".sectionHeader");
						for (var i=0;i<tabHeaders.length;i++){
								if (i!=index){
										tabHeaders[i].ex_RemoveClassName("active");
								}else{
										tabHeaders[i].ex_AddClassName("active");
								}
						}
						var tabs = $("#editHeaderTab").find(".appSettingFrame");
						for (var i=0;i<tabs.length;i++){
								if (i!=index){
										$(tabs[i]).hide();
								}else{
										$(tabs[i]).show();
										
								}
						}
				},
				
				/**
				 * Hides elements if global "on/off" button is unchecked
				 * @method toggleSubMenu
				 * @param {String} id The firing element. Accepts "#appSetting_enableHeader", "#appSetting_expertModeToggle"
				 */
				toggleSubMenu: function(element){
						var on = element.checked;
						switch (element.id){
								case "appSetting_enableHeader":
										if (on){
												$("#appSetting_HeaderSettings").show();
										}else{
												$("#appSetting_HeaderSettings").hide();
										}
										break;
								case "appSetting_expertModeToggle":
										if (on){
												$("#appSetting_ExpertSettings").show();
										}else{
												$("#appSetting_ExpertSettings").hide();
										}
										break;
						}
				},
				
				/**
				 * Creates an advanced text-editor for manual css mode
				 * @method createEditor
				 */
				createEditor: function(){
						
						if (!mygis.Admin.AppManager.Styles.editor){
								mygis.Admin.AppManager.Styles.editor = CodeMirror.fromTextArea(document.getElementById("expertModeCss"),{
										mode: "css",
										lineNumbers: true,
										matchBrackets: true,
										theme: "default",
										tabindex: 0
								});  
						}
						
				},
				
				/**
				 * Sets the selected grid row as the default(active) and notifies for save
				 * @method makeDefault
				 */
				makeDefault: function(){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var changed= false;
						var oldIndex = -1;
						if (selection.length>1){
								displayError("Only one style can be set as active");	//This should never fire under normal conditions
						}else{
								for (var i=0;i<records.length;i++){
										var item = records[i];
										if (item.isActive && i!=selection[0]){
												item.isActive=false;
												changed=true;
												oldIndex = i;
										}else if (i==selection[0]){
												item.isActive=!item.isActive;
												changed=true;
										}
								}
								if (changed){
										if (oldIndex>-1){
												var oldItem = mygis.Admin.AppManager.updateConfig.styles[oldIndex];
												oldItem.changed=true;
												if (oldItem.newValue){
														oldItem.newValue = JSON.stringify(records[oldIndex]);
												}else{
														oldItem.oldValue = JSON.stringify(records[oldIndex]);
												}
										}
										
										var newItem = mygis.Admin.AppManager.updateConfig.styles[selection[0]];
										
										newItem.changed=true;
										
										if (newItem.newValue){
												newItem.newValue = JSON.stringify(records[selection[0]]);
										}else{
												newItem.oldValue = JSON.stringify(records[selection[0]]);
										}
										mygis.Admin.AppManager.notifyUnsaved();
										grid.jqxGrid('refreshdata');
								}
						}
				},
				
				/**
				 * Sets the selected grid rows as 'published' and notifies for save
				 * @method publishStyles
				 */
				publishStyles: function(){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var atLeastOne = false;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								if (!item.isPublished){
										atLeastOne = true;
										item.isPublished = true;
										var confItem = mygis.Admin.AppManager.updateConfig.styles[selection[i]];
										confItem.changed=true;
										if (confItem.newValue){
												confItem.newValue = JSON.stringify(item);
										}else{
												confItem.oldValue = JSON.stringify(item);
										}
								}
						}
						if (atLeastOne){
								mygis.Admin.AppManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Sets the selected grid rows as 'published' and notifies for save
				 * @method unpublishStyles
				 */
				unpublishStyles: function(){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var atLeastOne = false;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								if (item.isPublished){
										atLeastOne = true;
										item.isPublished = false;
										var confItem = mygis.Admin.AppManager.updateConfig.styles[selection[i]];
										confItem.changed=true;
										if (confItem.newValue){
												confItem.newValue = JSON.stringify(item);
										}else{
												confItem.oldValue = JSON.stringify(item);
										}
								}
						}
						if (atLeastOne){
								mygis.Admin.AppManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Deletes the selected grid rows and notifies for save
				 * @method deleteStyles
				 */
				deleteStyles: function(){
						var grid = $("#adminStyleList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var atLeastOne = false;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								var confItem = mygis.Admin.AppManager.updateConfig.styles[selection[i]];
								if (confItem.newValue){	//it's simply a newly created item, so remove it from the array
										records.splice(selection[i],1);
										mygis.Admin.AppManager.updateConfig.styles.splice(selection[i],1);
								}else{
										var grabCopy = $.extend({},item);
										grabCopy.id=-1;
										confItem.newValue = JSON.stringify(grabCopy);
										confItem.changed=true;
										atLeastOne=true;
										records.splice(selection[i],1);
								}
						}
						if (atLeastOne){
								mygis.Admin.AppManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				}
		
		},
		
		/**
		 * Triggers when a section in the "edit app settings" is expanded
		 * @method expandDetails
		 * @param {Object} event The triggering event
		 * @for mygis.Admin.AppManager
		 */
		expandDetails: function(event){
				var index = event.item;
				var myconfig = mygis.Admin.AppManager.updateConfig;
				mygis.Utilities.blockUI();
				
				var tabHeaders = $("#contentLinkTabsRound").find(".sectionHeader");
				for (var i=0;i<tabHeaders.length;i++){
						if (i!=index){
								tabHeaders[i].ex_RemoveClassName("active");
						}else{
								tabHeaders[i].ex_AddClassName("active");
						}
				}
				var tabs = $("#editAppForm").find(".sectionContent");
				for (var i=0;i<tabs.length;i++){
						if (i!=index){
								$(tabs[i]).hide();
						}else{
								$(tabs[i]).show();
								var buttons = $(tabs[i]).find(".sectionButtons");
								$("#contentSpecificToolbar").empty();
								$("#contentSpecificToolbar").append(buttons.clone());
						}
				}
				
				mygis.Admin.AppManager.createGrid(index);
				mygis.Utilities.unblockUI();
		},
		
		/**
		 * Routing function for the app settings tabs
		 * @method createGrid
		 * @param {Integer} index The corresponding tabIndex to create a grid for.
		 */
		createGrid: function(index){
				var myconfig = mygis.Admin.AppManager.updateConfig;
				switch (index){
						case 1:
								if (myconfig.maps.length==0){
										mygis.Admin.AppManager.Maps.createAppMapGrid(myconfig.appID);
								}else{
										$("#adminMapList").jqxGrid('render'); //force update
								}
								break;
						case 2:
								if (myconfig.urls.length==0){
										mygis.Admin.AppManager.URLs.createAppURLGrid(myconfig.appID);
								}else{
										$("#adminURLList").jqxGrid('render'); //force update
								}
								break;
						case 3:
								if (myconfig.users.length==0){
										mygis.Admin.AppManager.createAppUserGrid(myconfig.appID);
								}else{
										$("#adminAppUserList").jqxGrid('render'); //force update
								}
								break;
						case 4:
								if (myconfig.styles.length==0){
										mygis.Admin.AppManager.Styles.createAppStylesGrid(myconfig.appID);
								}else{
										$("#adminStyleList").jqxGrid('render');	//force update
								}
								break;
				}
		},
		
		/**
			Fills in the "editForm" fields with the application details
			@method getAppDetails
			@param {String} appID The application id. If ommited, it will get the current application details.
		**/
		getAppDetails: function(appID){
			var records = $("#myAppGrid").jqxGrid('source').records;
			var found=false;
			var i=0;
			var details;
			while (!found && i<records.length){
				if (appID){
					if (records[i].appID==appID){
						found=true;
						details = records[i];
					}
				}else{
					if (records[i].appPrefix==currentAppName){
						found=true;
						details = records[i];
					}
				}
				i++;
			}
			if (found){
				mygis.Admin.AppManager.storeAppDetails(details);
				
				
				document.getElementById("editAppName").value = details.appName;
				document.getElementById("editAppAlias").value = details.appPrefix;
				document.getElementById("editAppWelcomeText").value = details.appWelcomeText;
				document.getElementById("editAppLogo").src = mygis.Utilities.format("{0}GetImage.ashx?qType=GetAppLogo&qContents={1}&qSize=142",config.folderPath,details.appID);
				if (details.hasLogo1){
					document.getElementById("editAppLogo1").src = mygis.Utilities.format("{0}GetImage.ashx?qType=GetAppLogo1&qContents={1}&qSize=142",config.folderPath,details.appID);
				}else{
						
						document.getElementById("editAppLogo1").src ="";
				}
				if (details.hasLogo2){
					document.getElementById("editAppLogo2").src	= mygis.Utilities.format("{0}GetImage.ashx?qType=GetAppLogo2&qContents={1}&qSize=142",config.folderPath,details.appID);
				}else{
						document.getElementById("editAppLogo2").src ="";
				}
			}else{
				displayError(strings.AppManager.err_notAuthorized);
			}
		},
		
		/**
		 * Stores the current editing application's details in the config object
		 * @method storeAppDetails
		 * @param {Object} detailRow The grid record
		 */
		storeAppDetails: function(detailRow){
				var myconfig = mygis.Admin.AppManager.updateConfig;
				var mymaps = detailRow.appMAPS.split("#");
				var myurls = detailRow.appURLS.split(",");
				myconfig.appID = detailRow.appID;
				myconfig.maps = [];
				myconfig.urls = [];
				myconfig.users = [];
				/*
				$.each(mymaps,function(i,v){
						var item = {
								changed: false,
								oldValue: v,
								newValue: null
						};
						myconfig.maps.push(item);
				});
				$.each(myurls,function(i,v){
						var item = {
								changed: false,
								oldValue: v,
								newValue: null
						};
						myconfig.urls.push(item);
				});
				*/
		},
		
		/**
		 * Creates the grid for the application's users
		 * @method createAppUserGrid
		 * @param {Integer} appID The application to search
		 */
		createAppUserGrid: function(appID){
				mygis.Utilities.blockUI();
				var userSource = mygis.Admin.AppManager.createAppUserGridSource(appID);
				var userContainer = $("#adminAppUserList");
				if (userSource.records.length>0){
						userContainer.jqxGrid({
								source: userSource,
								width: '100%',
								autoheight: true,
								theme: 'pk_mg_jm',
								altrows: true,
								enabletooltips: true,
								columns: [
										{text: strings.AppManager.usergrid_UserFirstName,datafield: 'firstName'},
										{text: strings.AppManager.usergrid_UserLastName,datafield: 'lastName'},
										{text: strings.AppManager.usergrid_UserEmail,datafield: 'email'},
										{text: strings.AppManager.usergrid_Username,datafield: 'username'},
										{text: strings.AppManager.usergrid_UserID,datafield: 'userID'}
								],
								enableanimations: false,
								showheader: true,
								columnsmenu: true,
								editable: true,
								selectionmode: 'none'
						});
				}else{
						userContainer.jqxGrid({
								source: userSource,
								width: '100%',
								autoheight: true,
								theme: 'pk_mg_jm',
								altrows: true,
								enabletooltips: true,
								columns: [
										{text: strings.AppManager.usergrid_UserFirstName,datafield: 'firstName'},
										{text: strings.AppManager.usergrid_UserLastName,datafield: 'lastName'},
										{text: strings.AppManager.usergrid_UserEmail,datafield: 'email'},
										{text: strings.AppManager.usergrid_Username,datafield: 'username'},
										{text: strings.AppManager.usergrid_UserID,datafield: 'userID'}
								],
								enableanimations: false,
								showheader: true,
								columnsmenu: true,
								editable: true,
								selectionmode: 'none'
						});
				}
				
				mygis.Utilities.unblockUI();
		},
		
		/**
		 * Creates the source for the application's users
		 * @method createAppUserGridSource
		 * @param {Integer} appID
		 */
		createAppUserGridSource: function(appID){
				var retvalue;
				var url = config.mgreq+"?qtype=GetAppUserList&qContents="+appID;
				var source = {
						datatype: "json",
						datafields: [
							{ name: "userID" },
							{ name: "username" },
							{ name: "firstName" },
							{ name: "lastName" },
							{ name: "email" }
						],
						id: 'userlist',
						url: url
			};
				retvalue = new $.jqx.dataAdapter(source,{async:false});
				//retvalue.dataBind();
				return retvalue;
		},
		
		
		/**
		 * Updates the config object with the source maps
		 * @method setConfigMaps
		 */
		setConfigMaps: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.AppManager.updateConfig.maps=finalList;
		},
		
		/**
		 * Updates the config object with the source Urls
		 * @method setConfigMaps
		 */
		setConfigUrls: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.AppManager.updateConfig.urls=finalList;
		},
		
		/**
			Handles the clicking of a 'replace logo' button.
			@method logoBtnClick
			@param {Element} elem The button clicked
		**/
		logoBtnClick: function(elem){
			var clicked = elem.id;
			var logo_id=-1;
			switch (clicked){
				case "replaceAppLogo":
					logo_id=0;
					break;
				case "replaceAppLogo1":
					logo_id=1;
					break;
				case "replaceAppLogo2":
					logo_id=2;
					break;
			}
			if (logo_id>-1){
				internalConfig.mmCallback.fn=mygis.Admin.AppManager.newlogoSelected;
				internalConfig.mmCallback.objectCount=1;
				internalConfig.mmCallback.object={
					logo_id: logo_id
				};
				showMediaManager();
			}
		},
		
		/**
		 * Handles the clicking of a 'remove logo' button.
		 * @method logoRemoveBtnClick
		 * @param {Element} elem The calling element
		 */
		logoRemoveBtnClick: function(elem){
				var clicked = elem.id;
				var logo_id=-1;
				var myconfig = mygis.Admin.AppManager.updateConfig;
				switch (clicked){
						case "removeAppLogo1":
								myconfig.logo1.changed=true;
								myconfig.logo1.newValue=-1;
								document.getElementById("editAppLogo1").src = "";
								break;
						case "removeAppLogo2":
								myconfig.logo2.changed=true;
								myconfig.logo2.newValue=-1;
								document.getElementById("editAppLogo2").src = "";
								break;
				}
				mygis.Admin.AppManager.notifyUnsaved();
		
		},
		
		/**
			This method is called after an image is selected in the Media Manager to replace the application's logos
			@method newlogoSelected
			@param {Object} result The result of the Media Manager window
		**/
		newlogoSelected: function(result){
			var resultObj=this;
			
			resultObj = resultObj[0];
			if (!result || result!="ok"){
				if (result){
					displayError(result);
				}
			}else{
				var myconfig = internalConfig.mmCallback.object;
				var updateConfig = mygis.Admin.AppManager.updateConfig;
				var confObj;
				var confObjLoc="";
				switch (myconfig.logo_id){
					case 0:
						confObj=updateConfig.logo;
						confObjLoc="editAppLogo";
						break;
					case 1:
						confObj=updateConfig.logo1;
						confObjLoc="editAppLogo1";
						break;
					case 2:
						confObj=updateConfig.logo2;
						confObjLoc="editAppLogo2";
						break;
				}
				if (!confObj.changed){
					confObj.oldValue = document.getElementById(confObjLoc).src;	//store the old value
				}
				confObj.changed = true;
				confObj.newValue = resultObj.fileID;
				var newsource = mygis.Utilities.format("{0}GetImage.ashx?qType=userFile&qContents={1}",
																				 config.folderPath,resultObj.fileID);
				document.getElementById(confObjLoc).src = newsource+"&qSize=142";	//thumbnail
				mygis.Admin.AppManager.notifyUnsaved();
				mygis.Admin.AppManager.previewAppLogo(myconfig.logo_id,newsource);
				displayNotify(strings.AppManager.logo_selected);
			}
		},
		
		/**
			Replaces the application logo with a new one.
		
			@method replaceLogo
			@param {Integer} id The logo to replace (0 - the default, 1 or 2)
			@param {Integer} fileID The fileID to replace it with
		**/
		replaceLogo: function(id,fileID){
			mygis.Utilities.blockUI();
			var params = mygis.Utilities.format("{0}%23{1}",id,fileID);
			var customUrl = config.mgreq+"?qtype=ReplaceLogo&qContents="+params;
			$.ajax({
				type:"GET",
				url: customUrl,
				success: function(data){
					try{
						//update the preview, update the logo!
						var realResults = eval('('+data+')');
						if (realResults.iotype=="success"){
							mygis.Admin.UI.refreshPageLogos();
							mygis.Admin.AppManager.resetConfigObject();
							displaySuccess(strings.AppManager.logo_updated);
						}else{
							displayError(realResults.iomsg);
						}
						
					}catch(err){
						console.log(err.message);
					}
					mygis.Utilities.unblockUI();
				}
			});
		},
		
		/**
		 * @method previewAppLogo
		 */
		previewAppLogo: function(logo_id,newvalue){
				var images = $(".domainLogoWrapper2").find("img");
				images[logo_id].src=newvalue;
				if (newvalue){
						images[logo_id].style.display="";
				}else if (logo_id>0){
						images[logo_id].style.display="none";
				}
		},
		
		/**
			Notifies that there are unsaved changes
			@method notifyUnsaved
		**/
		notifyUnsaved: function(){
			document.getElementById("amenu_Apps_Config_save").ex_RemoveClassName("disabled");
			$("#amenu_Apps_Config_save").qtip({
				content: {
						text: strings.AppManager.msg_NotifyUnsaved
				},
				position: {
						my: "center right",
						at: "center left"
				},
				show: {
						event: "mouseover",
						ready: true,
						solo: true
				},
				hide: {
						event: "unfocus",
						inactive: false
				},
				events: {
						hide: function(event, api) {
								api.destroy();
						}
				},
				style: {
						classes: 'ui-tooltip-shadow', // Optional shadow...
						tip: {
							border: 1
						},
						border: 1
				}});
		},
		
		/**
			Propagates all changes to the server
			@method saveChanges
		**/
		saveChanges: function(){
				var toSend=JSON.stringify(mygis.Admin.AppManager.updateConfig);
				var customUrl = config.mgreq+"?qtype=UpdateAppSettings";	//&qContents="+toSend;
				var postObject = new Object();
				postObject["qContents"]=toSend;
				mygis.Utilities.blockUI();
				$.ajax({
						type:"POST",
						data: postObject,
						url: customUrl,
						success: function(data){
							try{
								//update the preview, update the logo!
								var realResults = eval('('+data+')');
								if (realResults.iotype=="success"){
									mygis.Admin.UI.refreshPageLogos();
									mygis.Admin.AppManager.resetConfigObject();
									displaySuccess(strings.AppManager.settings_updated);
									setTimeout(function(){
										var activeTab = $("#contentLinkTabsRound").find(".sectionHeader.active");
										mygis.Admin.AppManager.createGrid(activeTab.index());
									},250);
									
								}else{
									displayError(realResults.iomsg);
								}
								
							}catch(err){
								console.log(err.message);
							}
							mygis.Utilities.unblockUI();
						}
			});
				
		},
		
		/**
		 * Reverts all changes at the client
		 * @method revertChanges
		 */
		revertChanges: function(){
				var myconfig = mygis.Admin.AppManager.updateConfig;
				if (myconfig.logo.changed){
								document.getElementById("editAppLogo").src=myconfig.logo.oldValue;
				}
				if (myconfig.logo1.changed){
								document.getElementById("editAppLogo1").src=myconfig.logo1.oldValue;	
				}
				if (myconfig.logo2.changed){
								document.getElementById("editAppLogo2").src=myconfig.logo2.oldValue;
				}
				if (myconfig.appName.changed){
								document.getElementById("editAppName").value=myconfig.appName.oldValue;
				}
				if (myconfig.appAlias.changed){
								document.getElementById("editAppAlias").value=myconfig.appAlias.oldValue;
				}
				if (myconfig.appText.changed){
								document.getElementById("editAppWelcomeText").value=myconfig.appText.oldValue;
				}
				mygis.Admin.AppManager.resetConfigObject();
		},

		/**
		 * Resets the configuration object used in tracking app settings' changes.
		 * @method resetConfigObject
		 **/
		resetConfigObject: function(){
				try{
						if (!document.getElementById("amenu_Apps_Config_save").ex_HasClassName("disabled")){
								document.getElementById("amenu_Apps_Config_save").ex_AddClassName("disabled");
						}
				}catch(err){}
				var resetobj = {
								maps: [],
								urls: [],
								users: [],
								styles: [],
								logo: {
									changed: false,
									newValue: null,
									oldValue: null
								},
								logo1: {
									changed: false,
									newValue: null,
									oldValue: null
								},
								logo2: {
									changed: false,
									newValue: null,
									oldValue: null
								},
								appName: {
									changed: false,
									newValue: null,
									oldValue: null
								},
								appAlias: {
									changed: false,
									newValue: null,
									oldValue: null
								},
								appText: {
									changed: false,
									newValue: null,
									oldValue: null
								}
			  };
				mygis.Admin.AppManager.updateConfig = mygis.Utilities.mergeOptions(mygis.Admin.AppManager.updateConfig,resetobj);
		}
		
		
	},
	
	
	/**
		Functions and classes for map management
		
		@class mygis.Admin.MapManager
		@static
	**/
	MapManager: {
		
		/**
			This holds the update configuration for the map settings.
			@property updateConfig
			@type {Object}
		**/
		updateConfig: {
				mapID: -1,
				layers: [],
				tags: [],
				quickSearches: [],
				permissions: [],
				macros: [],
				mapName: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDescription: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapExtent: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapCenter: {
						changed: false,
						oldValue : "",
						newValue: ""
				},
				mapZoom: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDeveloped: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapOwner: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapThumb: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDefaultBG: {
						changed: false,
						oldValue: "",
						newValue: ""
				}
		},
		
		/**
		 * Functions for the maps in the map manager
		 * @class mygis.Admin.MapManager.Maps
		 * @static
		 */
		Maps: {
				
				/**
				 * Shows a dialog window for inserting new map
				 * @method showAddNewMap
				 */
				showAddNewMap: function(){
						var myconfig = mygis.Admin.UI.dialogConfig;
						myconfig.checkfn = mygis.Admin.MapManager.Maps.addNewMapCheck;
						myconfig.callbackfn = mygis.Admin.MapManager.Maps.createNewMap;
						myconfig.objectCount = 1;
						myconfig.windowTitle = "#addMapNamePop";
						$(myconfig.windowTitle).dialog({
								autoOpen: true,
								modal: true,
								resizable: false,
								width: 480,
								height: 130, 
								title: strings.MapManager.addMap_windowTitle,
								closeOnEscape: false
						});
						var titleBar = $("#ui-dialog-title-addMapNamePop").parent();
						titleBar.css({
							"background":"url('"+config.folderPath+"Images/Administration/menu/icon-16-banner-tracks.png') #F6A828 no-repeat 12px 8px",
							"background-size":"auto 18px"
							});
						
				},
				
				/**
				 * Used for client-validation when inserting new map name
				 * @method addNewMapCheck
				 */
				addNewMapCheck: function(){
						var retvalue = false;
						var checkValue = $("#addMapNameInp").val();
						if (!checkValue){
								alert(strings.MapManager.addMap_err_NotFilled);
						}else{
								var wrongSymbols = ['`','~','!','@','#','$','%','^','&','*','-','+','=','[',']','{','}','\\','|',':',';','"','\'','<','>',',','.','/','?'];
								var atLeastOne =false;
								for (var i=0;i<wrongSymbols.length;i++){
										if (checkValue.indexOf(wrongSymbols[i])>-1){
												atLeastOne=true;
										}
								}
								if (atLeastOne){
										alert(strings.MapManager.addMap_err_InvalidName);
								}else{
										mygis.Admin.UI.dialogConfig.object = checkValue;
										retvalue=true;
								}
						}
						return retvalue;
				},
				
				/**
				 * Creates a new map
				 * @method createNewMap
				 */
				createNewMap: function(result){
						if (result=="ok"){
								var myValue = this;
								mygis.Admin.MapManager.resetConfigObject();
								var myconfig = mygis.Admin.MapManager.updateConfig;
								myconfig.mapName.changed=true;
								myconfig.mapName.newValue=myValue;
								var toSend=JSON.stringify(myconfig);
								var customUrl = config.mgreq+"?qtype=CreateNewMap";
								var postObject = new Object();
								postObject["qContents"]=toSend;
								mygis.Utilities.blockUI();
								$.ajax({
										type:"POST",
										data: postObject,
										url: customUrl,
										success: function(data){
											try{
												var realResults = eval('('+data+')');
												if (realResults.iotype=="success"){
														mygis.Admin.MapManager.Maps.refreshMapGrid();
														displaySuccess(strings.MapManager.addMap_msg_Success);
													
												}else{
													displayError(realResults.iomsg);
												}
												
											}catch(err){
												console.log(err.message);
											}
											mygis.Utilities.unblockUI();
										}
								});
						}
				},
				
				/**
					Used to create the map grid in the map Manager
					@method createMapGrid
				**/
				createMapGrid: function(){
						mygis.Utilities.blockUI();
						var container = $("#myMapsGrid");
						var columnrenderer = function(value){
								var retobject;
								var action = 'router("admin_Maps_allClick",this);';
								var grid = $("#myMapsGrid");
								var selection = grid.jqxGrid('getselectedrowindexes');
								var style = "text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
								var inpID = "admin_Maps_selectAllMaps";
								var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								retobject = mygis.Utilities.format("<div style='{0}'><input id='{1}' type='checkbox' onclick='{2}'{3}/></div>",
																									 style,inpID,action,checked);				
								return retobject;
						}
						var cellrenderer = function(row,datafield,value){
								var retobject;
								switch(datafield){
										case "mapName":
												var action = mygis.Utilities.format('router("mapnameClicked",{0});',row);
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><a href='#' onclick='{1}'>{0}</a></div>",value,action);
												break;
								}
								return retobject;
						}
						var locObject = {
								groupsheaderstring: strings.Grid.groupsheaderstring,
								sortascendingstring: strings.Grid.sortascendingstring,
								sortdescendingstring: strings.Grid.sortdescendingstring,
								sortremovestring: strings.Grid.sortremovestring,
								groupbystring: strings.Grid.groupbystring,
								groupremovestring: strings.Grid.groupremovestring
						};
						var mapSource = mygis.Admin.MapManager.createPotentialMapSource();
						container.jqxGrid({
								source: mapSource,
								width: '100%',
								height: '100%',
								autoheight: false,
								theme: 'pk_mg_jm',
								altrows: true,
								enabletooltips: true,
								columns: [
										{text:'asdf',datafield:'mapSelected', width:45,columntype: 'checkbox',renderer: columnrenderer},
										{text: strings.MapControl.col_mapName, datafield: 'mapName', width: 200, cellsrenderer: cellrenderer,editable:false},
										{text: strings.MapControl.col_mapOwner, datafield: 'mapOwner',editable:false},
										{text: strings.MapControl.col_mapLCount, datafield: 'mapLayerCount',editable:false,cellsrenderer: cellrenderer,width: 80},
										{text: strings.MapControl.col_mapCreate, datafield: 'mapCreateDate',editable:false},
										{text: strings.MapControl.col_mapUpdate, datafield: 'mapUpdateDate',editable:false},
										{text: strings.MapControl.col_mapDeveloped, datafield: 'mapDevelopedBy',editable:false}
										
								],
								enableanimations: false,
								showheader: true,
								columnsmenu: false,
								sortable: true,
								editable: true,
								groupable: true,
								showgroupsheader: true,
								selectionmode: 'none'
								
						});
						container.jqxGrid('localizestrings', locObject);
						container.bind('rowselect',mygis.Admin.MapManager.Maps.mapSelected);
						container.bind('rowunselect',mygis.Admin.MapManager.Maps.mapUnselected);
						container.bind('cellendedit',mygis.Admin.MapManager.Maps.singleCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Refreshes the list of maps from the server
				 * @method refreshMapGrid	
				 **/
				refreshMapGrid: function(){
						var container = $("#myMapsGrid");
						container.jqxGrid('updatebounddata');
				},
				
				/**
				 * Activates/deactivates some buttons when a map is selected
				 * @method mapSelected
				 **/
				mapSelected: function(){
						var grid = $("#myMapsGrid");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("amenu_Maps_Manager_edit").ex_HasClassName("disabled")){
										document.getElementById("amenu_Maps_Manager_edit").ex_AddClassName("disabled");
								}
								document.getElementById("amenu_Maps_Manager_delete").ex_RemoveClassName("disabled");
						}else{
								document.getElementById("amenu_Maps_Manager_edit").ex_RemoveClassName("disabled");
								document.getElementById("amenu_Maps_Manager_delete").ex_RemoveClassName("disabled");								
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("admin_Maps_selectAllMaps").checked=true;
						}else{
								document.getElementById("admin_Maps_selectAllMaps").checked=false;
						}
				},
				
				/**
				 * Activates/deactivates some buttons when a map is unselected
				 * @method mapUnselected
				 **/
				mapUnselected: function(){
						var grid = $("#myMapsGrid");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("amenu_Maps_Manager_edit").ex_HasClassName("disabled")){
										document.getElementById("amenu_Maps_Manager_edit").ex_AddClassName("disabled");
								}
								
								document.getElementById("amenu_Maps_Manager_delete").ex_RemoveClassName("disabled");
						}else if (selection.length==1){
								document.getElementById("amenu_Maps_Manager_edit").ex_RemoveClassName("disabled");
								document.getElementById("amenu_Maps_Manager_delete").ex_RemoveClassName("disabled");
						}else{
								if (!document.getElementById("amenu_Maps_Manager_edit").ex_HasClassName("disabled")){
										document.getElementById("amenu_Maps_Manager_edit").ex_AddClassName("disabled");
								}
								if (!document.getElementById("amenu_Maps_Manager_delete").ex_HasClassName("disabled")){
										document.getElementById("amenu_Maps_Manager_delete").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("admin_Maps_selectAllMaps").checked=true;
						}else{
								document.getElementById("admin_Maps_selectAllMaps").checked=false;
						}
				},
				
				/**
				* Handles the clicking of the checkbox in each row at the Map Manager
				* @method singleCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
				singleCheckClicked: function(elem){
					var grid = $("#myMapsGrid");
					if (elem.args.value) {
						 grid.jqxGrid('selectrow', elem.args.rowindex);
					}
					else {
						 grid.jqxGrid('unselectrow', elem.args.rowindex);
					}
				},
				
				/**
				 * Handles the check button in the Map Manager
				 * @method allCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				allCheckClicked : function(elem){
						var grid = $("#myMapsGrid");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].mapSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].mapSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				* Handles clicking on an app name in the map grid.
				* Selects the row and goes to "edit mode"
				* @method appClicked
				* @param {Integer} The row index clicked
				*/
				mapClicked: function(index){
						var grid = $("#myMapsGrid");
						grid.jqxGrid('clearselection');
						grid.jqxGrid('selectrow',index);
						mygis.Admin.UI.menuClick(null,"amenu_Maps_Config");		
				},
				
				/**
				 * Gets the map's current extent and replaces the corresponding map property
				 * @method getCurrentExtent
				 */
				getCurrentExtent: function(){
						var value = digimap.getExtent().toBBOX();
						$("#editMapExtent").val(value);
				},
				
				/**
				 * Gets the map's current center and replaces the corresponding map property
				 * @method getCurrentCenter
				 */
				getCurrentCenter: function(){
						var value = digimap.getCenter().toShortString();
						$("#editMapCenter").val(value);
				},
				
				/**
				 * Gets the map's current zoom level and replaces the corresponding map property
				 * @method getCurrentZoom
				 */
				getCurrentZoom: function(){
						var value = digimap.getZoom();
						$("#editMapZoom").val(value);
				},
				
				/**
				 * Shows the file manager to replace a map thumb.
				 * @method replaceMapThumbDialog
				 */
				replaceMapThumbDialog: function(){
						internalConfig.mmCallback.fn=mygis.Admin.MapManager.Maps.newMapThumbSelected;
						internalConfig.mmCallback.objectCount=1;
						internalConfig.mmCallback.object={
								
						};
						showMediaManager();
				},
				
				/**
				 * This method is called after an image is selected in the Media Manager to replace the map's thumb
				 * @method newMapThumbSelected
				 * @param {Object} result The result of the Media Manager window
				 */
				newMapThumbSelected: function(result){
						var resultObj=this;
						resultObj = resultObj[0];
						if (!result || result!="ok"){
							if (result){
								displayError(result);
							}
						}else{
								var myconfig = internalConfig.mmCallback.object;
								var updateConfig = mygis.Admin.MapManager.updateConfig;
								
								updateConfig.mapThumb.changed=true;
								updateConfig.mapThumb.newValue = resultObj.fileID;
								var newsource = mygis.Utilities.format("{0}GetImage.ashx?qType=userFile&qContents={1}",
																				 config.folderPath,resultObj.fileID);
								document.getElementById("editMapThumb").src = newsource+"&qSize=120";
								mygis.Admin.MapManager.notifyUnsaved();
						}
				},
				
				/**
				 * Generates a new map thumbnail from its layers
				 * @method replaceMapThumbAuto
				 */
				replaceMapThumbAuto: function(manualBox){
						var myconfig = mygis.Admin.MapManager.updateConfig;
						var format="image/png";
						var bbox;
						if (manualBox){
								bbox=manualBox;
						}else{
								bbox = myconfig.mapExtent.newValue?myconfig.mapExtent.newValue:myconfig.mapExtent.oldValue;
						}
						internalConfig.mapThumbPreviousBox = bbox;
						var srs = digimap.projection.toString();
						var size = 120;	//tha doume
						var layersNormal=[];
						
						for (var i=0;i<myconfig.layers.length;i++){
								var layer = myconfig.layers[i];
								var props = JSON.parse(layer.oldValue);
								layersNormal.push(props.layerTABLE);
								
						}
						var url = mygis.Utilities.format("{0}wms?service=WMS&version=1.1.0&request=GetMap&layers={1}&styles=&bbox={2}&width={3}&height={3}&srs={4}&format={5}&TILED=TRUE&TRANSPARENT=TRUE",
																						 config.mapserver,layersNormal.join(','),bbox,size,srs,format
																						 );
						$("#editMapThumb").bind('load',function(){
								$("#editMapThumb").unbind('load');
								var img = document.getElementById("editMapThumb");
								var canvas = document.createElement('canvas');
								canvas.width=img.width;
								canvas.height = img.height;
								var ctx = canvas.getContext("2d");
								ctx.drawImage(img,0,0);
								var myconfig = mygis.Admin.MapManager.updateConfig;
								myconfig.mapThumb.changed=true;
								myconfig.mapThumb.newValue=canvas.toDataURL();
								myconfig.mapThumb.oldValue="fromData";
								mygis.Admin.MapManager.Maps.mapThumbSelector();
								mygis.Utilities.unblockUI();
								mygis.Admin.MapManager.notifyUnsaved();
						});
						//mygis.Utilities.blockUI();
						document.getElementById("editMapThumb").src = url;
				},
				
				mapThumbSelector: function(){
						$("#editMapThumb").Jcrop({
								onSelect: mygis.Admin.MapManager.Maps.mapThumbSelectorChanged,
								aspectRatio: 1
						},function(){
								internalConfig.mapThumbCropper=this;		
						});
				},
				
				mapThumbSelectorChanged: function(event){
						var minX = event.x;
						var maxX = event.x2;
						var minY = event.y;
						var maxY = event.y2;
						internalConfig.mapThumbCropper.destroy();
						$("#editMapThumb").css({
								"display":"inline-block",	//no, i didn't have it as block, thank you
								"visibility":"visible"	//no, i didn't set it to hidden, thank you
						});
						
						var previousBox = internalConfig.mapThumbPreviousBox;
						previousBox = previousBox.split(",");
						var newCoords = [];
						var pixelUnitX = parseFloat(previousBox[2])-parseFloat(previousBox[0]);
						var pixelUnitY = parseFloat(previousBox[3])-parseFloat(previousBox[1]);
						pixelUnitX = pixelUnitX / 120;
						pixelUnitY = pixelUnitY / 120;
						var minXnew = parseFloat(previousBox[0])+(pixelUnitX*minX);
						var maxXnew = parseFloat(previousBox[0])+(pixelUnitX*maxX);
						var minYnew = parseFloat(previousBox[1])+(pixelUnitY*(120-maxY));
						var maxYnew = parseFloat(previousBox[1])+(pixelUnitY*(120-minY));
						newCoords.push(minXnew);
						newCoords.push(minYnew);
						newCoords.push(maxXnew);
						newCoords.push(maxYnew);
						mygis.Admin.MapManager.Maps.replaceMapThumbAuto(newCoords.join(","));
				},
				
				
				/**
				* Handles the input change in map settings
				* @method inputChanged
				* @param {Object} event The triggering event object
				*/
				inputChanged: function(event){
						var elem = event.currentTarget;
						var myconfig = mygis.Admin.MapManager.updateConfig;
						var confObj;
						switch (elem.id){
								case "editMapName":
										confObj=myconfig.mapName;
										break;
								case "editMapDescription":
										confObj=myconfig.mapDescription;
										break;
								case "editMapExtent":
										confObj=myconfig.mapExtent;
										break;
								case "editMapCenter":
										confObj=myconfig.mapCenter;
										break;
								case "editMapZoom":
										confObj=myconfig.mapZoom;
										break;
								case "editMapDeveloper":
										confObj=myconfig.mapDeveloped;
										break;
								case "editMapOwner":
										confObj=myconfig.mapOwner;
										break;
								case "editMapDefaultBG":
										confObj=myconfig.mapDefaultBG;
										break;
						}
						
						confObj.changed=true;
						if (elem.id=="editMapDefaultBG"){
								confObj.newValue = $(elem).find("option:selected")[0].value;
						}else{
								confObj.newValue = elem.value;
						}
						mygis.Admin.MapManager.notifyUnsaved();
				}
				
		},
		
		/**
		 * Functions for the layers in the map manager
		 * @class mygis.Admin.MapManager.Layers
		 * @static
		 */
		Layers: {
				
				/**
				 * Moves a layer up in the grid
				 * @method moveUp
				 */
				moveUp: function(){
						var grid = $("#mapLayerList");
						var records = grid.jqxGrid("source").records;
						var selection = grid.jqxGrid("getselectedrowindexes");
						var index = selection[0];
						var newIndex = index-1<0?records.length-1:index-1;
						records = mygis.Utilities.arrayMove(records,index,index-1);
						grid.jqxGrid('refreshdata');
						grid.jqxGrid("unselectrow",index);
						grid.jqxGrid("selectrow",newIndex);
						mygis.Admin.MapManager.setConfigLayers(records,true);
						mygis.Admin.MapManager.notifyUnsaved();
				},
				
				/**
				 * Moves a layer down in the grid
				 * @method moveDown
				 */
				moveDown: function(){
						var grid = $("#mapLayerList");
						var records = grid.jqxGrid("source").records;
						var selection = grid.jqxGrid("getselectedrowindexes");
						var index = selection[0];
						var newIndex = index+1>=records.length-1?0:index+1;
						records = mygis.Utilities.arrayMove(records,index,index+1);
						grid.jqxGrid('refreshdata');
						grid.jqxGrid('refreshdata');
						grid.jqxGrid("unselectrow",index);
						grid.jqxGrid("selectrow",newIndex);
						mygis.Admin.MapManager.setConfigLayers(records,true);
						mygis.Admin.MapManager.notifyUnsaved();
				},
				
				/**
				 * Deletes a layer from the grid
				 * @method deleteLayer
				 */
				deleteLayer: function(){
						var grid = $("#mapLayerList");
						var records = grid.jqxGrid("source").records;
						var selection = grid.jqxGrid("getselectedrowindexes");
						var atLeastOne = false;
						var grabLayers = [];
						//var grabRecords = [];
						var configLayers = mygis.Admin.MapManager.updateConfig.layers;
						for (var i=0;i<configLayers.length;i++){
								if (!(configLayers[i].newValue&&selection.indexOf(i)>-1)){	//if NOT (has newValue and is one of the selected indexes) include it.
										grabLayers.push(configLayers[i]);
										//grabRecords.push(records[i]);
								}else{
										//we took care of it, remove it from the selection
										grid.jqxGrid('deleterow',selection[selection.indexOf(i)]);
										selection.splice(selection.indexOf(i),1);
								}
						}
						mygis.Admin.MapManager.updateConfig.layers=grabLayers;
						//grid.jqxGrid("source").records = grabRecords;
						grid.jqxGrid('refreshdata');
						var records = grid.jqxGrid("source").records;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								var confItem = mygis.Admin.MapManager.updateConfig.layers[selection[i]];
								
								var grabCopy = $.extend({},item);
								grabCopy.layerID=-1;
								confItem.newValue = JSON.stringify(grabCopy);
								confItem.changed=true;
								atLeastOne=true;
								grid.jqxGrid('deleterow',selection[i]);//records.splice(selection[i],1);
								
						}
						if (atLeastOne){
								mygis.Admin.MapManager.notifyUnsaved();
								grid.jqxGrid('clearselection');
								grid.jqxGrid('refreshdata');
								mygis.Admin.MapManager.Layers.layerUnselected();
						}
						
						mygis.Admin.MapManager.Layers.layerUnselected();
				},
				
				/**
				 * Adds a layer to the current editing map
				 * @method addMapLayer
				 */
				addMapLayer: function(){
						var windowTitle;
						var myconfig = mygis.Admin.UI.dialogConfig;
						myconfig.checkfn = mygis.Admin.MapManager.Layers.addLayerCheck;
						myconfig.callbackfn = mygis.Admin.MapManager.Layers.addLayerResult;
						myconfig.objectCount=1;
						myconfig.windowTitle = "#layerManager";
						var records = $("#mapLayerList").jqxGrid('source').records;
						var filterList = "";
						
						for (var i=0;i<records.length;i++){
								if (i>0){
										filterList +="%23";
								}
								filterList += records[i].id;
						}
						showLayerManager(filterList);
				},
				
				/**
				 * Used to display the layer manager window
				 * @method showAddLayer
				 */
				showAddLayer: function(secondRun){
						
						if (!secondRun){
								$("#layerManager").dialog({
										autoOpen: false,
										modal: true,
										resizable: false,
										width: 900,
										height: 510, 
										title: strings.MapManager.window_LayerManager,
										closeOnEscape: false
								});
						}
						mygis.Admin.MapManager.Layers.createPotentialLayerGrid();
						$("#layerManager").dialog('open');
						if (mygis.Admin.UI.dialogConfig.callbackfn==null){
								$("#layerManagerDialogButtons").hide();
						}else{
								$("#layerManagerDialogButtons").show();
						}
						var titleBar = $("#ui-dialog-title-layerManager").parent();
						titleBar.css({
							"background":"url('"+config.folderPath+"Images/administration/menu/icon-16-banner.png') #F6A828 no-repeat 12px 2px",
							"background-size":"auto 25px"
						});
				},
				
				/**
				 * Used to check the "OK" button in the layer manager dialog
				 * @method addLayerCheck
				 */
				addLayerCheck: function(){
						var retvalue=false;
						var grid = $("#layerManagerList");
						var myconfig = mygis.Admin.UI.dialogConfig;
						var selections = grid.jqxGrid('getselectedrowindexes');
						var selectedCount = selections.length;
						var expectedCount = myconfig.objectCount;
						if (selectedCount>=expectedCount && expectedCount>-1){
								var retobject;
								retobject = [];
								for (var i=0;i<selections.length;i++){
										retobject.push(grid.jqxGrid('getrowdata',selections[i]));	
								}
								myconfig.object=  retobject;
							retvalue=true;
						}else{
								alert(mygis.Utilities.format(strings.LayerControl.err_notEnoughSelected,expectedCount));
						}
						return retvalue;
				},
				
				/**
				 * Callback function after the layer manager window returns
				 * @method addLayerResult
				 */
				addLayerResult: function(result){
						if (result=="ok"){
								var layersToAdd = [];
								var grid = $("#mapLayerList");
								var gridSource = grid.jqxGrid('source').records;
								var myconfig = mygis.Admin.MapManager.updateConfig;
								for (var i=0;i<this.length;i++){
										var r = this[i];
										var item = {
												layerSelected: false,
												layerID: r.layerID,
												layerNAME: r.layerNAME,
												layerDESCRIPTION: r.layerDESCRIPTION,
												layerTABLE: r.layerTABLE,
												hidden: r.hidden,
												Editable: r.Editable,
												Selectable: r.Selectable,
												Locked: r.Locked,
												layerMinScale: r.layerMinScale,
												layerMaxScale: r.layerMaxScale,
												layerGeomType: r.layerGeomType,
												layerEXTENTS: "",
												manualVisibility: false,
												layerORDER: "",
												folderName: r.folderName
										};
										grid.jqxGrid('addrow',null,item);
										var confItem = {
												changed: true,
												oldValue: null,
												newValue: JSON.stringify(item)
										};
										myconfig.layers.push(confItem);
								}
								mygis.Admin.MapManager.notifyUnsaved();
								grid.jqxGrid("refreshdata");
						}
				},
				
				/**
				 *	Creates the layer manager grid
				 *	@method createPotentialLayerGrid
				 */
				createPotentialLayerGrid: function(){
						var layerSource = mygis.Admin.MapManager.Layers.createPotentialLayerGridSource();
						var layerContainer = $("#layerManagerList");
						var columnrenderer = function(value){
								var retobject;
								var action = "";	//'router("adminAllClick",this);';
								//var grid = $("#myAppGrid");
								//var selection = grid.jqxGrid('getselectedrowindexes');
								var checked = ""; //var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								retobject = mygis.Utilities.format("<div style='text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;'><input id='adminSelectAllApps' type='checkbox' onclick='{0}'{1}/></div>",action,checked);
								return retobject;
								
						};
						var cellrenderer = function(row,datafield,value){
								var retobject;
								var rowdata = this.owner.getrowdata(row);
								switch (datafield){
										case "layerNAME":
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><a href='#' onclick='{1}'>{0}</a></div>",value,action);
												break;
										case "layerTABLE":
												var style = "width: 96%; margin: 6px 5px; float: left;";
												var actualApp = value.split("_")[0];
												retobject = mygis.Utilities.format("<span style='{0}'>{1}</span>",style,actualApp);
												break;
										case "layerGeomType":
												var action = "return false;";
												var title = "";
												switch (value){
														case "Point":
																var c1 = strings.LayerControl.layergrid_colPoints;
																var d1 = rowdata.layerPoints;
																title=mygis.Utilities.format("{0}: {1}",c1,d1);
																break;
														case "Line":
																var c1 = strings.LayerControl.layergrid_colLines;
																var d1 = rowdata.layerLines;
																title=mygis.Utilities.format("{0}: {1}",c1,d1);
																break;
														case "Polygon":
																var c1 = strings.LayerControl.layergrid_colPolygons;
																var d1 = rowdata.layerPolygons;
																title=mygis.Utilities.format("{0}: {1}",c1,d1);
																break;
														case "Mixed":
																var c1 = strings.LayerControl.layergrid_colPoints;
																var c2 = strings.LayerControl.layergrid_colLines;
																var c3 = strings.LayerControl.layergrid_colPolygons;
																var d1 = rowdata.layerPoints;
																var d2 = rowdata.layerLines;
																var d3 = rowdata.layerPolygons;
																title=mygis.Utilities.format("{0}: {1}, {2}: {3}, {4}: {5}",c1,d1,c2,d2,c3,d3);
																break;
												}
												retobject = mygis.Utilities.format("<span title='{2}' style='width: 96%; margin:6px 5px; float: left;'><a href='#' onclick='{1}' title='{2}'>{0}</a></span>",value,action,title);
												break;
								}
								return retobject;
						};
						var locObject = {
								groupsheaderstring: strings.Grid.groupsheaderstring,
								sortascendingstring: strings.Grid.sortascendingstring,
								sortdescendingstring: strings.Grid.sortdescendingstring,
								sortremovestring: strings.Grid.sortremovestring,
								groupbystring: strings.Grid.groupbystring,
								groupremovestring: strings.Grid.groupremovestring
						};
						layerContainer.jqxGrid({
								source: layerSource,
								width: 880,
								height: 414,
								autoheight: false,
								theme: 'pk-mg-jm',
								altrows: true,
								enabletooltips: true,
								columns: [
										{text: 'asdf', datafield: 'layerSelected',width: 45, renderer: columnrenderer,columntype: 'checkbox'},
										{text: strings.LayerControl.layergrid_colName,datafield: 'layerNAME', editable: false},
										{text: strings.LayerControl.layergrid_colTableApp, datafield: 'layerAppOrigin', editable: false, width: 140},
										{text: strings.LayerControl.layergrid_colTable,datafield: 'layerTABLE', editable: false,width: 200},
										{text: strings.LayerControl.layergrid_colGeom,datafield: 'layerGeomType', editable: false,width: 200, cellsrenderer: cellrenderer}
								],
								enableanimations: false,
								showheader: true,
								columnsmenu: false,
								editable: true,
								groupable: true,
								showgroupsheader: true,
								selectionmode: 'none'
						});
						layerContainer.jqxGrid('localizestrings', locObject);
						layerContainer.bind('cellendedit',mygis.Admin.MapManager.Layers.potentialLayer_checkClicked);
				},
				
				/**
				 *	Creates the grid source for the layer manager
				 *	@method createPotentialLayerGridSource
				 */
				createPotentialLayerGridSource: function(){
						var retvalue;
						var url = config.mgreq+"?qtype=GetPotentialLayers";
						var source = {
								datatype: "json",
								datafields: [
										{name: "layerSelected",type: "boolean"},
										{name: "layerID"},
										{name: "layerNAME"},
										{name: "layerDESCRIPTION"},
										{name: "layerTABLE"},
										{name: "layerAppOrigin"},
										{name: "hidden"},
										{name: "Editable"},
										{name: "Selectable"},
										{name: "Locked"},
										{name: "layerMinScale"},
										{name: "layerMaxScale"},
										{name: "layerGeomType"},
										{name: "layerPoints"},
										{name: "layerLines"},
										{name: "layerPolygons"}
								],
								id: 'adminPotentialLayerList',
								url: url
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						retvalue.dataBind();
						return retvalue;
				},
				
				/**
				 *	Used when a layer checkbox is clicked in the layer manager
				 *	@method potentialLayer_checkClicked
				 */
				potentialLayer_checkClicked: function(elem){
						var grid = $("#layerManagerList");
						if (elem.args.value) {
								grid.jqxGrid('selectrow', elem.args.rowindex);
						}
						else {
								grid.jqxGrid('unselectrow', elem.args.rowindex);
						}
				},
				
				/**
				 *	Used when the 'check all' button is clicked in the layer manager
				 *	@method potentialLayer_checkClicked
				 */
				potentialLayer_allCheckClicked: function(elem){
						var grid = $("#layerManagerList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].layerSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].layerSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
			
				
				/**
				 * Used to create the layer grid in the layers tab of the map Manager
				 * @method createLayerGrid
				 * @param {Integer} mapID The map to query
				**/
				createLayerGrid: function(mapID){
						mygis.Utilities.blockUI();
						var layerSource = mygis.Admin.MapManager.Layers.createLayerGridSource(mapID);
						var container = $("#mapLayerList");
						var columnrenderer = function(value){
								var action = 'router("mapLayerAllClick",this);';
								var grid = $("#mapLayerList");
								var selection = grid.jqxGrid('getselectedrowindexes');
								var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								retobject = mygis.Utilities.format("<div style='text-align: center; margin-top: 5px;position: absolute;left: 8px;z-index: 1;'><input id='map_selectAllLayers' type='checkbox' onclick='{0}'{1}/></div>",action,checked);
								return retobject;
						};
						
						if (layerSource.records.length>0){
								container.jqxGrid({
										source: layerSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf', datafield:'layerSelected',width: 22,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.LayerControl.layergrid_colName, datafield:'layerNAME',editable:false},
												{text: strings.LayerControl.layergrid_colDescription, datafield:'layerDESCRIPTION',editable:false},
												{text: strings.LayerControl.layergrid_colTable, datafield:'layerTABLE',editable:false},
												{text: strings.LayerControl.layergrid_colFolder, datafield:'folderName',editable: true},
												{text: strings.LayerControl.layergrid_colGeom, datafield:'layerGeomType',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								container.jqxGrid({
										source: layerSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf', datafield:'layerSelected',width: 22,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.LayerControl.layergrid_colName, datafield:'layerNAME',editable:false},
												{text: strings.LayerControl.layergrid_colDescription, datafield:'layerDESCRIPTION',editable:false},
												{text: strings.LayerControl.layergrid_colTable, datafield:'layerTABLE',editable:false},
												{text: strings.LayerControl.layergrid_colFolder, datafield:'folderName',editable: true},
												{text: strings.LayerControl.layergrid_colGeom, datafield:'layerGeomType',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});		
						}
						container.bind("rowselect",mygis.Admin.MapManager.Layers.layerSelected);
						container.bind("rowunselect",mygis.Admin.MapManager.Layers.layerUnselected);
						container.bind("cellendedit",mygis.Admin.MapManager.Layers.layerCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Creates the source for the map's layers
				 * @method createLayerGridSource
				 * @param {Integer} mapID the map to query
				 */
				createLayerGridSource: function(mapID){
						var retvalue;
						var url = config.mgreq+"?qtype=GetLayerList&qContents="+mapID;
						var source = {
								datatype: "json",
								datafields: [
										{name : "layerSelected", type: "boolean"},
										{ name: "layerID" },
										{ name: "layerNAME" },
										{ name: "layerDESCRIPTION" },
										{ name: "layerTABLE" },
										{ name: "layerORDER" },
										{ name: "layerEXTENTS"}, 
										{ name: "hidden"},
										{ name: "Editable"},
										{ name: "Selectable"},
										{ name: "Locked"},
										{ name: "layerMinScale" },
										{ name: "layerMaxScale" },
										{ name: "manualVisibility" },
										{ name: "layerGeomType" }, 
										{ name: "folderName" }
								],
								id: 'adminLayerList',
								url: url
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						retvalue.dataBind();
						mygis.Admin.MapManager.setConfigLayers(retvalue.records);
						return retvalue;
				},
				
				/**
				 * Handles the selection or rows in the layer grid
				 * @method layerSelected
				 */
				layerSelected: function(){
						var grid = $("#mapLayerList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_layerUpBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerUpBtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_layerDownBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerDownBtn").ex_AddClassName("disabled");
								}
								document.getElementById("map_layerDeleteBtn").ex_RemoveClassName("disabled");
						}else{
								document.getElementById("map_layerUpBtn").ex_RemoveClassName("disabled");
								document.getElementById("map_layerDownBtn").ex_RemoveClassName("disabled");
								document.getElementById("map_layerDeleteBtn").ex_RemoveClassName("disabled");
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("map_selectAllLayers").checked=true;
						}else{
								document.getElementById("map_selectAllLayers").checked=false;
						}
				},
				
				/**
				 * Handles the unselection or rows in the layer grid
				 * @method layerUnselected
				 */
				layerUnselected: function(){
						var grid = $("#mapLayerList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_layerUpBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerUpBtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_layerDownBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerDownBtn").ex_AddClassName("disabled");
								}
								document.getElementById("map_layerDeleteBtn").ex_RemoveClassName("disabled");
						}else if(selection.length==1){
								document.getElementById("map_layerUpBtn").ex_RemoveClassName("disabled");
								document.getElementById("map_layerDownBtn").ex_RemoveClassName("disabled");
								document.getElementById("map_layerDeleteBtn").ex_RemoveClassName("disabled");
						}else{
								if (!document.getElementById("map_layerUpBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerUpBtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_layerDownBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerDownBtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_layerDeleteBtn").ex_HasClassName("disabled")){
										document.getElementById("map_layerDeleteBtn").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("map_selectAllLayers").checked=true;
						}else{
								document.getElementById("map_selectAllLayers").checked=false;
						}
				},
				
				/**
				* Handles the clicking of the checkbox in each row at the layer grid
				* @method layerCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
				layerCheckClicked: function(elem){
						var grid = $("#mapLayerList");
						switch (elem.args.datafield){
							case "folderName":
								var grid = $("#mapLayerList");
								var oldData = grid.jqxGrid('getrowdata', elem.args.rowindex);
								oldData.folderName=elem.args.value;
								grid.jqxGrid('updaterow',grid.jqxGrid('getrowid', elem.args.rowindex),oldData);
								var records = grid.jqxGrid("source").records;
								mygis.Admin.MapManager.setConfigLayers(records,true);
								mygis.Admin.MapManager.notifyUnsaved();
								break;
							case "layerSelected":
								if (elem.args.value) {
										grid.jqxGrid('selectrow', elem.args.rowindex);
								}
								else {
										grid.jqxGrid('unselectrow', elem.args.rowindex);
								}
								break;
						}
						
				},
				
				/**
				 * Handles the check all button in the layer grid
				 * @method layerAllCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				layerAllCheckClicked: function(elem){
						var grid = $("#mapLayerList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].layerSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].layerSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				}
				
		},
		
		/**
		 * Functions for the permissions in the map manager
		 * @class mygis.Admin.MapManager.Permissions
		 * @static
		 */
		Permissions: {
				
		},
		
		/**
		 * Functions for the macros in the map manager
		 * @class mygis.Admin.MapManager.Macros
		 * @static
		 */
		Macros: {
				/**
				 * Pops up a dialog to edit a map Macro
				 * @method showEditMacro
				 * @param {Boolean} isNew True if this is a completely new macro
				 */
				showEditMacro: function(isNew){
						var windowTitle;
						var myconfig = mygis.Admin.UI.dialogConfig;
						if (isNew){
								$("#editMacroActionsTitle").attr('class','newMacro');
								windowTitle = strings.MapManager.window_NewMacro;	
						}else{
								$("#editMacroActionsTitle").attr('class','editMacro');
								windowTitle = strings.MapManager.window_EditMacro;	
						}
						$("#editMacroTitleElem").html(windowTitle);
						myconfig.checkfn = mygis.Admin.MapManager.Macros.editMacroCheck; 
						myconfig.callbackfn = mygis.Admin.MapManager.Macros.editMacroResult; 
						myconfig.objectCount = -1;
						myconfig.windowTitle = "#editMacroPop";
						var item;
						if (!isNew){
								var grid = $("#mapMacroList");
								var records = grid.jqxGrid('source').records;
								var selection = grid.jqxGrid('getselectedrowindexes');
								item = records[selection[0]];
								
								myconfig.objectCount = item.id;
								
						}
						$("#editMacroPop").dialog({
								autoOpen: true,
								modal: true,
								resizable: false,
								width: 900,
								height: 510, 
								title: strings.MapManager.window_MacroManager,
								closeOnEscape: false
						});
						var titleBar = $("#ui-dialog-title-editMacroPop").parent();
						titleBar.css({
							"background":"url('"+config.folderPath+"Images/Administration/header/icon-48-cpanel.png') #F6A828 no-repeat 14px 5px",
							"background-size":"auto 18px"
							});
						mygis.Admin.MapManager.Macros.setupMacroWindow(item);
				},
				
				/**
				 * Sets up the UI (tips, default values etc)
				 * @method setupMacroWindow
				 * @param {Object} item
				 */
				setupMacroWindow: function(item){
						singleQTip("tip_MacroName",[strings.MapManager.macroTip_name]);
						singleQTip("tip_MacroSelector",[strings.MapManager.macroTip_jselector]);
						singleQTip("tip_MacroButton",[strings.MapManager.macroTip_button]);
						singleQTip("tip_MacroRegistered",[strings.MapManager.macroTip_registered]);
						singleQTip("tip_MacroApp",[strings.MapManager.macroTip_app]);
						if (item){
								$("#appSetting_MacroName").val(item.name);
								$("#appSetting_parentSelector").val(item.parentSelector);
								$("#appSetting_IsButton").attr("checked",item.isButton);
								$("#appSetting_IsForRegistered").attr("checked",item.isForRegistered);
								$("#macroCommandsEditor").val(item.commands.replace(/\%/g,',').replace(/\#/g,'\r\n'));
								$("#macroContainerStyle").val(item.cont_css.replace(/\;/g,';\r\n'));
								$("#macroBtnStyle").val(item.btn_css.replace(/\;/g,';\r\n'));
						}else{
								$("#appSetting_MacroName").val("");
								$("#appSetting_parentSelector").val("");
								$("#appSetting_IsButton").attr("checked",true);
								$("#appSetting_IsForRegistered").attr("checked",false);
								$("#macroCommandsEditor").val("");
								$("#macroContainerStyle").val("");
								$("#macroBtnStyle").val("");
						}
						var apps=[];
						var counter = 0;
						var finalCounter = -1;
						$.each($("#myAppGrid").jqxGrid('source').records,function(i,v){
								var newitem={
										name: v.appName,
										value: v.appID
								};
								
								if (item){
										if (item.appID==v.appID){
												finalCounter = counter;
										}
								}
								counter++;
								apps.push(newitem);
						});
						mygis.Utilities.populateSelect(document.getElementById("appsetting_chooseMacroApp"),apps,true);
						if (item && finalCounter>-1){
								$("#appsetting_chooseMacroApp option").eq(finalCounter).attr("selected","selected");
						}
				},
				
				/**
				 *	Checking the validity of the input in the edit macro dialog
				 *	@method editMacroCheck
				 */
				editMacroCheck: function(){
						var retvalue = false;
						var grid = $("#mapMacroList");
						var myconfig = mygis.Admin.UI.dialogConfig;
						var retobject;
						retobject = [];
						
						var item = {
								macroSelected: false,
								macroID: -1,
								mapID: mygis.Admin.MapManager.updateConfig.mapID,
								appID: $("#appsetting_chooseMacroApp").val(),	
								name: $("#appSetting_MacroName").val(),
								commands: $("#macroCommandsEditor").val().replace(/\r\n/g,'#').replace(/\,/g,'%'),
								parentSelector: $("#appSetting_parentSelector").val(),
								cont_css: $("#macroContainerStyle").val().replace(/\r\n/g,''),
								btn_css: $("#macroBtnStyle").val().replace(/\r\n/g,''),
								options: null,
								isButton: $("#appSetting_IsButton").is(':checked'),
								isForRegistered: $("#appSetting_IsForRegistered").is(':checked')
						};
						retobject.push(item);
						myconfig.object=retobject;
						retvalue = true;
						return retvalue;
				},
				
				/**
				 * Handling the result of the edit macro dialog if it's a new item
				 * @method editMacroResult
				 * @param {String} result Whether it was successful ("ok") or not
				 */
				editMacroResult: function(result){
						if (result=="ok"){
								var grid = $("#mapMacroList");
								var gridSource = grid.jqxGrid('source').records;
								var myconfig = mygis.Admin.MapManager.updateConfig;
								for (var i=0;i<this.length;i++){
										var item = this[i];
										grid.jqxGrid('addrow',null,item);
										var confItem = {
												changed: true,
												oldvalue: null,
												newValue: JSON.stringify(item)
										};
										myconfig.macros.push(confItem)
								}
								mygis.Admin.MapManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Deletes the selected grid rows and notifies for save
				 * @method deleteMacros
				 */
				deleteMacros: function(){
						var grid = $("#mapMacroList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var atLeastOne = false;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								var confItem = mygis.Admin.MapManager.updateConfig.macros[selection[i]];
								if (confItem.newValue){	//it's simply a newly created item, so remove it from the array
										records.splice(selection[i],1);
										mygis.Admin.MapManager.updateConfig.macros.splice(selection[i],1);
								}else{
										var grabCopy = $.extend({},item);
										grabCopy.id=-1;
										confItem.newValue = JSON.stringify(grabCopy);
										confItem.changed=true;
										atLeastOne=true;
										records.splice(selection[i],1);
								}
						}
						if (atLeastOne){
								mygis.Admin.MapManager.notifyUnsaved();
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Switches the active tab to the given index
				 * @method switchToTab
				 */
				switchToTab: function(index){
						var tabHeaders = $("#editMacroLinkTabsRound").find(".sectionHeader");
						for (var i=0;i<tabHeaders.length;i++){
								if (i!=index){
										tabHeaders[i].ex_RemoveClassName("active");
								}else{
										tabHeaders[i].ex_AddClassName("active");
								}
						}
						var tabs = $("#editMacroTab").find(".appSettingFrame");
						for (var i=0;i<tabs.length;i++){
								if (i!=index){
										$(tabs[i]).hide();
								}else{
										$(tabs[i]).show();
										
								}
						}
				},
				
				/**
				 *	Used to create the macro grid in the macro tab of the map manager
				 *	@method createMacroGrid
				 *	@param {Integer} mapID the map to query
				 */
				createMacroGrid: function(mapID){
						mygis.Utilities.blockUI();
						var macroSource = mygis.Admin.MapManager.Macros.createMacroGridSource(mapID);
						var container = $("#mapMacroList");
						container.bind("bindingcomplete",function(event){
								mygis.Admin.MapManager.setConfigMacros($("#mapMacroList").jqxGrid('source').records);
						});
						var columnrenderer = function(value){
								var retobject;
								var grid=$("#mapMacroList");
								var action = 'router("adminMacroAllClick",this);';
								var selection = grid.jqxGrid('getselectedrowindexes');
								var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								var customStyle="text-align: center; margin-top: 5px;position: absolute;left: 18px;z-index: 1;";
								
								retobject = mygis.Utilities.format("<div style='{2}'><input id='adminSelectAllMacros' type='checkbox' onclick='{0}'{1}/></div>",
																									 action,checked,customStyle);
								return retobject;
						}
						var cellrenderer = function(row,datafield,value){
								var retobject;
								switch (datafield){
										
										case "isButton":
										case "isForRegistered":
												var checked = value?" checked":"";
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 25px;line-height:25px;'><a href='#' class='btnTickCheck{0}'></a></div>",checked);
												break;
								}
								return retobject;
						}
						if (macroSource.records.length>0){
								container.jqxGrid({
										source: macroSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns:[
												{text:'sel',datafield: 'macroSelected', width: 45, columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapManager.macroGrid_colID, datafield: 'macroID',editable: false},
												{text: strings.MapManager.macroGrid_colName, datafield: 'name', editable: false},
												{text: strings.MapManager.macroGrid_colApp, datafield: 'appID', editable: false},
												{text: strings.MapManager.macroGrid_colBtn, datafield: 'isButton', editable: false,cellsrenderer: cellrenderer},
												{text: strings.MapManager.macroGrid_colRegister, datafield: 'isForRegistered', editable: false,cellsrenderer: cellrenderer}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								container.jqxGrid({
										source: macroSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text:'sel',datafield: 'macroSelected', width: 45, columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapManager.macroGrid_colID, datafield: 'macroID',editable: false},
												{text: strings.MapManager.macroGrid_colName, datafield: 'name', editable: false},
												{text: strings.MapManager.macroGrid_colApp, datafield: 'appID', editable: false},
												{text: strings.MapManager.macroGrid_colBtn, datafield: 'isButton', editable: false,cellsrenderer: cellrenderer},
												{text: strings.MapManager.macroGrid_colRegister, datafield: 'isForRegistered', editable: false,cellsrenderer: cellrenderer}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}
						container.bind("rowselect",mygis.Admin.MapManager.Macros.macroSelected);
						container.bind("rowunselect",mygis.Admin.MapManager.Macros.macroUnselected);
						container.bind("cellendedit",mygis.Admin.MapManager.Macros.singleCheckClick);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Used to create the macro grid's source
				 * @method createMacroGridSource
				 * @param {Integer} mapID the map to query
				 */
				createMacroGridSource: function(mapID){
						var retvalue;
						var myurl = config.folderPath+"mgreq.ashx?qtype=GetMapMacros&qContents="+mapID;
						var source =
						{
								datatype: "json",
								datafields: [
										{ name: "macroSelected"},
										{ name: "macroID" },
										{ name: "mapID"}, 
										{ name: "appID" },
										{ name: "name" },
										{ name: "commands" },
										{ name: "parentSelector"},
										{ name: "cont_css"},
										{ name: "btn_css"},
										{ name: "options" },
										{ name: "isButton", type: "boolean"},
										{ name: "isForRegistered", type: "boolean"}
								],
								id: 'macroEditSource',
								url: myurl
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						return retvalue;
				},
				
				/**
				 * Refreshes the quick search grid
				 * @method refreshMacroGrid
				 */
				refreshMacroGrid: function(){
						$("#mapMacroList").jqxGrid('updatebounddata');
				},
				
				/**
				 *	Activates/deactivates some buttons when a macro is selected
				 *	@method macroSelected
				 **/
				macroSelected: function(){
						var grid = $("#mapMacroList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_editMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_editMacrobtn").ex_AddClassName("disabled");
								}
								if (document.getElementById("map_deleteMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteMacrobtn").ex_RemoveClassName("disabled");
								}
						}else{
								if (document.getElementById("map_editMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_editMacrobtn").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("map_deleteMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteMacrobtn").ex_RemoveClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllMacros").checked=true;
						}else{
								document.getElementById("adminSelectAllMacros").checked=false;
						}
				},
				
				/**
				 *	Activates/deactivates some buttons when a macro is unselected
				 *	@method macroUnselected
				 **/
				macroUnselected: function(){
						var grid = $("#mapMacroList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_editMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_editMacrobtn").ex_AddClassName("disabled");
								}
								if (document.getElementById("map_deleteMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteMacrobtn").ex_RemoveClassName("disabled");
								}
						}else if (selection.length==1){
								if (document.getElementById("map_editMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_editMacrobtn").ex_RemoveClassName("disabled");
								}
								if (document.getElementById("map_deleteMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteMacrobtn").ex_RemoveClassName("disabled");
								}
						}else{
								if (!document.getElementById("map_editMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_editMacrobtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_deleteMacrobtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteMacrobtn").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("adminSelectAllMacros").checked=true;
						}else{
								document.getElementById("adminSelectAllMacros").checked=false;
						}
				},
				
				/**
				* Handles the clicking of the checkbox in each row at the macro grid
				* @method singleCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
				singleCheckClick: function(elem){
						var grid = $("#mapMacroList");
						if (elem.args.value) {
								grid.jqxGrid('selectrow', elem.args.rowindex);
						}
						else {
								grid.jqxGrid('unselectrow', elem.args.rowindex);
						}
				},
				
				/**
				 * Handles the check all button in the macro grid
				 * @method allCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				allCheckClicked: function(elem){
						var grid = $("#mapMacroList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].macroSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].macroSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				},
				
				/**
				 * Displays a wizard that helps build the command for mygis.UI.Help.createPopup
				 * @method showPopupWizard
				 */
				showPopupWizard: function(){
						$("#popupWiz").dialog({
								autoOpen: true,
								modal: false,
								resizable: false,
								width: 600,
								height: 510,
								title: strings.MapManager.macroPopup_window,
								closeOnEscape: false,
								draggable: true,
								position: "center"
						});
						$("#popupWiz_id").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_header").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_width").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_height").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_position").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_dispHeader").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_dispClose").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_isMovable").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
						$("#popupWiz_textArea").bind('propertychange keyup input paste',mygis.Admin.MapManager.Macros.updatePopupWizardOutput);
				},
				
				/*
				 * Gathers the data entered in the popup Wizard dialog and updates the output
				 * @method updatePopupWizardOutput
				 */
				updatePopupWizardOutput: function(){
						var id = $("#popupWiz_id").val();
						var title = $("#popupWiz_header").val();
						var width = $("#popupWiz_width").val();
						var height = $("#popupWiz_height").val();
						var position = $("#popupWiz_position").val();
						var showTitle = $("#popupWiz_dispHeader").is(":checked");
						var showClose = $("#popupWiz_dispClose").is(":checked");
						var isMovable = $("#popupWiz_isMovable").is(":checked");
						var myhtml = $("#popupWiz_textArea").val();
						var output = mygis.Utilities.format("mygis.UI.Help.createPopup('{0}','{1}','{2}',{3},{4},{5},'{6}',[{7},{8}]);",
																								id,myhtml,title,showTitle,showClose,isMovable,position,width,height
																								);
						$("#popupWiz_output").val(output);
				},
				
				copyPopupOutput: function(){
						var id = $("#popupWiz_id").val();
						var title = $("#popupWiz_header").val();
						var width = $("#popupWiz_width").val();
						var height = $("#popupWiz_height").val();
						var position = $("#popupWiz_position").val();
						var showTitle = $("#popupWiz_dispHeader").is(":checked");
						var showClose = $("#popupWiz_dispClose").is(":checked");
						var isMovable = $("#popupWiz_isMovable").is(":checked");
						var myhtml = $("#popupWiz_textArea").val();
						
						var params = mygis.Utilities.format("'{0}','{1}','{2}',{3},{4},{5},'{6}',[{7},{8}]",
																								id,myhtml,title,showTitle,showClose,isMovable,position,width,height
																								);
						$("#macroCommandsEditor").val($("#macroCommandsEditor").val()+"\r\n"+"mygis.UI.Help.createPopup,"+params);
						$("#popupWiz").dialog('close');
				},
				
				testPopupOutput: function(){
						var output = $("#popupWiz_output").val();
						try{
								var fn = new Function(output);
								fn();
						}catch(err){alert("Error in syntax. Have you filled in all the fields?");}
				}
		},
		
		/**
		 * Functions for the quick searches in the map manager
		 * @class mygis.Admin.MapManager.QuickSearches
		 * @static
		 */
		QuickSearches: {
				/**
				 * Pops up a dialog to edit a map Quick Search
				 * @method showEditQS
				 * @param {Boolean} isNew True if this is a completely new QS
				 */
				showEditQS: function(isNew){
						var windowTitle;
						var myconfig = mygis.Admin.UI.dialogConfig;
						if (isNew){
								$("#editQSActionsTitle").attr('class','newQS');
								windowTitle = strings.MapManager.window_NewQS;
						}else{
								$("#editQSActionsTitle").attr('class','editQS');
								windowTitle = strings.MapManager.window_EditQS;
						}
						$("#editQSTitleELem").html(windowTitle);
						myconfig.checkfn = mygis.Admin.MapManager.QuickSearches.editQSCheck;
						myconfig.callbackfn = mygis.Admin.MapManager.QuickSearches.editQSResult;
						myconfig.objectCount = -1;
						myconfig.windowTitle = "#editQSPop";
						if (!isNew){
								var grid = $("#mapHotSearchList");
								var records = grid.jqxGrid('source').records;
								var selection = grid.jqxGrid('getselectedrowindexes');
								var item = records[selection[0]];
								mygis.Admin.MapManager.QuickSearches.setupEditQSButtons(item);
								myconfig.objectCount = item.id;
								//myconfig.callbackfn = mygis.Admin.MapManager.QuickSearches.editQSUpdateResult;
						}else{
								var item = {
										mapID: mygis.Admin.MapManager.updateConfig.mapID,
										quickID: -1
								};
								mygis.Admin.MapManager.QuickSearches.setupEditQSButtons(item);
						}
						$("#editQSPop").dialog({
								autoOpen: true,
								modal: true,
								resizable: false,
								width: 900,
								height: 510, 
								title: strings.MapManager.window_QSManager,
								closeOnEscape: false
						});
						var titleBar = $("#ui-dialog-title-editQSPop").parent();
						titleBar.css({
							"background":"url('"+config.folderPath+"Images/Administration/header/icon-48-cpanel.png') #F6A828 no-repeat 14px 5px",
							"background-size":"auto 18px"
							});
				},
				
				/**
				 * Sets up the UI (jqx widgets, handlers etc)
				 * @method setupEditQSButtons
				 * @param {Object} defaultItem The item that sets up the default parameters
				 */
				setupEditQSButtons: function(defaultItem){
						$("#qs_quickID").val(defaultItem.quickID);
						mygis.Admin.MapManager.QuickSearches.qsLoadLayers(defaultItem.mapID,defaultItem);
						if (defaultItem.quickID!=-1){
								switch (defaultItem.searchType){
										case "distinct":
												$("#editQSTab input[name='qs_layerSearchType']")[0].checked="checked";
												break;
										case "input":
												$("#editQSTab input[name='qs_layerSearchType']")[1].checked="checked";
												break;
										case "customSQL":
												$("#editQSTab input[name='qs_layerSearchType']")[2].checked="checked";
												break;
								}
								switch (defaultItem.searchLayout){
										case "checkbox":
												$("#editQSTab input[name='qs_searchLayout']")[0].checked="checked";
												break;
										case "dropdown":
												$("#editQSTab input[name='qs_searchLayout']")[1].checked="checked";
												break;
								}
								switch(defaultItem.searchMode){
										case "auto":
												$("#editQSTab input[name='qs_searchMode']")[0].checked="checked";
												break;
										case "buttons":
												$("#editQSTab input[name='qs_searchMode']")[1].checked="checked";
												break;
								}
								$("#qs_windowTitle").val(defaultItem.windowTitle);
						}
				},
				
				/**
				 * Loads the layer list in the create/edit QS dialog window
				 * @method qsLoadLayers
				 */
				qsLoadLayers: function(mapID,configItem){
						var myurl = config.folderPath +"mgreq.ashx?qtype=GetLayerList&qContents="+mapID;
						var source = {
								datatype: "json",
								datafields: [
									{ name: "layerID" },
									{ name: "layerNAME" },
									{ name: "layerTABLE" }
								],
								id: 'qsLayers',
								url: myurl
						};
						var mysource = new $.jqx.dataAdapter(source,{
								loadComplete: function(){
										var data = mysource.records;
										var selectSource = [];
										var defaultSelected=-1;
										
										for (var i = 0; i < data.length; i++) {
												var item = data[i];
												var label = item.layerNAME;
												var row = {};
												row["name"]=label;
												//row["value"]=label;
												row["value"]=item.layerTABLE;
												selectSource.push(row);
												if (configItem){
														if (configItem.layername==item.layerTABLE){
																defaultSelected=i;
														}
												}
										}
										mygis.Utilities.populateSelect($("#qs_layernameInp")[0],selectSource);
										if (defaultSelected>-1){
												document.getElementById("qs_layernameInp").selectedIndex=defaultSelected+1;
												mygis.Admin.MapManager.QuickSearches.qsLoadFields(configItem);
										}
								}
						});
						mysource.dataBind();
						$("#qs_layernameInp").bind("change",mygis.Admin.MapManager.QuickSearches.qsLoadFields);
				},
				
				/**
				 * Loads the field list in the create/edit QS dialog window
				 * @method qsLoadFields
				 */
				qsLoadFields: function(configItem){
						var element = document.getElementById("qs_layernameInp");
						if (element.selectedIndex>0){
								var layername = element.options[element.selectedIndex].value;
								var customUrl = config.mgreq+"?qtype=GetLayerFields&qContents="+escape(layername.replace(/ /g,"_"));
								$.ajax({
										type:"GET",
										url: customUrl,
										success: function(data){
												var newElem=document.getElementById("qs_layerfieldInp");
												var datacolumns = mygis.Query.resultLayerDetails(data);	
												mygis.Utilities.populateSelect(newElem,datacolumns);
												if (configItem){
														$("#qs_layerfieldInp option:contains('"+configItem.fieldname+"')").attr("selected","selected")
												}
										}
								});
						}
						
				},
								
				/**
				 * Checking the validity of the input in the edit QS dialog
				 * @method editQSCheck
				 */
				editQSCheck: function(){
						var retvalue=false;
						var flag1 = $("#qs_layernameInp")[0].selectedIndex>0;
						var flag2 = $("#qs_layerfieldInp")[0].selectedIndex>0;
						var flag3 = $("#qs_windowTitle").val()!="";
						if (flag1&&flag2&&flag3){
								retvalue=true;
								mygis.Admin.UI.dialogConfig.object = {
										layername: $("#qs_layernameInp").val(),
										fieldname: $("#qs_layerfieldInp").val().split("%")[0],
										searchType: $("#editQSTab input[name='qs_layerSearchType']:checked").val(),
										searchOperator: $("#qs_searchOp").val(),
										searchLayout: $("#editQSTab input[name='qs_searchLayout']:checked").val(),
										searchMode: $("#editQSTab input[name='qs_searchMode']:checked").val(),
										windowTitle: $("#qs_windowTitle").val(),
										mapID: mygis.Admin.MapManager.updateConfig.mapID,
										quickID: $("#qs_quickID").val()
								};
						}else{
								if (!flag1){
										alert(strings.MapManager.qsNew_err_NoLayer);	
								}else if (!flag2){
										alert(strings.MapManager.qsNew_err_NoField);
								}else if (!flag3){
										alert(strings.MapManager.qsNew_err_NoTitle);
								}
						}
						return retvalue;
				},
				
				/**
				 * Handling the result of the edit QS dialog if it's a new item
				 * @method editQSResult
				 * @param {String} result Whether it was successful ("ok") or not
				 */
				editQSResult: function(result){
						var configObj = this;
						var toSend=JSON.stringify(configObj);
						var customUrl = config.mgreq+"?qtype=CreateNewQS";
						var postObject = new Object();
						postObject["qContents"]=toSend;
						mygis.Utilities.blockUI();
						$.ajax({
								type:"POST",
								data: postObject,
								url: customUrl,
								success: function(data){
										try{
												var realResults = eval('('+data+')');
												if (realResults.iotype=="success"){
														mygis.Admin.MapManager.QuickSearches.refreshQSGrid();
														displaySuccess(strings.MapManager.qsNew_msg_Success);
													
												}else{
													displayError(realResults.iomsg);
												}		
										}catch(err){
												console.log(err.message);
										}
										mygis.Utilities.unblockUI();
								}
						});
				},
				
				/**
				 * Selects a row(deselecting others if necessary) and then calls the editing function
				 * @method directQSEdit
				 * @param {Integer} rowIndex
				 */
				directQSEdit: function(rowindex){
						var grid = $("#mapHotSearchList");
						grid.jqxGrid('clearselection');
						grid.jqxGrid('selectrow',rowindex);
						mygis.Admin.MapManager.QuickSearches.qsSelected();
						mygis.Admin.MapManager.QuickSearches.showEditQS(false);
				},
				
				/**
				 * Deletes the selected grid rows and notifies for save
				 * @method deleteQS
				 */
				deleteQS: function(){
						var grid = $("#mapHotSearchList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						var atLeastOne = false;
						for (var i=0;i<selection.length;i++){
								var item = records[selection[i]];
								var confItem = mygis.Admin.MapManager.updateConfig.quickSearches[selection[i]];
								var grabCopy = $.extend({},item);
								grabCopy.quickID=-1;
								confItem.newValue = JSON.stringify(grabCopy);
								confItem.changed=true;
								atLeastOne=true;
								records.splice(selection[i],1);
						}
						if (atLeastOne){
								mygis.Admin.MapManager.notifyUnsaved();
								grid.jqxGrid('clearselection');
								grid.jqxGrid('refreshdata');
								mygis.Admin.MapManager.QuickSearches.qsUnselected();
						}
				},
				
				/**
				 * Used to create the quick search grid in the QS tab of the map manager
				 * @method createQSGrid
				 * @param {Integer} mapID the map to query
				 */
				createQSGrid: function(mapID){
						mygis.Utilities.blockUI();
						var qsSource = mygis.Admin.MapManager.QuickSearches.createQSGridSource(mapID);
						var container = $("#mapHotSearchList");
						container.bind("bindingcomplete",function(event){
								mygis.Admin.MapManager.setConfigQS($("#mapHotSearchList").jqxGrid('source').records);
						});
						var columnrenderer = function(value){
								var action = 'router("mapQSAllClick",this);';
								var grid = $("#mapHotSearchList");
								var selection = grid.jqxGrid('getselectedrowindexes');
								var checked = selection.length==grid.jqxGrid('source').records.length ? ' checked="checked"' : '';
								retobject = mygis.Utilities.format("<div style='text-align: center; margin-top: 5px;position: absolute;left: 8px;z-index: 1;'><input id='map_selectAllQS' type='checkbox' onclick='{0}'{1}/></div>",action,checked);
								return retobject;
						};
						var cellrenderer = function(row,datafield,value){
								var retobject;
								switch (datafield){
										case "windowTitle":
												var action = mygis.Utilities.format('router("qsTitleClick",{0});',row);
												retobject = mygis.Utilities.format("<div class='imageVerticalContainer'><a href='#' onclick='{1}'>{0}</a></div>",value,action);
												break;
								}
								return retobject;
						};
						if (qsSource.records.length>0){
								container.jqxGrid({
										source: qsSource,
										width: '100%',
										autoheight: true,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf', datafield:'qsSelected',width: 22,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapManager.qsGrid_colWindowName, datafield:'windowTitle',editable:false,cellsrenderer: cellrenderer},
												{text: strings.MapManager.qsGrid_colLayerName, datafield:'layername',editable:false},
												{text: strings.MapManager.qsGrid_colFieldName, datafield:'fieldname',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}else{
								container.jqxGrid({
										source: qsSource,
										width: '100%',
										autoheight: false,
										height: 200,
										theme: 'pk_mg_jm',
										altrows: true,
										enabletooltips: true,
										columns: [
												{text: 'asdf', datafield:'qsSelected',width: 22,columntype: 'checkbox',renderer: columnrenderer},
												{text: strings.MapManager.qsGrid_colWindowName, datafield:'windowTitle',editable:false,cellsrenderer: cellrenderer},
												{text: strings.MapManager.qsGrid_colLayerName, datafield:'layername',editable:false},
												{text: strings.MapManager.qsGrid_colFieldName, datafield:'fieldname',editable:false}
										],
										enableanimations: false,
										showheader: true,
										columnsmenu: false,
										editable: true,
										selectionmode: 'none'
								});
						}
						container.bind("rowselect",mygis.Admin.MapManager.QuickSearches.qsSelected);
						container.bind("rowunselect",mygis.Admin.MapManager.QuickSearches.qsUnselected);
						container.bind("cellendedit",mygis.Admin.MapManager.QuickSearches.qsCheckClicked);
						mygis.Utilities.unblockUI();
				},
				
				/**
				 * Used to create the quick search grid's source
				 * @method createQSGridSource
				 * @param {Integer} mapID the map to query
				 */
				createQSGridSource: function(mapID){
						var retvalue;
						var myurl = config.folderPath+"mgreq.ashx?qtype=GetMapQuickSearches&qContents="+mapID;
						var source =
						{
							datatype: "json",
							datafields: [
								{ name: "qsSelected", type:"boolean"},
								{ name: "mapID"},
								{ name: "quickID" },
								{ name: "layername"}, 
								{ name: "fieldname" },
								{ name: "searchType" },
								{ name: "searchOperator" },
								{ name: "searchLayout" },
								{ name: "searchMode" },
								{ name: "windowTitle"}, 
								{ name: "windowIcon"}
							],
							id: 'asdfg',
							url: myurl
						};
						retvalue = new $.jqx.dataAdapter(source,{async:false});
						return retvalue;
				},
				
				/**
				 * Refreshes the quick search grid
				 * @method refreshQSGrid
				 */
				refreshQSGrid: function(){
						$("#mapHotSearchList").jqxGrid('updatebounddata');
				},
				
				/**
				 * Handles the selection or rows in the qs grid
				 * @method qsSelected
				 */
				qsSelected: function(){
						var grid = $("#mapHotSearchList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_editQSbtn").ex_HasClassName("disabled")){
										document.getElementById("map_editQSbtn").ex_AddClassName("disabled");
								}
								document.getElementById("map_deleteQSbtn").ex_RemoveClassName("disabled");
						}else{
								document.getElementById("map_editQSbtn").ex_RemoveClassName("disabled");
								document.getElementById("map_deleteQSbtn").ex_RemoveClassName("disabled");
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("map_selectAllQS").checked=true;
						}else{
								document.getElementById("map_selectAllQS").checked=false;
						}
				},
				
				/**
				 * Handles the selection or rows in the qs grid
				 * @method qsUnselected
				 */
				qsUnselected: function(){
						var grid = $("#mapHotSearchList");
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (selection.length>1){
								if (!document.getElementById("map_editQSbtn").ex_HasClassName("disabled")){
										document.getElementById("map_editQSbtn").ex_AddClassName("disabled");
								}
								document.getElementById("map_deleteQSbtn").ex_RemoveClassName("disabled");
						}else if (selection.length==1){
								document.getElementById("map_editQSbtn").ex_RemoveClassName("disabled");
								document.getElementById("map_deleteQSbtn").ex_RemoveClassName("disabled");
						}else{
								if (!document.getElementById("map_editQSbtn").ex_HasClassName("disabled")){
										document.getElementById("map_editQSbtn").ex_AddClassName("disabled");
								}
								if (!document.getElementById("map_deleteQSbtn").ex_HasClassName("disabled")){
										document.getElementById("map_deleteQSbtn").ex_AddClassName("disabled");
								}
						}
						if (selection.length==grid.jqxGrid('source').records.length){
								document.getElementById("map_selectAllQS").checked=true;
						}else{
								document.getElementById("map_selectAllQS").checked=false;
						}
				},
				
				/**
				* Handles the clicking of the checkbox in each row at the QS grid
				* @method qsCheckClicked
				* @param {Element} elem The checkbox clicked
				*/
				qsCheckClicked: function(elem){
						var grid = $("#mapHotSearchList");
						if (elem.args.value) {
								grid.jqxGrid('selectrow', elem.args.rowindex);
						}
						else {
								grid.jqxGrid('unselectrow', elem.args.rowindex);
						}
				},
				
				/**
				 * Handles the check all button in the QS grid
				 * @method qsAllCheckClicked
				 * @param {Element} elem The firing checkbox
				 */
				qsAllCheckClicked: function(elem){
						var grid = $("#mapHotSearchList");
						var records = grid.jqxGrid('source').records;
						var selection = grid.jqxGrid('getselectedrowindexes');
						if (elem.checked){
								for (var i=0;i<records.length;i++){
										if (selection.indexOf(i)==-1){
												records[i].qsSelected=true;
												grid.jqxGrid('selectrow',i)
										}
								}
								grid.jqxGrid('refreshdata');
						}else{
								for (var i=0;i<records.length;i++){
										records[i].qsSelected=false;
										grid.jqxGrid('unselectrow',i)
								}
								grid.jqxGrid('refreshdata');
						}
				}
		},
		
		/**
			Fills in the "editForm" fields with the map details
			@method getMapDetails
			@param {String} mapID The map id. If ommited, it will get the current map details.
			@for mygis.Admin.MapManager
		**/
		getMapDetails: function(mapID){
				if (!$("#myMapsGrid").jqxGrid('source')){
						mygis.Admin.MapManager.Maps.createMapGrid();
				}
				var records = $("#myMapsGrid").jqxGrid('source').records;
				var found=false;
				var i=0;
				var details;
				while (!found && i<records.length){
					if (mapID){
						if (records[i].id==mapID){
							found=true;
							details = records[i];
						}
					}else{
						if (records[i].id==currentMapID){
							found=true;
							details = records[i];
						}
					}
					i++;
				}
				if (found){
						mygis.Admin.MapManager.storeMapDetails(details);
						document.getElementById("editMapName").value = details.mapName;
						document.getElementById("editMapDescription").value = details.mapDescription;
						document.getElementById("editMapExtent").value = details.maxExtent;
						document.getElementById("editMapCenter").value = details.mapCenter;
						document.getElementById("editMapZoom").value = details.mapZoom;
						document.getElementById("editMapDeveloper").value = details.mapDevelopedBy;
						document.getElementById("editMapOwner").value = details.mapOwner;
						document.getElementById("editMapThumb").src = config.folderPath+'GetImage.ashx?qType=mapThumb&qsize=120&qContents='+details.id;
						mygis.Utilities.populateBGselect($("#editMapDefaultBG"),details.mapDefaultBG);
						mygis.Admin.MapManager.Layers.createLayerGrid(details.id);	//this is needed for map thumb generation from layers
						
				}
		},
		
		/**
		 * Stores the current editing map's details in the config object
		 * @method storeMapDetails
		 * @param {Object} detailRow The grid record
		 */
		storeMapDetails: function(detailRow){
				mygis.Admin.MapManager.resetConfigObject();
				var myconfig = mygis.Admin.MapManager.updateConfig;
				myconfig.mapID=detailRow.id;
				myconfig.mapName.oldValue = detailRow.mapName;
				myconfig.mapDescription.oldValue = detailRow.mapDescription;
				myconfig.mapExtent.oldValue = detailRow.maxExtent;
				myconfig.mapCenter.oldValue = detailRow.mapCenter;
				myconfig.mapZoom.oldValue =  detailRow.mapZoom;
				myconfig.mapDeveloped.oldValue = detailRow.mapDevelopedBy;
				myconfig.mapOwner.oldValue = detailRow.mapOwner;
				myconfig.mapDefaultBG.oldValue = detailRow.mapDefaultBG;
		},
		
		/**
		 * Updates the config object with the source layers
		 * @method setConfigLayers
		 * @param {Object} source The grid source
		 * @param {Boolean} changed If all items should be considered changed
		 */
		setConfigLayers: function(source,changed){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: changed?changed:false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.MapManager.updateConfig.layers=finalList;
		},
		
		/**
		 * Updates the config object with the source tags
		 * @method setConfigTags
		 */
		setConfigTags: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.MapManager.updateConfig.tags = finalList;
		},
		
		/**
		 * Updates the config object with the source Quick Searches
		 * @method setConfigQS
		 */
		setConfigQS: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.MapManager.updateConfig.quickSearches = finalList;
		},
		
		/**
		 * Updates the config object with the source Macros
		 * @method setConfigMacros
		 */
		setConfigMacros: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.MapManager.updateConfig.macros = finalList;
		},
		
		/**
		 * Updates the config object with the source permissions
		 * @method setConfigPermissions
		 */
		setConfigPermissions: function(source){
				var finalList = [];
				for (var i=0;i<source.length;i++){
						var item = {
								changed: false,
								newValue: null,
								oldValue : null
						};
						item.oldValue = JSON.stringify(source[i]);
						finalList.push(item);
				}
				mygis.Admin.MapManager.updateConfig.permissions = finalList;
		},
		
		resetConfigObject: function(){
				try{
						if (!document.getElementById("amenu_Maps_Config_save").ex_HasClassName("disabled")){
								document.getElementById("amenu_Maps_Config_save").ex_AddClassName("disabled");
						}
				}catch(err){}
				var resetobj = {
						layers: [],
						permissions: [],
						macros: [],
						mapName: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDescription: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapExtent: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapCenter: {
						changed: false,
						oldValue : "",
						newValue: ""
				},
				mapZoom: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDeveloped: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapOwner: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapThumb: {
						changed: false,
						oldValue: "",
						newValue: ""
				},
				mapDefaultBG: {
						changed: false,
						oldValue: "",
						newValue: ""
				}
				};
				mygis.Admin.MapManager.updateConfig = mygis.Utilities.mergeOptions(mygis.Admin.MapManager.updateConfig,resetobj);
		},
		
		/**
		 * Triggers when a section in the "edit map settings" is expanded
		 * @method expandDetails
		 * @param {Object} event The triggering event
		 */
		expandDetails: function(event){
				var index = event.item;
				mygis.Utilities.blockUI();
				
				var tabHeaders = $("#contentLinkTabsRound").find(".sectionHeader");
				for (var i=0;i<tabHeaders.length;i++){
						if (i!=index){
								tabHeaders[i].ex_RemoveClassName("active");
						}else{
								tabHeaders[i].ex_AddClassName("active");
						}
				}
				var tabs = $("#editMapForm").find(".sectionContent");
				for (var i=0;i<tabs.length;i++){
						if (i!=index){
								$(tabs[i]).hide();
						}else{
								$(tabs[i]).show();
								var buttons = $(tabs[i]).find(".sectionButtons");
								$("#contentSpecificToolbar").empty();
								$("#contentSpecificToolbar").append(buttons.clone());
						}
				}
				
				mygis.Admin.MapManager.createGrid(index);
				mygis.Utilities.unblockUI();
		},
		
		/**
		 * Routing function for the map settings tabs
		 * @method createGrid
		 * @param {Integer} index The corresponding tabIndex to create a grid for.
		 */
		createGrid: function(index){
				var myconfig = mygis.Admin.MapManager.updateConfig;
				switch (index){
						case 1:
								if (myconfig.layers.length==0){
										mygis.Admin.MapManager.Layers.createLayerGrid(myconfig.mapID);
								}else{
										$("#mapLayerList").jqxGrid('render'); //force update
								}
								break;
						case 3:
								if (myconfig.quickSearches.length==0){
										mygis.Admin.MapManager.QuickSearches.createQSGrid(myconfig.mapID);
								}else{
										$("#mapHotSearchList").jqxGrid('render');	//force update
								}
								break;
						case 4:
								if (myconfig.macros.length==0){
										mygis.Admin.MapManager.Macros.createMacroGrid(myconfig.mapID);
								}else{
										$("#mapMacroList").jqxGrid('render');	//force update
								}
								break;
				}
		},
		
		/**
		 * Notifies that there are unsaved changes
		 * @method notifyUnsaved
		 */
		notifyUnsaved: function(){
				document.getElementById("amenu_Maps_Config_save").ex_RemoveClassName("disabled");
				$("#amenu_Maps_Config_save").qtip({
					content: {
							text: strings.AppManager.msg_NotifyUnsaved
					},
					position: {
							my: "center right",
							at: "center left"
					},
					show: {
							event: "mouseover",
							ready: true,
							solo: true
					},
					hide: {
							event: "unfocus",
							inactive: false
					},
					events: {
							hide: function(event, api) {
									api.destroy();
							}
					},
					style: {
							classes: 'ui-tooltip-shadow', // Optional shadow...
							tip: {
								border: 1
							},
							border: 1
					}});
		},
		
		/**
		 * Propagates all changes to the server
		 * @method saveChanges
		 */
		saveChanges: function(){
				var toSend = JSON.stringify(mygis.Admin.MapManager.updateConfig);
				var customUrl = config.mgreq+"?qtype=UpdateMapSettings";
				var postObject = new Object();
				postObject["qContents"]=toSend;
				mygis.Utilities.blockUI();
				$.ajax({
						type: "POST",
						data: postObject,
						url: customUrl,
						success: function(data){
								var realResults = eval(data);
								if (realResults.iotype=="success"){
										mygis.Utilities.unblockUI();
										mygis.Admin.MapManager.resetConfigObject();
										displaySuccess(strings.MapManager.settings_updated);
										setTimeout(function(){
												var activeTab = $("#contentLinkTabsRound").find(".sectionHeader.active");
												mygis.Admin.MapManager.createGrid(activeTab.index());
										},250);
								}else{
										displayError(realResults.iomsg);
								}
						}
				});
		},
		
		/**
			This function is used to late-bind all handlers for the Map Manager window
			@method bindManagerHandlers
		**/
		bindManagerHandlers: function(){
				for (var i=0;i<5;i++){
						var handler="";
						switch(i){
								case 0:
										handler="mapManager_sortName";
										break;
								case 1:
										handler="mapManager_sortLayerCount";
										break;
								case 2:
										handler="mapManager_sortCreateDate";
										break;
								case 3:
										handler="mapManager_sortUpdateDate";
										break;
								case 4:
										handler="mapManager_sortOwnershipType";
										break;
								
						}
						$("#"+handler).bind('click',function(){
								mygis.Admin.MapManager.sortBy(handler);
								return false;
						});
				}
				var search=$("#mapManager_SearchInput");
				search.data("oldVal","");
				//search.bind('paste',mygis.Admin.MapManager.filterPotentialMaps);
				search.bind('focus',function(){mygis.Admin.MapManager.toggleFilterFocus(true);});
				search.bind('blur',function(){mygis.Admin.MapManager.toggleFilterFocus(false);});
				var delay = (function(){
						var timer = 0;
						return function(callback, ms){
							clearTimeout (timer);
							timer = setTimeout(callback, ms);
						};
						})();
				search.bind("propertychange input keyup",function(){delay(mygis.Admin.MapManager.filterPotentialMaps,300);});
				search.bind("propertychange input keyup",mygis.Admin.MapManager.toggleFilterDecoration);
		},
		
		/**
		 * Creates the grid for the available maps to load
		 * @method createPotentialMapGrid
		 * @param {String} filterList A #-separated list of map ids to filter OUT
		 */
		createPotentialMapGrid: function(filterList){
				var mapSource = mygis.Admin.MapManager.createPotentialMapSource(filterList);
				var mapContainer = $("#mapManagerList");
				var cellrenderer = function(row,datafield,value){
						var retobject;
						switch(datafield){
								case "mapName":
										var descr = this.owner.getrowdata(row).mapDescription;
										retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 100px;line-height:25px;'><a href='#' title='{1}' style='font-size: 11px;'>{0}</a></div>",value,descr);
						
										break;
								case "mapOwnershipDesc":
										var data = this.owner.getrowdata(row);
										var description = "";
										if (data.mapAmOwner && data.mapAmCreator){
												description = strings.MapManager.mapOwnershipType1;
										}else if (data.mapAmOwner){
												description = strings.MapManager.mapOwnershipType2;
										}else if (data.mapAmCreator){
												description = strings.MapManager.mapOwnershipType3;
										}else if (data.mapAmSubscriber){
												description = strings.MapManager.mapOwnershipType4;
										}else if (data.mapIsPublic){
												description = strings.MapManager.mapOwnershipType5;
										}
										retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 160px;line-height:25px;text-align:center;'><a href='#' title='{1}' style='font-size: 11px;'>{0}</a></div>",
																											 description,description);	//TODO: the second title should be an Ajax tooltip with more info
										break;
								case "mapIsPublic":
								case "mapAmOwner":
								case "mapAmCreator":
								case "mapAmSubscriber":
										var checked = value?" checked":"";
										retobject = mygis.Utilities.format("<div class='imageVerticalContainer' style='width: 80px;line-height:25px;'><div class='btnToggleCheck{0}'></div></div>",checked);
										break;
						}
						
						return retobject;
				};
				mapContainer.jqxGrid({
						source: mapSource,
						width: 760,
						height: 294,
						autoheight: false,
						theme: 'pk_mg_jm',
						altrows: true,
						enabletooltips: true,
						columns: [
								{text: 'asdf', datafield: 'mapSelected', width: 20, columntype: 'checkbox'},
								{text: strings.MapControl.col_mapName, datafield: 'mapName', cellsrenderer: cellrenderer, editable:false},
								{text: strings.MapControl.col_mapLCount, datafield: 'mapLayerCount',editable:false,width:50,cellsalign:'right'},
								{text: strings.MapControl.col_mapCreate, datafield: 'mapCreateDate',editable:false,width:130},
								{text: strings.MapControl.col_mapUpdate, datafield: 'mapUpdateDate',editable:false,width:130},
								{text: strings.MapControl.col_mapOwnership, datafield: "mapOwnershipDesc", editable:false, width:160,cellsrenderer: cellrenderer} /*,
								{text: strings.MapControl.col_mapIsPublic, datafield: "mapIsPublic", editable:false, width:80,cellsrenderer: cellrenderer},
								{text: strings.MapControl.col_mapAmOwner, datafield: "mapAmOwner", editable:false, width:80,cellsrenderer: cellrenderer},
								{text: strings.MapControl.col_mapAmCreator, datafield: "mapAmCreator",editable:false, width:80,cellsrenderer: cellrenderer},
								{text: strings.MapControl.col_mapAmSubsciber, datafield: "mapAmSubscriber",editable:false, width:80,cellsrenderer: cellrenderer}*/
						],
						enableanimations: false,
						showheader: false,
						columnsmenu: false,
						editable: true,
						selectionmode: 'none'
				});

				mapContainer.bind('rowselect',mygis.Admin.MapManager.mapSelected);
				mapContainer.bind('rowunselect',mygis.Admin.MapManager.mapUnselected);
				mapContainer.bind('cellendedit',mygis.Admin.MapManager.singleMapCheck);
		},
		
		/**
		 * Creates the source for the available maps to load
		 * @method createPotentialMapSource
		 * @param {String} filterList A #-separated list of map ids to filter OUT
		 */
		createPotentialMapSource: function(filterList){
				var retvalue;
				var url = config.mgreq+"?qtype=AppAvailableMaps";
				if (filterList){
						url+= "&qContents="+filterList;
				}
				var source = {
						datatype: "json",
						datafields: [
								{name: "mapSelected",type: "boolean"},
								{name: "mapOwnershipDesc"},
								{ name: "id" },
								{ name: "mapName" },
								{ name: "mapDescription" },
								{ name: "mapLayerCount" },
								{ name: "maxExtent" },
								{ name: "mapCenter"},
								{ name: "mapZoom"},
								{ name: "mapCreateDate"},
								{ name: "mapUpdateDate"},
								{ name: "mapDevelopedBy"},
								{ name: "mapOwner"},
								{ name: "mapDefaultBG"},
								{ name: "mapIsPublic",type: "boolean"},
								{ name: "mapAmOwner",type: "boolean"},
								{ name: "mapAmCreator",type: "boolean"},
								{ name: "mapAmSubscriber",type: "boolean"}
						],
						id: 'adminPotentialMapList',
						url: url
				};
				retvalue = new $.jqx.dataAdapter(source,{async:false});
				//retvalue.dataBind();
				return retvalue;
		},
		
		/**
		 * Filters the list of potential maps according to the <select> filters
		 * @method filterPotentialMaps
		 */
		filterPotentialMaps: function(){
				var grid=$('#mapManagerList');
				grid.jqxGrid('clearfilters');
				var textFilter = $("#mapManager_SearchInput").val();
				var selFilter = parseInt($("#mapManager_filterOwnership").val());
				var boolFilter1 = $("#mapManager_filterPublic").val()=="1"?true:false;
				var boolFilter2 = $("#mapManager_filterOwner").val()=="1"?true:false;
				var boolFilter3 = $("#mapManager_filterCreator").val()=="1"?true:false;
				var boolFilter4 = $("#mapManager_filterSubscriber").val()=="1"?true:false;
				
				if (textFilter || selFilter>-1 || boolFilter1 || boolFilter2 || boolFilter3 || boolFilter4){
						
						for (var i=0;i<6;i++){
								var examined;
								var examinedType;
								var examinedCondition;
								var examinedDatafield;
								switch (i){
										case 0:
												examined=textFilter;
												examinedDatafield="mapName";
												examinedType = "stringfilter";
												examinedCondition = "CONTAINS";
												break;
										case 1:
												examined=boolFilter1;
												examinedDatafield="mapIsPublic";
												examinedType = "booleanfilter";
												examinedCondition = "EQUAL";
												break;
										case 2:
												examined=boolFilter2;
												examinedDatafield="mapAmOwner";
												examinedType = "booleanfilter";
												examinedCondition = "EQUAL";
												break;
										case 3:
												examined=boolFilter3;
												examinedDatafield="mapAmCreator";
												examinedType = "booleanfilter";
												examinedCondition = "EQUAL";
												break;
										case 4:
												examined=boolFilter4;
												examinedDatafield="mapAmSubscriber";
												examinedType = "booleanfilter";
												examinedCondition = "EQUAL";
												break;
										case 5:
												examined = selFilter;
												examinedType = "numericfilter";
												examinedCondition = "EQUAL";
												examinedDatafield = "mapOwnershipDesc";
												break;
										
								}
								if (examined){
										var filtergroup = new $.jqx.filter();
										if (i!=5){
												var filter = filtergroup.createfilter(examinedType,examined,examinedCondition);
												filtergroup.addfilter(0,filter);
												grid.jqxGrid('addfilter', examinedDatafield, filtergroup);
										}else{
												
												switch (selFilter){
														case 0:	//My creation
																var filterA = filtergroup.createfilter(examinedType,1,examinedCondition);
																var filterB = filtergroup.createfilter(examinedType,3,examinedCondition);
																filtergroup.addfilter(1,filterA);
																filtergroup.addfilter(1,filterB);
																grid.jqxGrid('addfilter', examinedDatafield, filtergroup);
																break;
														case 1:	//Buy 
																var filterA = filtergroup.createfilter(examinedType,2,examinedCondition);
																var filterB = filtergroup.createfilter(examinedType,5,examinedCondition);
																filtergroup.addfilter(1,filterA);
																filtergroup.addfilter(1,filterB);
																grid.jqxGrid('addfilter', examinedDatafield, filtergroup);
																break;
														case 2:	//Subscribe
																var filterA = filtergroup.createfilter(examinedType,4,examinedCondition);
																//var filterB = filtergroup.createfilter(examinedType,3,examinedCondition);
																filtergroup.addfilter(0,filterA);
																//filtergroup.addfilter(1,filterB);
																grid.jqxGrid('addfilter', examinedDatafield, filtergroup);
																break;
												}
										}
										
								}
						}
						mygis.Admin.MapManager.clearSelection();
						grid.jqxGrid('applyfilters');
				}			
		},
		
		/**
		 * Sorts the files displayed according to the control ID.
		 * Element classes:
		 *  -No class: no sorting
		 *  -'desc'	sorted desc
		 *  -'asc' sorted asc
		 * The function cycles through the states as each button is pressed.
		 * @method sortBy
		 * @param {String} controlID The ID of the activating element.
		 */
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
					case "mapManager_sortName":
						columnName="mapName";
						break;
					case "mapManager_sortLayerCount":
						columnName="mapLayerCount";
						break;
					case "mapManager_sortCreateDate":
						columnName = "mapCreateDate";
						break;
					case "mapManager_sortUpdateDate":
						columnName = "mapUpdateDate";
						break;
					case "mapManager_sortOwnershipType":
						columnName = "mapOwnershipDesc"
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
						if (!document.getElementById(controlID).ex_HasClassName(newSortClass)){
								document.getElementById(controlID).ex_AddClassName(newSortClass);
						}
					}else{
						document.getElementById(controlID).ex_RemoveClassName(sortClass);
					}
				}
		},
		
		/**
		 * Initializes the MapManager dialog
		 * @method showMapManagerMaps
		 * @param {Boolean} secondRun
		 * @param {String} filterList #-separated list of map ids to filter out
		 */
		showMapManagerMaps: function(secondRun,filterList){
			if (!secondRun){
				mygis.Admin.MapManager.bindManagerHandlers();
				$("#mapManager").dialog({
					autoOpen: false,
					modal: true,
					resizable: false,
					width: 780,
					height: 510, 
					title: strings.MapManager.loadWindowTitle,
					closeOnEscape: false
				});
				var titleBar = $("#ui-dialog-title-mapManager").parent();
				titleBar.css({
					"background":"url('"+config.folderPath+"Images/pictures_folder.png') #F6A828 no-repeat 12px 2px",
					"background-size":"auto 25px"
				});
			}
			$("#mapManager").dialog('open');
			
			
			var fileContainer = $("#mapManagerList");
			if (secondRun){
				fileContainer.jqxGrid('clearselection');
				fileContainer.jqxGrid('clear');
			}
			
			if (!secondRun){
				mygis.Admin.MapManager.createPotentialMapGrid(filterList);
				fileContainer.bind('rowselect',mygis.Admin.MapManager.mapSelected);
				fileContainer.bind('rowunselect',mygis.Admin.MapManager.mapUnselected);
				
			}else{
				mygis.Admin.MapManager.refreshMapList();
				
			}
			if (mygis.Admin.UI.dialogConfig.callbackfn==null){
				$("#mapManagerDialogButtons").hide();
			}else{
				$("#mapManagerDialogButtons").show();
			}
		},
		
		/**
		 * Refreshes the map list from server
		 * @method refreshMapList
		 */
		refreshMapList: function(){
				var fileContainer = $("#mapManagerList");
				fileContainer.jqxGrid('clearselection');
				fileContainer.jqxGrid('updatebounddata');
		},
		
		/**
			This function is called whenever a map is selected in the grid.
			@method mapSelected
			@param {Object} event The event parameters
		**/
		mapSelected: function(event){
				var elem = $("#mapManager_toggleSelection");
				var grid = $("#mapManagerList");
				var selection = grid.jqxGrid('getselectedrowindexes');
				if (selection.length==grid.jqxGrid('source').records.length){
						elem.html(strings.MapManager.mapUncheckAllTitle);
				}else{
						elem.html(strings.MapManager.mapCheckAllTitle);
				}
		},
		
		/**
			This function is called whenever a map is unselected in the grid.
			It checks the selected rows count, to manipulate some controls
			@method mapUnselected
			@param {Object} event The event parameters
		**/
		mapUnselected: function(event){
				var elem = $("#mapManager_toggleSelection");
				var grid = $("#mapManagerList");
				var selection = grid.jqxGrid('getselectedrowindexes');
				if (selection.length==grid.jqxGrid('source').records.length){
						elem.html(strings.MapManager.mapUncheckAllTitle);
				}else{
						elem.html(strings.MapManager.mapCheckAllTitle);
				}
		},
		
		/**
		 * Handles the clicking of the checkbox in each row at the Map Manager
		 * @method singleMapCheck
		 * @param {Element} elem The checkbox clicked
		 */
		singleMapCheck :function(elem){
				var grid = $("#mapManagerList");
				if (elem.args.value) {
						grid.jqxGrid('selectrow', elem.args.rowindex);
				}
				else {
						grid.jqxGrid('unselectrow', elem.args.rowindex);
				}
		},
		
		/**
		 * Handles the toggle all button in the Map Manager
		 * @method allMapToggle
		 * @param {Element} elem The firing element
		 */
		allMapToggle: function(elem){
				var grid = $("#mapManagerList");
				var records = grid.jqxGrid('source').records;
				var selection = grid.jqxGrid('getselectedrowindexes');
				if (selection.length==records.length){
						grid.jqxGrid('clearselection');
						for (var i=0;i<records.length;i++){
								records[i].mapSelected=false;
						}
						grid.jqxGrid('refreshdata');
						$(elem).html(strings.MapManager.mapCheckAllTitle);
				}else{
						grid.jqxGrid('clearselection');
						for (var i=0;i<records.length;i++){
								records[i].mapSelected=true;
								grid.jqxGrid('selectrow',i);
						}
						grid.jqxGrid('refreshdata');
						$(elem).html(strings.MapManager.mapUncheckAllTitle);
				}
				
		},
		
		/**
		 * Clears the selected rows
		 * @method clearSelection
		 */
		clearSelection: function(){
				var grid = $("#mapManagerList");
				var selection = grid.jqxGrid('getselectedrowindexes');
				for (var i=0;i<selection.length;i++){
						grid.jqxGrid('getrowdata',selection[i]).mapSelected=false;
				}
				grid.jqxGrid('clearselection');
				grid.jqxGrid('refreshdata');
		},
		
		/**
		 *
		 * @method toggleFilterFocus
		 * @param {Boolean} on 
		 */
		 toggleFilterFocus: function(on){
				var parentElem = document.getElementById("mapManager_Search");
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
		  * Checks if filter input box is empty or not and sets the according css class
		  * @method toggleFilterDecoration
		  */
		 toggleFilterDecoration: function(){
				var textFilter = $("#mapManager_SearchInput").val();
				var elem = $("#mapManager_Search")[0];
				if (textFilter){
						if (!elem.ex_HasClassName("populated")){
								elem.ex_AddClassName("populated");
						}
				}else{
						if (!elem.ex_HasClassName("populated")){
								elem.ex_RemoveClassName("populated");
						}
						
				}
		 }
	},
	
	/**
		Functions and classes for layer management
		
		@class mygis.Admin.LayerManager
		@static
	**/
	LayerManager: {
	
	},
	
	/**
		Functions and classes for user/groups management
		
		@class mygis.Admin.UserManager
		@static
	**/
	UserManager: {
		
		/**
		 * Functions for the users in the user manager
		 * @class mygis.Admin.UserManager.Users
		 * @static
		 */
		Users: {
			
			createUserSource: function(){
				var url = mygis.User.Hooks.getAppUsersURL;
				var source = mygis.User.Hooks.getUserGridColumnSource(url);
				var retvalue = new $.jqx.dataAdapter(source);
				return retvalue;
			},
			
			
			userSelected: function(){
				mygis.Admin.UserManager.Users.checkButtonState();
				mygis.User.Hooks.UserManager.afterUserSelected();
			},
			
			userUnselected: function(){
				mygis.Admin.UserManager.Users.checkButtonState();
				mygis.User.Hooks.UserManager.afterUserUnselected();
			},
			
			clearSelection: function(){
				var grid = $("#myUsersGrid");
				var records = grid.jqxGrid('source').records;
				grid.jqxGrid('clearselection');
				for (var i=0;i<records.length;i++){
					records[i].isSelected=false;
				}
				grid.jqxGrid('refreshdata');
				mygis.Admin.UserManager.Users.checkButtonState();
			},
			
			checkButtonState: function(){
				var grid = $("#myUsersGrid");
				var selection = grid.jqxGrid('getselectedrowindexes');
				if (selection.length>1){
						if (!document.getElementById("amenu_Users_Manager_edit").ex_HasClassName("disabled")){
								document.getElementById("amenu_Users_Manager_edit").ex_AddClassName("disabled");
						}
						
						document.getElementById("amenu_Users_Manager_delete").ex_RemoveClassName("disabled");
				}else if (selection.length==1){
						document.getElementById("amenu_Users_Manager_edit").ex_RemoveClassName("disabled");
						document.getElementById("amenu_Users_Manager_delete").ex_RemoveClassName("disabled");
				}else{
						if (!document.getElementById("amenu_Users_Manager_edit").ex_HasClassName("disabled")){
								document.getElementById("amenu_Users_Manager_edit").ex_AddClassName("disabled");
						}
						if (!document.getElementById("amenu_Users_Manager_delete").ex_HasClassName("disabled")){
								document.getElementById("amenu_Users_Manager_delete").ex_AddClassName("disabled");
						}
				}
			},
			
			singleCheckClicked: function(elem){
				var grid = $("#myUsersGrid");
				if (elem.args.value) {
					 grid.jqxGrid('selectrow', elem.args.rowindex);
				}
				else {
					 grid.jqxGrid('unselectrow', elem.args.rowindex);
				}
				mygis.User.Hooks.UserManager.afterSingleCheckClicked(elem);
			},
			allCheckClicked: function(elem){
				var grid = $("#myUsersGrid");
				var records = grid.jqxGrid('source').records;
				var selection = grid.jqxGrid('getselectedrowindexes');
				if (elem.checked){
						for (var i=0;i<records.length;i++){
								if (selection.indexOf(i)==-1){
										records[i].isSelected=true;
										grid.jqxGrid('selectrow',i)
								}
						}
						grid.jqxGrid('refreshdata');
				}else{
					mygis.Admin.UserManager.Users.clearSelection();
				}
			},
			
			bindManagerHandlers: function(){
			
			},
			
			userDelete: function(){
				if (mygis.User.Hooks.UserManager.beforeUserDelete()){
					var userCount = $("#myUsersGrid").jqxGrid('getselectedrowindexes').length;
					var msg = mygis.Utilities.format(strings.UserManager.deleteConfirmation,userCount);
					showConfirmationDialog(msg,function(){
						var customUrl = mygis.User.Hooks.UserManager.getUserDeleteURL();
						var data=[];
						var selection = $("#myUsersGrid").jqxGrid('getselectedrowindexes');
						$.each(selection,function(i,index){
							var rowdata = $("#myUsersGrid").jqxGrid('getrowdata',index);
							data.push(rowdata.userID);
						});
						var obj = { users: data};
						var postObject = new Object();
						postObject["qContents"]=JSON.stringify(obj);
						mygis.Utilities.blockUI();
						$.ajax({
							type: "POST",
							url: customUrl,
							data: postObject,
							success: function(data){
								mygis.Utilities.unblockUI();
								mygis.Admin.UserManager.Users.clearSelection();
								try{
									var realResults = eval('('+data+')');
									if (realResults.iotype=="success"){
										displaySuccess(strings.UserManager.userDeletedFeedback);
									}else{
										displayError(strings.UserManager.usersNotDeleted+realResults.iomsg);
									}
								}
								catch(err){
									displayError(err.message);
								}
								$("#myUsersGrid").jqxGrid('updatebounddata');
							}
						});
					},mygis.Admin.UserManager.Users.clearSelection);
				}
				
				mygis.User.Hooks.UserManager.afterUserDelete();
			},
			
			/**
				Used to create the user grid in the User Manager
				@method createUserGrid
			**/
			createUserGrid: function(){
				mygis.Utilities.blockUI();
				var container = $("#myUsersGrid");
				var columnrenderer = function(value){
					//see later if it needs customization
				};
				var cellrenderer = function(row,datafield,value){
					//see later if it needs customization
				};
				var userSource = mygis.Admin.UserManager.Users.createUserSource();
				container.jqxGrid({
					source: userSource,
					width: '100%',
					height: '100%',
					autoheight: false,
					theme: 'pk_mg_jm',
					altrows: true,
					enabletooltips: true,
					columns: mygis.User.Hooks.getUserGridColumns(),
					enableanimations: false,
					showheader: true,
					columnsmenu: false,
					sortable: true,
					editable: true,
					groupable: false,
					selectionmode: 'none'
				});
				container.bind('rowselect',mygis.Admin.UserManager.Users.userSelected);
				container.bind('rowunselect',mygis.Admin.UserManager.Users.userUnselected);
				container.bind('cellendedit',mygis.Admin.UserManager.Users.singleCheckClicked);
				mygis.Utilities.unblockUI();
			}
		},
		
		/**
		 * Functions for the groups in the user manager
		 * @class mygis.Admin.UserManager.Groups
		 * @static
		 */
		Groups: {
		
		}
	},
	
	/**
		Functions and classes for log management
		
		@class mygis.Admin.LogManager
		@static
	**/
	LogManager: {
	
	},

	/**
		UI-related functions
		@class mygis.Admin.UI
		@static
	**/
	UI:{
		
		/**
			This holds internal variables per session
			@property internalConfig
			@type {Object}
		**/
		internalConfig: {
				lastMenuActive: -1
		},
		
		showManual: function(){
			var show=false;
			var src="";
			switch(currentAppName){
				case "psyhat":
					show=true;
					src="/psyhatManualAdmin.pdf";
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
						"width":"99%",
						"height": "100%"
					});
					superCont.append(cont);
					superCont.dialog({
						modal: true,
						autoOpen: false,
						width: 920,
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
		
		/**
			Activates(displays) the content tab with the given id and hides the rest.
			
			@method activateTab
			@param {String} tabID 
		**/
		activateTab: function(tabID){
			var tabs = $("#contentTabs").find(".contentTab");
			$.each(tabs,function(i,v){
				var myid = $(v).attr("id");
				if (myid==tabID){
					$(v).attr("class","contentTab active");
				}else{
					$(v).attr("class","contentTab");
				}
			});
		},
		
		/**
			Handles the clicking of a menu item
			
			@method menuClick
			@param {Object} sender The menu object
			@param {String} manualID Used if called manually.
		**/
		menuClick: function(sender,manualID){
			var eventArgs = manualID?document.getElementById(manualID):sender.args;
			var callerID = eventArgs.id;
			var menuLevel=-1;
			if (manualID){sender = $("#menuTabs");}
			if (callerID){
				var idparts =callerID.split("_");
				menuLevel = idparts.length-1;
				var parent;
				var title;
				if (menuLevel>1){
					if (manualID){
						parent = $(sender).find(mygis.Utilities.format("#{0}_{1}",idparts[0],idparts[1]));
					}else{
						sender.currentTarget=this;
						parent = $(sender.currentTarget).find(mygis.Utilities.format("#{0}_{1}",idparts[0],idparts[1]));
					}
					
					title = parent.find("a").html();
				}
				if (title && callerID!="amenu_Files_Manager"){	//Media Manager: special case (popup)
					var mytitle = $(eventArgs).find("a span").html();
					$("#contentActionsTitleElem").html(mygis.Utilities.format("{0}: {1}",title,mytitle));
				}
			}
			if (menuLevel>1){
				var idparts =callerID.split("_");
				switch (idparts[1]){
						case "Apps":
								mygis.Admin.UI.internalConfig.lastMenuActive=0;
								break;
						case "Maps":
								mygis.Admin.UI.internalConfig.lastMenuActive=1;
								break;
						case "Layers":
								mygis.Admin.UI.internalConfig.lastMenuActive=2;
								break;
						case "Users":
								mygis.Admin.UI.internalConfig.lastMenuActive=3;
								break;
						case "Data":
								mygis.Admin.UI.internalConfig.lastMenuActive=4;
								break;
						case "Files":
								mygis.Admin.UI.internalConfig.lastMenuActive=5;
								break;
						case "Logs":
								mygis.Admin.UI.internalConfig.lastMenuActive=6;
								break;
						case "Help":
								mygis.Admin.UI.internalConfig.lastMenuActive=7;
								break;
						
				}
				mygis.Admin.UI.resetTabs();
				switch (callerID){
						case "amenu_Apps_Manager":
							mygis.Admin.UI.activateTab("appManagerTab");
							mygis.Admin.UI.createGenericActions(callerID);
							$("#contentActionsTitle").attr("class","appManager");
							mygis.Admin.AppManager.Apps.createAppGrid();
							
							break;
						case "amenu_Apps_Config":
							mygis.Admin.UI.activateTab("editAppTab");
							mygis.Admin.UI.createGenericActions(callerID);
							$("#contentActionsTitle").attr("class","appConfig");
							if(manualID){
									var grid = $("#myAppGrid");
									var selectedIndex = grid.jqxGrid("getselectedrowindex");
									var details = grid.jqxGrid("getrowdata", selectedIndex);
									var appID = details.appID;
									$("#contentActionsTitleElem").html(mygis.Utilities.format("{0}: {1} '{2}'",title,strings.AppManager.appSetings_Label,details.appName));
									mygis.Admin.AppManager.getAppDetails(appID);
							}else{
									mygis.Admin.AppManager.getAppDetails();		
							}
							router("amenu_Apps_Config_Tab",0);
							break;
						case "amenu_Files_Manager":
							showMediaManager(null,true);	//true shows the admin interface
							break;
						case "amenu_Maps_Manager":
							mygis.Admin.UI.activateTab("mapManagerTab");
							mygis.Admin.UI.createGenericActions(callerID);
							$("#contentActionsTitle").attr("class","mapManager");
							mygis.Admin.MapManager.Maps.createMapGrid();
							break;
					
						case "amenu_Maps_Config":
							mygis.Admin.UI.activateTab("editMapTab");
							mygis.Admin.UI.createGenericActions(callerID);
							if(manualID){
									var grid = $("#myMapsGrid");
									var selectedIndex = grid.jqxGrid("getselectedrowindex");
									var details = grid.jqxGrid("getrowdata", selectedIndex);
									var mapID = details.id;
									$("#contentActionsTitleElem").html(mygis.Utilities.format("{0}: {1} '{2}'",title,strings.MapManager.mapSettingsLabel,details.mapName));
									mygis.Admin.MapManager.getMapDetails(mapID);
							}else{
									mygis.Admin.MapManager.getMapDetails();		
							}
							router("amenu_Maps_Config_Tab",0);
							
							break;
						case "amenu_Help_Manual":
							router("amenu_Help_Manual");
							break;
						case "amenu_Users_Manager":
							mygis.Admin.UI.activateTab("userManagerTab");
							mygis.Admin.UI.createGenericActions(callerID);
							$("#contentActionsTitle").attr("class","userManager");
							mygis.Admin.UserManager.Users.createUserGrid();
							break;
						default:
							mygis.Admin.UI.activateTab("");
							$("#contentActionsTitle").attr("class","");
							$("#contentToolbar").empty();
							
							displayNotify(msg_errFeatureNotImplemented);
							break;
				}
			}
		},
		
		/**
			Creates the generic action buttons for each menu item
			@method createGenericActions
			@param {String} menuItem The menuItem to create actions for
		**/
		createGenericActions: function(menuItem){
				var actionCount=0;
				var actionIDs=[];
				var actionTexts = [];
				var actionClasses = [];
				var actionHandlers = [];
				var disabled=[];
				var replacement=$("<div />");
				switch(menuItem){
						case "amenu_Apps_Manager":
								actionCount = 4;
								actionIDs = [
									mygis.Utilities.format("{0}_{1}",menuItem,"new"),
									mygis.Utilities.format("{0}_{1}",menuItem,"edit"),
									mygis.Utilities.format("{0}_{1}",menuItem,"style"),
									mygis.Utilities.format("{0}_{1}",menuItem,"delete")
								];
								actionTexts = [
															 strings.AppManager.amenu_Apps_Manager_ActionNew,
															 strings.AppManager.amenu_Apps_Manager_ActionEdit,
															 strings.AppManager.amenu_Apps_Manager_ActionStyle,
															 strings.AppManager.amenu_Apps_Manager_ActionDelete
								];
								actionClasses = ["imgNew","imgSettings","imgStyle","imgDelete"];
								actionHandlers = [
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"new"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"edit"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"style"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"delete")
								];
								disabled = [false,true,true,true];
								break;
						case "amenu_Apps_Config":
								actionCount = 2;
								actionIDs = [
									mygis.Utilities.format("{0}_{1}",menuItem,"save"),
									mygis.Utilities.format("{0}_{1}",menuItem,"cancel")
								];
								actionTexts = [
															 strings.AppManager.amenu_Apps_Config_ActionSave,
															 strings.AppManager.amenu_Apps_Config_ActionCancel
								];
								actionClasses = ["imgSave","imgReset"];
								actionHandlers = [
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"save"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"cancel")
								];
								disabled = [true,false];
								mygis.Admin.UI.setTabs($("#editAppForm").find(".sectionHeader").clone());
								$("#editAppName").bind("focus",mygis.Admin.AppManager.Apps.inputStore);
								$("#editAppAlias").bind("focus",mygis.Admin.AppManager.Apps.inputStore);
								$("#editAppWelcomeText").bind("focus",mygis.Admin.AppManager.inputStore);
								$("#editAppName").bind("propertychange keyup input paste",mygis.Admin.AppManager.Apps.inputChanged);
								$("#editAppAlias").bind("propertychange keyup input paste",mygis.Admin.AppManager.Apps.inputChanged);
								$("#editAppWelcomeText").bind("propertychange keyup input paste",mygis.Admin.AppManager.Apps.inputChanged);
								$("#chooseHost").bind("blur",mygis.Admin.AppManager.checkAliasValidity);
								$("#choosePort").bind("propertychange keyup input paste",mygis.Admin.AppManager.checkPortValidity);
								break;
						case "amenu_Maps_Manager":
								actionCount = 3;
								actionIDs = [
									mygis.Utilities.format("{0}_{1}",menuItem,"new"),
									mygis.Utilities.format("{0}_{1}",menuItem,"edit"),
									mygis.Utilities.format("{0}_{1}",menuItem,"delete")
								];
								actionTexts = [
															 strings.AppManager.amenu_Maps_Manager_ActionNew,
															 strings.AppManager.amenu_Maps_Manager_ActionEdit,
															 strings.AppManager.amenu_Maps_Manager_ActionDelete
								];
								actionClasses = ["imgNew","imgSettings","imgDelete"];
								actionHandlers = [
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"new"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"edit"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"delete")
								];
								disabled = [false,true,true];
								break;
						case "amenu_Users_Manager":
								actionCount = 3;
								actionIDs = [
									mygis.Utilities.format("{0}_{1}",menuItem,"new"),
									mygis.Utilities.format("{0}_{1}",menuItem,"edit"),
									mygis.Utilities.format("{0}_{1}",menuItem,"delete")
								];
								actionTexts = [
									strings.UserManager.amenu_Users_Manager_ActionNew,
									strings.UserManager.amenu_Users_Manager_ActionEdit,
									strings.UserManager.amenu_Users_Manager_ActionDelete
								];
								actionClasses = ["imgNew","imgSettings","imgDelete"];
								actionHandlers = [
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"new"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"edit"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"delete")
								];
								disabled = [false,true,true];
								break;
						case "amenu_Maps_Config":
								actionCount = 2;
								actionIDs = [
									mygis.Utilities.format("{0}_{1}",menuItem,"save"),
									mygis.Utilities.format("{0}_{1}",menuItem,"cancel")
								];
								actionTexts = [
															 strings.AppManager.amenu_Apps_Config_ActionSave,
															 strings.AppManager.amenu_Apps_Config_ActionCancel
								];
								actionClasses = ["imgSave","imgReset"];
								actionHandlers = [
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"save"),
									mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"cancel")
								];
								disabled = [true,false];
								mygis.Admin.UI.setTabs($("#editMapForm").find(".sectionHeader").clone());
								$("#editMapName").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapDescription").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapExtent").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapCenter").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapZoom").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapDeveloper").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapOwner").bind("propertychange keyup input paste",mygis.Admin.MapManager.Maps.inputChanged);
								$("#editMapDefaultBG").bind("change",mygis.Admin.MapManager.Maps.inputChanged);
								break;
					
				}
				for (var i=0;i<actionCount;i++){
					replacement.append(mygis.Admin.UI.btnGenerator(actionIDs[i],actionClasses[i],actionTexts[i],actionHandlers[i],disabled[i]));
				}
				if (actionCount>0){
					$("#contentToolbar").html(replacement.html());
				}
				mygis.User.Hooks.AdminTabActions(menuItem,replacement.html());
		},
		
		/**
			Generates a button for the "generic actions"
			
			@method btnGenerator
			@param {String} id The generated id on the element
			@param {String} imageClass The additional class the element should have (in order to display an image)
			@param {String} text The text that will be displayed for the button
			@param {String} action A function that should be attached at the "onclick" event
			@param {Boolean} disabled If the button starts disabled.
			@return {Element} The generated element.
		**/
		btnGenerator: function(id,imageClass,text, action,disabled){
			var retvalue = $("<a />");
			retvalue.attr("href","#");
			retvalue.attr("id",id);
			retvalue.attr("title",text);
			if (disabled){
				retvalue.attr("class","adminGenericAction disabled");
			}else{
				retvalue.attr("class","adminGenericAction");
			}
			if (action){
				retvalue.attr("onclick",action);
			}
			var imgElement = $("<span />");
			imgElement.attr("class",mygis.Utilities.format("adminActionImg {0}",imageClass));
			
			retvalue.append(imgElement);
			retvalue.append(text);
			return retvalue;
		},
		
		/**
			Handles the off-page loading of the administration interface
			@method loadAdministration
		**/
		loadAdministration: function(){
			if ($("#page_administration").children().length==0){
				mygis.Utilities.blockUI();
				loadFragment("page_administration",mygis.Admin.UI.initialize);
			}else{
				mygis.Admin.UI.initialize();
			}
		},
		
		/**
			Initializes the interface (menus,tabs,grids, handlers etc)
			@method initialize
		**/
		initialize: function(){
			mygis.Utilities.unblockUI();
			internalConfig.isAdminInterfaceLoaded=true;
			$("#menuTabs").jqxMenu({ 
				width: '635', 
				height: '30', 
				mode: 'horizontal', 
				showTopLevelArrows: true, 
				theme: 'classic' 
			});
			$("#menuTabs").bind('itemclick',function(event){
													MakeTimeout(mygis.Admin.UI.menuClick,event,800,this);
													});
													//mygis.Admin.UI.menuClick);
			
			//$("#editAppForm").bind("expandingItem",mygis.Admin.AppManager.expandDetails)
			mygis.Admin.UI.switchToAdmin();
			mygis.Admin.UI.menuClick(null,"amenu_Apps_Manager");	//TODO: first item
		},
		
		/**
			Hides the application interface and shows the admin.
			@method switchToAdmin
		**/
		switchToAdmin: function(){
			if (internalConfig.isAdminInterfaceLoaded){
				$("#page_effect").hide();
				$("#page_userProfile").hide();
				$("#page_administration").show();
				var activeTab = $("#contentLinkTabsRound").find(".sectionHeader.active");
				if (activeTab){
						switch (mygis.Admin.UI.internalConfig.lastMenuActive){
								case 0:
										if (activeTab.index()>=0){
												mygis.Admin.AppManager.createGrid(activeTab.index());
										}
										break;
								case 1:
										if (activeTab.index()>=0){
												mygis.Admin.MapManager.createGrid(activeTab.index());
										}
						}
						
						
				}
			}else{
				mygis.Admin.UI.loadAdministration();
			}
		},
		
		
		/**
			Forces a redraw of the page logos, as well as the logos in the "edit app settings" dialog
			@method refreshPageLogos
		**/
		refreshPageLogos: function(){
			var images = $(".domainLogoWrapper2").find("img");
			$.each(images,function(i,v){
				var prevSrc = v.src;
				if (prevSrc){
						if (prevSrc.indexOf("&ut=")>-1){
								prevSrc= prevSrc.substring(0,prevSrc.indexOf("&ut="));
						}
						v.src=prevSrc + "&ut="+new Date().getTime();
				}
			});
			images = $("#editAppForm .editAppRow").find("img");
			$.each(images,function(i,v){
				var prevSrc = v.src;
				if (prevSrc){
					prevSrc = prevSrc.substring(0,prevSrc.indexOf("&qSize=")+10);
					v.src=prevSrc + "&ut="+new Date().getTime();
				}
			});
		},
		
		/**
		 * Resets the tabs under each menu to blank status
		 * @method resetTabs
		 */
		resetTabs: function(){
			$("#contentLinkTabsRound").empty();
			$("#contentLinkTabs").css("display","none");
			$("#contentSpecificToolbar").empty();
		},
		
		/**
		 * Sets the tabs under each menu to the specific content
		 * @method setTabs
		 * @param {Mixed} htmlElement any valid input for jQuery's 'append' method
		 */
		setTabs: function(htmlElement){
			$("#contentLinkTabsRound").empty();
			$("#contentLinkTabsRound").append(htmlElement);
			$("#contentLinkTabs").css("display","table-row");
		},
		
		/**
		 * Handles the clicking of the "OK" button in Admin popups
		 * @method acceptWindow
		 */
		acceptWindow: function(){
				var myconfig = mygis.Admin.UI.dialogConfig;
				if (myconfig.checkfn!=null){
						if (myconfig.checkfn()){
								$(myconfig.windowTitle).dialog('close');
								myconfig.callbackfn.call(myconfig.object,"ok");
								mygis.Admin.UI.resetDialog();
						}
				}
		},
		
		/**
		 * Handles the clicking of the "CANCEL" button in Admin popups
		 * @method closeWindow
		 */
		closeWindow: function(){
				var myconfig = mygis.Admin.UI.dialogConfig;
				if (myconfig.callbackfn!=null){
						$(myconfig.windowTitle).dialog('close');
						myconfig.callbackfn.call(null,null);
						mygis.Admin.UI.resetDialog();
				}
				$(myconfig.windowTitle).dialog('close');
		},
		
		/**
		 * Resets the dialog config object
		 * @method resetDialog
		 */
		resetDialog: function(){
				var myconfig = mygis.Admin.UI.dialogConfig;
				myconfig.checkfn=null;
				myconfig.callbackfn=null;
				myconfig.objectCount=-1;
				myconfig.object=null;
				myconfig.windowTitle=null;
		},
		
		/**
		 * Used to track popup dialogs' config object
		 * @property dialogConfig
		 * @type {Object}
		 */
		dialogConfig: {
				/** 
				 * @property checkfn
				 * @type {Function}
				 */
				checkfn: null,
				
				/** 
				 * @property callbackfn
				 * @type {Function}
				 */
				callbackfn: null,
				
				/** 
				 * @property objectCount
				 * @type {Integer}
				 */
				objectCount: -1,
				
				/** 
				 * @property object
				 * @type {Object}
				 */
				object: null,
				
				/**
				 * @property windowTitle
				 * @type {String}
				 */
				windowTitle: null
		}
	},
	
	/**
	 * Contains utility functions for administration
	 * @class mygis.Admin.Utilities
	 * @static
	 */
	Utilities: {
		/**
		 * Gets the current application's id
		 *@method getAppID
		 *@returns {Integer} The applications id
		 */
		getAppID: function(){
				var records = $("#myAppGrid").jqxGrid('source').records;
				var found=false;
				var i=0;
				var retvalue = -1;
				while (!found && i<records.length){
						if (records[i].appPrefix==currentAppName){
								found=true;
								retvalue = records[i].appID;
						}
						i++;
				}
				return retvalue;
		},
		
		/**
		 * Outputs an rgba css string
		 * @method getRGBA
		 * @param {String} hexColor The hexadecimal color code
		 * @param {Integer} opacity The percentage based opacity. EG 45 means 0.45 opacity
		 */
		getRGBA: function(hexColor,opacity){
				var rgbColor = mygis.Utilities.hexToRGB(hexColor);
				var myopacity = parseInt(opacity);
				var rgbaString = "rgba("
							+rgbColor[0]+","
							+rgbColor[1]+","
							+rgbColor[2]+","
							+(myopacity/100)+")";
				return rgbaString;
		}
	}
	
};
