var layout;

var mypageSplitter;
var midzone;
var rightzone;
var layoutControl;
var maplistControl;
var wizard;
var stepWizard;
var currentWizard;

var layerOpacityText;
var markerStyleList;
var markerSizeText;
var pointBorderText;
var pointOpacityText;
var lineColorText;
var lineOpacityText;
var lineWeightText;
var polygonStrokeOpacityText;
var polygonFillOpacityText;
var polygonStrokeWeightText;


var rsideSplitter;
var wrapSplitter;
var lsideExpanded;

var reg_firstname;
var reg_lastname;
var reg_displayname;
var reg_username;
var reg_password;
var reg_email;

var login_username;
var login_password;

var slideMenuToggling = false;
var slideMenuVisible = false;
var impendingSlideClose;

var tabsInitialized=false;
var infoWindowInitialized=false;
var gridInitialized=false;
var mapsBound = false;

var currentMapID;
var currentMapMaxExtent;
var currentAppName;
var mapSource;
var layerSource;
var layerRemovedSource=[];
var layerStyles={};
var layerToReset,layerCurrentEditing;
var layerTreeSource;
var layergridSource;
var layerImages;
var layersLoaded;
var layersToLoad;
var querySource;
var QSSource;

var layerTimeWindow;
var infoDetachStruct;
var resultGridButtons;

var showInfoOnEdit=true;
var finishApplicationLoad = false;

var customStyleApplied = false;
var unsavedChanges=false;
var featureEditMode=0;
var customFiltered = false;

var memory = {
	LayerControl: {
		selectableBeforeEdit: []
	}
};

function setRegName(textbox) {
    reg_firstname = textbox;
}

function setRegLastName(textbox) {
    reg_lastname = textbox;
}

function setRegDisplayName(textbox) {
    reg_displayname = textbox;
}

function setRegUserName(textbox) {
    reg_username = textbox;
}

function setRegPassword(textbox) {
    reg_password = textbox;
}

function setRegEmail(textbox) {
    reg_email = textbox;
    document.getElementById("extraMsg").innerHTML = msg_reg_step1;
}

function setLoginUsername(textbox) {
    login_username = textbox;
}

function setLoginPassword(textbox) {
    login_password = textbox;
}

function setMarkerStyleList(listBox){
	var listItem, imageurl, filename,finalurl;
	markerStyleList = listBox;
	setMarkerStyleTree();
}

function setpointBorderText(textBox){
	pointBorderText=textBox;
}

function setpointOpacityText(textBox){
	pointOpacityText=textBox;
}

function setlayerOpacityText(textBox){
	layerOpacityText = textBox;
}

function setMarkerSizeText(textBox){
	markerSizeText = textBox;
}

function setLineOpacityText(textBox){
	lineOpacityText = textBox;
}

function setLineWeightText(textBox){
	lineWeightText = textBox;
}

function setPolyStrokeOpacityText(textBox){
	polygonStrokeOpacityText=textBox;
}

function setPolyFillOpacityText(textBox){
	polygonFillOpacityText = textBox;
}

function setPolyStrokeWeightText(textBox){
	polygonStrokeWeightText = textBox;
}

function router(cmd,params){
	switch (cmd){
		case 'cmdLogin2':
				show_Login();
				break;
		case 'cmdRegister2':
				show_Registration();
				break;
		case 'cmdAdministration':
				show_Administration();
				break;
		case 'mapAction_Maps':
				showMapDialog();
				break;
		case 'mapAction_buildQuery':
				showQueryDialog();
				break;
		case 'mapAction_QuerySettings':
				toggleQuerySettings();
			break;
		case 'mapAction_Export':
				showMapExport();
				break;
		case 'mapAction_Save':
				mygis.Drawing.Exporting.saveDigitizing();
				break;
		case 'zoomOutBtn':
				mygis.Map.ZoomOut();
				break;
		case 'zoomBoxBtn':
				mygis.UI.activateControl('zoomBox');
				break;
		case 'dragPanBtn':
				mygis.UI.activateControl('drag');
				break;
		case 'toggleInfoBtn':
				//mygis.UI.toggleInfoBtn();
				mygis.UI.toggleInfoBtn_V2(params);
				break;
		case "toggleOverviewBtn":
				mygis.UI.toggleOverview();
				break;
		case 'infoPoint':
				mygis.UI.toggleSelectBtn('point');
				break;
		case 'infoRect':
				mygis.UI.toggleSelectBtn('rectangle');
				break;
		case 'markerButton':
				mygis.UI.setTool('marker', params);
				break;
		case 'polylineButton':
				mygis.UI.setTool('polyline', params);
				break;
		case 'polygonButton':
				mygis.UI.setTool('polygon', params);
				break;
		case 'rectangleButton':
				mygis.UI.setTool('rectangle', params);
				break;
		case 'showInfoOnEdit':
				mygis.UI.toggleEditableInfo();
				break;
		case 'tlvm':
				mygis.UI.preToggleLayerVisible(null,params);	
				//mygis.UI.toggleLayerVisible(null,params);
				break;
		case 'tlvp':
				mygis.UI.toggleLayerVisibleProperty(params);
				break;
		case 'tle':
				mygis.UI.toggleLayerEditable();
				break;
		case 'tls':
				mygis.UI.toggleLayerSelectable();
				break;
		case 'tlz':
				mygis.UI.zoomToLayer(0);
				break;
		case 'tlr':
				mygis.UI.mg_removeLayer(0);
				break;
		case 'tlmu':
				mygis.UI.moveLayerUp(0);
				break;
		case 'tlmd':
				mygis.UI.moveLayerDown(0);
				break;
		case 'tlcf':
				mygis.UI.toggleLayerConstraint('From');
				break;
		case 'tlct':
				mygis.UI.toggleLayerConstraint('To');
				break;
		case 'tlgv':
				mygis.UI.toggleLayerGroup(params);
				break;
		case 'popScaleFrom':
				mygis.UI.getMgScale(params);
				break;
		case 'popScaleTo':
				mygis.UI.getMgScale(params);
				break;
		case 'pointMode':
				mygis.UI.togglePointMode(params);
				break;
		case 'scaleTo':
				mygis.UI.scaleTo($("#olScale_wrapper").find(":selected").val());
				break;
		case 'lcg':
				mygis.UI.layerGrouping(params);
				break;
		case 'resultSelectOn':
				mygis.UI.dbResultsSelect(params);
				break;
		case 'mapResults':
				mygis.UI.dbResultsOnMap(params);
				break;
		case 'critClick':
				mygis.UI.dbCriteriaClick(params);
				break;
		case 'critMap':
				mygis.UI.updateCriteriaMap(params);
				break;
		case 'critPop':
				mygis.UI.dbFieldPopulate(params);
				break;
		case 'critDescrip':
				mygis.UI.dbCriteriaUpdateDescription();
				break;
		case 'critSelect':
				mygis.UI.dbSelectChanged(params);
				break;
		case 'critGetDisc':
				mygis.UI.dbGetFromDistinct(params);
				break;
		case 'critPopDisc':
				mygis.UI.dbPopulateDistinct(params);
				break;
		case 'critReset':
				mygis.UI.dbCriteriaReset();
				break;
		case 'showQR':
				showQueryResetConfirm();
				break;
		case 'lmap':
			showConfirmationDialog(strings.MapControl.loadMapConfirm,function(){router('dragPanBtn');loadMap(false,params);},function(){return false});
			break;
		case 'codingTLD':
			toggleLayerDetails(params,this);
			break;
		case 'codingTLE':
			mygis.UI.toggleLayerEditable(params);
			break;
		case 'codingTLS':
			mygis.UI.toggleLayerSelectable(params);
			break;
		case 'codingSaveLayer':
			mygis.UI.startSaving(params);
			break;
		case 'styleUpdate':
			mygis.UI.previewLayerStyle();
			break;
		case 'styleApply':
			mygis.UI.applyLocalStyle();
			break;
		case 'styleSave':
			mygis.UI.saveLayerStyle();
			break;
		case 'styleCancel':
			mygis.UI.cancelApplyLocalStyle();
			break;
		case 'editModeBtn':
			mygis.UI.switchEditMode(params);
			break;
		case 'selectCtrl':
			mygis.UI.activateSelectCtrl(params);
			break;
		case 'expandSelect':
			if (params.isMapSelect){
				var data = mygis.Query.breakupMapData(params.results,params.layername,params.fid);
				mygis.Query.popupInfo(data,params.layername);
			}else{
				var data=mygis.Query.breakupQueryData(params.results);
				mygis.Query.popupInfo(data,params.layername);
			}
			break;
		case 'markHoverResult':
			//mygis.Map.markFeatures(params.feature);
			break;
		case 'infopopup_previewImg':
			mygis.Query.infoImgPreview(params);
			break;
		case 'infopopup_previewFile':
			mygis.Query.infoFilePreview(params);
		case 'tlSM':
			mygis.UI.toggleDrawerButton(params);
			break;
		case 'exportMap':
			var mode = params.id.split("_")[1];
			mygis.Drawing.Exporting.exportMapAs(mode);
			break;
		case 'mapDL':
			mygis.UI.showExportMap();
			break;
		case 'tHotSearch':
			mygis.UI.toggleHotSearchItem(params);
			break;
		case 'tFieldEditU':
			mygis.UI.updateObjectField();
			break;
		case 'tFieldEditC':
			mygis.UI.clearObjectField();
			break;
		case 'tFieldEditE':
			mygis.UI.cancelObjectEditing();
			break;
		case 'mm_imgclick':
			mygis.UI.MediaManager.fullImgPreview(params);
			break;
		case "cmdMediaManager":
			showMediaManager();
			break;
		case "attachNew_I":
			mygis.UI.attachFileToRecord(params);
			break;
		case "attachNew_F":
			mygis.UI.attachFileToRecord(params);
			break;
		case "cycleBG":
			mygis.Map.cycleBackground(params);
			break;
		case "switchBG_0":
			//mygis.Map.switchBackground($("#bgSelect").linkselect("val"),0);
			break;
		case "switchBG_1":
			mygis.Map.switchBackground($(params).find("option:selected")[0].value,1);
			break;
		case "mm_toggleSelection":
			mygis.UI.MediaManager.toggleSelection(params);
			break;
		case "cmdAdminPanel":
			mygis.Admin.UI.switchToAdmin();
			break;
		case "cmdUserPanel":
			mygis.User.UI.switchToUserPage();
			break;
		case "cmdSwitchLayout":
			displayNotify(msg_errFeatureNotImplemented);
			break;
		case "backToApp":
			mygis.User.UI.switchToApp();
			break;
		case "adminAppLogo":
			mygis.Admin.AppManager.logoBtnClick(params);
			break;
		case "adminAppLogoRemove":
			mygis.Admin.AppManager.logoRemoveBtnClick(params);
			break;
		case "amenu_Apps_Manager":
			switch(params){
				case "new":
					mygis.Admin.AppManager.Apps.showAddNewApp();
					break;
				case "edit":
					mygis.Admin.UI.menuClick(null,"amenu_Apps_Config");
					break;
			}
			break;
		case "amenu_Maps_Manager":
			switch(params){
				case "new":
					mygis.Admin.MapManager.Maps.showAddNewMap();
					break;
			}
			break;
		case "amenu_Apps_Config":
			switch(params){
					case "save":
							mygis.Admin.AppManager.saveChanges();
							break;
					case "cancel":
							mygis.Admin.AppManager.revertChanges();
							break;
			}
			break;
		case "amenu_Maps_Config":
			switch(params){
					case "save":
							mygis.Admin.MapManager.saveChanges();
							break;
					case "cancel":
							mygis.Admin.MapManager.revertChanges();
							break;
			}
			break;
		case "amenu_Users_Manager":
			switch(params){
				case "delete":
					mygis.Admin.UserManager.Users.userDelete();
					break;
			}
			break;
		case "amenu_Help_Manual":
			mygis.Admin.UI.showManual();
			break;
		case "adminAppClick":
			mygis.Admin.AppManager.Apps.singleCheckClicked(params);
			break;
		case "adminAllClick":
			mygis.Admin.AppManager.Apps.allCheckClicked(params);
			break;
		case "appNameClick":
			mygis.Admin.AppManager.Apps.appClicked(params);
			break;
		case "adminMapClick":
			mygis.Admin.AppManager.Maps.mapCheckClicked(params);
			break;
		case "adminMapAllClick":
			mygis.Admin.AppManager.Maps.mapAllCheck(params);
			break;
		case "adminURlAllClick":
			mygis.Admin.AppManager.URLs.urlAllCheck(params);
			break;
		case "adminStyleAllClick":
			mygis.Admin.AppManager.Styles.allCheckClicked(params);
			break;
		case "adminMacroAllClick":
			mygis.Admin.MapManager.Macros.allCheckClicked(params);
			break;
		case "appAddAlias":
			mygis.Admin.AppManager.URLs.showAddAlias();
			break;
		case "appRemoveAlias":
			mygis.Admin.AppManager.URLs.urlDelete();
			break;
		case "appAddMap":
			mygis.Admin.AppManager.Maps.addAppMap();
			break;
		case "appDefaultMap":
			mygis.Admin.AppManager.Maps.mapMakeDefault();
			break;
		case "appUnpublishMap":
			mygis.Admin.AppManager.Maps.mapUnpublish();
			break;
		case "appDeleteMap":
			mygis.Admin.AppManager.Maps.mapDelete();
			break;
		case "amenu_Apps_Config_Tab":
			var event = {};
			event.item=params;
			mygis.Admin.AppManager.expandDetails(event);
			break;
		case "accountInfo_Config_Tab":
			var event = {};
			event.item=params;
			mygis.User.ProfileInfo.switchToTab(event);
			break;
			break;
		case "amenu_Maps_Config_Tab":
			var event = {};
			event.item=params;
			mygis.Admin.MapManager.expandDetails(event);
			break;
		case "adminOK":
			mygis.Admin.UI.acceptWindow();
			break;
		case "adminCancel":
			mygis.Admin.UI.closeWindow();
			break;
		case "mapManager_filterMe":
			mygis.Admin.MapManager.filterPotentialMaps();
			break;
		case "mapManager_toggleAll":
			mygis.Admin.MapManager.allMapToggle(params);
			break;
		case "adminStylePreview":
			
			var time = $(mygis.Utilities.format("#stylePreviewTimer_{0}",params)).val();
			mygis.Admin.AppManager.Styles.stylePreview(params,time);
			break;
		case "app_addNewStyle":
			mygis.Admin.AppManager.Styles.showEditStyle(true);
			break;
		case "app_editStyle":
			mygis.Admin.AppManager.Styles.showEditStyle(false);
			break;
		case "app_directEditStyle":
			mygis.Admin.AppManager.Styles.directStyleEdit(params);
			break;
		case "app_copyStyle":
			mygis.Admin.AppManager.Styles.saveAsCopy();
			break;
		case "app_copyStyleTo":
			
			break;
		case "app_makeActiveStyle":
			mygis.Admin.AppManager.Styles.makeDefault();
			break;
		case "app_publishStyle":
			mygis.Admin.AppManager.Styles.publishStyles();
			break;
		case "app_unpublishStyle":
			mygis.Admin.AppManager.Styles.unpublishStyles();
			break;
		case "app_deleteStyle":
			mygis.Admin.AppManager.Styles.deleteStyles();
			break;
		case "styleMenu_ConfigTab":
			//doSomethingWith params
			mygis.Admin.AppManager.Styles.switchToTab(params);
			break;
		case "macroMenu_ConfigTab":
			mygis.Admin.MapManager.Macros.switchToTab(params);
			break;
		case "digitizeMenu_ConfigTab":
			mygis.Drawing.Editing.switchToTab(params);
			break;
		case "mapnameClicked":
			mygis.Admin.MapManager.Maps.mapClicked(params);
			break;
		case "admin_Maps_allClick":
			mygis.Admin.MapManager.Maps.allCheckClicked(params);
			break;
		case "map_addNewQS":
			mygis.Admin.MapManager.QuickSearches.showEditQS(true);
			break;
		case "map_editQS":
			mygis.Admin.MapManager.QuickSearches.showEditQS(false);
			break;
		case "map_directEditQS":
			mygis.Admin.MapManager.QuickSearches.directQSEdit(params);
			break;
		case "map_deleteQS":
			mygis.Admin.MapManager.QuickSearches.deleteQS();
			break;
		case "map_getExtent":
			mygis.Admin.MapManager.Maps.getCurrentExtent();
			break;
		case "map_getCenter":
			mygis.Admin.MapManager.Maps.getCurrentCenter();
			break;
		case "map_getZoom":
			mygis.Admin.MapManager.Maps.getCurrentZoom();
			break;
		case "map_customThumb":
			mygis.Admin.MapManager.Maps.replaceMapThumbDialog();
			break;
		case "map_generateThumb":
			mygis.Admin.MapManager.Maps.replaceMapThumbAuto();
			break;
		case "mapQSAllClick":
			mygis.Admin.MapManager.QuickSearches.qsAllCheckClicked(params);
			break;
		case "qsTitleClick":
			mygis.Admin.MapManager.QuickSearches.directQSEdit(params);
			break;
		case "mapLayerAllClick":
			mygis.Admin.MapManager.Layers.layerAllCheckClicked(params);
			break;
		case "mapAddLayer":
			mygis.Admin.MapManager.Layers.addMapLayer();
			break;
		case "mapDeleteLayer":
			mygis.Admin.MapManager.Layers.deleteLayer();
			break;
		case "mapLayermoveUp":
			mygis.Admin.MapManager.Layers.moveUp();
			break;
		case "mapLayermoveDown":
			mygis.Admin.MapManager.Layers.moveDown();
			break;
		case "map_addNewMacro":
			mygis.Admin.MapManager.Macros.showEditMacro(true);
			break;
		case "map_editMacro":
			mygis.Admin.MapManager.Macros.showEditMacro(false);
			break;
		case "map_deleteMacro":
			mygis.Admin.MapManager.Macros.deleteMacros();
			break;
		case "editPopup_addImage":
			mygis.Drawing.Editing.handlerAttachImage();
			break;
		case "editPopup_detachImage":
			mygis.Drawing.Editing.imageDetach();
			break;
		case "editPopup_imageSelectAll":
			mygis.Drawing.Editing.imageGridCheckAll(params);
			break;
		case "editPopup_addFile":
			mygis.Drawing.Editing.handlerAttachFile();
			break;
		case "editPopup_detachFile":
			mygis.Drawing.Editing.fileDetach();
			break;
		case "editPopup_fileSelectAll":
			mygis.Drawing.Editing.fileGridCheckAll(params);
			break;
		case "editDigi_btnImageDownload":
			mygis.Drawing.Editing.imageDownload(params);
			break;
		case "editDigi_btnFileDownload":
			mygis.Drawing.Editing.fileDownload(params);
			break;
		case "editDigi_btnImageZoom":
			mygis.Drawing.Editing.imageZoom(params);
			break;
		case "appManual":
			mygis.UI.Help.shortcutStart();
			//mygis.UI.Help.showManual();
			break;
		case "appManual2":
			mygis.UI.Help.showManual(true);
			break;
		case "shortcutMaps":
			mygis.UI.Help.shortcutMaps();
			break;
		case "shortcutSearches":
			mygis.UI.Help.shortcutSearch();
			break;
		case "buildPopup":
			mygis.Admin.MapManager.Macros.showPopupWizard();
			break;
		case "popupWiz_copyToMacro":
			mygis.Admin.MapManager.Macros.copyPopupOutput();
			break;
		case "popupWiz_testIt":
			mygis.Admin.MapManager.Macros.testPopupOutput();
			break;
		case "wizard_ChangeBG":
			mygis.UI.Help.tutorial('changeBG',params);
			break;
		case "infoPopup_download":
			mygis.UI.MediaManager.downloadFile(params);
			break;
		case "infoPopup_replace":
			mygis.UI.replaceFileInRecord(params[0],params[1],params[2]);
			break;
		case "infoPopup_detach":
			mygis.UI.MediaManager.detachFile(params[0],params[1],params[2]);
			break;
		case "searchDelete":
			mygis.UI.removeSavedQuery();
			break;
		case "styleManager_ConfigTab":
			mygis.Drawing.Styling.styleManager_switchTab(params);
			break;
		case "up_menuAccount_Info":
			switch (params){
				case "save":
					mygis.User.ProfileInfo.updateProfile();
					break;
				case "cancel":
					mygis.User.ProfileInfo.getProfileDetails();
					break;
			}
			
			break;
		case "qstatsBtn":
			mygis.Query.queryStatsWindow();
			break;
		case "withinBtn":
			mygis.Query.queryWithinWindow();
			break;
		case "qstatsExecute":
			mygis.Query.statsCalculate();
			break;
		case "layerSelectionToggle":
			mygis.Map.switchSelectionToggleBtn(params);
			break;
		case "withinSearchGo":
			mygis.Query.queryWithinExecute();
			break;
		case "qstatsBack":
			mygis.Query.statsBackToSelection();
			break;
		case "qstatsPrint":
			mygis.Query.queryStatsPrint();
			break;
		case "mapResultsToggle":
			if ($("#mapFeaturesCont").is(":visible")){
				$("#mapFeaturesCont").hide();
				$("#mapResultsToggleBtn").attr("class","");
			}else{
				$("#mapFeaturesCont").show();
				$("#mapResultsToggleBtn").attr("class","pressed");
				router('mapFeatureSearchOpen');
				mygis.Map.moveEnd();
			}
			break;
		case "mapFeatureSearchToggle":
			if ($("#mapFeatureSearchBar").is(":visible")){
				mygis.Map.hideSearchPanel();
			}else{
				mygis.Map.showSearchPanel();
			}
			break;
		case "mapFeatureSearchClose":
			mygis.Map.hideSearchPanel();
			break;
		case "mapFeatureSearchOpen":
			mygis.Map.showSearchPanel();
			break;
		case "mapFeatureSearchNext":
			mygis.Map.gotoNextFeatureResult();
			break;
		case "mapFeatureSearchPrevious":
			mygis.Map.gotoPreviousFeatureResult();
			break;
		case 'togglePreviousSearch':
			if ($("#pageHelpSearchMap").attr("class")=="active"){
				mygis.UI.Help.shortcutStart();
				$("#btnSearchList").html(strings.MapTools.showSearchesBtn);
			}else{
				mygis.UI.Help.shortcutSearch();
				$("#btnSearchList").html(strings.MapTools.hideSearchesBtn);
			}
			break;
		case 'toggleGoogle':
			if ($(".googleSearchContainer").is(":visible")){
				$(".googleSearchContainer").hide('slide', {direction: 'right'}, 1000);
				mygis.Map.clearFeedback();
			}else{
				$(".googleSearchContainer").show('slide', {direction: 'right'}, 1000);
			}
			break;
		case 'applyLayerChanges':
			mygis.UI.applyLayerChanges();
			break;
		case 'cancelLayerChanges':
			mygis.UI.cancelLayerChanges();
			break;
	}
}


function locateObjectlist(listbox, event) {
    var mouseoverItem,counter;
	mouseoverItem = event.get_item();
    counter = mouseoverItem.get_index();
    mygis.Map.selectObject(counter);
}

function unlocateObjectlist(listbox, event) {
	var mouseoverItem,counter;
    mouseoverItem = event.get_item();
    counter = mouseoverItem.get_index();
    mygis.Map.deselectObject(counter);
}

function show_Registration() {
	var part2 = function(){
		$("#registrationDialog").dialog({
			width: 525,
			modal: true,
			resizable: false, 
			open: mygis.Utilities.unbindGlobalHandlers,
			close: mygis.Utilities.rebindGlobalHandlers,
			title: strings.Registration.infoTitle
		});
	};
	if ($("#registrationDialog").children().length==0){
		loadFragment("registrationDialog",part2)
	}else{
		part2();
	}
	
}

function show_Login() {
	/*
	var div = $("#loginDialog");
	if (div.is(":visible")){
		div.slideUp("slow");
	}else{
		div.slideDown("slow");
	}
	*/
	
	$("#loginDialogCont").dialog({
		width: 440,
		height: 217,
		modal: true,
		resizable: false, 
		title: strings.Login.welcomeTo+$(".domainStaticTextBackground").attr("title")
	});
	
	
}

function show_Forgot(){
	var url = "/default.aspx?returnurl=&ctl=SendPassword&popUp=true";
	$("#forgotCont").load(url,function(){
		$("#forgotCont").dialog({
		width: 440,
		height: 300,
		modal: true,
		resizable: false, 
		title: "Forgot password?"
		});
	});
}

function nextStep_Registration() {
    var max_step = 2;
    var currentStep = parseInt(document.getElementById("currentStep").value);
    if (Page_ClientValidate("step"+currentStep)) {

        if (currentStep < max_step) {
            document.getElementById("reg_back").style.display = "";
            document.getElementById("reg_step" + currentStep).style.display = "none";
            currentStep += 1;
            document.getElementById("reg_step" + currentStep).style.display = "";
            document.getElementById("currentStep").value = currentStep;
            switch (currentStep) {
                case 1:
                    document.getElementById("extraMsg").innerHTML = msg_reg_step1;
                    break;
                case 2:
                    document.getElementById("extraMsg").innerHTML = msg_reg_step2;
                    break;
            }
        } else {
            registerUser();
        }
    }
}

function prevStep_Registration() {
    var currentStep = parseInt(document.getElementById("currentStep").value);
    document.getElementById("reg_results").style.display = "none";
    document.getElementById("reg_forward").style.display = "";
    if (currentStep > 1) {
        document.getElementById("reg_step" + currentStep).style.display = "none";
        currentStep -= 1;
        document.getElementById("reg_step" + currentStep).style.display = "";
        document.getElementById("currentStep").value = currentStep;
        if (currentStep == 1) {
            document.getElementById("reg_back").style.display = "none";
        }
        switch (currentStep) {
            case 1:
                document.getElementById("extraMsg").innerHTML = msg_reg_step1;
                break;
            case 2:
                document.getElementById("extraMsg").innerHTML = msg_reg_step2;
                break;
        }
    }
}

function login(controlID){
    if (Page_ClientValidate("login_dialog")) {
        loginUser(controlID);
    }
}

function show_Administration(){

}

function playVideo(){
    var params = {allowScriptAccess: "always", allowFullScreen: "true"};
    var atts = { id: "myytplayer", color2: "#FFFFFF" };
    swfobject.embedSWF("http://youtube.com/v/tPPcahQb7aQ?version=3&playerapiid=ytapiplayer",
                        "ytapiplayer","500","384","8",null,null,params,atts);
}

function displayShortNotify(message){
	$('#Notification').jnotifyAddMessage({
        text: message,
        permanent: false,
		disappearTime: 1500,
		oneAtTime: true
    });
}

function displayNotify(message, permanent,cb) {
    $('#Notification').jnotifyAddMessage({
        text: message,
        permanent: permanent,
		disappearTime: 5000,
		callbackClose: cb,
		oneAtTime: true
    });
}

function displayError(message,permanent){
	$('#Notification').jnotifyAddMessage({
		text:message,
		type: "error",
		permanent: permanent,
		disappearTime: 10000
	});
}

function displaySuccess(message,permanent){
	$('#Notification').jnotifyAddMessage({
		text:message,
		type: "success",
		permanent: permanent,
		disappearTime: 5000
	});
}

function menuHandler(clicked_id){
    var cut_id = clicked_id.substring(clicked_id.lastIndexOf('_')+1);
    var cut_subid = "lm_"+ cut_id.replace("img","");
    switch (cut_id) {
        case "imgTables":
        case "imgShared":
        case "imgProfile":
        case "imgSupport":
            displayNotify(msg_errFeatureNotImplemented);
            break;
        case "imgMap":
            document.getElementById("middlePane").style.left = "15px";
            document.getElementById("leftPane").style.display='none';
            //google.maps.event.trigger(digimap, 'resize');
            break;
        default:
            document.getElementById("middlePane").style.left = "800px";
            document.getElementById("leftPane").style.display='block';
            initLeftMenu(cut_subid);
            //google.maps.event.trigger(digimap, 'resize');
            break;
    }
	mygis.Map.elementPosition("mapContainer");
}

function leftmenuHandler(clicked_id){
    var list,selected,child,counter,parentMenu,rightDiv,rightChildren,parentMenuItem;
    
    parentMenu = clicked_id.substring(0,clicked_id.indexOf('_'));
    selected = document.getElementById(clicked_id);
    list = selected.parentNode.parentNode;
    document.getElementById("infoTitle").innerHTML = selected.innerHTML;
    for (var i=0;i<$(list).find('li').length;i++){
        child = $($(list).find('li')[i]).find('a').get(0);
        if (child!=selected){
            $(child).removeClass("selected");
        }else{
            $(child).addClass("selected");
            counter = i;
        }
    }
    
	parentMenuItem = clicked_id.substring(clicked_id.indexOf("_")+1);
    switch (parentMenu){
        case "menuStart":
			mygis.UI.stopDigitize();
            rightDiv = document.getElementById("startDialog");
			
            rightChildren = $(rightDiv).find('>div');
			var checkCondition;
			if (counter==0 && parentMenuItem=="Welcome"){
				checkCondition = counter+1;
			}else{
				checkCondition = counter;
			}
            for (var i = 0; i < rightChildren.length; i++) {
                if (i != checkCondition) {
                    $(rightChildren[i]).hide();
                } else {
					
                    $(rightChildren[i]).clone().show().dialog({
						modal: true,
						resizable: false, 
						width: 800,
						title: selected.innerHTML,
						close: function(event, ui){
							$(this).remove();
						}
					});
					
					
					
                    document.getElementById("startDialog").style.display = "";
                    document.getElementById("registrationDialog").style.display = "none";
                    document.getElementById("loginDialog").style.display = "none";
                }
            }
			
			
            break;
            
    }
}

function initLeftMenu(toWhat){
    var left = document.getElementById("wizardPane");
    var right = document.getElementById("wizardOutputPane");
    var listDivs = $(left).find('div');
    var childDiv;
    for (var i=0;i<listDivs.length;i++){
        childDiv = listDivs[i];
        if ($(childDiv).attr("id")!=toWhat){
            $(childDiv).hide();
        }else{
            $(childDiv).show();
        }
    }
    switch(toWhat){
        case 'lm_Welcome':
            document.getElementById("startDialog").style.display="";
            document.getElementById("saveAskDialog").style.display="none";
            document.getElementById("supportDialog").style.display="none";
            break;
        case 'lm_Save':
            document.getElementById("startDialog").style.display="none";
            document.getElementById("saveAskDialog").style.display="";
            document.getElementById("supportDialog").style.display="none";
            break;
        case 'lm_Support':
            document.getElementById("startDialog").style.display="none";
            document.getElementById("saveAskDialog").style.display="none";
            document.getElementById("supportDialog").style.display="";
            break;
    }

}

function ffclose(){
    try{
        netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserWrite');
    }catch(err){}
    window.open('','_self');
    window.close();
}

/**
 * Sets the Title in the map Dock
 * @param descr
 */
function setMapDescription(descr){
	var addDescr = document.createElement("span");
	addDescr.innerHTML = " - "+descr;
    document.getElementById("mapDescription").appendChild(addDescr);
}

function registerUser() {
    var postbackform = document.createElement("FORM");
    postbackform.id = "gisRegistrationForm";
    postbackform.name = postbackform.id;
    postbackform.method = "POST";
    postbackform.action = "";
    postbackform.target = "self";
    var inp_firstname = createDummyPostbackControl("reg_firstname");
    var inp_lastname = createDummyPostbackControl("reg_lastname");
    var inp_displayname = createDummyPostbackControl("reg_displayname");
    var inp_username = createDummyPostbackControl("reg_username");
    var inp_password = createDummyPostbackControl("reg_password");
    var inp_email = createDummyPostbackControl("reg_email");
    var post_action = createDummyPostbackControl("postbackAction");
    postbackform.appendChild(inp_firstname);
    postbackform.appendChild(inp_lastname);
    postbackform.appendChild(inp_displayname);
    postbackform.appendChild(inp_username);
    postbackform.appendChild(inp_password);
    postbackform.appendChild(inp_email);
    post_action.value = "registerUser";
    postbackform.appendChild(post_action);
    $.ajax({
        data: $(postbackform).serialize(),
        success: function(data) {
            switch (data) {
                case "Success":
                default:
                    document.getElementById("reg_results_msg").innerHTML = data;
                    if (data == "Success") {
                        document.getElementById("reg_results_img").className = "successful";
                        document.getElementById("extraMsg").innerHTML = msg_reg_successful;
                    }else{
                        document.getElementById("reg_results_img").className = "error";
                        document.getElementById("extraMsg").innerHTML = msg_reg_error;
                    }
                    var currentStep = parseInt(document.getElementById("currentStep").value);
                    document.getElementById("reg_step"+currentStep).style.display="none";
                    document.getElementById("reg_results").style.display="";
                    document.getElementById("reg_forward").style.display="none";
                    //alert(data);
                    break;
            }
        },
        type: "POST",
		url: config.mgreq+"?qtype=register"
    });
}

function loginUser(controlID) {
    var postbackform = document.createElement("FORM");
    postbackform.id = "gisLoginForm";
    postbackform.name = postbackform.id;
    postbackform.method = "POST";
    postbackform.action = config.mgreq;	//"";
    postbackform.target = "_self";
    postbackform.style.display = "none";
    var inp_username = createDummyPostbackControl("login_username");
    var inp_password = createDummyPostbackControl("login_password");
    var inp_rememberme = createDummyPostbackControl("login_remember");
    var post_action = createDummyPostbackControl("postbackAction");
    postbackform.appendChild(inp_username);
    postbackform.appendChild(inp_password);
    postbackform.appendChild(inp_rememberme);
    post_action.value = "loginUser";
    postbackform.appendChild(post_action);
	$("#loginDialog").css('cursor','wait');
    $.ajax({
        data: $(postbackform).serialize(),
        success: function(data) {
			$("#loginDialog").css('cursor','default');
            switch (data) {
                case "Invalid username/password":
                    alert(data);
                    break;
                default:
					mygis.UI.gatherUnsaved();
                    location.reload();	//__doPostBack("loginDialog", null);
                    break;
            }
        },
        type: "POST",
		url: postbackform.action+"?qtype=login"
    });
    
    
}

function checkKeys(sender, eventArgs) {
    var c = eventArgs.get_keyCode();
    if (sender == login_password) {
        if (c == 13) {
            login();
            eventArgs.set_cancel(true);
        }
    }
    
}

function createDummyPostbackControl(name){
    var retControl = document.createElement("input");
    var retValue;
    retControl.id = name;
    retControl.name = name;
    retControl.type = "hidden";
    switch (name){
        case "reg_firstname":
            retValue = reg_firstname.get_textBoxValue();
            break;
        case "reg_lastname":
            retValue = reg_lastname.get_textBoxValue();
            break;
        case "reg_email":
            retValue = reg_email.get_textBoxValue();
            break;
        case "reg_displayname":
            retValue = reg_displayname.get_textBoxValue();
            break;
        case "reg_username":
            retValue = reg_username.get_textBoxValue();
            break;
        case "reg_password":
            retValue = reg_password.get_textBoxValue();
            break;
        case "login_username":
            retValue = login_username.get_textBoxValue();
            break;
        case "login_password":
            retValue = login_password.get_textBoxValue();
            break;
        case "login_remember":
            retValue = document.getElementById("RememberMe").checked;
            break;
		case "mapID":
			retValue = $("#mapsList").jqxListBox('getSelectedItem').value;
			break;
    }
    retControl.value = retValue;
    return retControl;
}

function showSave() {
	mygis.UI.stopDigitize();
    var ctrl = rsideSplitter;
    var visible = $("#saveAskDialog").is(":visible"); 
    if (!visible) {
		document.getElementById("saveMarkers").innerHTML = countMarkers;
		document.getElementById("savePolygons").innerHTML = countPolygons;
		document.getElementById("savePolylines").innerHTML = countPolylines;
		$("#saveAskDialog").dialog({modal: true,resizable: false, title: tip_btnSave});
    } else {
		$("#saveAskDialog").dialog("close");
    } 
}

function showCosmetic(forceon) {
	mygis.UI.stopDigitize();
    var visible = $("#cosmeticPanel").is(":visible"); 
    if (!visible && forceon) {
        showSingleRightPane("cosmeticPanel");
		$("#rsideSplitter").jqxSplitter('expandAt',1);
		$("#rsideSplitter").jqxSplitter('panels')[1].collapsed=false;	//duh...
		$("#rsideSplitter").jqxSplitter('enable');
    } else {
        $("#cosmeticPanel").hide();
		$("#rsideSplitter").jqxSplitter('collapseAt',1);
		$("#rsideSplitter").jqxSplitter('panels')[1].collapsed=true;	//duh...
		$("#rsideSplitter").jqxSplitter('disable');
    } 
}

function showMapDialog(event){
	//$("#mapsAnalysis").jqxSplitter('_refreshWidgetLayout');
	/*$("#mapsAnalysis").dialog({width: 660, height: 420, modal: true, resizable: false, title: tip_btnMaps});
	var titleBar = $("#ui-dialog-title-mapsAnalysis").parent();
	titleBar.css({
		"background":"url('"+config.folderPath+"Images/map_mini.png') #F6A828 no-repeat 12px 2px",
		"background-size":"auto 25px"
		});
	setTimeout(createMapListTips,100);
	*/
	if (event){
		
		var mapIndex = event.data.mapIndex;
		if (mapIndex!=undefined){
			//$("#bottomTabContainer").jqxTabs('select',internalConfig.mapTabIndex);
			$("#mapsList").jqxListBox('selectIndex',mapIndex);
			
			expandMapProperties();
		}
	}
}

function showQueryDialog(){	
	if ($("#databaseAnalysis").children().length==0){
		loadFragment("databaseAnalysis",showQueryExecute);
	}else{
		showQueryExecute(true);
	}
}

function QuerySettingsVisibility(on){
	if (on){
		$("#searchSettings").show();
		$("#btnSearchSettings").attr("class","active");
	}else{
		$("#searchSettings").hide();
		$("#btnSearchSettings").attr("class","");
	}
}

function toggleQuerySettings(){
	var visible=$("#searchSettings").is(":visible");
	QuerySettingsVisibility(!visible);
}

function showNewLayerDialog(){
	if ($("#newLayerDialog").children().length==0){
		loadFragment("newLayerDialog",showNewLayer);
	}else{
		showNewLayer();
	}
}

function showMediaManager(onlyImages,appAdmin){
	if ($("#userFiles").children().length==0){
		loadFragment("userFiles",function(){showUserFiles(false,onlyImages,appAdmin);});
	}else{
		showUserFiles(true,onlyImages,appAdmin);
	}
}

function showMapManager(filterList){
	var closure = function(filter){
		return function(){
			mygis.Admin.MapManager.showMapManagerMaps(false,filter);
		}
		
	};
	var callme = closure(filterList);
	if ($("#mapManager").children().length==0){
		loadFragment("mapManager",callme);
	}else{
		mygis.Admin.MapManager.showMapManagerMaps(true,filterList);
	}
}

function showLayerManager(filterList){
	var closure = function(filter){
		return function(){
			mygis.Admin.MapManager.Layers.showAddLayer(false,filter);
		}
	};
	var callme = closure(filterList);
	if ($("#layerManager").children().length==0){
		loadFragment("layerManager",callme);
	}else{
		mygis.Admin.MapManager.Layers.showAddLayer(true,filterList);
	}
}

function showNewLayer(){
	$("#newLayerDialog").dialog({modal: true,resizable: false,width: 900,height: 510, title: strings.LayerControl.newLayerWindowTitle});
	var titleBar = $("#ui-dialog-title-newLayerDialog").parent();
	titleBar.css({
		"background":"url('"+config.folderPath+"Images/layerlist/Color_layers_original.png') #F6A828 no-repeat 12px 2px",
		"background-size":"auto 25px"
		});
}

function showQueryExecute(secondRun){
	if (currentAppName=="ToBeParks"){
		//$('#criteriaPanels .dbFieldOperator option[value="LIKE"]').remove();
		$('#criteriaPanels .dbFieldOperator option[value="NEQ"]').remove();
		$('#criteriaPanels .dbFieldOperator option[value="GEQ"]').remove();
		$('#criteriaPanels .dbFieldOperator option[value="LEQ"]').remove();
		
	}
	var myDate = new Date().toString(Date.CultureInfo.formatPatterns.fullDateTime);	//needs datejs to play
	var myDate = new Date().toString("hh:mm:ss");
	if (!secondRun){buildDBSearchSource(layerSource);}
	document.getElementById("critFriendlyName").value = strings.QBuilder.friendlyNameDef+myDate;
	$("#databaseAnalysis").dialog({modal: true,resizable: false,width: 900,height: 510, title: strings.QBuilder.windowTitle});
	var titleBar = $("#ui-dialog-title-databaseAnalysis").parent();
	titleBar.css({
		"background":"url('"+config.folderPath+"Images/queryBuilder/database_search.png') #F6A828 no-repeat 12px 2px",
		"background-size":"auto 25px"
		});
		//.find(".ui-dialog-titlebar-close").css({"visibility":"hidden"});
	//<a href="#" class="movingHideBtn" onclick="$('#databaseAnalysis').dialog('close');">HIDE</a>
	if (titleBar.find(".movingHideBtn").length==0){
		var movingBtn = document.createElement("a");
		movingBtn.onclick = function(){$('#databaseAnalysis').dialog('close');};
		movingBtn.className = "movingHideBtn";
		movingBtn.innerHTML=strings.QBuilder.windowClose;
		titleBar.append(movingBtn);
	}
	mygis.UI.dbCriteriaReset();
	/*mygis.UI.createCriteriaMap();*/
}

function showQueryResetConfirm(){
	/*
	$('#critReset').css({'display':'block'});
	document.getElementById("criteriaGo").ex_RemoveClassName("defaultAction");
	$("#criteriaResetCont").unbind('mouseleave');
	$("#criteriaResetCont").bind('mouseleave', function(){
		hideQueryResetConfirm();
		return false;
	});
	*/
	showConfirmationDialog(strings.ConfirmBox.msg_qb_resetcrit,mygis.UI.dbCriteriaReset);
}

function hideQueryResetConfirm(){
	$('#critReset').css({'display':'none'});
	document.getElementById("criteriaGo").ex_AddClassName("defaultAction");
}

function showMapExport(){
	var layers = mygis.Utilities.getVisibleLayerString(currentAppName,false);
	document.getElementById("saveAsLink").href = document.getElementById("permaElem").href;
	document.getElementById("saveAsLink").innerHTML=document.getElementById("saveAsLink").href;
	
	document.getElementById("saveAsLegendImg").src = "http://mgmapserver.avmap.gr:8081/geoserver/wms"+
		"?layer="+layers+
		"&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png";
	$("#saveAs").show().dialog({resizable: false,title: strings.Export.saveAsWindowTitle});
	
}

function showUserFiles(secondRun,onlyImages,appAdmin){
	if (!secondRun){
		mygis.UI.MediaManager.bindManagerHandlers();
		$("#userFiles").dialog({
			autoOpen: false,
			modal: true,
			resizable: false,
			width: 780,
			height: 510, 
			title: strings.MediaManager.windowTitle,
			closeOnEscape: false
			});
		var titleBar = $("#ui-dialog-title-userFiles").parent();
		titleBar.css({
			"background":"url('"+config.folderPath+"Images/pictures_folder.png') #F6A828 no-repeat 12px 2px",
			"background-size":"auto 25px"
			});
	}
	$("#userFiles").dialog('open');
	
	
	var fileContainer = $("#userFilesList");
	if (secondRun){
		fileContainer.jqxGrid('clearselection');
		fileContainer.jqxGrid('clearfilters');
		fileContainer.jqxGrid('clear');
		
	}
	var cellrenderer = function (row, datafield, value) {
		var retobject = "";
		switch (datafield){
			case 'fileID':
				var action ="";
				var fileType = this.owner.getrowdata(row).fileTYPE.toLowerCase();
				switch (fileType){
					case ".png":
					case ".jpg":
					case ".jpeg":
					case ".gif":
						action = "router('mm_imgclick',this);";
						retobject = mygis.Utilities.format('<img onclick="{0}" style="margin: 4px;" src="{1}GetImage.ashx?qType=userFile&qContents={2}&qSize=28" />',
									"return false;", //action,
									config.folderPath,
									value);
						break;
					case ".doc":
					case ".docx":
						var cname = "doc";
						retobject=mygis.Utilities.format('<div class="MMFile {0}" />',cname);
						break;
					case ".xls":
					case ".xlsx":
						var cname = "xls";
						retobject=mygis.Utilities.format('<div class="MMFile {0}" />',cname);
						break;
					case ".ppt":
					case ".pptx":
						var cname = "ppt";
						retobject=mygis.Utilities.format('<div class="MMFile {0}" />',cname);
						break;
					case ".pdf":
						var cname = "pdf";
						retobject=mygis.Utilities.format('<div class="MMFile {0}" />',cname);
						break;
					default:
						var cname = "unknown";
						retobject=mygis.Utilities.format('<div class="MMFile {0}" />',cname);
						break;
				}
				
				break;
			case 'fileTYPE':
				var genericName;
				switch(value.toLowerCase()){
					case ".png":
					case ".jpg":
					case ".jpeg":
					case ".gif":
						genericName=strings.MediaManager.filetype_Image;
						break;
					case ".txt":
					case ".doc":
					case ".docx":
					case ".rtf":
					case ".pdf":
						genericName=strings.MediaManager.filetype_Document;
						break;
					default:
						genericName=strings.MediaManager.filetype_Other;
						break;
				}
				retobject = mygis.Utilities.format("<span class='primaryFileType' style='margin: 9px 4px; float: left;'>{0}<span class='secondaryFileType'>{1}</span></span>",genericName,value);
				break;
			case 'fileSIZE':
				retobject = mygis.Utilities.format("<span style='margin:9px 4px; float: right;'>{0}</span>",value.toFixed(2));
				break;
			case 'fileINSERT':
				retobject = mygis.Utilities.format("<span style='margin:9px 10px 9px 4px; float: right;'>{0}</span>",value);
				break;
			default:
				retobject = mygis.Utilities.format("<span style='margin:9px 4px; float: left;'>{0}</span>",value);
				break;
		}
		return retobject;
	}
	if (!secondRun){
		mygis.UI.MediaManager.setupGaugeFeedback();
		var fileSource;
		if (appAdmin){
			fileSource = createFileListApp();
		}else{
			fileSource = createFileList();
		}
		fileContainer.jqxGrid({
			source:fileSource,
			width: 760,
			height: 224,
			autoheight: false,
			theme: 'pk_mg',
			enabletooltips: true,
			columns: [
				{text: '',datafield:'fileID', width: 36,cellsrenderer: cellrenderer},
				{text: 'really really really long name',datafield:'fileNAME',cellsrenderer: cellrenderer},
				{text: '',datafield:'fileTYPE', width: 100,cellsrenderer: cellrenderer},
				{text: '', datafield:'fileSIZE', width: 95,cellsrenderer: cellrenderer},
				{text: '',datafield:'fileINUSE', width: 55,columntype: 'checkbox',type: 'boolean'},
				{text: '',datafield:'fileINSERT', width: 115,cellsrenderer: cellrenderer}
			],
			enableanimations: false,
			showheader: false,
			selectionmode: 'singlerow',
			rowsheight:35
		});
		fileContainer.bind('rowselect',mygis.UI.MediaManager.fileSelected);
		//fileContainer.bind('rowunselect',mygis.UI.MediaManager.fileUnselected);
		
		var myurl = config.mgreq+"?qtype=GetUserSpace";
		$.ajax({
			url: myurl,
			type: 'GET',
			success: function(data){
				mygis.UI.MediaManager.setupGaugeValue(parseFloat(data));
			}
		});
	}else{
		mygis.UI.MediaManager.refreshFileList();
		
	}
	if (internalConfig.mmCallback.fn==null){
		$("#userFilesDialogButtons").hide();
	}else{
		$("#userFilesDialogButtons").show();
	}
	if (onlyImages){
		mygis.UI.MediaManager.filterImages();
	}else{
		mygis.UI.MediaManager.clearFilterImages();
	}
}

function fileUploaded(sender,eventArgs){
	var info = eventArgs.get_fileInfo();
	var row = eventArgs.get_row();
}

function fileUploading(){
	$("#userFiles_uploadNew").addClass("disabled");
}

function fileUploadFinished(sender){
	$("#userFiles_uploadNew").removeClass("disabled");
	mygis.UI.MediaManager.refreshFileList();
}

function loadMap(initialLoad,listBoxID){
	/* TODO PROPER FIX
	if (layerCurrentEditing>-1){
		showConfirmationDialog(strings.Editing.loseChanges,function(){
			mygis.UI.clearUnsavedLayer(layerCurrentEditing);
			//loadMap(initialLoad);
		});
		return false;
	}
	*/
	mygis.Utilities.blockUI();
	if (!listBoxID){
		listBoxID="mapsList";
	}
	try{mygis.UI.queryResultsReset();}catch(err){}
	try{$("#infoLeftList").jqxListBox('clear');}catch(err){}
	if ($("#mapsPanel").is(":visible")){
				$("#mapsPanel").slideUp('fast');
				$("#mapsPanelOverlay").hide().unbind('click');
			}
	if (!$("#"+listBoxID).jqxListBox('getSelectedItem')){
		mygis.UI.feedback(strings.Coding.loadingStep4,true);
		mygis.UI.feedback(strings.Coding.loadingStep5,true);
		if (initialLoad){
			ui_setup_2();
		}
	}else{
		syncMapSelection(listBoxID);
		var mapItem = $("#"+listBoxID).jqxListBox('getSelectedItem').originalItem;
		var mapID = mapItem.id;
		
		currentMapID = mapID;
		currentMapMaxExtent = mapItem.maxExtent;
		currentAppName = mapItem.appName;
		createLayerList(mapID);
		//mygis.UI.resetLoadFeedback();
		//mygis.Map.switchBackground(mapItem.mapDefaultBG,0);
		mygis.UI.feedback(strings.Coding.loadingStep4);
		
		mygis.UI.Macros.init();
		setTimeout(function(){
			
			loadMapSequence(mapItem,true);
			$("#filterContents").empty();
			mygis.UI.feedback(strings.Coding.loadingStep5);
			mygis.UI.Help.shortcutStart();
			setTimeout(function(){
				createQSList(mapID);
				mygis.UI.initHotSearches();
				if (initialLoad){
					ui_setup_2();
				}else{
					try{
						$("#databaseAnalysis").dialog('destroy');
						$("#databaseAnalysis").empty();
						mygis.Map.switchBackground(mapItem.mapDefaultBG,0);
					}catch(err){}
					
					$(document).trigger('finishedLoading');
				}
				//console.log('beforeTrigger');
				
			},4);
		},4);
		
	}
	
	
}

function loadMapSequence(mapItem,initialLoad)
{
	if (!mapItem){
		mapItem = $("#mapsList").jqxListBox('getSelectedItem').originalItem;
	}
	var recs = layerSource.records;
	var layername;
	var layer;
	var pushMaps= new Array();
	layersToLoad=recs.length;
	layersLoaded=0;
	
	mygis.Map.clearMap(initialLoad);
	//mygis.Utilities.blockUI(initialLoad);
	
	
	var mapPath = mapItem.filePath;
	var mapExtent = mapItem.maxExtent;
	var appName = mapItem.appName;
	var mapCenter = mapItem.mapCenter.split(",");;
	var mapZoomLevel = mapItem.mapZoom;
	
	$("#mapDescription").html(mapItem.mapName);
	
	var fullLayerString = mygis.Utilities.getVisibleLayerString(appName);
	if (fullLayerString){
	
		
		layer = mygis.Map.getMapServerLayer(fullLayerString,mapPath,mapExtent);
		//layer.projection = new OpenLayers.Projection("EPSG:4326");
		layer.events.register("loadend", layer, finishLoad);
		pushMaps.push(layer);
				
		digimap.addLayers(pushMaps);
		digimap.setLayerIndex(cosmeticLayer,99);
		digimap.setLayerIndex(selectionLayer,100);
		digimap.setLayerIndex(feedbackLayer,101);
		
		if (initialLoad){
			mygis.Map.buildSLDArray();
			if (mapCenter.length>1){
				//digimap.setCenter(new OpenLayers.LonLat([mapCenter[0],mapCenter[1]]),mapZoomLevel);
				digimap.setCenter(new OpenLayers.LonLat([mapCenter[0],mapCenter[1]]).transform(
					new OpenLayers.Projection(mygis.Utilities.projections.wgs84),
					digimap.getProjectionObject()
				), mapZoomLevel);
				internalMemory.lastZoom=digimap.getExtent();
			}else{
				digimap.zoomToExtent(layer.getMaxExtent());
				internalMemory.lastZoom=digimap.getExtent();
			}
			//showLayers(true);
			
		}
	}else{
		mygis.Utilities.unblockUI();
	}
}

function finishLoad(){
	this.events.unregister("loadend",this,finishLoad);
	if (finishApplicationLoad){mygis.Utilities.unblockUI()};
}

function initializeTabs()
{
	if (!tabsInitialized){
		$("#bottomTabContainer").jqxTabs({
			width: '100%',
			height: 'auto',
			theme: 'classic',	//'pk_mg_white',
			scrollable: false,
			selectionTracker: false,
			selectedIndex: 0//internalConfig.layerTabIndex
		});
		$("#bottomTabContainer").jqxTabs('disableAt',internalConfig.editTabIndex);
		$("#bottomTabContainer").bind('selecting',function(event){
			//$('#layersList').jqxGrid('beginupdate');
			
			if (event.args.item==$("#bottomTabContainer").jqxTabs('length')-1){
				var elem = $("#appTabs").parent()[0];
				if (elem.ex_HasClassName("collapsed")){
					elem.ex_RemoveClassName("collapsed");
					document.getElementById("tabsCloseButton").ex_RemoveClassName("collapsed");
					var selIndex = $("#bottomTabContainer").jqxTabs('selectedItem');
					var manualTab = $("#bottomTabsRow li")[selIndex];
					manualTab.ex_AddClassName("jqx-tabs-title-selected-top");
					manualTab.ex_AddClassName("jqx-tabs-title-selected-top-classic");
					manualTab.ex_AddClassName("jqx-fill-state-pressed");
					manualTab.ex_AddClassName("jqx-fill-state-pressed-classic");
				}else{
					elem.ex_AddClassName("collapsed");
					document.getElementById("tabsCloseButton").ex_AddClassName("collapsed");
					var selIndex = $("#bottomTabContainer").jqxTabs('selectedItem');
					var manualTab = $("#bottomTabsRow li")[selIndex];
					manualTab.ex_RemoveClassName("jqx-tabs-title-selected-top");
					manualTab.ex_RemoveClassName("jqx-tabs-title-selected-top-classic");
					manualTab.ex_RemoveClassName("jqx-fill-state-pressed");
					manualTab.ex_RemoveClassName("jqx-fill-state-pressed-classic");
					//$('#bottomTabContainer').jqxTabs('collapse');
				}
				event.cancel=true;
			}else if (event.args.item==internalConfig.editTabIndex){
				//event.cancel=true;	
			}else{
				mygis.UI.toggleActiveList(event.args.item);
				var elem = $("#appTabs").parent()[0];
				if (elem.ex_HasClassName("collapsed")){
					elem.ex_RemoveClassName("collapsed");
					document.getElementById("tabsCloseButton").ex_RemoveClassName("collapsed");
					var selIndex = $("#bottomTabContainer").jqxTabs('selectedItem');
					var manualTab = $("#bottomTabsRow li")[selIndex];
					manualTab.ex_AddClassName("jqx-tabs-title-selected-top");
					manualTab.ex_AddClassName("jqx-tabs-title-selected-top-classic");
					manualTab.ex_AddClassName("jqx-fill-state-pressed");
					manualTab.ex_AddClassName("jqx-fill-state-pressed-classic");
				}
			}
			
		});
				
		tabsInitialized=true;
	}
}

function initializeInfoWindow(){
	querySource = new Array();
	mygis.UI.updateQueryList();
	$("#infoLeftList").show();
	infoWindowInitialized=true;
}

function queryResultsMouseOver(event)
{
	var target = $(event.target);
	var resultList = $("#infoLeftList");
	var items = resultList.jqxListBox('getItems');
	var found=false;
	var i=0;
	var centerPoint;
	if (mygis.UI.isActiveSelectMode("mode_ResultsOnHover")){
		while (i<items.length && !found)
		{
			var x = $(items[i].element);
			if (x.is(':hover')){
				found=true;
			}
			i++;
		}
		if (found){		
			var features = resultList.jqxListBox('source')[i-1].linkedResults.features;
			if (features){
				mygis.Map.markFeatures(features);
			}
		}
	}
}


function queryResultsMouseOut()
{
	var resultList = $("#infoLeftList");
	var item = resultList.jqxListBox('getSelectedItem');
	if (item){
		/*
		var centerPoint = resultList.jqxListBox('source')._source.localdata[item.index].centerPoint;
		mygis.Map.markSelectionPoint(centerPoint,true);	//if centerPoint is null, it'll clear the layer
		*/
		if (mygis.UI.isActiveSelectMode("mode_ResultsOnHover")){
			mygis.Map.markFeatures();
		}
		
	}
}

function queryResultsClick(event)
{
	var item = $("#infoLeftList").jqxListBox('getSelectedItem').element;
	if (event.target==item){
		queryResultsSelect();
	}
}

function queryResultsSelect(){
	mygis.UI.toggleSearchAvailableActions();
}


function populateQueryLayerList(resultdata,queryname)
{
	showInfoDialog('query',queryname);
	var newdata = {};
	var rightList = $("#infoRightCol");
	var rightTabs = $("<ul />");
	rightTabs.attr("id","infoRightTabsQ");
	rightList.removeData().empty();
	rightList.die();
	rightList.append(rightTabs);
	var windowTitle;
	if (rightList.children().length>1){
		rightList.children().slice(1).remove();
	}
	//showInfoDialog('query',queryname);
	$.each(resultdata,function(i,result){
		var newdiv = $("<div />");
		var newdivHeader = $("<li />");
		
		var newdivContent = $("<div />");
		newdivContent.attr("class","resultGridButtons");
		//loadFragment("resultGridButtons",null,newdivContent);
		newdivContent.html(resultGridButtons.html());
		
		var clickMe = false;
		
		rightTabs.append(newdivHeader);
		newdiv.attr("id","queryTab_"+i);
		newdiv.append(newdivContent);
		//----window title
		
		//windowTitle = result.TableName.split("_").slice(1).join(" ");
		//windowTitle += mygis.Utilities.format(" ({0})",result.Rows.length);
		windowTitle = result.TableName;
		newdivHeader.html(windowTitle);
		
		
		if (i==0){clickMe=true;}
		newdiv.data('clickMe',clickMe);
		newdiv.data('result',result);
		newdiv.data('queryname',queryname);
		newdiv.data('windowTitle',windowTitle);
		
		rightList.append(newdiv);
		
	});
	
	rightList.jqxTabs({
		width: '100%',
		height: '100%',	//TODO: FIX this size
		theme: 'classic',	//'pk_mg_white',
		scrollable: true,
		scrollPosition:'right',
		selectionTracker: true
	});
	rightList.live('selected', infoTabClicked);
	//console.log("binding infoTabClicked");
	infoTabClicked(null,0);
}



function infoTabClicked(event,manual,isInfo,isMap)
{
	var clickedIndex;
	if (event){
		clickedIndex = event.args.item;
	}else{
		clickedIndex = manual;
	}
	var getDiv = $("#queryTab_"+clickedIndex);
	if (isMap){
		populateMapFeatureList(getDiv.data('result'),getDiv,getDiv.data('windowTitle'));	//WhatToSend
	}else{
		if (isInfo){
			//populateInfoFeatureList(getDiv.data('url'),getDiv.data('name'),getDiv,getDiv.data('clickMe'),getDiv.data('tableNAME'));
		}else{
			populateQueryFeatureList(getDiv.data('result'),getDiv,getDiv.data('queryname'),getDiv.data('clickMe'),getDiv.data('tableNAME'));
		}
	}
}

function infoTabClickedM(event,manual)
{
	infoTabClicked(event,manual,false,true);
}

function showInfoDialog(mode,infoTitle)
{
	var mytitle = infoTitle;
	var titlePrefix;
	var resultTitle;
	var myicon;
	switch (mode)
	{
		case 'query':
			myicon="queryBuilder/database_search.png";
			titlePrefix = strings.Info.windowTitleQuery;
			break;
		case 'info':
			myicon="info2.png";
			titlePrefix = "";	//strings.Info.windowTitle;
			break;
	}
	resultTitle = titlePrefix;
	if (infoTitle){
		resultTitle += mygis.Utilities.format("{0}",infoTitle);
	}
	expandResultDetails();
	var titleBar = $("#ui-dialog-title-infoAnalysis").parent();
	titleBar.css({
		"background":"url('"+config.folderPath+"Images/"+myicon+"') #F6A828 no-repeat 12px 2px",
		"background-size":"auto 25px"
	});
	
}

/**
	* Build a dataAdapter from existing data, in order to call actualInfoGridPop
	* The existing data is from a map select tool.
	* @method populateMapFeatureList
	*/
function populateMapFeatureList(features,container,windowTitle){
	var data = new Array();
	var row;
	var datacolumns = new Array();
	$.each(features[0].data,function(prop,value){
		var colObject = new Object();
		colObject.text=prop;
		colObject.dataField=prop;
		colObject.width=100;
		datacolumns.push(colObject);
	});
	$.each(features,function(index,f){
		var row = {};
		row = f.data;
		data.push(row);
	});
	var source =
	{
		localdata: data,
		datatype: "local"
	};
	var dataAdapter = new $.jqx.dataAdapter(source,{
		async: false
	});
	dataAdapter.dataBind();	
	dataAdapter.mydatacolumns=datacolumns;
	infoWindows[windowTitle]=dataAdapter;
	
	actualInfoGridPop(windowTitle,container);
}




/**
 * Creates the returning form, posts it back and closes the window
 */
function saveAndClose(){
    var postbackform = document.createElement("FORM");
    postbackform.id = "digiForm";
    postbackform.name = "digiForm";
    postbackform.method = "POST";
    postbackform.action = "";
    postbackform.target = "self";
    
    var inp_output = document.createElement("input");
    inp_output.id = "_output";
    inp_output.name = "_output";
    inp_output.value = getKML();
    postbackform.appendChild(inp_output);
    
    var inp_extra = document.createElement("input");
    inp_extra.id = "_extra";
    inp_extra.name = "_extra";
    inp_extra.value = getExtra();
    postbackform.appendChild(inp_extra);
    
    
    var inp_guid = document.createElement("input");
    inp_guid.id = "guid";
    inp_guid.name = "guid";
    inp_guid.value = getGUID();
    postbackform.appendChild(inp_guid);
    //document.body.appendChild(postbackform);
    //postbackform.submit();
    
    var inp_pback = document.createElement("input");
    inp_pback.id = "postbackurl";
    inp_pback.name = "postbackurl";
    inp_pback.value = postbackurl;
    postbackform.appendChild(inp_pback);
    
    if (postbackurl){
    $.ajax({
        data: $(postbackform).serialize(),
        success: function(data){
            self.close();
        },
        type: "POST"
    });
    }else{
		$("#Body").append(postbackform);
		postbackform.submit();
	}
    
    
    return false;
}


function toggleRadControl(which,callerID){
	mygis.UI.stopDigitize();
    var ctrl;
    var caller = document.getElementById(callerID);
    switch (which) {
        case "layers":
        case "tables":
            ctrl = rsideSplitter;
            break;
        case "info":
            ctrl = wrapSplitter;
            break;
    }
	var previouslyHidden=ctrl.getEndPane().get_collapsed();
	if (which=="layers" && previouslyHidden){
		showSingleRightPane("cosmeticPanel");
	}else{
		$("#cosmeticPanel").hide();
	}
    expandRightPane(!ctrl.getEndPane().get_collapsed(),ctrl);
	
    ToggleSplitBar(previouslyHidden,ctrl);
	
}

function forwardRightPane()
{
	var divs= $("#bottomTopPane").find(">div");
	var current=-1;
	var loopDone = false;
	var i=0;
	while (i<divs.length && !loopDone)
	{
		var item = $(divs[i]);
		if (item.is(":visible")){
			current=i;
			loopDone = true;
		}else{
			i++;
		}
	}
	if (current>-1){
		if (current+1<=divs.length-1){
			$(divs[current]).hide();
			$(divs[current+1]).show();
			if (current==1){
				$("#rotateBackBtn").show();
			}
			if (current+1==divs.length-1){
				$("#rotateForwardBtn").hide();
			}
		}
	}
	
}

function backRightPane()
{
	var divs= $("#bottomTopPane").find(">div");
	var current=-1;
	var loopDone = false;
	var i=0;
	while (i<divs.length && !loopDone)
	{
		var item = $(divs[i]);
		if (item.is(":visible")){
			current=i;
			loopDone = true;
		}else{
			i++;
		}
	}
	if (current>-1){
		if (current-1>=0){
			$(divs[current]).hide();
			$(divs[current-1]).show();
			if (current-1==0){
				$("#rotateBackBtn").hide();
			}
			if (current==divs.length-1){
				$("#rotateForwardBtn").show();
			}
		}
	}
	
}

function createMapList()
{
	//var url = config.mgreq+"?qtype=GetMapList";
	var url = config.folderPath+"mgreq.ashx?qtype=GetMapList";
	var source;
	var rowheight = 52;
	var rowheight2 = 38;
	if (internalConfig.changeDefaultMap != null){
		url += "&oDef="+internalConfig.changeDefaultMap;
	}
	var localMaps = mygis.Storage.getItem('mapRecords_'+url);
	if (localMaps && !Sys.Services.AuthenticationService.get_isLoggedIn()){
		var restore = eval(localMaps);
		source = {
			datatype: "local",
			localdata: restore
		};
	}else{
		source =
		{
			datatype: "json",
			datafields: [
				{ name: "mapName" },
				{ name: "mapDescription" },
				{ name: "mapLayerCount" },
				{ name: "id" },
				{ name: "defaultLoad" },
				{ name: "filePath"},
				{ name: "maxExtent"},
				{ name: "appName"},
				{ name: "mapCenter"},
				{ name: "mapZoom"},
				{ name: "mapCreateDate"},
				{ name: "mapUpdateDate"},
				{ name: "mapDevelopedBy"},
				{ name: "mapOwner"},
				{ name: "mapDefaultBG"},
				{ name: "appDisabledBGs"}
			],
			id: 'id',
			url: url
		};
	}
	
	mapSource = new $.jqx.dataAdapter(source,{
		
		async: false
	});
	mapSource.dataBind();
	if (!Sys.Services.AuthenticationService.get_isLoggedIn())mygis.Storage.storeItem('mapRecords_'+url,JSON.stringify(mapSource.records));
	var defaultLoad;
	var deletedBGs=false;
	$.each(mapSource.records,function(i,v){
		if (v.defaultLoad=="true"){
			defaultLoad = i;
		}
		if (v.appDisabledBGs && (!deletedBGs)){
			deletedBGs=true;
			var bgs = v.appDisabledBGs.split(",");
			for (var i=0;i<bgs.length;i++){
				delete backgrounds[bgs[i]];
			}
		}
	});
	var itemRenderer = function(index, label, value){
		var src = config.folderPath+"GetImage.ashx?qType=mapThumb&qSize=50&qContents="+value;
		retobject = mygis.Utilities.format("<div class='mapListRowContainer' style='height: {1}px;'><a class='loadMapBtn' href='#' title='{3}'><img style='margin-right: 5px;' src='{0}'/><span>{2}</span></a></div>",src,rowheight,label,strings.MapControl.loadMapTooltip);
		return retobject;
	};
	var itemRenderer2 = function(index, label, value){
		var src = config.folderPath+"GetImage.ashx?qType=mapThumb&qSize=35&qContents="+value;
		retobject = mygis.Utilities.format("<div class='mapListRowContainer' style='height: {1}px;'><a class='loadMapBtn' href='#' title='{3}'><img style='margin-right: 5px;' src='{0}'/><span>{2}</span></a></div>",src,rowheight2,label,strings.MapControl.loadMapTooltip);
		return retobject;
	};
	$("#mapsList").jqxListBox({
		source: mapSource,
		displayMember: "mapName",
		valueMember: "id",
		width: 232,
		itemHeight: rowheight,
		height: '100%',
		theme: 'pk_mg',
		renderer: itemRenderer,
		equalItemsWidth:true
		//,selectedIndex: 0
	});
	$("#mapsList2").jqxListBox({
		source: mapSource,
		displayMember: "mapName",
		valueMember: "id",
		width: 243,
		itemHeight: rowheight2,
		height: 150,
		theme: 'pk_mg',
		renderer: itemRenderer2,
		equalItemsWidth:true
	});
	$("#mapsList").jqxListBox('selectIndex',defaultLoad);
	$("#mapsList2").jqxListBox('selectIndex',defaultLoad);
	$(".loadMapBtn").live('click',function(args){
		var listBoxID=$(args.currentTarget).closest("div.jqx-listbox").attr('id');
		router('lmap',listBoxID);
		return false;
	});
	//createMapListThumbsUL();
	
}

function createMapListThumbsUL(){
	var slider = $("#mapSlider");
	var maps = mapSource.getrecords();
	slider.html("");
	var data = [];
	var contDiv = $("<ul />");
	var item = $("<li />");
	var img = $("<img />");
	var link = $("<a />");
	var src = config.folderPath+'Images/map_Add.png';
	img.attr("src",src);
	img.attr("title","New Map");
	link.attr("title","New Map");
	item.attr("title","New Map");
	link.bind('click',showMapDialog);
	link.append(img);
	
	
	item.append(link);
	//contDiv.append(item);
	$.each(maps,function(i,v){
		var item = $("<li />");
		var img = $("<img />");
		var link = $("<a />");
		var src = config.folderPath+'GetImage.ashx?qType=mapThumb&qContents='+v.id;
		img.attr("src",src);
		img.attr("title",v.mapName);
		link.attr("title",v.mapName);
		item.attr("title",v.mapName);
		link.bind('click',{mapIndex: i},showMapDialog);
		//link.onclick = showMapDialog;
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
}

function createLayerList(mapID)
{
	var layerlist=$('#layersList');
	
	try{
		layerlist.die();
		layerlist.unbind('cellendedit');
		layerlist.unbind('select');
		layerlist.unbind('checkchange');
		
		//$("#layersList").jqxListBox('clearSelection', true);
	}catch(err){
	
	}
	//layerlist.bind("bindingcomplete",setTimeout(function(){mygis.UI.layerCloneInit();},1500));
	//var myurl = config.mgreq+"?qtype=GetLayerList&qContents="+mapID;
	var myurl = config.folderPath +"mgreq.ashx?qtype=GetLayerList&qContents="+mapID;
	var source;
	var localLayers = mygis.Storage.getItem('layerRecords_'+mapID);
	if (localLayers && !Sys.Services.AuthenticationService.get_isLoggedIn()){
		var restore = eval(localLayers);
		source = {
			datatype: "local",
			localdata: restore
		};
	}else{
		source =
		{
			datatype: "json",
			datafields: [
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
				//{ name: "Locked"},
				{ name: "layerMinScale" },
				{ name: "layerMaxScale" },
				{ name: "manualVisibility" },
				{ name: "layerGeomType" },
				{ name: "folderName"},
				{ name: "layer_ObjectCount"}
			],
			id: 'layers_asdf',
			url: myurl
		};
	}
	layerSource = new $.jqx.dataAdapter(source,{async:false});
	layerSource.dataBind();
	mygis.Map.getFieldDescriptions();
	if (!Sys.Services.AuthenticationService.get_isLoggedIn())mygis.Storage.storeItem('layerRecords_'+mapID,JSON.stringify(layerSource.records));
	//layerTreeSource = buildTreeSource(layerSource,'layers');
	
	layergridSource = {
		localdata: mygis.UI.buildGridSource(layerSource,'layers',true),
		datatype: 'array'
	};
	

	var containerForLayers=$("#layersPanel");

	var locObject = {
		groupsheaderstring: strings.Grid.groupsheaderstring,
		sortascendingstring: strings.Grid.sortascendingstring,
		sortdescendingstring: strings.Grid.sortdescendingstring,
		sortremovestring: strings.Grid.sortremovestring,
		groupbystring: strings.Grid.groupbystring,
		groupremovestring: strings.Grid.groupremovestring
	};

	var groupsrenderer = function (text, group, expanded,properties) {
		var len=properties.subItems.length;
		var items=properties.subItems;
		countVisible=0;
		$.each(items,function(i,v){
			if (v.Visible){
				countVisible++;
			}
		});
		var classNames="groupVisible jqx-checkbox-default jqx-checkbox-default-pk_mg jqx-rc-all jqx-rc-all-pk_mg";
		if (countVisible==len){
			classNames+=" jqx-checkbox-check-checked"
		}else if (countVisible>0){
			classNames+=" jqx-fill-state-normal jqx-fill-state-normal-pk_mg pressed"
		}else{
			classNames+= " jqx-fill-state-normal jqx-fill-state-normal-pk_mg";
		}
		var btn="<a href='#' class='"+classNames+"' onclick=\"router('tlgv','"+group+"');return false;\"></a>";
		return (btn+"<div class='groupHeaderRow' title='"+group+"'>" + group +"</div>");
	}
	var mycolumns=[];
	if (Sys.Services.AuthenticationService.get_isLoggedIn()){
		mycolumns=[
			//{text: '', datafield: 'Locked', width: 26, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false},
			{text: '',datafield:'Visible', width: 20,cellsrenderer: mygis.UI.layerInnerCellRenderer()},
			{text: '',datafield:'Image', width: 26, cellsrenderer: mygis.UI.layerGraphicCellRenderer(),editable:false},
			{text: strings.LayerControl.columnName, datafield:'Name', cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
			//{text: '', datafield: 'Selectable', width: 16, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
			//REENABLE when fixed:
			//,{text: '', datafield: 'Editable', width: 16, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false},
			//{text: '', datafield: 'Savable', width: 16, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
		];
	}else{
		mycolumns=[
			//{text: '', datafield: 'Locked', width: 26, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false},
			{text: '',datafield:'Visible', width: 20,cellsrenderer: mygis.UI.layerInnerCellRenderer()},
			{text: '',datafield:'Image', width: 26, cellsrenderer: mygis.UI.layerGraphicCellRenderer(),editable:false},
			{text: strings.LayerControl.columnName, datafield:'Name', cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
			//{text: '', datafield: 'Selectable', width: 16, cellsrenderer: mygis.UI.layerInnerCellRenderer(), editable:false}
			
		];
	}
	layerlist.jqxGrid({
		source:layergridSource,
		width: 241,
		//height: 300,
		//autoheight: false,
		rowheight: 29,
		//autorowheight: true,
		autoheight: true, 
		theme: 'pk_mg',
		columns:mycolumns,
		groups: ['folderName'],
		groupsexpandedbydefault:true,
		enableanimations: true,
		rowdetails: false,
		sortable: true,
		groupable: true,
		showheader: false,
		showgroupsheader: false,
		editable: false,
		pageable: false,
		selectionmode: 'none',
		groupsrenderer: groupsrenderer,
		scrollbarsize: 5,
		rendered: layerGridRendered
	});
	
	mygis.UI.initLayerSelectionList(true);
	mygis.UI.initLayerWithinSelectionList(true);
	
	
	
	
	//mygis.Map.setSelectableLayers(layerSource.records,selectionLayers);
	//mygis.Map.determineSelectionToggleStatus("#layerSelectionList");
	
	
	layerlist.jqxGrid('localizestrings', locObject);
	
	
	layerlist.bind('rowselect',mygis.UI.toggleLayerAvailableActions);
	layerlist.bind('rowunselect',mygis.UI.toggleLayerAvailableActions);
	
	layerlist.bind('mouseover',gridRowsMouseOver);
	layerlist.bind('mouseout',gridRowsMouseOut);
	
	
	layerlist.find('.layerLegendGraphic').live({
		mouseenter: layerStyleFullZoom,
		mouseleave: layerStyleFullZoomOff
	});
	if (Sys.Services.AuthenticationService.get_isLoggedIn()){
		mygis.User.Hooks.loadUserLayerRights();
	};
	//mygis.UI.layerCloneInit();
}

function createQSList(mapID)
{
	//var myurl = config.mgreq+"?qtype=GetMapQuickSearches&qContents="+mapID;
	var myurl = config.folderPath+"mgreq.ashx?qtype=GetMapQuickSearches&qContents="+mapID;
	var source =
	{
		datatype: "json",
		datafields: [
			{ name: "quickID" },
			{ name: "layername"}, 
			{ name: "fieldname" },
			{ name: "searchType" },
			{ name: "searchOperator" },
			{ name: "searchLayout" },
			{ name: "searchMode" },
			{ name: "windowTitle"}, 
			{ name: "windowIcon"},
			{ name: "customFn"},
			{ name: "fieldFill"}
		],
		id: 'asdfg',
		url: myurl
	};
	QSSource = new $.jqx.dataAdapter(source,{async:false});
	QSSource.dataBind();
	
	
}

function createFileList()
{
	var myurl = config.mgreq+"?qtype=GetUserFiles";
	var fileSource;
	var source =
		{
			datatype: "json",
			datafields: [
				{ name: "fileID" },
				{ name: "fileTYPE" },
				{ name: "fileNAME" },
				{ name: "fileINUSE",type: "boolean" },
				{ name: "fileINSERT"},
				{ name: "fileSIZE",type: "number"  }
			],
			id: 'filesource',
			url: myurl
		};
	fileSource = new $.jqx.dataAdapter(source,{async:false});
	//fileSource.dataBind();
	return fileSource;
}

function createFileListApp()
{
	var myurl = config.mgreq+"?qtype=GetUserFilesApplication&qContents=";
	var fileSource;
	var source =
		{
			datatype: "json",
			datafields: [
				{ name: "fileID" },
				{ name: "fileTYPE" },
				{ name: "fileNAME" },
				{ name: "fileINUSE",type: "boolean" },
				{ name: "fileINSERT"},
				{ name: "fileSIZE",type: "number"  }
			],
			id: 'filesource',
			url: myurl
		};
	fileSource = new $.jqx.dataAdapter(source,{async:false});
	return fileSource;
}

function layerStyleFullZoom(e){
	var targ = $(e.target);
	var imgsrc = targ.css('background-image');
	if (imgsrc!="none"){
		if (imgsrc.indexOf('url("')==0){
			imgsrc = imgsrc.substring(5,imgsrc.length-2);
		}else{
			imgsrc = imgsrc.substring(4,imgsrc.length-1);
		}
		imgsrc=imgsrc.replace("&WIDTH=20&HEIGHT=20","");
		$("#magnifierStyle").remove();
		var magnifier = $("<div />");
		magnifier.attr("id","magnifierStyle");
		var magnImg = $("<img />");
		var position,posx,posy;
		position = targ.offset();
		posx = position.left+20;
		posy = position.top;
		magnImg.attr("src",imgsrc);
		magnifier.append(magnImg);
		var docHeight = $(document).height();
		var myHeight = magnifier.height();
		if (posy+myHeight>docHeight){
			posy = docHeight-myHeight;
		}
		magnifier.css({
			"left": posx+"px",
			"top": posy+"px"
		});
		$("Body").append(magnifier);
		setTimeout(function(){
			var myHeight = magnifier.height();
			if (posy+myHeight>docHeight){
				posy = docHeight-myHeight-30;
			}
			magnifier.css({
				"left": posx+"px",
				"top": posy+"px"
			});
		},300);
	}
}

function layerStyleFullZoomOff(e){
	var magnifier = $("#magnifierStyle");
	magnifier.remove();
}

function gridRowsMouseOver(event){
	var target = $(event.target);
	
	var gridRows=$("#contenttablelayersList >div");
	var found=false;
	var i=0;
	while (i<gridRows.length && !found)
	{
		var x = $(gridRows[i]);
		if (x.is(':hover')){
			found=true;
		}
		i++;
	}
	if (found){
		var optionCell = x.find(".layer_options")[0];
		if (optionCell){
			optionCell.ex_AddClassName("pressed");
		}
		return true;
	}else{
		return true;
	}
}

function gridRowsMouseOut()
{
	var gridRows=$("#contenttablelayersList >div");
	var items = gridRows.find(".layer_options");
	for (var i=0;i<items.length;i++){
		items[i].ex_RemoveClassName("pressed");
	}
}

function toggleLayerDetails(index,elem){
	/*
	var arrowBtn;
	if (index>=layerSource.records.length){
		displayNotify(strings.LayerControl.propertiesNotForBG);
	}else{
		var layerlist = $("#layersList");
		var alreadySelected = layerlist.jqxGrid('getselectedrowindexes').indexOf(index);
		if (alreadySelected == -1){
			layerlist.jqxGrid('clearselection');
			layerlist.jqxGrid('selectrow', index);
			expandLayerDetails();
			arrowBtn = $("#row"+index+"layersList").find(".layer_options")[0];
			arrowBtn.ex_AddClassName("permanent_on");
		}else{
			collapseLayerDetails();
			arrowBtn = $("#row"+index+"layersList").find(".layer_options")[0];
			arrowBtn.ex_RemoveClassName("permanent_on");
		}
	}
	*/
}

function createLayerProperties(){
	var calcHeight = $("#rsideSplitter").height()-10;
	
	$("#layerPropertiesTabs").die();
	$("#layerstylePanel").die();
	$("#layerPropertiesTabs").jqxNavigationBar({ 
		width: 324, 
		height: calcHeight,
		sizeMode: 'fitAvailableHeight', 
		theme: 'pk_mg',
		expandMode: 'toggle',
		expandedIndex: 0
	});
	$("#layerstylePanel").jqxNavigationBar({ 
		width: 300, 
		height: calcHeight-235,
		sizeMode: 'fitAvailableHeight', 
		theme: 'classic',
		expandMode: 'toggle'
	});
	
}

function createMapProperties(){
	var calcHeight = $("#rsideSplitter").height()-10;
	$("#mapsProperties").die();
	$("#mapsList").die();
	$("#mapsProperties").jqxNavigationBar({ 
		width: '324', 
		height: calcHeight,
		sizeMode: 'fitAvailableHeight', 
		theme: 'pk_mg',
		expandMode: 'toggle',
		expandedIndex: 0
	});
	$("#mapsProperties").bind("collapsedItem",collapseMapProperties);
}

function propertiesVisibility(specific,visible){
	var variousProps = $("#layerPropertiesWrapper").find(">div");
	for (var i=0;i<variousProps.length;i++){
		var id = variousProps[i].id;
		if (id==specific && visible){
			$(variousProps[i]).css("display","block");
		}else{
			$(variousProps[i]).css("display","none");
		}
	}
	var buttons = $("#rpanelTabButtons a");
	for (var i=0;i<buttons.length;i++){
		buttons[i].ex_RemoveClassName("active");
	}
	if (visible){
		//$("#layerPropertiesWrapper").css("visibility","visible");
		//document.getElementById("panel3").ex_RemoveClassName("collapsed");
		switch(specific){
			case "filterAnalysis":
				//document.getElementById("filterTabButton").ex_AddClassName("active");
				break;
			case "infoAnalysis":
				//document.getElementById("resultsTabButton").ex_AddClassName("active");
				break;
		}
		
		document.getElementById("panel3Out").ex_RemoveClassName("collapsed");
		document.getElementById("rpanelCollapseBtn").ex_AddClassName("active")
		//layout.show('east');
		document.getElementById("panel2").ex_AddClassName("rightExpanded");
		
	}else{
		//$("#layerPropertiesWrapper").css("visibility","hidden");
		//document.getElementById("panel3").ex_AddClassName("collapsed");
		document.getElementById("panel3Out").ex_AddClassName("collapsed");
		document.getElementById("rpanelCollapseBtn").ex_RemoveClassName("active");
		//layout.hide('east');
		document.getElementById("panel2").ex_RemoveClassName("rightExpanded");
		
		
	}
}

function expandLayerDetails(event,forceUpdate){
	
	var rowIndex;
	propertiesVisibility("layerPropertiesPanelCont",true);
	/*
	$("#layerPropertiesPanelCont").css("display","block");
	$("#layerPropertiesWrapper").css("visibility","visible");
	$("#infoAnalysis").css("display","none");
	*/
	
	if (event){
		rowIndex = event.args.rowindex;
	}else{
		rowIndex = $('#layersList').jqxGrid('getselectedrowindex');
	}
	
	
	var actualItem = layerSource.records[rowIndex];
	//$("#layerPropertiesTitleText").html(actualItem.layerNAME);
	$("#layerPropertiesDescription").html(actualItem.layerDESCRIPTION);
		
	var actionBar = $("#layerPropertiesCommonActions");
	var visibleBar1 = $("#visibleFrom");
	var visibleBar2 = $("#visibleTo");
	
	var btnVisible = actionBar.find(".toggleLayerVisible")[0];
	var btnEditable = actionBar.find(".toggleLayerEditable")[0];
	var btnSelectable = actionBar.find(".toggleLayerSelectable")[0];
	
	var btnVisibleFrom = visibleBar1.find(".visibleFromBtn")[0];
	var btnVisibleFromText = visibleBar1.find(".layerVisibleInput")[0];
	var btnVisibleTo = visibleBar2.find(".visibleToBtn")[0];
	var btnVisibleToText = visibleBar2.find(".layerVisibleInput")[0];
	
	if (actualItem.hidden){
		btnVisible.ex_RemoveClassName('pressed');
	}else{
		btnVisible.ex_AddClassName('pressed');
	}
	if (actualItem.Editable){
		btnEditable.ex_AddClassName('pressed');
	}else{
		btnEditable.ex_RemoveClassName('pressed');
	}
	if (actualItem.Selectable){
		btnSelectable.ex_AddClassName('pressed');
	}else{
		btnSelectable.ex_RemoveClassName('pressed');
	}
	if (actualItem.layerMinScale>-1){
		btnVisibleFromText.value=mygis.Utilities.addCommas(actualItem.layerMinScale);
		if (!actualItem.manualVisibility){
			btnVisibleFrom.ex_AddClassName("pressed");
		}else{
			btnVisibleFrom.ex_RemoveClassName("pressed");
		}
	}else{
		btnVisibleFrom.ex_RemoveClassName("pressed");
	}
	if (actualItem.layerMaxScale>-1){
		btnVisibleToText.value=mygis.Utilities.addCommas(actualItem.layerMaxScale);
		if (!actualItem.manualVisibility){
			btnVisibleTo.ex_AddClassName("pressed");
		}else{
			btnVisibleTo.ex_RemoveClassName("pressed");
		}
	}else{
		btnVisibleTo.ex_RemoveClassName("pressed");
	}
	createLayerProperties();
	mygis.UI.initializeStyler(actualItem.layerTABLE,actualItem);
}

function collapseLayerDetails(){
	propertiesVisibility("layerPropertiesPanelCont",false);
	/*
	$("#layerPropertiesPanelCont").css("display","none");
	
	$("#layerPropertiesWrapper").css("visibility","hidden");
	$("#infoAnalysis").css("display","none");
	*/
	var layerlist = $('#layersList');
	layerlist.jqxGrid('clearselection');
	
	
}

function expandResultDetails(){
	propertiesVisibility("infoAnalysis",true);
	if (!$("#resultsTabButton").is(":visible")){
		$("#resultsTabButton").show();
	}	
		
	
}

function collapseResultDetails(){
	propertiesVisibility("infoAnalysis",false);
		
}

function expandMapProperties(){
	createMapProperties();
	if (finishApplicationLoad){
	
		propertiesVisibility("mapsPropertiesCont",true);
		$("#mapsProperties").jqxNavigationBar('expandAt',0);
		$("#mapsList").bind("select",expandMapProperties);
	}
}

function collapseMapProperties(){
	
	propertiesVisibility("mapsPropertiesCont",false);
}

function expandFilters(){
	propertiesVisibility("filterAnalysis",true);	
}

function collapseFilters(){
	propertiesVisibility("filterAnalysis",false);	
}


function toggleStylerButton(mode){
	var onButton;
	var offBtn1, offBtn2;
	var onDiv;
	var offDiv1, offDiv2;
	var arrowBtn;
	var mycolor;
	switch(mode){
		case 'Point':
			onButton = $("#pointStyleButton");
			offBtn1 = $("#lineStyleButton");
			offBtn2 = $("#polygonStyleButton");
			onDiv = "markerChooseStyle";
			offDiv1 = "polylineChooseStyle";
			offDiv2 = "polygonChooseStyle";
			mycolor="blue";
			break;
		case 'Line':
			onButton = $("#lineStyleButton");
			offBtn1 = $("#pointStyleButton");
			offBtn2 = $("#polygonStyleButton");
			onDiv = "polylineChooseStyle";
			offDiv1 = "markerChooseStyle";
			offDiv2 = "polygonChooseStyle";
			mycolor="green";
			break;
		case 'Polygon':
			onButton = $("#polygonStyleButton");
			offBtn1 = $("#lineStyleButton");
			offBtn2 = $("#pointStyleButton");
			onDiv = "polygonChooseStyle";
			offDiv1 = "polylineChooseStyle";
			offDiv2 = "markerChooseStyle";
			mycolor="purple";
			break;
	}
	/*
	$("#"+onDiv).css("display","block");
	$("#"+offDiv1).css("display","none");
	$("#"+offDiv2).css("display","none");
	*/
}

function MakeTimeout(fn,data,timeout,oThis){
	
	setTimeout(function(){fn.call(oThis,data);},timeout);
}

function buildDBSearchSource(dataAdapter)
{
	var selectElement = $("#databaseAnalysis").find(".criteriaFirstRow").find(".dbTableName")[0];
	var data = dataAdapter.records;
	var source=new Array();
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		var label = item.layerNAME;
		var row = {};
		row["name"]=label;
		//row["value"]=label;
		row["value"]=item.layerTABLE;
		source.push(row);
	}
	mygis.Utilities.populateSelect(selectElement,source);
}


/***
* Pure magic :)
*
*/
function buildFontSource(fontname,colNumber){
	var retvalue = [];
	var rowItem;
	var hexValue;
	var rowNumber = parseInt(224/colNumber);	//256 -32 control characters
	if ((224%colNumber)!=0){rowNumber+=1;}
	switch (fontname){
		case 'Wingdings':
			for (var i=1;i<=rowNumber;i++){
				rowItem={};
				for (var j=1;j<=colNumber;j++){
					var picrow = parseInt((((i-1)*colNumber)+j) / 16);
					var piccol = (((i-1)*colNumber)+j)%16;
					//hexValue=32+(i*j);
					hexValue = 32 + (picrow*16) + piccol;
					rowItem["_"+j.toString()]="0x"+hexValue.toString(16);
				}
				retvalue.push(rowItem);
			}
			break;
	}
	return retvalue;
}

function buildLibrarySource(mode,colNumber){
	var retvalue = [];
	var rowItem;
	
	var rowNumber ;	//= parseInt(layer
	switch (mode){
		case "currentMap":
			var mysymbols = mygis.Map.getUniqueGraphics();
			var symbolCount = mysymbols.length;
			var lowestLoop = colNumber<symbolCount?colNumber:symbolCount;
			var itemEntered;
			rowNumber = parseInt(symbolCount/colNumber);
			if ((symbolCount%colNumber)!=0){rowNumber+=1;}
			for (var i=1;i<=rowNumber;i++){
				rowItem={};
				itemEntered=false;
				for (var j=1;j<=lowestLoop;j++){
					var actualItemIndex = ((i-1)*symbolCount)+j-1;
					var actualItem = mysymbols[actualItemIndex];
					rowItem["_"+j.toString()]=mygis.Utilities.format("{0}#{1}",actualItem.layer,actualItem.graphicUrl);
				};
				retvalue.push(rowItem);
			}
			break;
	}
	return retvalue;
}

function updateMapProperties(event)
{
	
	var selectedItem = $("#mapsList").jqxListBox('getSelectedItem'); 
	if (selectedItem){
		var data = selectedItem.originalItem;
		$("#layerMapTitle").html(data.mapName);
		$("#mapShortDescription").html(data.mapDescription);
		if (data.mapDescription){
			$("#mapShortDescription").show();
		}else{
			$("#mapShortDescription").hide();
		}
		document.getElementById("mapLargeThumb").src = config.folderPath+"GetImage.ashx?qType=mapThumb&qSize=300&qContents="+data.id;
		$("#mapLayerCount").html(data.mapLayerCount);
		
		$("#mapCreatedDate").html(data.mapCreateDate);
		$("#mapUpdateDate").html(data.mapUpdateDate);
		$("#mapOwner").html(data.mapOwner);
		$("#mapDeveloper").html(data.mapDevelopedBy);
		
	}

	return false;
}

function updateLayerProperties()
{
	var selectedItem = $("#layersList").jqxTree('selectedItem'); 
	
}

function createMapListTips()
{
	var found=$("#mapsList").find("#listBoxContent>div>div");
	if (found.length==0){setTimeout(createMapListTips,500);}
	else{
		
		found.addClass('listFullWidth');
		var objArray = $("#mapsList").jqxListBox('getItems');
		for (var i=0;i<objArray.length;i++){
			try{
			var item = objArray[i].element;
			var itemData = objArray[i].originalItem;
			
			if (itemData.defaultLoad!="false"){
				var found2 = $(item).parent().find('.mapsListButtons');
				if (found2.length==0){
					var appendButtons = $('<div />');
					appendButtons.addClass('mapsListButtons');
					var starButton = $('<a />');
					starButton.addClass('starButton');
					starButton.attr("title",strings.MapControl.currentMap);
					appendButtons.append(starButton);
					appendButtons.insertBefore(item);
				}
			}
					
			}catch(err){
			
				console.log(err);
			}
		};
		if (!mapsBound){
			$('#mapsList').bind('change', function (event){
				updateMapProperties(event);
			});
			mapsBound = true;
		}
		var previousIndex=$("#mapsList").jqxListBox('getSelectedIndex');
		$("#mapsList").jqxListBox('clearSelection'); 
		$("#mapsList").jqxListBox('selectIndex',previousIndex);
	}
}

function setUpQTips() {
    singleQTip("cosmetic");
	//singleQTip("mapActionsBtn");
	//singleQTip("mapAction_Maps");
	//singleQTip("mapAction_Layers");
	//singleQTip("mapAction_Tables");
	singleQTip("mapSaveBtn");
	singleQTip("mode_TopSelect");
	singleQTip("mode_InfoSelect");
	singleQTip("mode_InfoStore");
	singleQTip("mode_AddSelect");
	singleQTip("mode_SubtractSelect");
	singleQTip("editModeCopy");
	singleQTip("editModePaste");
	singleQTip("editModeDelete");
	singleQTip("editModeDrag");
	singleQTip("editModeRotate");
	singleQTip("editModeResize");
	singleQTip("editModeReshape");
	singleQTip("mode_EditableInfo");
	singleQTip("mode_Grouping");
	singleQTip("mode_Snap");
	singleQTip("dragPanBtn");
	singleQTip("zoomBoxBtn");
	singleQTip("zoomOutBtn");
	singleQTip("toggleInfoBtn");
	singleQTip("selectObject");
	singleQTip("infoTool");
	singleQTip("selectRect");
	singleQTip("selectCircle");	//JK CHANGES
	singleQTip("selectClear");
	singleQTip("markerButton");
	singleQTip("polylineButton");
	singleQTip("polygonButton");
	singleQTip("rectangleButton");
	singleQTip("mapActionsBtn");
	
}

function singleQTip(tipped,params) {
    var message; 
    var containerSelector;
    var posMy = "top left";
    var posAt = "bottom right";
    var defaultTarget=false;
    var defaultEvent = 'click';
    var defaultReady = false;
    var defaultHide = 'mouseleave unfocus';
    var destroyAfter = false;
	var defaultInactive = 3000;
    switch (tipped){
		case "editField":
			message = params.message;
			containerSelector= params.element;
			defaultEvent = 'mouseover click';
			defaultReady = false;
			destroyAfter = false;
			posMy = 'left center';
			posAt = "right center";
			defaultInactive = 6000;
			defaultHide = 'click unfocus'
			break;
		case "polygon":
		case "marker":
        case "polyline":
		case "rectangle":
            message = params[1];
            containerSelector = "<div />";
            posMy = "top center";
            //at = "right middle";
            var pixel = params[0];
            // Grab marker position

            var offsetB = $('#mapContainer').offset();
            var offTop = offsetB.top;
            var offLeft = offsetB.left;
            var pos = [offLeft + pixel.x, offTop + pixel.y + 10];

            defaultTarget = pos;
            defaultReady = true;
            defaultEvent = 'mouseover';
            defaultHide = 'mouseleave unfocus';
            destroyAfter = true;
            break;
                      
		case "cosmetic":
			message = strings.LayerControl.tipEdit;
			containerSelector = $("#cosmeticPanel").find("div.RadListBox");
			defaultEvent = "mouseover";
			posMy="bottom center";
			posAt = "top center";
			break;
		case "mapActionsBtn":
		case "mapAction_Maps":
		case "mapAction_Layers":
		case "mapAction_Tables":
		case "mapSaveBtn":
			containerSelector = $("#"+tipped);
			defaultEvent = "mouseover";
			posMy = "bottom center";
			posAt = "top center";
			//Only message changes:
			switch (tipped){
				case "mapActionsBtn":
					message = tip_btnErgaleia;
					break;
				case "mapAction_Maps":
					message = tip_btnMaps;
					break;
				case "mapAction_Layers":
					message = tip_btnLayers;
					break;
				case "mapAction_Tables":
					message = tip_btnTables;
					break;
				case "mapSaveBtn":
					message = tip_btnSave;
					break;
			}
			break;
		case "mapList":
			containerSelector=$(params[0]);
			defaultEvent = "mouseover";
			posMy = "bottom center";
			posAt = "top center";
			message = params[1];
			break;
		case "projection":
			containerSelector=$("#map_projection_node");
			defaultEvent = "mouseover";
			posMy = "bottom center";
			posAt = "top center";
			message = params[0];
			break;
		case "tip_MacroName":
			containerSelector = $("#tip_MacroName");
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = params[0];			
			break;
		case "tip_MacroSelector":
			containerSelector = $("#tip_MacroSelector");
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = params[0];
			break;
		case "tip_MacroButton":
			containerSelector = $("#tip_MacroButton");
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = params[0];			
			break;
		case "tip_MacroRegistered":
			containerSelector = $("#tip_MacroRegistered");
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = params[0];
			break;
		case "tip_MacroApp":
			containerSelector = $("#tip_MacroApp");
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = params[0];
			break;
		case "mode_TopSelect":
		case "mode_InfoSelect":
		case "mode_InfoStore":
		case "mode_AddSelect":
		case "mode_SubtractSelect":
		case "editModeCopy":
		case "editModePaste":
		case "editModeDelete":
		case "editModeDrag":
		case "editModeRotate":
		case "editModeResize":
		case "editModeReshape":
		case "mode_EditableInfo":
		case "mode_Grouping":
		case "mode_Snap":
			containerSelector = ("#"+tipped);
			defaultEvent = "mouseover";
			posMy = "left center";
			posAt = "right center";
			message = strings.MapTools[tipped];
			break;
		case "dragPanBtn":
		case "zoomBoxBtn":
		case "zoomOutBtn":
		case "toggleInfoBtn":
		case "selectObject":
		case "infoTool":
		case "selectRect":
		case "selectCircle":	//JK CHANGES
		case "selectClear":
		case "markerButton":
		case "polylineButton":
		case "polygonButton":
		case "rectangleButton":
		case "mapActionsBtn":
			containerSelector = ("#"+tipped);
			defaultEvent = "mouseover";
			posMy = "bottom center";
			posAt = "top center";
			message = strings.MapTools[tipped];
			break;
		case "switchBG":
			containerSelector = params[0];
			defaultEvent = "mouseover";
			posMy = "right center";
			posAt = "left center";
			message = strings.LayerControl.tip_ChangeBG_cb;
			defaultReady = true;
            defaultEvent = 'mouseover';
            //defaultHide = 'mouseleave unfocus';
            destroyAfter = true;
			defaultInactive = 6000;
			break;
		case "mapResultsToggler":
			containerSelector = "#panel2 .ui-layout-toggler";
			message = strings.HelpSystem.mapResults;
			posMy = "bottom center";
			posAt = "top center";
			defaultHide= 'click';
			defaultEvent= 'mouseover';
			defaultReady=true;
			
			break;
		
    }
    $(containerSelector).qtip({
        content: {
            text: message
        },
        position: {
            my: posMy,
            at: posAt,
            viewport: $(window),
            target: defaultTarget
        },
        show: {
            event: defaultEvent,
            ready: defaultReady,
            solo: true,
			delay: 1000
        },
        hide: {
            event: defaultHide,
            inactive: defaultInactive
        },
        events: {
            hide: function(event, api) {
                if (destroyAfter) {
                    api.destroy();
                }
            }
        },
        style: {
            classes: 'ui-tooltip-shadow', // Optional shadow...
            tip: {
                border: 1
            },
            border: 1
        }
    });
}

function setMarkerStyleTree(){
	var thetree = $("#markerFolders").jstree(
		{
		"html_data":{
			"ajax": {
				"url": config.folderPath+"Scripts/markerStyleTree.html",
				"data": function(n){
					return {id: n.attr ? n.attr("id"): 0};
				}
			}
		},
		"themes":{
			"theme":"pk",
			"dots": false,
			"icons": false
		},
		"ui":{
			"initially_select": ["nodeDefault"],
			"select_limit": 1
		},
		"plugins": ["themes","html_data","ui"]
		}
	
	);
	thetree.bind("select_node.jstree",function(e,data){
		var tree=data.inst;
		var clicked = data.rslt.obj;
		var parentText,text;
		var has_parent;
		if (tree.is_leaf(clicked)){
			has_parent = tree._get_parent(clicked);
			text=tree.get_text(clicked);
			if (has_parent===-1){
				//has no parent, so call this:
				//mygis.UI.populateMarkerIcons(text);
			}else{
				parentText = tree.get_text(has_parent);
				//mygis.UI.populateMarkerIcons(parentText,text);
			}
			
		}else{
			tree.toggle_node(clicked);
		}
	});
}


function showConfirmationDialog(actionstring,callbackYes,callbackNo)
{
	$("#confirmationAction").html(actionstring);
	$("#confirmationBox").dialog({
		'buttons': {
			'Confirm': {
				'text': strings.ConfirmBox.buttonConfirm,
				'class': 'confirmButton',
				'click': function(){
					closeConfirm();
					if (callbackYes){
						callbackYes();
					}
				}
			},
			'Cancel': {
				'text': strings.ConfirmBox.buttonCancel,
				'class': 'cancelButton',
				'click': function(){
					closeConfirm();
					if (callbackNo){
						callbackNo();
					}
				}
			}
		},
		modal: true,
		draggable: false,
		resizable: false
	}).siblings('div.ui-dialog-titlebar').remove();

}

function showEditFieldDialog(layername,columnname,existingValue,recordNumber,callbackYes){
	$("#editRecordNo").html("#"+recordNumber);
	$("#editLayerName").html(layername);
	$("#fieldColumnName").html(columnname);
	$("#fieldEditor").attr("value",existingValue);
	
	$("#editFieldBox").dialog({
		modal: true,
		draggable: true,
		resizable: false,
		open: mygis.Utilities.unbindGlobalHandlers,
		close: mygis.Utilities.rebindGlobalHandlers
	}).siblings('div.ui-dialog-titlebar').remove();
}

function editRouter(){
	var mydata = $(this).data("attachedData");
	showEditFieldDialog(mydata.layername,mydata.fieldname,mydata.existingValue,mydata.recordIndex);
};

function closeConfirm(){
	$("#confirmationBox").dialog('close');
}


function fixLayerList(){
	//$("#layersList").jqxGrid('width',240);
	//$("#layersList").jqxGrid('width',241);
	//$("#infoLeftList").jqxListBox('height','99%');
	//$("#infoLeftList").jqxListBox('height','100%');
	
	
}

function layerGridRendered(){
	//console.log("rendered");
	
	
	
}


jQuery.fn.animateStrikethrough = function(speed, callback){
  return this.each(function(){
    if(jQuery(this).find('.strike').length == 0) {
      jQuery(this).wrapInner("<span class='letters-left'></span>");
      jQuery(this).prepend("<span class='strike'></span>");
    }
    
    var line = jQuery(this);
    var strike = jQuery(line).find('.strike');
    var left = jQuery(line).find('.letters-left');

    strikethrough = setInterval(function () {
      jQuery(line).strikeThroughFirstLetter();
      if(jQuery(left).text().length == 0) {
        jQuery(line).addClass('strike');
        //jQuery(line).text(jQuery(line).find('.strike').text());
        clearInterval(strikethrough);
        if(typeof callback == "function") callback();
      }
    }, speed);
  });
};

jQuery.fn.strikeThroughFirstLetter = function(){
  return this.each(function(){
    jQuery(this).find('.strike').transposeFirstLetter(jQuery(this).find('.letters-left'));
    jQuery(this).find('.letters-left').removeFirstLetter();
  });
};

jQuery.fn.transposeFirstLetter = function(toTransposeTo){
  return this.each(function(){
    
    var replacementText = jQuery(this).text() + jQuery(toTransposeTo).text().charAt(0);
    jQuery(this).text(replacementText);
  });
};

jQuery.fn.removeFirstLetter = function(){
  return this.each(function(){
    var replacementText = jQuery(this).text().replace(/^./, '');
    jQuery(this).text(replacementText);
  });
};




var notSupportedBrowsers = [{'os': 'Any', 'browser': 'MSIE', 'version': 9}, {'os': 'Any', 'browser': 'Firefox', 'version': 3}];
var displayPoweredBy = false;
var noticeLang = 'pk';
var noticeLangCustom = null;
var supportedBrowsers = [];

var BrowserDetection = {
	init: function(){
		if(notSupportedBrowsers == null || notSupportedBrowsers.length < 1){
			notSupportedBrowsers = this.defaultNotSupportedBrowsers;
		}
		
		this.detectBrowser();
		this.detectOS();
		
		if(this.browser == '' || this.browser == 'Unknown' || this.os == '' || 
		   this.os == 'Unknown' || this.browserVersion == '' || this.browserVersion == 0)
		{
			return;
		}
		
		// Check if this is old browser
		var oldBrowser = false;
		for(var i = 0; i < notSupportedBrowsers.length; i++){
			if(notSupportedBrowsers[i].os == 'Any' || notSupportedBrowsers[i].os == this.os){
				if(notSupportedBrowsers[i].browser == 'Any' || notSupportedBrowsers[i].browser == this.browser){
					if(notSupportedBrowsers[i].version == "Any" || this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)){
						oldBrowser = true;
						break;
					}
				} 
			}
		}
		
		if(oldBrowser){
			this.displayNotice();
		}
	},
	
	getEl: function(id){ return window.document.getElementById(id); },
	getElSize: function(id){ 
		var el = this.getEl(id); 
		if(el == null){ return null; } 
		return { 'width': parseInt(el.offsetWidth), 'height': parseInt(el.offsetHeight) }; 
	},
	getWindowSize: function(){
		if(typeof window.innerWidth != 'undefined'){
			return {'width': parseInt(window.innerWidth), 'height': parseInt(window.innerHeight)};
		} else {
			if(window.document.documentElement.clientWidth != 0){
				return {'width': parseInt(window.document.documentElement.clientWidth), 'height': parseInt(window.document.documentElement.clientHeight)};
			} else {
				return {'width': parseInt(window.document.body.clientWidth), 'height': parseInt(window.document.body.clientHeight)};
			}
		}
	},
	positionNotice: function(){
		var noticeSize = this.getElSize('browser-detection');
		var windowSize = this.getWindowSize();
		var noticeEl = this.getEl('browser-detection');
		
		if(noticeEl == null || noticeSize == null || windowSize == null || !windowSize.width || !windowSize.height){ return; }
		noticeEl.style.left = (windowSize.width - noticeSize.width) / 2 + "px";
		
		var offset = (this.browser == "MSIE" && this.browserVersion < 7) ? (window.document.documentElement.scrollTop != 0 ? window.document.documentElement.scrollTop : window.document.body.scrollTop) : 0;
		noticeEl.style.top = (windowSize.height - noticeSize.height - 20 + offset) + "px";
		this.noticeHeight = noticeSize.height;
	},
	
	displayNotice: function(){
		/* --DISPLAY ALWAYS--
		if(this.readCookie('bdnotice') == 1){
			return;
		}
		*/
		this.writeNoticeCode();
		this.positionNotice();
		
		var el = this;
		
		if(this.browser == "MSIE" && this.browserVersion < 10){
			window.onscroll = function(){ el.positionNotice(); };
		}
		
		this.getEl('browser-detection-close').onclick = function(){ el.remindMe(false); };
		this.getEl('browser-detection-remind-later').onclick = function(){ el.remindMe(false); };
		this.getEl('browser-detection-never-remind').onclick = function(){ el.remindMe(true); };
	},
	
	remindMe: function(never){
		this.writeCookie('bdnotice', 1, never == true ? 365 : 7);
		this.getEl('browser-detection').style.display = 'none';
		this.getEl('black_overlay').style.display = 'none';
	},
	
	writeCookie: function(name, value, days){
		var expiration = ""; 
		if(parseInt(days) > 0){
			var date = new Date();
			date.setTime(date.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);
			expiration = '; expires=' + date.toGMTString();
		}
		
		document.cookie = name + '=' + value + expiration + '; path=/';
	},
	
	readCookie: function(name){
		if(!document.cookie){ return ''; }
		
		var searchName = name + '='; 
		var data = document.cookie.split(';');
		
		for(var i = 0; i < data.length; i++){
			while(data[i].charAt(0) == ' '){
				data[i] = data[i].substring(1, data[i].length);
			}
			
			if(data[i].indexOf(searchName) == 0){ 
				return data[i].substring(searchName.length, data[i].length);
			}
		}
		
		return '';
	},
	
	writeNoticeCode: function(){
		var title = '';
		var notice = '';
		var selectBrowser = '';
		var remindMeLater = '';
		var neverRemindAgain = '';
		
		var browsersList = null;		
		var code = '<div id="black_overlay"></div><div id="browser-detection"><a href="javascript:;" id="browser-detection-close">Close</a>';
		
		if(noticeLang == 'custom' && noticeLangCustom != null){
			title = noticeLangCustom.title;
			notice = noticeLangCustom.notice;
			selectBrowser = noticeLangCustom.selectBrowser;
			remindMeLater = noticeLangCustom.remindMeLater;
			neverRemindAgain = noticeLangCustom.neverRemindAgain;
		} else {
			var noticeTextObj = null;
			eval('noticeTextObj = this.noticeText.' + noticeLang + ';');
			
			if(!noticeTextObj){
				noticeTextObj = this.noticeText.professional;
			}
			
			title = noticeTextObj.title;
			notice = noticeTextObj.notice;
			selectBrowser = noticeTextObj.selectBrowser;
			remindMeLater = noticeTextObj.remindMeLater;
			neverRemindAgain = noticeTextObj.neverRemindAgain;
		}
		
		notice = notice.replace("\n", '</p><p class="bd-notice">');
		notice = notice.replace("{browser_name}", (this.browser + " " + this.browserVersion));
		
		code += '<p class="bd-title">' + title + '</p><p class="bd-notice">' + notice + '</p><p class="bd-notice"><b>' + selectBrowser + '</b></p>';
		
		if(supportedBrowsers.length > 0){
			browsersList = supportedBrowsers;
		} else {
			browsersList = this.supportedBrowsers;
		}
		
		code += '<ul class="bd-browsers-list">';
		for(var i = 0; i < browsersList.length; i++){
			code += '<li class="' + browsersList[i].cssClass + '"><a href="' + browsersList[i].downloadUrl + '" target="_blank">' + browsersList[i].name + '</a></li>';
		}		
		code += '</ul>';
		
		if(displayPoweredBy){
			code += '<div class="bd-poweredby">Powered by <a href="http://www.devslide.com/labs/browser-detection" target="_blank">DevSlide Labs</a></div>';
		}
		/*
		code += '<ul class="bd-skip-buttons">';
		code += '<li><button id="browser-detection-remind-later" type="button">' + remindMeLater + '</button></li>';
		code += '<li><button id="browser-detection-never-remind" type="button">' + neverRemindAgain + '</button></li>';
		code += '</ul>';
		*/
		code += '</div>';
		window.document.body.innerHTML = code;
	},

	detectBrowser: function(){
		this.browser = '';
		this.browserVersion = 0;
		
		if(/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Opera';
		} else if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			this.browser = 'MSIE';
		} else if(/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Netscape';
		} else if(/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Chrome';
		} else if(/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Safari';
			/Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
			this.browserVersion = new Number(RegExp.$1);
		} else if(/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
			this.browser = 'Firefox';
		}
		
		if(this.browser == ''){
			this.browser = 'Unknown';
		} else if(this.browserVersion == 0) {
			this.browserVersion = parseFloat(new Number(RegExp.$1));
		}		
	},
	
	// Detect operation system
	detectOS: function(){
		for(var i = 0; i < this.operatingSystems.length; i++){
			if(this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) != -1){
				this.os = this.operatingSystems[i].name;
				return;
			}
		}
		
		this.os = "Unknown";
	},
	
	//	Variables
	noticeHeight: 0,
	browser: '',
	os: '',
	browserVersion: '',
	supportedBrowsers: [
	       { 'cssClass': 'firefox', 'name': 'Mozilla Firefox', 'downloadUrl': 'http://www.getfirefox.com/' },
	       { 'cssClass': 'chrome', 'name': 'Google Chrome', 'downloadUrl': 'http://www.google.com/chrome/' },
	       { 'cssClass': 'msie', 'name': 'Internet Explorer', 'downloadUrl': 'http://www.google.com/chromeframe/eula.html?quickenable=true/' },
	       { 'cssClass': 'opera', 'name': 'Opera', 'downloadUrl': 'http://www.opera.com/' }
	],
	operatingSystems: [
           { 'searchString': navigator.platform, 'name': 'Windows', 'subStr': 'Win' },
           { 'searchString': navigator.platform, 'name': 'Mac', 'subStr': 'Mac' },
           { 'searchString': navigator.platform, 'name': 'Linux', 'subStr': 'Linux' },
           { 'searchString': navigator.userAgent, 'name': 'iPhone', 'subStr': 'iPhone/iPod' }
	],
	defaultNotSupportedBrowsers: [{'os': 'Any', 'browser': 'MSIE', 'version': 8}],
	noticeText: {
    	   'professional': { "title": "Not suppported Browser Detected", "notice": "Our website has detected that you are using an outdated or not supported browser. Using your current browser will prevent you from accessing features on our website. An upgrade is not required, but is strongly recommend to improve your browsing experience on our website.", "selectBrowser": "Use the links below to download a new browser or upgrade your existing browser.", "remindMeLater": "Remind me later", "neverRemindAgain": "No, don't remind me again" },
    	   'pk': { "title": "Not suppported browser detected", "notice": "Our website has detected that you are using an outdated or not supported browser. Using your current browser will prevent you from accessing features on our website. An upgrade is required.", "remindMeLater": "Remind me later", "neverRemindAgain": "No, don't remind me again" },
    	   'informal': { "title": "Whoaaa!", "notice": "It appears you're using an outdated browser which prevents access to some of the features on our website. While it's not required, you really should <b>upgrade or install a new browser</b>!", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Not now, but maybe later", "neverRemindAgain": "No, don't remind me again" },
    	   'technical': { "title": "Old Browser Alert! <span class='bd-highlight'>DEFCON 5</span>", "notice": "Come on! If you are hitting our site, then you must at least be partially tech savvy. So, why the older browser? We're not asking you to brush off your old Fibonacci Heap and share it with the class. Just upgrade!\nI know, I know. You don't like to be told what to do. But, we're only asking you to upgrade so you can access all the latest, greatest features on our site. It's quick and easy. But, if you still want to skip it, that's cool. We will still welcome you &mdash; and your creepy old browser. :P", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Remind me later", "neverRemindAgain": "No, don't remind me. I like my Commodore 64!" },
    	   'goofy': { "title": "Are You Serious?", "notice": "Are you really using <b>{browser_name}</b> as your browser?\nYou're surfing the web on a dinosaur (a dangerous one too &mdash; like a Tyrannosaurus or Pterodactyl or something scary like that). <b>Get with it and upgrade now!</b> If you do, we promise you will enjoy our site a whole lot more. :)", "selectBrowser": "Visit the official sites for popular browsers below:", "remindMeLater": "Maybe Later", "neverRemindAgain": "No, don't remind me again" },
    	   'mean': { "title": "Umm, Your Browser Sucks!", "notice": "Get a new one here.", "selectBrowser": "Official sites for popular browsers:", "remindMeLater": "Remind me later, a'hole", "neverRemindAgain": "F' off! My browser rocks!" }
	}
};

window.onload = function(){
	BrowserDetection.init();
};


$(document).ready(function(){
	layout = $('#applicationContainer').layout({
		north__closable:false
	,	spacing_open: 0
	,	spacing_closed: 0
	,	west__onresize:	function(pane_name,pane_element,pane_state,pane_options,layout_name){fixLayerList();}
	,	center__onresize: function(pane_name,pane_element,pane_state,pane_options,layout_name){digimap.updateSize();$.layout.callbacks.resizePaneAccordions(pane_name,pane_element);}
	});
	panel1=$('#panel1').layout({
		north__size: 87+13    //345
	,   north__resizable: false
	,	north__closable:false	
	});
	/*
	maplayout= $('#panel2').layout({
		south__size:      190
	,   south__resizable: true
	,	south__closable:true
	,	south__initHidden: false
	,	south__initClosed: true
	
	});
	*/
	singleQTip("mapResultsToggler");
	//replace_initialLogo();
	// Stores past URLs that failed to load. Used for a quick lookup
	// and because `onerror` is not triggered in some browsers
	// if the response is cached.
	window.errors = {};
  
	// Check the existence of an image file at `url` by creating a
	// temporary Image element. The `success` callback is called
	// if the image loads correctly or the image is already complete.
	// The `failure` callback is called if the image fails to load
	// or has failed to load in the past.
	window.checkImage = function (url, success, failure) {
	  var img = new Image(), // the
		  loaded = false,
		  errored = false;
  
	  // Run only once, when `loaded` is false. If `success` is a
	  // function, it is called with `img` as the context.
	  img.onload = function () {
			if (loaded) {
			  return;
			}
  
			loaded = true;
  
			if (success && success.call) {
			  success.call(img,img);
			}
		  };
  
	  // Run only once, when `errored` is false. If `failure` is a
	  // function, it is called with `img` as the context.
	  img.onerror = function () {
			if (errored) {
			  return;
			}
  
			window.errors[url] = errored = true;
  
			if (failure && failure.call) {
			  failure.call(img,img);
			}
		  };
  
	  img.src = url;
  
	  // If `url` is in the `errors` object, trigger the `onerror`
	  // callback.
	  if (window.errors[url]) {
		img.onerror.call(img,img);
	  }
  
	  // If the image is already complete (i.e. cached), trigger the
	  // `onload` callback.
	  if (img.complete) {
		img.onload.call(img);
	  }
	};
	
	$("#dialog-extend-fixed-title").bind('click',mygis.UI.toggleInfoGroup);
	
    ui_setup();
	
	
});



function replace_initialLogo(){
	var domainLogo = $("#logoPane").parent().find(".domainLogoWrapper2 img")[0];
	var startLogo = $("#initialLoad").find(".mygis_logo img")[0];
	if (domainLogo.src){
		startLogo.src=domainLogo.src;
	}
}

function ui_setup()
{
	mygis.Utilities.blockUI(true);
	//$('a[title]').qtip();
	//$("#mapDescription").button().click(function(){router('shortcutMaps');});;
	$("#mapChangeBtn").click(function(){router('shortcutMaps');});
	
	mygis.UI.resetLoadFeedback();
	mygis.UI.feedback(strings.Coding.loadingStep1);
	setTimeout(function(){
	mygis.UI.initializeStyleSheets();
	
	$("#olScaleLine_wrapper").find(".olControlScaleLineTop").css({
		visibility: "visible !important"
	});
	
	//playVideo();
		
    $('.backBtn').button();
	$('.forwardBtn').button();
	$('#polylineStrokeColor').bind('colorpicked', function () {
      mygis.UI.updateLinePreview();
    });
	$('#polygonStrokeColor').bind('colorpicked', function () {
      mygis.UI.updatePolyPreview();
    });
	$('#polygonFillColor').bind('colorpicked', function () {
      mygis.UI.updatePolyPreview();
    });
	//------- Layer------------
	$("#layerOpacitySlider").slider({
		max: 1,
		min: 0,
		value: 0,
		step: 0.25,
		slide: mygis.UI.changeLayerOpacity
	});
	
	
	//--------Marker-----------
	$('#markerSizeSlider').slider({
		max: 128,
		min: 8,
		step: 1,
		value: 32,
		slide: mygis.UI.changeMarkerSize
	});
	$("#pointColumns").jqxNumberInput({
		width: '50px',
		height: '25px',
		decimal: 5,
		min: 1,
		max: 7,
		decimalDigits: 0,
		spinButtons: true,
		inputMode: 'simple',
		theme: 'energyblue'
	});
	$("#pointColumns").bind('valuechanged',function(){
		var fontSelect = document.getElementById("pointFontFamily");
		var font = fontSelect.options[fontSelect.options.selectedIndex].value;
		mygis.UI.populatePointIcons('font',font);
	});
	$("#pointBorderSlider").slider({
		max: 32,
		min: 1,
		value: 1,
		step: 1,
		slide: mygis.UI.changePointBorder
	});
	$("#pointOpacitySlider").slider({
		max: 1,
		min: 0,
		value: 0,
		step: 0.25,
		slide: mygis.UI.changePointOpacity
	});
	//--------Polyline-----------
	$('#lineStrokeOpacitySlider').slider({
		max: 1,
		min: 0,
		step: 0.25,
		value: 1,
		slide: mygis.UI.changeLineOpacity
	});
	$('#lineStrokeWeightSlider').slider({
		max: 32,
		min: 1,
		value: 3,
		step: 1,
		slide: mygis.UI.changeLineWeight
	});
	//--------Polygon-----------
	$('#polygonStrokeOpacitySlider').slider({
		max: 1,
		min: 0,
		step: 0.25,
		value: 1,
		slide: mygis.UI.changePolyStrokeOpacity
	});
	$('#polygonFillOpacitySlider').slider({
		max: 1,
		min: 0,
		step: 0.25,
		value: 0.5,
		slide: mygis.UI.changePolyFillOpacity
	});
	$('#polygonStrokeWeightSlider').slider({
		max: 32,
		min: 1,
		value: 3,
		step: 1,
		slide: mygis.UI.changePolyWeight
	});
	
	//--------------------------------
    $('.saveActionLine').find('.forwardBtn').button()
        .bind('click', saveAndClose);

    $('#login_btn').hover(
        function() {
            $('#login_btn').stop().animate({ backgroundPosition: "138px 0px" }, 900);
            $('#login_btn').css({ backgroundColor: "white" });
        }
    );

    $('#login_btn').mouseout(
        function() {
            $('#login_btn').stop().animate({ backgroundPosition: "0 0" }, 900);
            $('#login_btn').css({ backgroundColor: "#F2F2F2" });
        }
    );

    $('#Notification')

        .jnotifyInizialize({

            oneAtTime: true,

            appendType: 'append'

        })

        .css({ 'position': 'fixed',
			/*
            'top': '65px',

            'right': '433px',

            'width': 'auto',
			'left': '145px',
			*/
			/*
			'bottom': '5px',
			'right': '15px',
			*/
			/*plaka den ehei pou alli douleia den ehoume kai ta pame giro giro? */
			'top': '1px',
			'left': '50%',
			'margin-left': '-250px',
			'width': '500px',
            'z-index': '100000',
			
			
			'padding-top': '5px'

        }).appendTo($("#Body"));
    $('#mapActionsBtn').bind('click', function() {
        if (!toolbarToggling) {
            toolbarToggling = true;
            if ($("#fWindowWrapper").is(":visible")) {
                $("#fWindowWrapper").hide("slide", { direction: "up" }, 1000, function() { toolbarToggling = false; });
				//$("#fWindowWrapper").hide();
                document.getElementById("mapActionsBtn").setAttribute("class", "");
                document.getElementById("mapActionsBtn").setAttribute("className", "");
				$("#rsideSplitter").jqxSplitter('collapseAt',0);
            } else {
                //closeToolbars("mapToolbar");
                $("#fWindowWrapper").show("slide", { direction: "up" }, 1000, function() { toolbarToggling = false; });
				//$("#fWindowWrapper").show();
                document.getElementById("mapActionsBtn").setAttribute("class", "pressed");
                document.getElementById("mapActionsBtn").setAttribute("className", "pressed");
				$("#rsideSplitter").jqxSplitter('expandAt',0);

            }
        }

    });
	$('#allListsTabButton').bind('click', function() {
		if (!document.getElementById("panel1").ex_HasClassName("collapsed")){
			document.getElementById("panel1").ex_AddClassName("collapsed");
			document.getElementById("allListsTabButton").ex_RemoveClassName("active");
			document.getElementById("panel2").ex_RemoveClassName("leftExpanded");
			//layout.hide('west');
		}else{
			document.getElementById("panel1").ex_RemoveClassName("collapsed");
			document.getElementById("allListsTabButton").ex_AddClassName("active")
			//layout.show('west');
			document.getElementById("panel2").ex_AddClassName("leftExpanded");
		}
	});
	$('#rpanelCollapseBtn').bind('click', function() {
		if (!document.getElementById("panel3Out").ex_HasClassName("collapsed")){
			document.getElementById("panel3Out").ex_AddClassName("collapsed");
			document.getElementById("rpanelCollapseBtn").ex_RemoveClassName("active");
			//layout.hide('east');
			document.getElementById("panel2").ex_RemoveClassName("rightExpanded");
		}else{
			document.getElementById("panel3Out").ex_RemoveClassName("collapsed");
			document.getElementById("rpanelCollapseBtn").ex_AddClassName("active")
			//layout.show('east');
			document.getElementById("panel2").ex_AddClassName("rightExpanded");
		}
	});
	$("#resultsTabButton").bind('click',function(){propertiesVisibility("infoAnalysis",!document.getElementById("resultsTabButton").ex_HasClassName("active"));});
    $('#mapActionsBtn').click();
	setUpQTips();
	
	var lPanes=$(".leftpanes");
	
	$("#menuTriggerBtn").bind('click',function(){
		
		if (!slideMenuVisible){
			
			lPanes.css({"margin-left":"0px"});
			
			slideMenuVisible=true;
		}
	});
	
	lPanes.bind('mouseenter',function(){
		clearTimeout(impendingSlideClose);
	});
	lPanes.bind('mouseleave',function(){
		
		if (slideMenuVisible){
			lPanes.css({"margin-left":"-195px"});
			slideMenuVisible=false;
		}
	});
	var search=$("#infoAnalysis_SearchInput");
	search.data("oldVal","");
	search.bind('propertychange keyup input paste',mygis.UI.filterSearchResults);
	search.bind('focus',function(){mygis.UI.toggleSearchFilterFocus(true);});
	search.bind('blur',function(){mygis.UI.toggleSearchFilterFocus(false);});
	/*
	if (!tabsInitialized){
		initializeTabs();
	}
	*/
	mygis.UI.feedback(strings.Coding.loadingStep2);
	createMapList();
	mygis.UI.feedback(strings.Coding.loadingStep3,
					  $("#mapsList").jqxListBox('source').records==0);	//if true will say that there's error
	loadMap(true);
	
	},100);
}

function ui_setup_2(error){
	//console.log('ui_setup_2');
	
	mygis.UI.togglePointMode();
	mygis.UI.feedback('');
	//$("#olScale_wrapper").linkselect();
	setTimeout(function(){
		
		
		resultGridButtons = $("<div />");
		setTimeout(function(){initializeTabs();$("#bottomTabContainer").jqxTabs('ensureVisible',0);},1500);
		setTimeout(createMapListTips,1000);
		
		
		finishApplicationLoad=true;
		var mapItem = $("#mapsList").jqxListBox('getSelectedItem').originalItem;
		mygis.Map.switchBackground(mapItem.mapDefaultBG,0);
		setTimeout(function(){
			mygis.Utilities.unblockUI();
			$(document).trigger("initMapFinished");
			$(".blockUI.blockOverlay").animate({opacity: 0},1400);
			$("#page_effect").animate({opacity:1},1400);
			digimap.updateSize();
			$("#pageActionsWrapper").animate({opacity: 1},1400);
			if (Sys.Services.AuthenticationService.get_isLoggedIn()){
				mygis.User.Hooks.initialLoad();
			};
			setTimeout(function(){panel1.sizePane('north',$("#customOverview").height()+$("#bottomTabContainer").height()-4);},2000);
			mygis.Map.moveEnd();
			$(document).trigger('finishedLoading');
			//mygis.UI.Help.showManual();
			
		},1400);
	},1400);
}

/**
 * Loads an html fragment from another source
 * @method loadFragment
 * @param {String} idSelector the id of the object to load
 * @param {Function} callback The function to call when load is complete
 * @param {String} specificElement The id of the specificElement to load inside the html fragment
 * @param {Boolean} stripIDs Whether to strip ids from the loaded fragment
 */
function loadFragment(idSelector,callback,specificElement,stripIDs)
{
	var containerDiv; 
	if (!specificElement){
		containerDiv= $("#"+idSelector);
	}else{
		containerDiv = $(specificElement);
	}
	if (containerDiv.children().length==0){
		//mygis.Utilities.blockUI();
		var suffix = "?qtype="+idSelector;	
		var customUrl = "/mgfrag2.aspx"+suffix+"&language="+Sys.CultureInfo.CurrentCulture.name;
		$.ajax({
			url: customUrl,
			type: 'GET',
			dataType: "html",
			success: function(data) {
				//mygis.Utilities.unblockUI();
				var replacement=$(data).find("#"+idSelector).html();
				if (stripIDs){$(replacement).find("*").removeAttr('id');}
				containerDiv.html(replacement);
				if (callback){
					callback();
				}
			}
		});

		//$("#"+idSelector).load('/mgfrag.aspx #'+idSelector,callback);
	}else{
		callback();
	}
}

function testLocal(evt)
{
	//$("#testLocalBrowse").bind('change',testLocal);
	//$("#testLocal").dialog();
	
	var get = function(id) { return document.getElementById(id); }
	var files = evt.target.files; // FileList object.
// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {
	// Only process image files.
	if (!f.type.match('image.*')) {
	continue;
	}
	/*
	var reader = new FileReader();
	// Need a closure to capture the file information.
	reader.onload = (function(theFile) {
	return function(e) {
	// Render thumbnail.
	document.getElementById("testLocalImg").src=	e.target.result;
	var graphic = new OpenLayers.Layer.Image( 
			'City Lights', 
			document.getElementById("testLocalImg").src, 
			new OpenLayers.Bounds(digimap.getExtent()), 
			new OpenLayers.Size(580, 288) 
		); 
		digimap.addLayer(graphic);  
	
	};
	})(f);
	// Read in the image file as a data URL.
	//reader.readAsDataURL(f);
	*/
	
	document.getElementById("testLocalImg").src=window.URL.createObjectURL(f);
	var manipulateBlob = document.getElementById("testLocalImg").src.split(":");
	var newUrl = manipulateBlob[0]+":"+"http://localhost/"+manipulateBlob[1];
	var graphic = new OpenLayers.Layer.Image( 
			'City Lights', 
			newUrl, 
			new OpenLayers.Bounds(digimap.getExtent()), 
			new OpenLayers.Size(580, 288) 
		); 
		digimap.addLayer(graphic);  
	} 
	
}

(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

Telerik.Web.UI.RadAsyncUpload.prototype._updateFormProperties = function (form) {
	 if (form) {
		 form.enctype = form.encoding = "multipart/form-data";
	 }
 }
 
 



function contextMenu(div){
	var that = this,
		ts = null;

	this.div = div;
	this.items = [];

	// create an item using a new closure
	this.create = function(item){
		var $item = $('<div class="item '+item.cl+'">'+item.label+'</div>');
		$item
		// bind click on item
		.click(function(){
			if (typeof(item.fnc) === 'function'){
				item.fnc.apply($(this), []);
			}
		})
		// manage mouse over coloration
		.hover(
			function(){$(this).addClass('hover');},
			function(){$(this).removeClass('hover');}
		);
		return $item;
	};
	this.clearTs = function(){
		if (ts){
			clearTimeout(ts);
			ts = null;
		}
	};
	this.initTs = function(t){
		ts = setTimeout(function(){that.close()}, t);
	};
}

// add item
contextMenu.prototype.add = function(label, cl, fnc){
	this.items.push({
		label:label,
		fnc:fnc,
		cl:cl
	});
}

// close previous and open a new menu
contextMenu.prototype.open = function(event,hack){
	this.close();
	var k,
	that = this,
	offset = {
	x:0,
	y:0
	},
	$menu = $('<div id="right-menu"></div>');

	// add items in menu
	for(var k=0;k<this.items.length;k++){
		$menu.append(this.create(this.items[k]));
	}

	// manage auto-close menu on mouse hover / out
	$menu.hover(
		function(){that.clearTs();},
		function(){that.initTs(3000);}
	);
	$menu.css({
		'top': event.layerY ,
		'left': event.layerX,
		'position': 'absolute'
	});
	rightmenuOpen = true;
	$(digiContainer).append($menu);
	this.initTs(5000);
	return false;
}

// close the menu
contextMenu.prototype.close = function(){
	this.clearTs();
	rightmenuOpen = false;
	$("#right-menu").remove();

}

var loadGoogleMaps = (function($) {

	var now = $.now(),

	promise;

	return function( version, apiKey, language ) {

		if( promise ) { return promise; }

		//Create a Deferred Object
		var	deferred = $.Deferred(),

		//Declare a resolve function, pass google.maps for the done functions
		resolve = function () {
		deferred.resolve( window.google && google.maps ? google.maps : false );
		},

		//global callback name
		callbackName = "loadGoogleMaps_" + ( now++ ),

		// Default Parameters
		params = $.extend(
			{'sensor': false}
			, apiKey ? {"key": apiKey} : {}
			, language ? {"language": language} : {}
			, {'libraries':'places'}
		);;

		//If google.maps exists, then Google Maps API was probably loaded with the <script> tag
		if( window.google && google.maps ) {

		resolve();

		//If the google.load method exists, lets load the Google Maps API in Async.
		} else if ( window.google && google.load ) {

		google.load("maps", version || 3, {"other_params": $.param(params) , "callback" : resolve});

		//Last, try pure jQuery Ajax technique to load the Google Maps API in Async.
		} else {

		//Ajax URL params
		params = $.extend( params, {
		'v': version || 3,
		'callback': callbackName
		});

		//Declare the global callback
		window[callbackName] = function( ) {

		resolve();

		//Delete callback
		setTimeout(function() {
		try{
		delete window[callbackName];
		} catch( e ) {}
		}, 20);
		};

		//Can't use the jXHR promise because 'script' doesn't support 'callback=?'
		$.ajax({
		dataType: 'script',
		data: params,
		url: 'http://maps.google.com/maps/api/js'
		});

		}

		promise = deferred.promise();

		return promise;
	};

}(jQuery));

function syncMapSelection(sourceID){
	var otherID=sourceID=="mapsList"?"mapsList2":"mapsList";
	$("#"+otherID).jqxListBox('selectIndex',$("#"+sourceID).jqxListBox('getSelectedIndex'));
}