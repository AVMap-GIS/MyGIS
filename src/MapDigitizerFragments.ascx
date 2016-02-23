<%@ Control language="vb" Inherits="YourCompany.Modules.MapDigitizerFragments.MapDigitizerFragments" CodeFile="MapDigitizerFragments.ascx.vb" AutoEventWireup="false" Explicit="True" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.UI.WebControls" Assembly="DotNetNuke.Web" %>


<html>
    <body>
        <div>
        <div id="resultGridButtons" runat="server">
            <!--
            <div class="gridButtonsRow0">
                <a href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;" ><asp:Localize  runat="server" meta:resourcekey="updateStyle"></asp:Localize></a>
            </div>
            -->
            <div class="gridButtonsRow1">
                <a href="#" class="gridSelectBtn" onclick="router('resultSelectOn',this);return false;" ><asp:Localize runat="server" meta:resourcekey="searchSelectAll"></asp:Localize></a>                
            </div>
            <div class="gridButtonsRow2">
                <a href="#" onclick="router('mapResults',this);return false;" class="freshButton" ><asp:Localize runat="server" meta:resourcekey="selectionOnMap"></asp:Localize></a><!--
                <a href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;" class="freshButton"><asp:Localize runat="server" meta:resourcekey="selectionOnTheme"></asp:Localize></a>
                <a href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;" class="freshButton"><asp:Localize runat="server" meta:resourcekey="selectionOnLayer"></asp:Localize></a>
                -->
            </div>
        </div>
        <div id="testLocal">
            <input type="file" id="testLocalBrowse"/>
            <img id="testLocalImg" src="" />
        </div>
        <div id="infoAnalysis" runat="server">
            <div id="resultsDetailsTitle"></div>
            <div class="criteriaWrapper">       		
	            <div id="infoRightCol"></div>
            </div>
            <div id="infoDetachContWrapper">
	            <div id="detachContainer">
		            <a href="#" onclick="infoDetach();return false;"></a>
	            </div>
	            <div id="infoDetachTitle">

	            </div>
	            <div id="infoDetachCont" class="infoDetachCont">
		            <ul class="infoTabs">
			            <li><img id="Img1" runat="server" src='Images/type_fields.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeFields" /><span class="infoFieldsCount" runat="server" meta:resourcekey="tipTypeFields"></span></li>
			            <li><img id="Img2" runat="server" src='Images/type_images.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeImages" /><span class="infoImagesCount" runat="server" meta:resourcekey="tipTypeImages"></span></li>
			            <li><img id="Img3"  runat="server" src='Images/type_files.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeFiles" /><span class="infoFilesCount" runat="server" meta:resourcekey="tipTypeFiles"></span></li>
			            <li><img id="Img4" runat="server" src='Images/type_links.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeLinks" /><span class="infoLinksCount" runat="server" meta:resourcekey="tipTypeLinks"></span></li>
		            </ul>
		            <div class="infoFields infoFeaturePopup"></div>
		            <div class="infoImages infoFeaturePopup"></div>
		            <div class="infoFiles infoFeaturePopup"></div>
		            <div class="infoLinks infoFeaturePopup"></div>
	            </div>
            </div>
            <div id="infoDetachContWrapper2" runat="server">
                <div class="layoutContainer">
                    <div class="ui-layout-north">
                        <div class="mainImageCont"></div>
                        <a href="#" class="showInfoImagesBtn"></a>
                    </div>
                    <div class="ui-layout-center">
                        <h3 class="infoImagesLabel"><asp:Localize runat="server" meta:resourcekey="infoImagesLabel" ID="infoImagesLabel"></asp:Localize></h3>
                        <div class="popupimageContainer" style="display:none"></div>
                        <h3 class="infoFieldsLabel"><asp:Localize ID="infoFieldsLabel" runat="server" meta:resourcekey="infoFieldsLabel"></asp:Localize></h3>
                        <div class="popupFieldContainer"></div>
                        <h3 class="infoFilesLabel"><asp:Localize ID="infoFilesLabel" runat="server" meta:resourcekey="infoFilesLabel"></asp:Localize></h3>
                        <div class="popupFileContainer" style="display:none"></div>
                    </div>
                    <div class="ui-layout-east"></div>
                </div>
            </div>
        </div>
        <div id="statsAnalysis" runat="server">
            <div id="statsCont">
                <div id="statsResults" class="ui-layout-center">
                    <div id="statsButtonsCont">
                        <a href="#" id="statsCalculate" class="freshButton defaultAction disabled"  onclick="router('qstatsExecute');return false;"><asp:Localize ID="statsCalculate" runat="server" meta:resourcekey="statsCalculate"></asp:Localize></a>
                        <a href="#" id="statsPrint" class="freshButton defaultAction" onclick="router('qstatsPrint');return false;" style="display:none;"><asp:Localize ID="statsPrint" runat="server" meta:resourcekey="statsPrint"></asp:Localize></a>
                        <a href="#" id="statsBack" class="freshButton" onclick="router('qstatsBack');return false;" style="display:none;"><asp:Localize ID="statsBack" runat="server" meta:resourcekey="statsBack"></asp:Localize></a>
                    </div>
                </div>
                <div id="statsActions" class="ui-layout-south">
                    <div id="statsCriteria" class="ui-layout-center">
                        <div id="statsLayers" class="ui-layout-center">
                            <span><asp:Localize ID="statsExplain1" runat="server" meta:resourcekey="statsExplain1"></asp:Localize></span>
                            <div id="statsLayerList"></div>
                        </div>
                        <div id="statsFields" class="ui-layout-east">
                            <span><asp:Localize ID="statsExplain3a" runat="server" meta:resourcekey="statsExplain3a"></asp:Localize></span>
                            <div id="statsFieldList"></div>
                        </div>
                    </div>
                    <div id="statsResultCont" class="ui-layout-east"></div>    
                </div>                
            </div>
        </div>
        <div id="databaseAnalysis" runat="server">
          
          <div id="criteriaPanels">
            <div class="criteriaWrapper">
            <div class="criteriaWrapperLegend"><asp:Localize runat="server" meta:resourcekey="critWrapLegend"></asp:Localize></div>
            <div class="criteriaPanelActions">
	            <a href="#" class="closePanel" onclick="router('critClick',this);return false;"></a>
	            <a href="#" class="addPanel" onclick="router('critClick',this);return false;"></a>
            </div>
           
            <div class="criteriaFirstRow">
	            <span><asp:Localize runat="server" meta:resourcekey="critLabelTable"></asp:Localize></span>
	            <select class="dbTableName" onfocus="router('critMap',this);" onchange="router('critPop',this);router('critDescrip');return false;"></select>
	            <div class="criteriaThirdRow">
		            <a href="#" class="andButton freshButton disabled" onclick="router('critClick',this);return false;"><asp:Localize runat="server" meta:resourcekey="critLabelCriteria"></asp:Localize></a>
	            </div>
            </div>
            <div class="criteriaSecondRow" id="second_row_0"> <!--JK CHANGE - give id to div-->  
	            <div class="criteriaRowActions">
		            <a href="#" class="critDuplicate" onclick="router('critClick',this);router('critDescrip');return false;"></a>
		            <a href="#" class="critRemove" onclick="router('critClick',this);return false;" style="display:none"></a>
	            </div>
	            <div class="criteriaMOD">
		            <a id="A1" href="#" class="bAnd freshButton pressed" onclick="router('critClick',this);return false;" runat="server" meta:resourcekey="sqlMOD_AND_TIP"><asp:Localize runat="server" meta:resourcekey="sqlMOD_AND"></asp:Localize></a>
		            <a id="A2" href="#" class="bOr freshButton" onclick="router('critClick',this);return false;"  runat="server" meta:resourcekey="sqlMOD_OR_TIP"><asp:Localize runat="server" meta:resourcekey="sqlMOD_OR"></asp:Localize></a>
		            <!--<a href="#" class="bXor" onclick="mygis.UI.dbCriteriaClick(this);return false;" runat="server"  meta:resourcekey="sqlMOD_XOR_TIP"><asp:Localize runat="server" meta:resourcekey="sqlMOD_XOR"></asp:Localize></a>-->
		            <a id="A3" href="#" class="bNot freshButton" onclick="router('critClick',this);return false;" runat="server" meta:resourcekey="sqlMOD_NOT_TIP"><asp:Localize runat="server" meta:resourcekey="sqlMOD_NOT"></asp:Localize></a>
	            </div>	                    

	            <div class="selectCont">
		            <select class="dbFieldName" onchange="router('critSelect',this);router('critDescrip');return false;"></select>
	            </div>
	            <div class="selectCont">
		            <select disabled="disabled" class="dbFieldOperator" onchange="router('critSelect',this);router('critDescrip');return false;">
			            <option value=""></option>
			            <option value="EQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_EQ"></asp:Localize></option>
			            <option value="LIKE"><asp:Localize runat="server" meta:resourcekey="sqlOP_LIKE"></asp:Localize></option>
			            <option value="NEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_NEQ"></asp:Localize></option>
			            <option value="GEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_GEQ"></asp:Localize></option>
			            <option value="GT"><asp:Localize runat="server" meta:resourcekey="sqlOP_GT"></asp:Localize></option>
			            <option value="LT"><asp:Localize runat="server" meta:resourcekey="sqlOP_LT"></asp:Localize></option>
			            <option value="LEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_LEQ"></asp:Localize></option>
		            </select>
	            </div>
	            <div class="selectCont" >
		            <input disabled="disabled" type="text" class="dbFieldValue" onchange="router('critDescrip');return false;"/>
		            <select class="dbValueDistinct" onchange="router('critGetDisc',this);router('critDescrip');"></select>	                
	            </div>	            
	            <a href="#" disabled="disabled" class="dbFieldGetList" title="Populate with distinct values" onclick="router('critPopDisc',this);return false;"></a>
                <!--JK CHANGES - Add calendar initial divs-->  
                <div class='cal_button'; id ='cal_button_0'; style='display: none'> <img src="../DesktopModules/AVMap.MapDigitizer_v2/Scripts/Images/cal.png"; style="height: 22px; width: 22px;" /></div>              
                <div class="jqxdatetime" id="datetime"></div>
                <!--JK CHANGES END-->
            </div>
        	
          </div>  
          </div>
          <div id="criteriaMapWrapper">
            <div id="criteriaMapTools">
	            <div id="criteriaMapToolsSelect">
		            <a id="critdragPanBtn" class="dragPanBtn selected" href="#" onclick="return false;"></a>
		            <a id="critzoomBoxBtn" class="zoomBoxBtn" href="#" onclick="return false;"></a>
		            <a id="critzoomOutBtn" class="zoomOutBtn" href="#" onclick="return false;"></a>
		            <a id="crittoggleInfoBtn" class="toggleInfoBtn" href="#" onclick="return false;"></a>
	            </div>
	            <div id="criteriaMapToolsDraw">
		            <a id="critmarkerButton" class="markerButton" href="#" onclick="return false;"></a>
		            <a id="critpolylineButton" class="polylineButton" href="#" onclick="return false;"></a>
		            <a id="critpolygonButton" class="polygonButton" href="#" onclick="return false;"></a>
		            <a id="critrectangleButton" class="rectangleButton" href="#" onclick="return false;"></a>
	            </div>
	            <div id="criteriaMapToolsBg">
		            <select id="criteriaMapBgSelect"></select>
	            </div>
            </div>
            <div id="criteriaMap"></div>
          </div>
          <div id="criteriaUltActions">
            <div id="criteriaNameCont">
	            <div class="LabelCont SpecialCase">
		            <span class="Label"><asp:Localize runat="server" meta:resourcekey="qBuilderDescription"></asp:Localize></span>
		            <div id="critSearchDescription" class="textarea"></div>
	            </div>
            </div>
            <div id="criteriaUltActCont">
	            <div class="LabelCont">
		            <span class="Label"><asp:Localize runat="server" meta:resourcekey="qBuilderName"></asp:Localize></span>
		            <input id="critFriendlyName" type="text" />
	            </div>
	            <div class="critWindowActs">
		            <a href="#" id="criteriaGo" class="search freshButton defaultAction" onclick="router('critClick',this);return false;"><asp:Localize runat="server" meta:resourcekey="qBuilderBtnGo"></asp:Localize></a>
		            <input type="hidden" id="criteriaURL" />
		            <div id="criteriaResetCont">
			            <a href="#" id="critPreReset" onclick="router('showQR');return false;" class="freshButton"><asp:Localize runat="server" meta:resourcekey="qBuilderBtnReset"></asp:Localize></a>
			            <a href="#" id="critReset" class="defaultAction freshButton" onclick="router('critReset');return false;" style="display:none"><asp:Localize runat="server" meta:resourcekey="qBuilderBtnConfirm"></asp:Localize></a>
		            </div>
        			
	            </div>
            </div>
          </div>
        </div>
        <div id="newLayerDialog" runat="server">
            <div id="newLayerLevel1">
                <span class="propertyCaption">Όνομα:</span><input id="newLayerName" type="text" class="propertyValue" />
            </div>
            <div id="newLayerLevel2">
                <div class="zoneExpander">
                    <div id="mode_NewLayerDB" class="drawerContainer drawer">
                        <a class="drawer" href="#" onclick="router('tlSM',this);return false;" >
                            <span class="switchLabel">Προεπιλεγμένη βάση</span>
                            <span class="switch">
                                <span>
                                    <small class="on"><asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                    <small class="off"><asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                </span>
                             </span>
                        </a>
                    </div>
                    <div class="zoneExpanderHidden">
                        COMING SOON
                    </div>
                </div>
                <div class="zoneExpander">
                    <div id="mode_NewLayerStyle" class="drawerContainer drawer">
                        <a class="drawer" href="#" onclick="router('tlSM',this);return false;" >
                            <span class="switchLabel">Προεπιλεγμένo στυλ</span>
                            <span class="switch">
                                <span>
                                    <small class="on"><asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                    <small class="off"><asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                </span>
                             </span>
                        </a>
                    </div>
                    <div class="zoneExpanderHidden">
                        COMING SOON
                    </div>
                </div>
                <div class="zoneExpander">
                    <div id="mode_NewLayerAdvanced" class="drawerContainer">
                        <a class="drawer" href="#" onclick="router('tlSM',this);return false;" >
                            <span class="switchLabel">Για προχωρημένους</span>
                            <span class="switch">
                                <span>
                                    <small class="on"><asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                    <small class="off"><asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                </span>
                             </span>
                        </a>
                    </div>
                    <div class="zoneExpanderHidden">
                        COMING SOON
                    </div>
                </div>
            </div>
            <div id="newLayerActionCont">
                <a href="#" class="defaultAction freshButton">ΔΗΜΙΟΥΡΓΗΣΕ ΤΟ</a>
            </div>
        </div>
        <div id="saveAs" style="display:none" runat="server">
            <div class="saveAsMethod1">
	            <asp:Label ID="saveAsPermalink" runat="server" meta:resourcekey="saveAsPermalink"></asp:Label>
	            <a id="saveAsLink" href></a>
            </div>
            <div class="saveAsMethod2">
	            <asp:Label ID="saveAsLegend" runat="server" meta:resourcekey="saveAsLegend"></asp:Label>
	            <img id="saveAsLegendImg" />
            </div>
        </div>
       
        <div id="blockMessage" runat="server"></div>
        <div id="infoWindow" runat="server"></div>
        
        
        <div id="mapsAnalysis" style="display:none" runat="server">
            <div class="mapsLeftCol">
	            <div id="mapsPanel">
		            <div class="objectWrapper" style="height:auto;overflow:auto;">
			            <div id="mapsList"></div>
		            </div>  
		             
	            </div>
            </div>
            <div class="mapsRightCol">
                <div class="propertyTab"><asp:Localize runat="server" meta:resourcekey="mapsPropertyTitle"></asp:Localize></div>
	            <div id="mapsProperties" style="display: none;">
		            <table>
			            <tbody>
				            <tr>
					            <td class="propertyTitle"><asp:Localize ID="mapShortDescription" runat="server" meta:resourcekey="mapShortDescription"></asp:Localize></td>
					            <td id="mapShortDescription" class="propertyValue"></td>
				            </tr>
				            <tr>
					            <td class="propertyTitle"><asp:Localize ID="mapLayerCount" runat="server" meta:resourcekey="mapLayerCount"></asp:Localize></td>
					            <td id="mapLayerCount" class="propertyValue"></td>
				            </tr>
			            </tbody>
		            </table>
	            </div>
            </div>
        	<div class="mapsActions">
	            <span class="currentLevelActions">
		            <a class="defaultAction" href="#" onclick="router('lmap');return false;"><asp:Localize runat="server" meta:resourcekey="mapLoadBtn"></asp:Localize></a>
	            </span>
            </div> 
        </div>

        <div id="userFiles" runat="server">
            <div id="userFilesHeader">
                <div id="userFiles_GenericActions">
                    <span id="userFiles_Tipper"><asp:Localize runat="server" meta:resourcekey="mm_Tipper_MainWindow"></asp:Localize></span>
                    <a id="userFiles_refreshList" href="#" class="btnTool"></a>
                    <a id="userFiles_toggleSelection" href="#" class="freshButton" onclick="router('mm_toggleSelection',this);return false;"><asp:Localize runat="server" meta:resourcekey="userFiles_btnSelectAll"></asp:Localize></a>
                    
                    <div id="userFiles_Search">
                        <label for="userFiles_SearchInput"><asp:Localize runat="server" meta:resourcekey="mm_filterAction_Search"></asp:Localize></label>
                        <input id="userFiles_SearchInput" type="text" name="userFiles_SearchInput" />
                    </div>
                </div>
                <div id="userFiles_SelectedActions">
                    <a id="userFiles_delete" href="#" class="btnTool"><asp:Localize runat="server" meta:resourcekey="mm_fileAction_delete"></asp:Localize></a>
                    <a id="userFiles_replace" href="#" class="btnTool"><asp:Localize runat="server" meta:resourcekey="mm_fileAction_replace"></asp:Localize></a>
                    <a id="userFiles_download" href="#" class="btnTool"><asp:Localize runat="server" meta:resourcekey="mm_fileAction_download"></asp:Localize></a>
                    <a id="userFiles_OK" class="defaultAction freshButton"><asp:Localize ID="mm_windowAction_OK" runat="server" meta:resourcekey="mm_windowAction_OK"></asp:Localize></a>
                </div>
                <div id="userFiles_SortContainer">
                    <a id="userFiles_nameSort" href="#" class="sortButton"><asp:Localize runat="server" meta:resourcekey="mm_fileProp_Name"></asp:Localize></a>
                    <a id="userFiles_typeSort" href="#" class="sortButton"><asp:Localize runat="server" meta:resourcekey="mm_fileProp_Type"></asp:Localize></a>
                    <a id="userFiles_sizeSort" href="#" class="sortButton"><asp:Localize runat="server" meta:resourcekey="mm_fileProp_Size"></asp:Localize></a>
                    <a id="userFiles_inuseSort" href="#" class="sortButton"><asp:Localize runat="server" meta:resourcekey="mm_fileProp_InUse"></asp:Localize></a>
                    <a id="userFiles_dateSort" href="#" class="sortButton"><asp:Localize runat="server" meta:resourcekey="mm_fileProp_Date"></asp:Localize></a>
                </div>
            </div>
            <div id="userFilesListCont">
                <div id="userFilesList"></div>
            </div>
            <div id="userFilesFeedBack">
                <div id="userFilesMessages">
                    <div style="display:block;vertical-align: top;text-align: left;width: 200px;margin-top: 10px;margin-left:10px;margin-right:10px;">
                        <div class="spaceInfo"><span><asp:Localize runat="server" meta:resourcekey="mm_spaceInfo_current"></asp:Localize></span><span id="currentUsedSpaceSpan"></span></div>
                        <div><a href="#" id="user_NeedMoreSpace" class="freshButton"><asp:Localize runat="server" meta:resourcekey="mm_spaceInfo_needMore"></asp:Localize></a></div>
                    </div>
                    <div id="userFilesSpace"></div>
                </div>
                <div id="userFilesSpaceCont">
                    <a id="userFiles_uploadNew" href="#" class="freshButton"><asp:Localize runat="server" meta:resourcekey="mm_windowAction_uploadNew"></asp:Localize></a>
                </div>
            </div>
            <div id="userFilesDialogButtons">
                
                <a id="userFiles_CANCEL" class="freshButton"><asp:Localize runat="server" meta:resourcekey="mm_windowAction_Cancel"></asp:Localize></a>
            </div>
        </div>
        <div id="page_userProfile" class="MyGISAdmin" runat="server">
            <div id="userProfileWrapper" class="pageWrapper">
                <div id="up_Header" class="adminHeader">
                    <span id="up_headerText" class="headerText"><a href="#"><asp:Localize runat="server" meta:resourcekey="up_Header"></asp:Localize></a></span>
                    <div id="up_headerLogoCont" class="headerLogoCont"><img id="userProfileLogo" runat="server"  /></div>
                </div>
                <div id="up_TopMenu" class="topMenu">
                    <div id="up_MenuActions" class="menuActions">
                        <a href="#" id="up_switchToAppBtn" class="switchToAppBtn" onclick="router('backToApp');return false;"><asp:Localize runat="server" meta:resourcekey="adminbackToApp"></asp:Localize></a>
                    </div>
                    <div id="up_MenuTabsCont">
                        <div id="up_menuTabs">
                            <ul>
                                <li id="up_menuAccount">
                                    <a href="#"><asp:Localize runat="server" meta:resourcekey="up_menuAccount"></asp:Localize></a>
                                    <ul style="width: 250px;">
                                        <li id="up_menuAccount_Info">
                                            <img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-user.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuAccount_Info"></asp:Localize></span></a>
                                        </li>
                                        <li id="up_menuAccount_Preferences">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuAccount_Preferences"></asp:Localize></span></a>
                                        </li>
                                    </ul>
                                </li>
                                <li id="up_menuMessages">
                                    <a href="#"><asp:Localize runat="server" meta:resourcekey="up_menuMessages"></asp:Localize></a>
                                    <ul style="width: 250px;">
                                        <li id="up_menuMessages_Inbox">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuMessages_Inbox"></asp:Localize></span></a>
                                        </li>
                                        <li id="up_menuMessages_NewMessage">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuMessages_NewMessage"></asp:Localize></span></a>
                                        </li>
                                    </ul>
                                </li>
                                <li id="up_menuShopMaps">
                                    <a href="#"><asp:Localize runat="server" meta:resourcekey="up_menuShopMaps"></asp:Localize></a>
                                    <ul style="width: 250px;">
                                        <li id="up_menuShopMaps_Buy">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuShopMaps_Buy"></asp:Localize></span></a>
                                        </li>
                                        <li id="up_menuShopMaps_Sell">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuShopMaps_Sell"></asp:Localize></span></a>
                                        </li>
                                    </ul>
                                </li>
                                <li id="up_menuShopLayers">
                                    <a href="#"><asp:Localize runat="server" meta:resourcekey="up_menuShopLayers"></asp:Localize></a>
                                    <ul style="width: 250px;">
                                        <li id="up_menuShopLayers_Buy">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuShopLayers_Buy"></asp:Localize></span></a>
                                        </li>
                                        <li id="up_menuShopLayers_Sell">
                                            <img class="menuImage" src='' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="up_menuShopLayers_Sell"></asp:Localize></span></a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="up_Content" class="adminContent">
                    <div id="up_ContentWrapper" class="contentWrapper">
                        <div id="up_ContentSuperActions" class="superActions">
                            <div id="up_contentToolbar" class="mainToolbar"></div>
                            <div id="up_contentSpecificToolbar" class="specificToolbar"></div>
                            <div id="up_contentActionsTitle"><h2 id="up_contentActionsTitleElem"></h2></div>
                        </div>
                        <div id="up_ContentTabsWrapper" class="tabsWrapper">
                            <div id="up_contentTabsInnerWrapper" class="innerWrapper">
                                <div id="up_contentLinkTabs" class="linkTabs">
                                    <div id="up_contentLinkTabsCell" class="linkTabsCell">
                                        <div id="up_contentLinkTabsRound" class="linkTabsRound"></div>
                                    </div>
                                </div>
                                <div id="up_contentTabs" class="contentTabs">
                                    <div class="absoluteContainer">
                                        <div id="up_AccountTab_Info" class="contentTab"></div>
                                        <div id="up_AccountTab_Preferences" class="contentTab"></div>
                                        <div id="up_AccountTab_Balance" class="contentTab"></div>
                                        <div id="up_MessagesTab_Inbox" class="contentTab"></div>
                                        <div id="up_MessagesTab_New" class="contentTab"></div>
                                        <div id="up_ShopMapsTab_Buy" class="contentTab"></div>
                                        <div id="up_ShopMapsTab_Sell" class="contentTab"></div>
                                        <div id="up_ShopLayersTab_Buy" class="contentTab"></div>
                                        <div id="up_ShopLayersTab_Sell" class="contentTab"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="userProfilePopups"></div>
        </div>
        <div id="page_administration" class="MyGISAdmin" runat="server">
          <div id="pageWrapper" class="pageWrapper">
              <div id="adminHeader" class="adminHeader">
                <span id="headerText" class="headerText"><a href="#"><asp:Localize runat="server" meta:resourcekey="adminHeader"></asp:Localize></a></span>
                <div id="headerLogoCont" class="headerLogoCont"><img src='<%= Me.ControlPath +"Images/myGIS_logoMini.png" %>' alt='MyGIS Logo here' /></div>
              </div>
              <div id="topMenu" class="topMenu">
                <div id="menuActions" class="menuActions">
                    <a href="#" id="switchToAppBtn" class="switchToAppBtn" onclick="router('backToApp');return false;"><asp:Localize runat="server" meta:resourcekey="adminbackToApp"></asp:Localize></a>
                </div>
                <div id="menuTabsCont">
                    <div id="menuTabs">
                    <ul>
                      <li id="amenu_Apps">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Apps"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Apps_Manager">
                                <img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/mg/application_16.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Apps_Manager"></asp:Localize></span></a>
                            </li>
                            <li id="amenu_Apps_Config">
                                <img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/mg/config_16.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Apps_Config"></asp:Localize></span></a>
                            </li>
                        </ul>
                      </li>
                      <li id="amenu_Maps">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Maps"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Maps_Manager">
                                <img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-banner-tracks.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Maps_Manager"></asp:Localize></span></a>
                            </li>
                            <li id="amenu_Maps_Config">
                                <img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/mg/config_16.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Maps_Config"></asp:Localize></span></a>
                            </li>
                        </ul>
                      </li>
                      <li id="amenu_Layers">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Layers"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Layers_Manager"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-banner.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Layers_Manager"></asp:Localize></span></a></li>
                        </ul>
                      </li>
                      <li id="amenu_Users">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Users"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Users_Manager"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-user.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Users_Manager"></asp:Localize></span></a></li>
                            <li id="amenu_Users_RoleManager"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-groups.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Users_RoleManager"></asp:Localize></span></a></li>
                            <li id="amenu_Users_MassMail"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-newsfeeds.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Users_MassMail"></asp:Localize></span></a></li>
                        </ul>
                      </li>
                      <li id="amenu_Data">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Data"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Data_Manager"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-content.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Data_Manager"></asp:Localize></span></a></li>
                            <li id="amenu_Data_Buy"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-download.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Data_Buy"></asp:Localize></span></a></li>
                            <li id="amenu_Data_Sell"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-upload.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Data_Sell"></asp:Localize></span></a></li>
                        </ul>
                      </li>
                      <li id="amenu_Files">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Files"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Files_Manager"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-media.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Files_Manager"></asp:Localize></span></a></li>
                        </ul>
                      </li>
                      <li id="amenu_Logs">
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Logs"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Logs_DataActions"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-install.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Logs_DataActions"></asp:Localize></span></a></li>
                            <li id="amenu_Logs_UserAccess"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-cpanel.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Logs_UserAccess"></asp:Localize></span></a></li>
                            <li id="amenu_Logs_Transactions"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-help-shop.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Logs_Transactions"></asp:Localize></span></a></li>
                        </ul>
                      </li>
                      <li id="amenu_Help>
                        <a href="#"><asp:Localize runat="server" meta:resourcekey="amenu_Help"></asp:Localize></a>
                        <ul style="width: 250px;">
                            <li id="amenu_Help_Manual"><img class="menuImage" src='<%= Me.ControlPath + "Images/Administration/menu/icon-16-help-jed.png" %>' /><a href="#"><span><asp:Localize runat="server" meta:resourcekey="amenu_Help_Manual"></asp:Localize></span></a>
                        </ul>
                      </li>
                    </ul>
                </div>
                </div>
              </div>
              <div id="adminContent" class="adminContent">
                <div id="adminContentWrapper" class="contentWrapper">
                    <div id="contentSuperActions" class="superActions">
                        <div id="contentToolbar" class="mainToolbar"></div>
                        <div id="contentSpecificToolbar" class="specificToolbar"></div>
                        
                        <div id="contentActionsTitle"><h2 id="contentActionsTitleElem"></h2></div>
                    </div>
                    <div id="contentTabsWrapper" class="tabsWrapper">
                        <div id="contentTabsInnerWrapper" class="innerWrapper">
                            <div id="contentLinkTabs" class="linkTabs">
                                <div id="contentLinkTabsCell" class="linkTabsCell">
                                    <div id="contentLinkTabsRound" class="linkTabsRound">
                                        <a href="#" class="btnTool" style="margin-left: 5px;"></a>
                                    </div>
                                </div>
                            </div>
                            <div id="contentTabs" class="contentTabs">
                            <div class="absoluteContainer">
                                <div id="appManagerTab" class="contentTab">
                                    <div id="myAppGrid"></div>
                                </div>
                                <div id="editAppTab" class="contentTab">
                                    <div id="editAppForm">
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',0);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderBasic"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppName"></asp:Localize></span>
                                                <input id="editAppName" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppAlias"></asp:Localize></span>
                                                <input id="editAppAlias" type="text" class="editAppInput" readonly="readonly" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppWelcomeText"></asp:Localize></span>
                                                <textarea id="editAppWelcomeText" rows="4" class="editAppInputArea"></textarea>
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppImageButtons">
                                                    <a href="#" class="freshButton replace" id="replaceAppLogo" onclick="router('adminAppLogo',this);"><asp:Localize runat="server" meta:resourcekey="editCommonReplace"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppLogo"></asp:Localize></span>
                                                <img id="editAppLogo" />
                                            
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppImageButtons">
                                                    <a href="#" class="freshButton" id="replaceAppLogo1" onclick="router('adminAppLogo',this);"><asp:Localize runat="server" meta:resourcekey="editCommonReplace"></asp:Localize></a>
                                                    <a href="#" class="freshButton" id="removeAppLogo1" onclick="router('adminAppLogoRemove',this);"><asp:Localize runat="server" meta:resourcekey="editCommonRemove"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppLogo1"></asp:Localize></span>
                                                <img id="editAppLogo1" />
                                                
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppImageButtons">
                                                    <a href="#" class="freshButton" id="replaceAppLogo2" onclick="router('adminAppLogo',this);"><asp:Localize runat="server" meta:resourcekey="editCommonReplace"></asp:Localize></a>
                                                    <a href="#" class="freshButton" id="removeAppLogo2" onclick="router('adminAppLogoRemove',this);"><asp:Localize runat="server" meta:resourcekey="editCommonRemove"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editAppLogo2"></asp:Localize></span>
                                                <img id="editAppLogo2" />
                                                
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',1);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderMaps"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction" onclick="router('appAddMap');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Add"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled"><span class="editBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Edit"></asp:Localize></a> 
                                                <a href="#" class="adminGenericAction disabled" onclick="router('appDefaultMap');"><span class="defaultBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Default"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled" onclick="router('appUnpublishMap');"><span class="unpublishBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Unpublish"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled" onclick="router('appDeleteMap');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Remove"></asp:Localize></a></a>
                                            </div>
                                            <div class="editAppRow">
                                                <div id="adminMapList"></div>
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',2);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderURLS"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction" onclick="router('appAddAlias');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="editApp_UrlAdd"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled" onclick="router('appRemoveAlias');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="editApp_UrlRemove"></asp:Localize></a>
                                            </div>
                                            <div class="editAppRow">
                                                
                                                <div id="adminURLList"></div>
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',3);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderPermissions"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="editApp_UserAdd"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction  disabled"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="editApp_UserRemove"></asp:Localize></a>
                                            </div>
                                            <div class="editAppRow">
                                                <div id="adminAppUserList"></div>
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',4);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderStyles"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction" onclick="router('app_addNewStyle');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Add"></asp:Localize></a>
                                                <a id="appStyle_Edit" href="#" class="adminGenericAction disabled" onclick="router('app_editStyle');"><span class="editBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Edit"></asp:Localize></a> 
                                                <a id="appStyle_Copy" href="#" class="adminGenericAction disabled" onclick="router('app_copyStyle');"><span class="duplicateBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Duplicate"></asp:Localize></a> 
                                                <a id="appStyle_CopyTo" href="#" class="adminGenericAction disabled" onclick="router('app_copyStyleTo');"><span class="copyToBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_CopyTo"></asp:Localize></a> 
                                                <a id="appStyle_MakeDefault" href="#" class="adminGenericAction disabled" onclick="router('app_makeActiveStyle');"><span class="defaultBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Default"></asp:Localize></a>
                                                <a id="appStyle_MakePublish" href="#" class="adminGenericAction disabled" onclick="router('app_publishStyle');"><span class="publishBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Publish"></asp:Localize></a>
                                                <a id="appStyle_MakeUnpublish" href="#" class="adminGenericAction disabled" onclick="router('app_unpublishStyle');"><span class="unpublishBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Unpublish"></asp:Localize></a>
                                                <a id="appStyle_Remove" href="#" class="adminGenericAction disabled" onclick="router('app_deleteStyle');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppStyle_Remove"></asp:Localize></a></a>
                                            </div>
                                            <div class="editAppRow">
                                                <div id="adminStyleList"></div>
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Apps_Config_Tab',5);"><asp:Localize runat="server" meta:resourcekey="editApp_HeaderDatabase"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="editAppRow">
                                                <!--<iframe id="testDatabase" width="100%" height="100%" frameborder="0" src="http://mylittleadmin.mygis.gr" style="min-height: 370px;overflow:auto;"></iframe>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="styleAppTab" class="contentTab"></div>
                                <div id="mapManagerTab" class="contentTab">
                                   <div class="gridWrapper">
                                        <div id="myMapsGrid"></div> 
                                   </div>
                                </div>
                                <div id="editMapTab" class="contentTab">
                                    <div id="editMapForm">
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',0);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderProperties"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapName"></asp:Localize></span>
                                                <input id="editMapName" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapDescription"></asp:Localize></span>
                                                <input id="editMapDescription" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppInputButtons">
                                                    <a href="#" id="editMapViewPort" class="freshButton" onclick="router('map_getExtent');"><asp:Localize runat="server" meta:resourcekey="editMapViewPort"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapExtent"></asp:Localize></span>
                                                <input id="editMapExtent" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppInputButtons">
                                                    <a href="#" id="editMapViewCenter" class="freshButton" onclick="router('map_getCenter');"><asp:Localize runat="server" meta:resourcekey="editMapViewPort"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapCenter"></asp:Localize></span>
                                                <input id="editMapCenter" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <div class="editAppInputButtons">
                                                    <a href="#" id="editMapViewZoom" class="freshButton" onclick="router('map_getZoom');"><asp:Localize runat="server" meta:resourcekey="editMapViewPort"></asp:Localize></a>
                                                </div>
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapZoom"></asp:Localize></span>
                                                <input id="editMapZoom" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapDeveloper"></asp:Localize></span>
                                                <input id="editMapDeveloper" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapOwner"></asp:Localize></span>
                                                <input id="editMapOwner" type="text" class="editAppInput" />
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapThumb"></asp:Localize></span>
                                                <img id="editMapThumb" class="thumbCropped" />
                                                <div class="editAppImageButtons mapThumbnailButtons">
                                                    <a href="#" class="freshButton replace" onclick="router('map_generateThumb');"><asp:Localize runat="server" meta:resourcekey="editMapThumbFromMap"></asp:Localize></a>
                                                    <a href="#" class="freshButton" onclick="router('map_customThumb');"><asp:Localize runat="server" meta:resourcekey="editMapThumbFromManual"></asp:Localize></a>
                                                </div>
                                            </div>
                                            <div class="editAppRow">
                                                <span class="editAppLabel"><asp:Localize runat="server" meta:resourcekey="editMapDefaultBG"></asp:Localize></span>
                                                <select id="editMapDefaultBG" class="editAppInput" />
                                            </div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',1);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderLayers"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                 <a href="#" class="adminGenericAction" onclick="router('mapAddLayer');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_AddLayer"></asp:Localize></a>
                                                 <!--<a href="#" class="adminGenericAction disabled" onclick=""><span class="editBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_EditLayer"></asp:Localize></a>-->
                                                 <a href="#" id="map_layerUpload" class="adminGenericAction" onclick="displayNotify(msg_errFeatureNotImplemented);return false;"><span class="newBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_NewLayer"></asp:Localize></a>
                                                 <a href="#" id="map_layerUpBtn" class="adminGenericAction disabled" onclick="router('mapLayermoveUp');"><span class="moveUpBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_MoveUpLayer"></asp:Localize></a>
                                                 <a href="#" id="map_layerDownBtn" class="adminGenericAction disabled" onclick="router('mapLayermoveDown');"><span class="moveDownBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_MoveDownLayer"></asp:Localize></a>
                                                 <a href="#" id="map_layerDeleteBtn" class="adminGenericAction disabled" onclick="router('mapDeleteLayer');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_RemoveLayer"></asp:Localize></a>
                                            </div>
                                            <div id="mapLayerList"></div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',2);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderTags"></asp:Localize></a></div>
                                        <div class="sectionContent"></div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',3);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderHotSearch"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction" onclick="router('map_addNewQS');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_AddHotSearch"></asp:Localize></a>
                                                <a href="#" id="map_editQSbtn" class="adminGenericAction disabled" onclick="router('map_editQS');"><span class="editBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_EditHotSearch"></asp:Localize></a>
                                                <a href="#" id="map_deleteQSbtn" class="adminGenericAction disabled" onclick="router('map_deleteQS');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_DeleteHotSearch"></asp:Localize></a>
                                            </div>
                                            <div id="mapHotSearchList"></div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',4);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderMacros"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="sectionButtons">
                                                <a href="#" class="adminGenericAction" onclick="router('map_addNewMacro');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_AddMacro"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled" id="map_editMacrobtn" onclick="router('map_editMacro');"><span class="editBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_EditMacro"></asp:Localize></a>
                                                <a href="#" class="adminGenericAction disabled" id="map_deleteMacrobtn" onclick="router('map_deleteMacro');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="editMap_DeleteMacro"></asp:Localize></a>
                                            </div>
                                            <div id="mapMacroList"></div>
                                        </div>
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Maps_Config_Tab',5);"><asp:Localize runat="server" meta:resourcekey="editMap_HeaderPermissions"></asp:Localize></a></div>
                                        <div class="sectionContent"></div>
                                    </div>
                                </div>
                                <div id="layerManagerTab" class="contentTab"></div>
                                <div id="userManagerTab" class="contentTab">
                                    <div class="gridWrapper">
                                        <div id="myUsersGrid"></div> 
                                   </div>
                                </div>
                                <div id="editUserTab" class="contentTab">
                                    <div id="editUserForm">
                                        <div class="sectionHeader"><a href="#" onclick="router('amenu_Users_Config_Tab',0);"><asp:Localize runat="server" meta:resourcekey="editUser_HeaderProperties"></asp:Localize></a></div>
                                        <div class="sectionContent">
                                            <div class="editAppRow">
                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="userGroupManagerTab" class="contentTab"></div>
                                <div id="massMailUserTab" class="contentTab"></div>
                                <div id="dataManagerTab" class="contentTab"></div>
                                <div id="buyDataTab" class="contentTab"></div>
                                <div id="sellDataTab" class="contentTab"></div>
                                <div id="actionLogTab" class="contentTab"></div>
                                <div id="userAccessLogTab" class="contentTab"></div>
                                <div id="transactionsLogTab" class="contentTab"></div>
                            </div>
                        </div>
                        </div>
                     </div>
                </div>
              </div>
          </div>
          <div id="adminPopups">
            <div id="addAppAliasPop">
                <div class="addApp_group1">
                    <div id="chooseProtocolCont">
                        <label for="chooseProtocol"><asp:Localize runat="server" meta:resourcekey="chooseProtocol"></asp:Localize></label>
                        <select id="chooseProtocol" name="chooseProtocol">
                            <option value="http" selected="selected">http</option>
                            <option value="https">https</option>
                        </select>
                    </div>
                    <div id="chooseIPAddressCont">
                        <label for="chooseIPAddress"><asp:Localize runat="server" meta:resourcekey="chooseIPAddress"></asp:Localize></label>
                        <select id="chooseIPAddress" name=chooseIPAddress">
                            <option value="*" selected="selected"><asp:Localize runat="server" meta:resourcekey="addAliasAllIP"></asp:Localize></option>
                        </select>
                    </div>
                    <div id="choosePortCont">
                        <label for="choosePort"><asp:Localize runat="server" meta:resourcekey="choosePort"></asp:Localize></label>
                        <input type="text" value="80" id="choosePort" name="choosePort" />
                        <span id="addAppAlias_err_WrongPort" class="errorMessage"></span>
                    </div>
                </div>
                <div class="addApp_group2">
                    <div>
                        <label for="chooseHost"><asp:Localize runat="server" meta:resourcekey="chooseHost"></asp:Localize></label>
                        <input type="text" id="chooseHost" />
                        <span id="appChooseHost_Example"><asp:Localize runat="server" meta:resourcekey="addAliasExample"></asp:Localize></span>
                        <span id="addAppAlias_err_WrongHostname" class="errorMessage"></span>
                    </div>
                </div>
                <div class="addAppAliasBtnCont">
                    <a href="#" class="freshButton defaultAction" onclick="router('adminOK');"><asp:Localize runat="server" meta:resourcekey="addAliasOK"></asp:Localize></a>
                    <a href="#" class="freshButton" onclick="router('adminCancel');"><asp:Localize runat="server" meta:resourcekey="addAliasCancel"></asp:Localize></a>
                </div>
            </div>
            <div id="addAppNamePop">
                <div id="addAppNameInpCont">
                    <input type="text" id="addAppNameInp" />
                </div>
                <div id="appAppNameButtons">
                    <a class="defaultAction freshButton" href="#" onclick="router('adminOK');"><asp:Localize runat="server" meta:resourcekey="addAppName_btnOK"></asp:Localize></a>
                    <a class="freshButton" href="#" onclick="router('adminCancel');"><asp:Localize runat="server" meta:resourcekey="addAppName_btnCancel"></asp:Localize></a>
                </div>
            </div>
            <div id="addMapNamePop">
                <div id="addMapNameInpCont">
                    <input type="text" id="addMapNameInp" />
                </div>
                <div id="addMapNameButtons">
                    <a class="defaultAction freshButton" href="#" onclick="router('adminOK');"><asp:Localize runat="server" meta:resourcekey="addAppName_btnOK"></asp:Localize></a>
                    <a class="freshButton" href="#" onclick="router('adminCancel');"><asp:Localize runat="server" meta:resourcekey="addAppName_btnCancel"></asp:Localize></a>
                </div>
            </div>
            <div id="editStylePop">
                <div id="editStyleContentWrapper" class="contentWrapper">
                    <div id="editStyleActions" class="superActions">
                        
                        <div id="editStyleToolbar" class="mainToolbar">
                            <a href="#" id="amenu_editStyle_save" class="adminGenericAction" onclick="router('adminOK');"><span class="adminActionImg imgSave"></span><asp:Localize runat="server" meta:resourcekey="amenu_editStyle_save"></asp:Localize></a>
                            <a href="#" id="amenu_editStyle_cancel" class="adminGenericAction" onclick="router('adminCancel');"><span class="adminActionImg imgReset"></span><asp:Localize runat="server" meta:resourcekey="amenu_editStyle_cancel"></asp:Localize></a>
                        </div>
                        <div id="editStyleTabActions" class="specificToolbar"></div>
                        <div id="editStyleActionsTitle">
                            <h2 id="editActionsTitleElem"></h2>
                            <label for="saveStyleAs" id="saveStyleAsLabel"><asp:Localize runat="server" meta:resourcekey="saveStyleAsLabel"></asp:Localize></label>
                            <input type="text" id="saveStyleAs" />
                        </div>
                    </div>
                    <div id="editStyleTabsWrapper" class="tabsWrapper">
                        <div id="editStyleTabsInnerWrapper" class="innerWrapper">
                            <div id="editStyleLinkTabs" class="linkTabs">
                                <div id="editStyleLinkTabsCell" class="linkTabsCell">
                                    <div id="editStyleLinkTabsRound" class="linkTabsRound">
                                        <div class="sectionHeader active">
                                            <a href="#" onclick="router('styleMenu_ConfigTab',0);"><asp:Localize runat="server" meta:resourcekey="editStyleTabHeader"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('styleMenu_ConfigTab',1);"><asp:Localize runat="server" meta:resourcekey="editStyleTabMenu"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('styleMenu_ConfigTab',2);"><asp:Localize runat="server" meta:resourcekey="editStyleTabRPanel"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('styleMenu_ConfigTab',3);"><asp:Localize runat="server" meta:resourcekey="editStyleTabMisc"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('styleMenu_ConfigTab',4);"><asp:Localize runat="server" meta:resourcekey="editStyleTabΕxpert"></asp:Localize></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="editStyleContent" class="contentTabs">
                                <div class="absoluteContainer">
                                    <div id="editHeaderTab">
                                        <div class="appSettingFrame active">
                                            <label for="appSetting_enableHeader"><asp:Localize runat="server" meta:resourcekey="editStyle_showHeader"></asp:Localize></label>
                                            <input type="checkbox" id="appSetting_enableHeader" checked="checked" />
                                            <div id="appSetting_HeaderSettings">
                                                <div class="appSetting">
                                                    <label for="appSetting_HeaderHeight"><asp:Localize runat="server" meta:resourcekey="editStyle_headerHeight"></asp:Localize></label>
                                                    <div id="appSetting_HeaderHeight" ></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_HeaderBG"><asp:Localize runat="server" meta:resourcekey="editStyle_headerBG"></asp:Localize></label>
                                                    <input type="color" id="appSetting_HeaderBG" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_HeaderOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_HeaderOpacity"></asp:Localize></label>
                                                    <div id="appSetting_HeaderOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_HeaderTextBG"><asp:Localize runat="server" meta:resourcekey="editStyle_headerTextBG"></asp:Localize></label>
                                                    <input type="color" id="appSetting_HeaderTextBG" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;"/>
                                                    <label for="appSetting_HeaderTextOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_HeaderTextOpacity"></asp:Localize></label>
                                                    <div id="appSetting_HeaderTextOpacity"></div>
                                                </div>
                                                 <div class="appSetting">
                                                    <label for="appSetting_HeaderTextColor"><asp:Localize runat="server" meta:resourcekey="appSetting_HeaderTextColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_HeaderTextColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;"/>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_HeaderTextRadius"><asp:Localize runat="server" meta:resourcekey="editStyle_headerTextRadius"></asp:Localize></label>
                                                    <div id="appSetting_HeaderTextRadius"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="appSettingFrame">
                                            <div class="appSetting_MenuSettings">
                                                <div class="appSetting">
                                                    <label for="appSetting_menuBackground"><asp:Localize runat="server" meta:resourcekey="editStyle_menuBackground"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuBackground" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_menuBGOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_menuBGOpacity"></asp:Localize></label>
                                                    <div id="appSetting_menuBGOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_menuBackgroundBorder"><asp:Localize runat="server" meta:resourcekey="editStyle_menuBackgroundBorder"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuBackgroundBorder" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_menuColor"><asp:Localize runat="server" meta:resourcekey="editStyle_menuColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                                
                                                <div class="appSetting">
                                                    <label for="appSetting_menuBackgroundActive"><asp:Localize runat="server" meta:resourcekey="appSetting_menuBackgroundActive"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuBackgroundActive" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_menuBGActiveOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_menuBGActiveOpacity"></asp:Localize></label>
                                                    <div id="appSetting_menuBGActiveOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_menuBackgroundBorderActive"><asp:Localize runat="server" meta:resourcekey="appSetting_menuBackgroundBorderActive"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuBackgroundBorderActive" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_menuΑctiveColor"><asp:Localize runat="server" meta:resourcekey="editStyle_menuΑctiveColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_menuΑctiveColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="appSettingFrame">
                                            <div class="appSetting_RightPanelSettings">
                                                <div class="appSetting">
                                                    <label for="appSetting_TopBackground"><asp:Localize runat="server" meta:resourcekey="appSetting_rPanelTopBG"></asp:Localize></label>
                                                    <input type="color" id="appSetting_TopBackground" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_TopBGOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_TopBGOpacity"></asp:Localize></label>
                                                    <div id="appSetting_TopBGOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_TopColor"><asp:Localize runat="server" meta:resourcekey="appSetting_rPanelTopColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_TopColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_MidBackground"><asp:Localize runat="server" meta:resourcekey="appSetting_rPanelTabBG"></asp:Localize></label>
                                                    <input type="color" id="appSetting_MidBackground" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_MidBGOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_MidBGOpacity"></asp:Localize></label>
                                                    <div id="appSetting_MidBGOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_MidColor"><asp:Localize runat="server" meta:resourcekey="appSetting_rPanelTabColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_MidColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_MidActiveColor"><asp:Localize runat="server" meta:resourcekey="appSetting_rPanelTabActiveColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_MidActiveColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="appSettingFrame">
                                            <div class="appSetting_MiscSettings">
                                                <div class="appSetting">
                                                    <label for="appSetting_mapHeaderBG"><asp:Localize runat="server" meta:resourcekey="appSetting_mapHeaderBG"></asp:Localize></label>    
                                                    <input type="color" id="appSetting_mapHeaderBG" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_mapHeaderOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_mapHeaderOpacity"></asp:Localize></label>
                                                    <div id="appSetting_mapHeaderOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_mapDescriptionColor"><asp:Localize runat="server" meta:resourcekey="appSetting_mapDescriptionColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_mapDescriptionColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_mapDescriptionSize"><asp:Localize runat="server" meta:resourcekey="appSetting_mapDescriptionSize"></asp:Localize></label>
                                                    <div id="appSetting_mapDescriptionSize"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_mapFooterBG"><asp:Localize runat="server" meta:resourcekey="appSetting_mapFooterBG"></asp:Localize></label>    
                                                    <input type="color" id="appSetting_mapFooterBG" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                    <label for="appSetting_mapFooterOpacity"><asp:Localize runat="server" meta:resourcekey="appSetting_mapFooterOpacity"></asp:Localize></label>
                                                    <div id="appSetting_mapFooterOpacity"></div>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_mapFooterFontColor"><asp:Localize runat="server" meta:resourcekey="appSetting_mapFooterFontColor"></asp:Localize></label>
                                                    <input type="color" id="appSetting_mapFooterFontColor" value="#FFFFFF" data-text="hidden" data-hex="true" style="height:20px;width:20px;" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="appSettingFrame">
                                            <div id="expertModeWarning"><asp:Localize runat="server" meta:resourcekey="appSetting_expertModeWarning"></asp:Localize></div>
                                            <label for="appSetting_expertModeToggle"><asp:Localize runat="server" meta:resourcekey="appSetting_expertModeToggle"></asp:Localize></label>
                                            <input type="checkbox" id="appSetting_expertModeToggle" />
                                            <div id="appSetting_ExpertSettings" style="display: none;">
                                                <textarea id="expertModeCss" rows="10"></textarea> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="editQSPop">
                <div id="editQSContentWrapper" class="contentWrapper">
                    <div id="editQSActions" class="superActions">
                        
                        <div id="editQSToolbar" class="mainToolbar">
                            <a href="#" id="amenu_editQS_save" class="adminGenericAction" onclick="router('adminOK');"><span class="adminActionImg imgSave"></span><asp:Localize runat="server" meta:resourcekey="amenu_editQS_save"></asp:Localize></a>
                            <a href="#" id="amenu_editQS_cancel" class="adminGenericAction" onclick="router('adminCancel');"><span class="adminActionImg imgReset"></span><asp:Localize runat="server" meta:resourcekey="amenu_editQS_cancel"></asp:Localize></a>
                        </div>
                        <div id="editQSTabActions" class="specificToolbar"></div>
                        <div id="editQSActionsTitle">
                            <h2 id="editQSTitleELem"></h2>
                        </div>
                    </div>
                    <div id="editQSTabsWrapper" class="tabsWrapper">
                        <div id="editQSTabsInnerWrapper" class="innerWrapper">
                            <div id="editQSLinkTabs" class="linkTabs">
                                <div id="editQSLinkTabsCell" class="linkTabsCell">
                                    <div id="editQSLinkTabsRound" class="linkTabsRound">
                                        <div class="sectionHeader active">
                                            <a href="#" onclick="router('qsMenu_ConfigTab',0);"><asp:Localize runat="server" meta:resourcekey="editQSTabSettings"></asp:Localize></a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div id="editQSContent" class="contentTabs">
                                <div class="absoluteContainer">
                                    <div id="editQSTab">
                                        <div class="appSettingFrame active">
                                            <div id="appSetting_QSBasicSettings">
                                                <div class="appSetting">
                                                    <input type="hidden" id="qs_quickID" />
                                                    <label for="qs_layernameInp"><asp:Localize runat="server" meta:resourcekey="qs_layernameInp"></asp:Localize></label>
                                                    <select id="qs_layernameInp"></select>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="qs_layerfieldInp"><asp:Localize runat="server" meta:resourcekey="qs_layerfieldInp"></asp:Localize></label>
                                                    <select id="qs_layerfieldInp"></select>
                                                </div>
                                                <div class="appSetting">
                                                    <label class="radioExplanation"><asp:Localize runat="server" meta:resourcekey="qs_layerSearchType"></asp:Localize></label>
                                                    <input type="radio" name="qs_layerSearchType" id="qs_layerSearchType1" value="distinct" checked="checked" />
                                                    <label for="qs_layerSearchType1" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_layerSearchType1"></asp:Localize></label>
                                                    <input type="radio" name="qs_layerSearchType" id="qs_layerSearchType2" value="input" /> 
                                                    <label for="qs_layerSearchType2" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_layerSearchType2"></asp:Localize></label>
                                                    <input type="radio" name="qs_layerSearchType" id="qs_layerSearchType3" value="customSQL" disabled="disabled" />
                                                    <label for="qs_layerSearchType3" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_layerSearchType3"></asp:Localize></label>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="qs_searchOp"><asp:Localize runat="server" meta:resourcekey="qs_searchOp"></asp:Localize></label>
                                                    <select id="qs_searchOp">
                                                        <option value="EQ" selected="selected"><asp:Localize runat="server" meta:resourcekey="sqlOP_EQ"></asp:Localize></option>
                                                        <option value="LIKE"><asp:Localize runat="server" meta:resourcekey="sqlOP_LIKE"></asp:Localize></option>
                                                        <option value="NEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_NEQ"></asp:Localize></option>
                                                        <option value="GEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_GEQ"></asp:Localize></option>
                                                        <option value="GT"><asp:Localize runat="server" meta:resourcekey="sqlOP_GT"></asp:Localize></option>
                                                        <option value="LEQ"><asp:Localize runat="server" meta:resourcekey="sqlOP_LEQ"></asp:Localize></option>
                                                        <option value="LT"><asp:Localize runat="server" meta:resourcekey="sqlOP_LT"></asp:Localize></option>
                                                    </select>
                                                </div>
                                                <div class="appSetting">
                                                    <label class="radioExplanation"><asp:Localize runat="server" meta:resourcekey="qs_searchLayout"></asp:Localize></label>
                                                    <input type="radio" name="qs_searchLayout" id="qs_searchLayout1" value="checkbox" checked="checked" />
                                                    <label for="qs_searchLayout1" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_searchLayout1"></asp:Localize></label>
                                                    <input type="radio" name="qs_searchLayout" id="qs_searchLayout2" value="dropdown" disabled="disabled" />
                                                    <label for="qs_searchLayout2" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_searchLayout2"></asp:Localize></label>
                                                    
                                                </div>
                                                <div class="appSetting">
                                                    <label class="radioExplanation"><asp:Localize runat="server" meta:resourcekey="qs_searchMode"></asp:Localize></label>
                                                    <input type="radio" name="qs_searchMode" id="qs_searchMode1" value="auto" checked="checked" />
                                                    <label for="qs_searchMode1" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_searchMode1"></asp:Localize></label>
                                                    <input type="radio" name="qs_searchMode" id="qs_searchMode2" value="buttons" disabled="disabled" />
                                                    <label for="qs_searchMode2" class="radiolabel"><asp:Localize runat="server" meta:resourcekey="qs_searchMode2"></asp:Localize></label>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="qs_windowTitle"><asp:Localize runat="server" meta:resourcekey="qs_windowTitle"></asp:Localize></label>
                                                    <input type="text" id="qs_windowTitle" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>   
            </div>
            <div id="editMacroPop">
                <div id="editMacroContentWrapper" class="contentWrapper">
                    <div style="display:none">
                        <div id="popupWiz">
                            <div class="appSettingFrame active">
                                <div class="appSetting">
                                    <label for="popupWiz_id"><asp:Localize runat="server" meta:resourcekey="popupWiz_id"></asp:Localize></label>
                                    <input id="popupWiz_id" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_header"><asp:Localize runat="server" meta:resourcekey="popupWiz_header"></asp:Localize></label>
                                    <input id="popupWiz_header" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_width"><asp:Localize runat="server" meta:resourcekey="popupWiz_width"></asp:Localize></label>
                                    <input id="popupWiz_width" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_height"><asp:Localize  runat="server" meta:resourcekey="popupWiz_height"></asp:Localize></label>
                                    <input id="popupWiz_height" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_position"><asp:Localize runat="server" meta:resourcekey="popupWiz_position"></asp:Localize></label>
                                    <input id="popupWiz_position" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_dispHeader"><asp:Localize runat="server" meta:resourcekey="popupWiz_dispHeader"></asp:Localize></label>
                                    <input id="popupWiz_dispHeader" type="checkbox" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_dispClose"><asp:Localize runat="server" meta:resourcekey="popupWiz_dispClose"></asp:Localize></label>
                                    <input id="popupWiz_dispClose" type="checkbox" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_isMovable"><asp:Localize runat="server" meta:resourcekey="popupWiz_isMovable"></asp:Localize></label>
                                    <input id="popupWiz_isMovable" type="checkbox" />
                                </div>
                                <div class="appSetting">
                                    <label for="popupWiz_textArea"><asp:Localize runat="server" meta:resourcekey="popupWiz_textArea"></asp:Localize></label>
                                    <textarea ID="popupWiz_textArea"  Height="200" Width="500" />
                                </div>
                                <div class="appSetting output">
                                    <label for="popupWiz_output"><asp:Localize runat="server" meta:resourcekey="popupWiz_output"></asp:Localize></label>
                                    <textarea id="popupWiz_output" readonly="readonly" />
                                    <a href="#" class="freshButton defaultAction" onclick="router('popupWiz_copyToMacro');"><asp:Localize runat="server" meta:resourcekey="popupWiz_btnCopy"></asp:Localize></a>
                                    <a href="#" class="freshButton" onclick="router('popupWiz_testIt');"><asp:Localize runat="server" meta:resourcekey="popupWiz_btnRun"></asp:Localize></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="editMacroActions" class="superActions">
                        
                        <div id="editMacroToolbar" class="mainToolbar">
                            <a href="#" id="amenu_editMacro_save" class="adminGenericAction" onclick="router('adminOK');"><span class="adminActionImg imgSave"></span><asp:Localize runat="server" meta:resourcekey="amenu_editMacro_save"></asp:Localize></a>
                            <a href="#" id="amenu_editMacro_cancel" class="adminGenericAction" onclick="router('adminCancel');"><span class="adminActionImg imgReset"></span><asp:Localize runat="server" meta:resourcekey="amenu_editMacro_cancel"></asp:Localize></a>
                        </div>
                        <div id="editMacroTabActions" class="specificToolbar"></div>
                        <div id="editMacroActionsTitle">
                            <h2 id="editMacroTitleElem"></h2>
                        </div>
                    </div>
                    <div id="editMacroTabsWrapper" class="tabsWrapper">
                        <div id="editMacroTabsInnerWrapper" class="innerWrapper">
                            <div id="editMacroLinkTabs" class="linkTabs">
                                <div id="editMacroLinkTabsCell" class="linkTabsCell">
                                    <div id="editMacroLinkTabsRound" class="linkTabsRound">
                                        <div class="sectionHeader active">
                                            <a href="#" onclick="router('macroMenu_ConfigTab',0)"><asp:Localize runat="server" meta:resourcekey="editMacroTabSettings"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('macroMenu_ConfigTab',1);"><asp:Localize runat="server" meta:resourcekey="editMacroTabCommands"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('macroMenu_ConfigTab',2);"><asp:Localize runat="server" meta:resourcekey="editMacroTabContainer"></asp:Localize></a>
                                        </div>
                                        <div class="sectionHeader">
                                            <a href="#" onclick="router('macroMenu_ConfigTab',3);"><asp:Localize runat="server" meta:resourcekey="editMacroTabButton"></asp:Localize></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="editMacroContent" class="contentTabs">
                                <div class="absoluteContainer">
                                    <div id="editMacroTab">
                                        <div class="appSettingFrame active">
                                            <div id="appSetting_MacroBasicSettings">
                                                <div class="appSetting">
                                                    <input type="hidden" id="macro_id" />
                                                    <label for="appSetting_MacroName"><asp:Localize runat="server" meta:resourcekey="editMacro_macroName"></asp:Localize></label>
                                                    <input id="appSetting_MacroName" type="text" />
                                                    <a href="#" class="helpTooltip" id="tip_MacroName"></a>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_parentSelector"><asp:Localize runat="server" meta:resourcekey="editMacro_macroSelector"></asp:Localize></label>
                                                    <input id="appSetting_parentSelector" type="text" />
                                                    <a href="#" class="helpTooltip" id="tip_MacroSelector"></a>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_IsButton"><asp:Localize runat="server" meta:resourcekey="editMacro_macroIsButton"></asp:Localize></label>
                                                    <input id="appSetting_IsButton" type="checkbox" checked="checked"/>
                                                    <a href="#" class="helpTooltip" id="tip_MacroButton"></a>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appSetting_IsForRegistered"><asp:Localize runat="server" meta:resourcekey="editMacro_macroIsForRegistered"></asp:Localize></label>
                                                    <input id="appSetting_IsForRegistered" type="checkbox" />
                                                    <a href="#" class="helpTooltip" id="tip_MacroRegistered"></a>
                                                </div>
                                                <div class="appSetting">
                                                    <label for="appsetting_chooseMacroApp"><asp:Localize runat="server" meta:resourcekey="editMacro_macroAppID"></asp:Localize></label>
                                                    <select id="appsetting_chooseMacroApp"></select>
                                                    <a href="#" class="helpTooltip" id="tip_MacroApp"></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="appSettingFrame">
                                            <a href="#" class="freshButton" onclick="router('buildPopup');return false;"><asp:Localize runat="server" meta:resourcekey="popupWiz_button"></asp:Localize></a>
                                            <label for="macroCommandsEditor" class="textareaExplain"><asp:Localize runat="server" meta:resourcekey="tip_macroCommandEditor"></asp:Localize></label>
                                            <textarea id="macroCommandsEditor" style="width:100%;height:265px;margin-top:10px;"></textarea>
                                        </div>
                                        <div class="appSettingFrame">
                                            <div style="width: 100%;display:inline-block;vertical-align: middle">
                                                <label for="macroContainerStyle" class="textareaExplain"><asp:Localize runat="server" meta:resourcekey="tip_macroContainerStyle"></asp:Localize></label>
                                                <textarea id="macroContainerStyle" style="width:100%;height:268px;margin-top:10px;"></textarea>
                                            </div>
                                            <!--
                                            <div style="width: 20%;display:inline-block;vertical-align: middle">
                                                <div id="previewMacro1"><a href="#" id="previewMacro1Btn"></a></div>    
                                            </div>
                                            -->
                                        </div>
                                        <div class="appSettingFrame">
                                            <div style="width: 100%;display:inline-block;vertical-align: middle">
                                                <label for="macroBtnStyle" class="textareaExplain"><asp:Localize runat="server" meta:resourcekey="tip_macroBtnStyle"></asp:Localize></label>
                                                <textarea id="macroBtnStyle" style="width:100%;height:268px;margin-top:10px;"></textarea>
                                            </div>
                                            <!--
                                            <div style="width: 20%;display:inline-block;vertical-align: middle">
                                                <div id="previewMacro2"><a href="#" id="previewMacro2Btn"></a></div>    
                                            </div>
                                            -->
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <div id="editDigitize" runat="server">
            <div id="editDigitizeContentWrapper" class="contentWrapper">
                <div id="editDigitizeActions" class="superActions">
                    
                    <div id="editDigitizeToolbar" class="mainToolbar">
                        <a href="#" id="amenu_editDigitize_save" class="adminGenericAction" onclick="router('adminOK');"><span class="adminActionImg imgSave"></span><asp:Localize runat="server" meta:resourcekey="amenu_editDigitize_save"></asp:Localize></a>
                        <a href="#" id="amenu_editDigitize_cancel" class="adminGenericAction" onclick="router('adminCancel');"><span class="adminActionImg imgReset"></span><asp:Localize runat="server" meta:resourcekey="amenu_editDigitize_cancel"></asp:Localize></a>
                    </div>
                    <div id="editDigitizeTabActions" class="specificToolbar"></div>
                    <div id="editDigitizeActionsTitle">
                        <h2 id="editDigitizeTitleElem"></h2>
                    </div>
                </div>
                <div id="editDigitizeTabsWrapper" class="tabsWrapper">
                    <div id="editDigitizeTabsInnerWrapper" class="innerWrapper">
                        <div id="editDigitizeLinkTabs" class="linkTabs">
                            <div id="editDigitizeLinkTabsCell" class="linkTabsCell">
                                <div id="editDigitizeLinkTabsRound" class="linkTabsRound">
                                    <div class="sectionHeader active">
                                        <a href="#" onclick="router('digitizeMenu_ConfigTab',0);"><asp:Localize runat="server" meta:resourcekey="editDigitizeTabFields"></asp:Localize></a>
                                    </div>
                                    <div class="sectionHeader">
                                        <a href="#" onclick="router('digitizeMenu_ConfigTab',1);"><asp:Localize runat="server" meta:resourcekey="editDigitizeTabImages"></asp:Localize></a>
                                    </div>
                                    <div class="sectionHeader">
                                        <a href="#" onclick="router('digitizeMenu_ConfigTab',2);"><asp:Localize runat="server" meta:resourcekey="editDigitizeTabFiles"></asp:Localize></a>
                                    </div><!--
                                    <div class="sectionHeader">
                                        <a href="#" onclick="router('digitizeMenu_ConfigTab',3);"><asp:Localize runat="server" meta:resourcekey="editDigitizeTabLinks"></asp:Localize></a>
                                    </div>
                                    -->
                                </div>
                            </div>
                        </div>
                        <div id="editDigitizeContent" class="contentTabs">
                            <div class="absoluteContainer">
                                <div id="editDigitizeTab">
                                    <div class="appSettingFrame active">
                                        <div id="appSetting_DigitizeFields"></div>
                                    </div>
                                    <div class="appSettingFrame">
                                        <div class="sectionButtons">
                                            <a href="#" class="adminGenericAction" onclick="router('editPopup_addImage');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Add"></asp:Localize></a>
                                            <a href="#" class="adminGenericAction disabled" onclick="router('editPopup_detachImage');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Remove"></asp:Localize></a></a>
                                        </div>
                                        <div id="appSetting_DigitizeImages"></div>
                                    </div>
                                    <div class="appSettingFrame">
                                        <div class="sectionButtons">
                                            <a href="#" class="adminGenericAction" onclick="router('editPopup_addFile');"><span class="addBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Add"></asp:Localize></a>
                                            <a href="#" class="adminGenericAction disabled" onclick="router('editPopup_detachFile');"><span class="removeBtn"></span><asp:Localize runat="server" meta:resourcekey="adminAppMap_Remove"></asp:Localize></a></a>
                                        </div>
                                        <div id="appSetting_DigitizeFiles"></div>
                                    </div>
                                    <!--
                                    <div class="appSettingFrame">
                                        <div class="sectionButtons">

                                        </div>
                                        <div id="appSetting_DigitizeLinks"></div>
                                    </div>
                                    -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="mapManager" runat="server">
            <div id="mapManagerHeader">
                <div id="mapManager_GenericActions">
                    <span id="mapManager_Tipper"><asp:Localize runat="server" meta:resourcekey="mapManager_load_Tipper"></asp:Localize></span>
                    <a id="mapManager_refreshList" class="btnTool" href="#"></a>
                    <a id="mapManager_toggleSelection" class="freshButton" href="#" onclick="router('mapManager_toggleAll',this);"><asp:Localize runat="server" meta:resourcekey="mapManager_btnSelectAll"></asp:Localize></a>
                    <div id="mapManager_Search">
                        <label for="mapManager_SearchInput"><asp:Localize runat="server" meta:resourcekey="mapManager_search_Prompt"></asp:Localize></label>
                        <input id="mapManager_SearchInput" type="text" name="mapManager_SearchInput" />
                    </div>
                </div>
                <div id="mapManager_FilterCont">
                    <span><asp:Localize runat="server" meta:resourcekey="mapManager_filterTip"></asp:Localize></span>
                    <select id="mapManager_filterOwnership" onchange="router('mapManager_filterMe');">
                        <option value="-1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnershipNull"></asp:Localize></option>
                        <option value="0"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnershipCreation"></asp:Localize></option>
                        <option value="1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnershipBuy"></asp:Localize></option>
                        <option value="2"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnershipSubscribe"></asp:Localize></option>
                        
                    </select>
                    <select id="mapManager_filterPublic" onchange="router('mapManager_filterMe');" style="display:none;">
                        <option value="-1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterPublicNull"></asp:Localize></option>
                        <option value="0"><asp:Localize runat="server" meta:resourcekey="mapManager_filterPublicFalse"></asp:Localize></option>
                        <option value="1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterPublicTrue"></asp:Localize></option>
                    </select>
                    <select id="mapManager_filterOwner" onchange="router('mapManager_filterMe');" style="display:none;">
                        <option value="-1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnerNull"></asp:Localize></option>
                        <option value="0"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnerFalse"></asp:Localize></option>
                        <option value="1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterOwnerTrue"></asp:Localize></option>
                    </select>
                    <select id="mapManager_filterCreator" onchange="router('mapManager_filterMe');" style="display:none;">
                        <option value="-1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterCreatorNull"></asp:Localize></option>
                        <option value="0"><asp:Localize runat="server" meta:resourcekey="mapManager_filterCreatorFalse"></asp:Localize></option>
                        <option value="1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterCreatorTrue"></asp:Localize></option>
                    </select>
                    <select id="mapManager_filterSubscriber" onchange="router('mapManager_filterMe');" style="display:none;">
                        <option value="-1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterSubscriberNull"></asp:Localize></option>
                        <option value="0"><asp:Localize runat="server" meta:resourcekey="mapManager_filterSubscriberFalse"></asp:Localize></option>
                        <option value="1"><asp:Localize runat="server" meta:resourcekey="mapManager_filterSubscriberTrue"></asp:Localize></option>
                    </select>
                </div>
                <div id="mapManager_SelectedActions" style="display:none">
                    
                </div>
                <div id="mapManager_SortContainer">
                    <a id="mapManager_sortName" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropName"></asp:Localize></a>
                    <a id="mapManager_sortLayerCount" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropLCount"></asp:Localize></a>
                    <a id="mapManager_sortCreateDate" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropCDate"></asp:Localize></a>
                    <a id="mapManager_sortUpdateDate" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropUDate"></asp:Localize></a>
                    <a id="mapManager_sortOwnershipType" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropOwnership"></asp:Localize></a><!--
                    <a id="mapManager_sortPublic" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropPublic"></asp:Localize></a>
                    <a id="mapManager_sortOwner" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropOwner"></asp:Localize></a>
                    <a id="mapManager_sortCreator" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropCreator"></asp:Localize></a>
                    <a id="mapManager_sortSubscriber" class="sortButton" href="#"><asp:Localize runat="server" meta:resourcekey="mapManager_load_PropSubscriber"></asp:Localize></a>-->
                </div>
            </div>
            <div id="mapManagerListCont">
                <div id="mapManagerList"></div>
            </div>
            <div id="mapManagerDialogButtons" style="display: none;">
                <a id="mapManager_OK" class="defaultAction freshButton" href="#" onclick="router('adminOK');"><asp:Localize runat="server" meta:resourcekey="mapManager_btnOK"></asp:Localize></a>
                <a id="mapManager_CANCEL" class="freshButton" href="#" onclick="router('adminCancel');"><asp:Localize runat="server" meta:resourcekey="mapManager_btnCANCEL"></asp:Localize></a>
            </div>
        </div>
        
        <div id="layerManager" runat="server">
            <div id="layerManagerHeader">
                
            </div>
            <div id="layerManagerListCont">
                <div id="layerManagerList"></div>
            </div>
            <div id="layerManagerDialogButtons" style="display: none;">
                <a id="layerManager_OK" class="defaultAction freshButton" href="#" onclick="router('adminOK');"><asp:Localize runat="server" meta:resourcekey="mapManager_btnOK"></asp:Localize></a>
                <a id="layerManager_CANCEL" class="freshButton" href="#" onclick="router('adminCancel');"><asp:Localize runat="server" meta:resourcekey="mapManager_btnCANCEL"></asp:Localize></a>
            </div>
        </div>
        
        <div id="infoDetachCont" class="infoDetachCont" runat="server">
	            <ul class="infoTabs">
		            <li><img runat="server" src='Images/type_fields.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeFields" /><span class="infoFieldsCount" runat="server" meta:resourcekey="tipTypeFields"></span></li>
		            <li><img runat="server" src='Images/type_images.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeImages" /><span class="infoImagesCount" runat="server" meta:resourcekey="tipTypeImages"></span></li>
		            <li><img runat="server" src='Images/type_files.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeFiles" /><span class="infoFilesCount" runat="server" meta:resourcekey="tipTypeFiles"></span></li>
		            <li><img runat="server" src='Images/type_links.png' style="width:18px;height:18px; vertical-align:top;margin-right: 6px;margin-left:3px;" meta:resourcekey="tipTypeLinks" /><span class="infoLinksCount" runat="server" meta:resourcekey="tipTypeLinks"></span></li>
	            </ul>
	            <div class="infoFields infoFeaturePopup"></div>
	            <div class="infoImages infoFeaturePopup"></div>
	            <div class="infoFiles infoFeaturePopup"></div>
	            <div class="infoLinks infoFeaturePopup"></div>
            </div>
    </div>
    </body>
</html>

