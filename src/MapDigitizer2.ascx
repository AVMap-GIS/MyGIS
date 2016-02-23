<%@ Control language="vb" Inherits="YourCompany.Modules.MapDigitizer2.MapDigitizer2" CodeFile="MapDigitizer2.ascx.vb" AutoEventWireup="false" Explicit="True" %>

<%@ Register TagPrefix="i386" Namespace="i386.UI" Assembly="i386.UI" %>
<%@ Register TagPrefix="dnn" Namespace="DotNetNuke.Web.UI.WebControls" Assembly="DotNetNuke.Web" %>
<%@ Register TagPrefix="pkdnn" TagName="Login" Src="~/DesktopModules/Admin/Authentication/Login.ascx" %>
<%@ Register TagPrefix="pkdnn" TagName="Auth" Src="~/DesktopModules/Admin/Authentication/Authentication.ascx" %>
<%@ Register TagPrefix="dnn" Assembly="DotNetNuke.WebControls" Namespace="DotNetNuke.UI.WebControls" %>
<%@ Register TagPrefix="dnn" Assembly="DotNetNuke" Namespace="DotNetNuke.UI.WebControls"%>
<%@ Register TagPrefix="dnn" TagName="Label" Src="~/controls/LabelControl.ascx" %>
<%@ Register TagPrefix="dnn" TagName="Profile" Src="~/DesktopModules/Admin/Security/Profile.ascx" %>
<%@ Register TagPrefix="dnn" TagName="Password" Src="~/DesktopModules/Admin/Security/Password.ascx" %>
<%@ Register TagPrefix="dnn" TagName="User" Src="~/DesktopModules/Admin/Security/User.ascx" %>
<script src="http://code.jquery.com/jquery-migrate-1.1.0.js"></script>
<script type="text/javascript" src="<%= Me.ControlPath+"Scripts/standardScripts.js" %>"></script>
<script type="text/javascript" src="<%= Me.ControlPath+"Scripts/finalScript.js" %>"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.2&sensor=false&libraries=places"></script>

<asp:ScriptManagerProxy ID="cb1" runat="server"></asp:ScriptManagerProxy>
<asp:ScriptManagerProxy ID="cb5" runat="server"></asp:ScriptManagerProxy>
<asp:ScriptManagerProxy ID="cb6" runat="server"></asp:ScriptManagerProxy>
<div id="additionalScripts" runat="server"></div>

<!--[if !IE]><!--> <div class="NON_IE"> <!--<![endif]-->

<script type="text/javascript" >
    function raiseAsyncPostback() {

        login("<%= login_btn.UniqueID  %>"); 
        return false;
    }
    
</script>
<div style="position: fixed;top: 0;bottom:0;left:0;right:0;background-color: White;">

<div id="page_effect" class="MapDigitizer">
    
    <div id="toplinkbar">
        <asp:Image ID="logo" runat="server" />
        <a href="http://www.avmap.gr/geoinformation/"><asp:Localize runat="server" meta:resourcekey="linkCompany1"></asp:Localize></a>
        <a href="http://www.avmap.gr/informatics/"><asp:Localize runat="server" meta:resourcekey="linkCompany2"></asp:Localize></a>
        <a href="http://www.avmap.gr/environment/"><asp:Localize runat="server" meta:resourcekey="linkCompany3"></asp:Localize></a>
        <a href="http://www.avmap.gr/promotion/"><asp:Localize runat="server" meta:resourcekey="linkCompany4"></asp:Localize></a>
        <a href="http://www.avmap.gr/funding/"><asp:Localize runat="server" meta:resourcekey="linkCompany5"></asp:Localize></a>
        <a href="http://estates.avmap.gr/"><asp:Localize runat="server" meta:resourcekey="linkCompany6"></asp:Localize></a>
        <a href="http://www.avmap.gr/e-shop/"><asp:Localize  runat="server" meta:resourcekey="linkCompany7"></asp:Localize></a>
        <a href="http://www.mygis.gr/" class="active"><asp:Localize runat="server" meta:resourcekey="linkDigitizer"></asp:Localize></a>
        <a href="http://job2day.gr/"><asp:Localize runat="server" meta:resourcekey="linkCompany8"></asp:Localize></a>
        <a href="http://eclass.avmap.gr/"><asp:Localize runat="server" meta:resourcekey="linkCompany9"></asp:Localize></a>
    </div>
     
    <div ID="applicationContainer">
        <div class="ui-layout-center">
                    
            <div id="panel1">
                <div class="ui-layout-north">
                    <a href="#" id="toggleMapOverviewSearch" class="btnTool" onclick="router('toggleGoogle');return false;"></a>
                    <div id="customOverview" class="olControlOverviewMapContainer" ></div>
                    <div class="googleSearchContainer" style="display:none;">
                        <input type="text" id="autoComplete" />
                    </div>
                    
                    <div id="bottomTabContainer">
                        <ul id="bottomTabsRow">
                            <li><asp:Localize ID="btnStartHere"  runat="server" meta:resourcekey="btnStartHere"></asp:Localize></li>
                            <li><asp:Localize ID="mapControlPanelTitle"  runat="server" meta:resourcekey="mapControlPanelTitle"></asp:Localize></li>
                            <li><asp:Localize ID="layerControlPanelTitle"  runat="server" meta:resourcekey="layerControlPanelTitle"></asp:Localize></li>
                            <li><asp:Localize ID="resultsPanelTitle"   runat="server" meta:resourcekey="resultsPanelTitle"></asp:Localize></li>
                            <li><asp:Localize ID="editPanelTitle"  runat="server" meta:resourcekey="editPanelTitle"></asp:Localize></li>
                            <li id="tabsCloseButton">X</li>
                        </ul>
                        <div>   <!-- Start here -->
                            <div id="pageHelpActions" class="tabTopActions">
                                <a href="#" title="Start here" id="pageHelpStartHere" onclick="router('appManual');return false;"><span class="pageHelpLabel"><asp:Localize ID="pageHelp_StartHere"  runat="server" meta:resourcekey="pageHelp_StartHere"></asp:Localize></span></a>
                                <a href="#" title="Change map" id="pageHelpChangeMap" onclick="router('shortcutMaps');return false;"><span class="pageHelpLabel"><asp:Localize ID="pageHelp_ChangeMap"  runat="server" meta:resourcekey="pageHelp_ChangeMap"></asp:Localize></span></a>
                                <a href="#" title="Search the map" id="pageHelpSearchMap" onclick="router('shortcutSearches');return false;"><span class="pageHelpLabel"><asp:Localize ID="pageHelp_SearchMap" runat="server" meta:resourcekey="pageHelp_SearchMap"></asp:Localize></span></a>
                            </div>
                        </div>
                        <div>   <!-- Maps -->
                            <div class="tabTopActions">
                                <div class="gisButtonGrouping first">
                                    <a id="btnMaps_Load" class="gisButton" href="#" onclick="router('lmap');return false;"><span class="helpLabel"><asp:Localize ID="mapLoadBtn"  runat="server" meta:resourcekey="mapLoadBtn"></asp:Localize></span></a>                                        
                                </div>
                                <div class="gisButtonGrouping">
                                    <a id="btnMaps_New" class="gisButton disabled" href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;"><span class="helpLabel"><asp:Localize ID="btnCreateNewMap"   runat="server" meta:resourcekey="btnCreateNewMap"></asp:Localize></span></a>                                        
                                    <a id="btnMaps_Edit" class="gisButton disabled" href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;"><span class="helpLabel"><asp:Localize ID="btnEditMap"  runat="server" meta:resourcekey="btnEditMap"></asp:Localize></span></a>
                                    <a id="btnMaps_Remove" class="gisButton disabled" href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;"><span class="helpLabel"><asp:Localize ID="btnRemoveSelectedMap"  runat="server" meta:resourcekey="btnRemoveSelectedMap"></asp:Localize></span></a>
                                </div>
                            </div>
                        </div>
                        <div>   <!-- Layers -->
                            <div class="tabTopActions">
                                <div class="gisButtonGrouping first">
                                    <a id="mapDL" class="gisButton" href="#" onclick="router('mapDL',this);return false;"><span class="helpLabel"><asp:Localize ID="btnExtractCurrentMap"  runat="server" meta:resourcekey="btnExtractCurrentMap"></asp:Localize></span></a>
                                    <a id="btnLayer_ZoomFull" class="gisButton disabled"  href="#" onclick="router('tlz');return false;"><span class="helpLabel"><asp:Localize ID="btnLayer_ZoomFull" runat="server" meta:resourcekey="btnLayer_ZoomFull"></asp:Localize></span></a>
                                </div>
                                <div class="gisButtonGrouping">
                                    <a id="btnLayer_New" class="gisButton disabled" href="#"><span class="helpLabel"><asp:Localize ID="btnLayer_New"  runat="server" meta:resourcekey="btnLayer_New"></asp:Localize></span></a>
                                    <a id="btnLayer_Add" class="gisButton disabled" href="#"><span class="helpLabel"><asp:Localize ID="btnAddLayer"  runat="server" meta:resourcekey="btnAddLayer"></asp:Localize></span></a>
                                    <div class="gisMiniCont">
                                        <a id="btnLayer_Up" class="gisButton disabled mini" href="#" onclick="router('tlmu');return false;"><span class="helpLabel"><asp:Localize ID="btnLayer_Up"  runat="server" meta:resourcekey="btnLayer_Up"></asp:Localize></span></a>
                                        <a id="btnLayer_Down" class="gisButton disabled mini" href="#" onclick="router('tlmd');return false;"><span class="helpLabel"><asp:Localize ID="btnLayer_Down"  runat="server" meta:resourcekey="btnLayer_Down"></asp:Localize></span></a>
                                        <a id="btnLayer_Remove" class="gisButton disabled mini" href="#" onclick="router('tlr');return false;"><span class="helpLabel"><asp:Localize ID="btnLayer_Remove"  runat="server" meta:resourcekey="btnLayer_Remove"></asp:Localize></span></a>
                                    </div>
                                </div>
                                <div class="gisButtonGrouping">
                                    <a id="btnLayer_ViewMetaData" class="gisButton disabled" href="#"><span class="helpLabel"><asp:Localize ID="lp_HeaderMetadata"  runat="server" meta:resourcekey="lp_HeaderMetadata"></asp:Localize></span></a>
                                    <a id="btnLayer_EditStyle" class="gisButton disabled" href="#"><span class="helpLabel"><asp:Localize ID="lp_HeaderStyles"  runat="server" meta:resourcekey="lp_HeaderStyles"></asp:Localize></span></a>
                                </div>
                            </div>
                        </div>
                        <div>   <!-- Searches -->
                            <div class="tabTopActions">
                                <div class="gisButtonGrouping first">
                                    <a id="btnAddSearch" href="#" class="gisButton" onclick="router('mapAction_buildQuery'); return false;"><span class="helpLabel"><asp:Localize ID="btnAddSearch"  runat="server" meta:resourcekey="btnAddSearch"></asp:Localize></span></a>
                                    <a id="btnPlaySearch" href="#" class="gisButton disabled" onclick="queryResultsRun();return false;"><span class="helpLabel"><asp:Localize ID="btnPlaySearch"  runat="server" meta:resourcekey="btnPlaySearch"></asp:Localize></span></a>
                                    <a id="btnRemoveSearch" href="#" class="gisButton disabled" onclick="router('searchDelete');return false;"><span class="helpLabel"><asp:Localize ID="btnRemoveSearch"  runat="server" meta:resourcekey="btnRemoveSearch"></asp:Localize></span></a>
                                </div><!--
                                -->
                            </div>
                        </div>
                        <div>   <!-- edit panel -->
                            <div class="tabTopActions">
                                <div>
                                    <div >
                                        <div>   <!-- edit panel -->
                                            <div class="tabTopActions">
                                                <div class="gisButtonGrouping first">
                                                    <div id="Div5" class="yatoolbar">
                                                        <a id="editModeCopy" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditCopy"  runat="server" meta:resourcekey="drawer_EditCopy"></asp:Localize></a><!--
                                                     --><a id="editModePaste" href="#" class="freshButton disabled" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditPaste"  runat="server" meta:resourcekey="drawer_EditPaste"></asp:Localize></a><!--
                                                     --><a id="editModeDelete" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditDelete"  runat="server" meta:resourcekey="drawer_EditDelete"></asp:Localize></a><!--
                                                   
                                                     --><a id="editModeDrag" href="#" class="pressed freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditPosition"  runat="server" meta:resourcekey="drawer_EditPosition"></asp:Localize></a><!--
                                                     --><a id="editModeRotate" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditRotation"  runat="server" meta:resourcekey="drawer_EditRotation"></asp:Localize></a><!--
                                                     --><a id="editModeResize" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditSize"  runat="server" meta:resourcekey="drawer_EditSize"></asp:Localize></a><!--
                                                     --><a id="editModeReshape" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="drawer_EditShape"  runat="server" meta:resourcekey="drawer_EditShape"></asp:Localize></a>
                                                    </div>
                                                </div>
                                                <div class="gisButtonGrouping">
                                                    <div id="mode_EditableInfo" class="drawerContainer drawer">
                                                        <a id="A1" class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_EditableInfo" runat="server">
                                                            <span class="switchLabel"><asp:Localize ID="help_mode_EditableInfoLabel"  runat="server" meta:resourcekey="help_mode_EditableInfoLabel"></asp:Localize></span>
                                                            <span class="switch">
                                                                <span>
                                                                    <small class="on"><asp:Localize ID="Localize4"   runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                                    <small class="off"><asp:Localize ID="Localize5"  runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                                </span>
                                                             </span>
                                                        </a>
                                                     </div>
                                                    <div id="mode_Grouping" class="drawerContainer">
                                                        <a id="A2"   class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_Grouping" runat="server">
                                                            <span class="switchLabel"><asp:Localize ID="help_mode_GroupingLabel"  runat="server" meta:resourcekey="help_mode_GroupingLabel"></asp:Localize></span>
                                                            <span class="switch">
                                                                <span>
                                                                    <small class="on"><asp:Localize ID="Localize6" runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                                    <small class="off"><asp:Localize ID="Localize7"   runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                                </span>
                                                             </span>
                                                        </a>
                                                     </div>
                                                    <div id="mode_Snap" class="drawerContainer">
                                                        <a class="drawer" href="#" onclick="router('tlSM',this);return false;" >
                                                            <span class="switchLabel"><asp:Localize ID="help_mode_SnappingLabel"  runat="server" meta:resourcekey="help_mode_SnappingLabel"></asp:Localize></span>
                                                            <span class="switch">
                                                                <span>
                                                                    <small class="on"><asp:Localize ID="Localize8"   runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                                    <small class="off"><asp:Localize ID="Localize9" runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                                </span>
                                                             </span>
                                                        </a>
                                                     </div>
                                                 </div>          
                                            </div>
                                        </div>
                                        <div></div><!-- Collapse -->
                                    </div>
                                </div>
                                <div class="gisButtonGrouping first">
                                    <div id="selectModeTools_2" class="yatoolbar">
                                
                                        <a id="editModeCopy" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize10"   runat="server" meta:resourcekey="drawer_EditCopy"></asp:Localize></a><!--
                                     --><a id="editModePaste" href="#" class="freshButton disabled" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize11"   runat="server" meta:resourcekey="drawer_EditPaste"></asp:Localize></a><!--
                                     --><a id="editModeDelete" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize12"  runat="server" meta:resourcekey="drawer_EditDelete"></asp:Localize></a><!--
                                   
                                     --><a id="editModeDrag" href="#" class="pressed freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize13"   runat="server" meta:resourcekey="drawer_EditPosition"></asp:Localize></a><!--
                                     --><a id="editModeRotate" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize14"   runat="server" meta:resourcekey="drawer_EditRotation"></asp:Localize></a><!--
                                     --><a id="editModeResize" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize15"   runat="server" meta:resourcekey="drawer_EditSize"></asp:Localize></a><!--
                                     --><a id="editModeReshape" href="#" class="freshButton" onclick="router('editModeBtn',this);return false;"><asp:Localize ID="Localize16"  runat="server" meta:resourcekey="drawer_EditShape"></asp:Localize></a>
                                    
                                    </div>
                                </div>
                                <div class="gisButtonGrouping">
                                    <div id="mode_EditableInfo" class="drawerContainer drawer">
                                        <a id="A3"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_EditableInfo" runat="server">
                                            <span class="switchLabel"><asp:Localize ID="Localize17"  runat="server" meta:resourcekey="help_mode_EditableInfoLabel"></asp:Localize></span>
                                            <span class="switch">
                                                <span>
                                                    <small class="on"><asp:Localize ID="Localize18"  runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                    <small class="off"><asp:Localize ID="Localize19"  runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                </span>
                                             </span>
                                        </a>
                                     </div>
                                    <div id="mode_Grouping" class="drawerContainer">
                                        <a id="A4" class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_Grouping" runat="server">
                                            <span class="switchLabel"><asp:Localize ID="Localize20" runat="server" meta:resourcekey="help_mode_GroupingLabel"></asp:Localize></span>
                                            <span class="switch">
                                                <span>
                                                    <small class="on"><asp:Localize ID="Localize21"  runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                    <small class="off"><asp:Localize ID="Localize22"  runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                </span>
                                             </span>
                                        </a>
                                     </div>
                                    <div id="mode_Snap" class="drawerContainer">
                                        <a class="drawer" href="#" onclick="router('tlSM',this);return false;" >
                                            <span class="switchLabel"><asp:Localize ID="Localize23"   runat="server" meta:resourcekey="help_mode_SnappingLabel"></asp:Localize></span>
                                            <span class="switch">
                                                <span>
                                                    <small class="on"><asp:Localize ID="Localize24"  runat="server" meta:resourcekey="coolBtnOn"></asp:Localize></small>
                                                    <small class="off"><asp:Localize ID="Localize25"  runat="server" meta:resourcekey="coolBtnOff"></asp:Localize></small>
                                                </span>
                                             </span>
                                        </a>
                                     </div>
                                </div>          
                            </div>
                        </div>
                        <div></div><!-- Collapse -->
                    </div>
                
                </div>
                <div class="ui-layout-center">
                    <div id="applyLayersCont" style="display:none;">
                        <a href="#" id="applyLayersBtn" onclick="router('applyLayerChanges');return false;" class="freshButton defaultAction" ><asp:Localize ID="applyLayersBtn" runat="server" meta:resourcekey="applyLayersBtn"></asp:Localize></a>
                        <a href="#" id="cancelLayersBtn" onclick="router('cancelLayerChanges');return false;" class="freshButton" ><asp:Localize ID="cancelLayersBtn" runat="server" meta:resourcekey="cancelLayersBtn"></asp:Localize></a>
                    </div>
                    <div id="dialog-extend-fixed-container" style="display:none">
                        <div id="dialog-extend-fixed-title" style="display:none">
                            <span id="dialog-extend-fixed-titleIcon"></span>
                            <asp:Localize ID="dialogMinimizedContainerTitle" runat="server" meta:resourcekey="dialogMinimizedContainerTitle"></asp:Localize>
                        </div>
                    </div>
                    <div id="sidePanel">
                        <div id="mapsAnalysis" class="subPanel">
                            <span class="listHeader"><asp:Localize ID="listHeader_Maps"  runat="server" meta:resourcekey="listHeader_Maps"></asp:Localize></span>
                            <div class="bottomTopPane" >
                                <div id="mapsList2"></div>
                            </div>
                        </div>
                        <div id="layersAnalysis" class="subPanel active">
                            <span class="listHeader"><asp:Localize ID="listHeader_Layers"  runat="server" meta:resourcekey="listHeader_Layers"></asp:Localize></span>
                            <div class="bottomTopPane" >
                                <div id="layersPanel" >
                                    <div class="objectWrapper">
                                        <div id="layersList"></div>
                                        <div id="layerlistClone"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="objectsAnalysis" class="subPanel">
                            <span class="listHeader"><asp:Localize ID="listHeader_Search"  runat="server" meta:resourcekey="listHeader_Search"></asp:Localize></span>
                            <div class="bottomTopPane" >
                                <div id="infoWindowContent">
                                    <div id="infoLeftCol">
                                        <a id="btnSearchSettings" href="#" onclick="router('mapAction_QuerySettings');return false;"></a>
                                        
                                        <div id="infoLeftList"></div>
                                    </div>
                                </div>                      
                            </div>
                        </div>
                    </div>
               
                    
                <div id="searchSettings" style="display:none">
                    <div class="gisButtonGrouping">
                        <div id="resultsMode">
                            <div id="mode_ResultsOnHover" class="drawerContainer drawer">
                                <a id="A5"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_ResultsOnHover" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="resultsModeDynamic"  runat="server" meta:resourcekey="resultsModeDynamic"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small class="on"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="gisButtonGrouping">
                        <div id="selectModeTools_0">
                            <div id="mode_TopSelect" class="drawerContainer">
                                <a id="A6"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_TopSelect" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="drawer_SelectTop"  runat="server" meta:resourcekey="drawer_SelectTop"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small clas="on"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                            <div id="mode_InfoSelect" class="drawerContainer drawer">
                                <a id="A7" class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_InfoSelect" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="drawer_SelectInfo"  runat="server" meta:resourcekey="drawer_SelectInfo"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small class="on"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                            <div id="mode_InfoStore" class="drawerContainer">
                                <a id="A8"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_InfoStore" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="drawer_SelectRecord"  runat="server" meta:resourcekey="drawer_SelectRecord"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small class="on"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="gisButtonGrouping">
                        <div id="selectModeTools_1">
                            <div id="mode_AddSelect" class="drawerContainer">
                                <a id="A9"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_AddSelect" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="drawer_EditAdd"  runat="server" meta:resourcekey="drawer_EditAdd"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small class="on"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                            <div id="mode_SubtractSelect" class="drawerContainer">
                                <a id="A10"  class="drawer" href="#" onclick="router('tlSM',this);return false;" meta:resourcekey="help_mode_SubtractSelect" runat="server">
                                    <span class="switchLabel"><asp:Localize ID="drawer_EditRemove"  runat="server" meta:resourcekey="drawer_EditRemove"></asp:Localize></span>
                                    <span class="switch">
                                        <span>
                                            <small class="on"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOn"></asp:Localize>--></small>
                                            <small class="off"><!--<asp:Localize runat="server" meta:resourcekey="coolBtnOff"></asp:Localize>--></small>
                                        </span>
                                     </span>
                                </a>
                            </div>
                        </div>     
                    </div>
                </div>          
                
                </div>

            </div>   
            
            <div id="panel2" class="leftExpanded">    
                
                    <div ID="middlePane">
                        <div id="mapTitleInfo" class="appTitle">
                            <div class="panelTitleButtons">
                                <!--<a href="#" id="menuTriggerBtn" class="freshButton"><asp:Localize ID="menuAct_menu" runat="server" meta:resourcekey="menuAct_menu" ></asp:Localize></a>-->
                                <a href="#" id="mapActionsBtn" title="" class="freshButton"></a>
                                
                            </div>
                            <div id="permaContainer"><a id="permaElem"><asp:Localize ID="permaElem2" runat="server" meta:resourcekey="permaElem"></asp:Localize></a></div>
                        </div>
                        <div id="mapWrapper">
                            <div id="mapContainer" style="width:100%; "></div>
                            <div id="mapFeaturesCont" style="display:none;"></div>
                            <div id="footerBar">
                                <a href="#" id="mapResultsToggleBtn" onclick="router('mapResultsToggle');return false;"></a>
                                <div id="logoContainer2">
                                    <div id="avlogo_wrapper" class="footerFloaters"></div>
                                    <img id="domainAdditionalLogo2" runat="server" class="domainLogoRight" />
                                    <img id="domainAdditionalLogo1" runat="server" class="domainLogoRight" />
                                </div>
                                <div id="mapFooter" class="appFooter">
                                    
                                    <span class="footerCaption footerFloaters"><asp:Localize runat="server" meta:resourcekey="scaleLabel" /></span>
                                    <select id="olScale_wrapper" onchange="router('scaleTo',this);" class="footerFloaters">
                                        <option id="currentScale" selected="selected"></option>
                                        <option>1: 100</option>
                                        <option>1: 500</option>
                                        <option>1: 1.000</option>
                                        <option>1: 5.000</option>
                                        <option>1: 50.000</option>
                                        <option>1: 500.000</option>
                                        <option>1: 5.000.000</option>
                                        <option>1: 50.000.000</option>
                                    </select>
                                    <div id="olScaleLine_wrapper" class="footerFloaters"></div>
                                    <div id="northArrow_wrapper" class="footerFloaters">
                                        <span id="Span1" runat="server" meta:resourcekey="northTextTip" class="northArrowText"><asp:Localize ID="northText" runat="server" meta:resourcekey="northText"></asp:Localize></span>
                                        <span id="mapDirectionArrow" /><!--<img src='<%= Me.ControlPath +  "Images/arrow_north_m.png" %>' />-->
                                    </div>
                                    <div id="map_projection_node" class="footerFloaters"></div>                                        
                                    <div id="customAttribution" class="olControlAttribution olControlNoSelect"></div>
                                </div>
                            </div>
                        </div>
                        <div id="layerSelectionListCont" style="display:none" class="">
                            <div id="layerSelectionHeader">
                                <a href="#" onclick="router('layerSelectionToggle','#layerSelectionToggleBtn'); return false;" id="layerSelectionToggleBtn" class="jqx-checkbox-default jqx-checkbox-default-pk_mg jqx-fill-state-normal jqx-fill-state-normal-pk_mg jqx-rc-all jqx-rc-all-pk_mg"></a><span id="layerSelectionHeaderLabel"><asp:Localize id="layerSelectionHeaderLabel" runat="server" meta:resourcekey="layerSelectionHeaderLabel"></asp:Localize></span>
                                <a id="selectionListCloseBtn" class="toolbarCloseBtn" onclick="$('#layerSelectionListCont').hide();return false;" href="#"></a>
                            </div>
                            <div id="layerSelectionList"></div> 
                        </div>
                        
                        <div id="mapFeatureSearchBar" style="display:none;">
                            <div id="searchBarTitle"><asp:Localize runat="server" ID="mapFeatureSearchLabel" meta:resourcekey="mapFeatureSearchLabel"></asp:Localize></div>
                            <a href="#" id="mapFeatureClose" onclick="router('mapFeatureSearchClose');return false;"></a>
                            <a href="#" id="mapFeatureNext" class="resultBtn" onclick="router('mapFeatureSearchNext');return false;"></a>
                            <a href="#" id="mapFeaturePrevious" class="resultBtn" onclick="router('mapFeatureSearchPrevious');return false;"></a>
                            <input type="text" id="mapFeatureSearch" />
                            <div>
                                <a id="btnSearchNew" href="#" onclick="router('mapAction_buildQuery');return false;"><asp:Localize id="btnSearchNew" runat="server" meta:resourcekey="btnSearchNew"></asp:Localize></a>
                                <a id="btnSearchList" href="#" onclick="router('togglePreviousSearch');return false;"><asp:Localize ID="btnSearchList" runat="server" meta:resourcekey="btnSearchList"></asp:Localize></a>
                            </div>       
                        </div>             
                        <div id="fWindowWrapper" style="display:none">
                            
                            <div id="fWindowContainer">
                                <div id="fDock1">
                                    
                                    <div id="window0" class="toolWindow first">
                                        <div class="yatoolbarLabel"><asp:Localize id="mapActions_General" runat="server" meta:resourcekey="mapActions_General"></asp:Localize></div>
                                        <div class="yatoolbarCont">
                                            <div class="yatoolbar">
                                                <a href="#" id="dragPanBtn" class="dragPanBtn btnTool selected" onclick="router('dragPanBtn');return false;"></a><!--
                                             --><a href="#" id="zoomBoxBtn" class="zoomBoxBtn btnTool" onclick="router('zoomBoxBtn');return false;"></a><!--
                                             --><a href="#" id="zoomOutBtn" class="zoomOutBtn btnTool" onclick="router('zoomOutBtn'); return false;"></a><!--
                                             --><a href="#" id="searchToggleBtn" class="btnTool" onclick="router('mapFeatureSearchToggle');return false;"></a><!--
                                             --><a href="#" id="toggleInfoBtn" class="toggleInfoBtn btnTool" onclick="router('toggleInfoBtn',false);return false;"></a><!--
                                             --><a href="#" id="toggleOverviewBtn" class="toggleOverviewBtn btnTool selected" onclick="router('toggleOverviewBtn');return false;"></a><!--
                                             --><!--<a href="#" id="toggleDrillInfoBtn" class="toggleDrillInfoBtn btnTool" onclick="router('toggleInfoBtn',false);return false;"></a>-->
                                            </div>
                                        </div>
                                    </div><!--
                                    --><div id="window1" class="toolWindow" >
                                        <div class="yatoolbarLabel"><asp:Localize  runat="server" meta:resourcekey="mapSelectBtn"></asp:Localize></div>
                                        <div class="yatoolbarCont">
                                            <div id="mapSelectToolbar" class="yatoolbar">
                                                <a id="infoTool" href="#" class="btnTool infoTool" onclick="router('selectCtrl',this);return false;"></a>
                                                <a id="selectObject" href="#" class="btnTool selectObjButton" onclick="router('selectCtrl',this);return false;"></a><!-- infoPoint, infoRect                                                 
                                             --><a id="selectRect" href="#" class="btnTool rectangleButton" onclick="router('selectCtrl',this);return false;"></a><!-- JK CHANGES - Circle select btn
                                             --><a id="selectCircle" href="#" class="btnTool circleButton" onclick="router('selectCtrl',this);return false;"></a><!-- 
                              JK CHANGES END --><a id="selectClear" href="#" class="btnTool selectClearButton disabled" onclick="router('selectCtrl',this);return false;"></a>
                                            </div>
                                        </div>
                                    </div><!--
                                 --><div id="window2" class="toolWindow" >
                                        <div class="yatoolbarLabel"><asp:Localize ID="toggleToolbar1" runat="server" meta:resourcekey="mapAction_Tools"></asp:Localize></div>
                                        <div class="yatoolbarCont">
                                            <div id="mapToolbar" class="yatoolbar">
                                                <a title="Σχεδίαση σημείου" class="btnTool markerButton" id="markerButton" type="button" onclick="router('markerButton',this);return false;"></a><!--
                                             --><a title="Σχεδίαση γραμμής" class="btnTool polylineButton" id="polylineButton" type="button" onclick="router('polylineButton',this);return false;"></a><!--
                                             --><a title="Σχεδίαση πολυγώνου" class="btnTool polygonButton" id="polygonButton" type="button" onclick="router('polygonButton',this);return false;"></a><!--
                                             --><a title="Σχεδίαση ορθογωνίου" class="btnTool rectangleButton" id="rectangleButton" type="button" onclick="router('rectangleButton',this);return false;"></a>
                                            </div>
                                        </div>
                                    </div><!--
                                 --><div class="toolWindow special">
                                        <div class="coordsCont">
                                            <div id="ll_mouse" class="footerFloaters"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
      
                    </div>
                          
            </div>    
            
            <div id="panel3Out" class="collapsed">
            <div id="layerWithinSelectionListCont" style="display:none" class="">
                <div id="layerWithinSelectionInnerCont">
                    <div id="layerWithinSelectionHeader">
                        <a href="#" onclick="router('layerSelectionToggle','#layerWithinSelectionToggleBtn');return false;" id="layerWithinSelectionToggleBtn" class="jqx-checkbox-default jqx-checkbox-default-pk_mg jqx-fill-state-normal jqx-fill-state-normal-pk_mg jqx-rc-all jqx-rc-all-pk_mg"></a>
                        <span id="layerWithinSelectionHeaderLabel"><asp:Localize id="layerWithinSelectionHeaderLabel" runat="server" meta:resourcekey="layerWithinSelectionHeaderLabel"></asp:Localize></span>
                    </div>
                    <div id="layerWithinSelectionList"></div> 
                    <div id="layerWithinFunctionCont">
                        <select id="withinFunction">
                            <option value="0"><asp:Localize ID="withinFunction_Contained" runat="server" meta:resourcekey="withinFunction_Contained"></asp:Localize></option>
                        </select>
                        <span><asp:Localize ID="withinFunctionLabel" runat="server" meta:resourcekey="withinFunctionLabel"></asp:Localize></span>
                    </div>
                    <div><a href='#' id="withinSearchGo" class="defaultAction freshButton" onclick="router('withinSearchGo');return false;"><asp:Localize ID="withinSearchGo" runat="server" meta:resourcekey="withinSearchGo"></asp:Localize></a></div>
                </div>
            </div> 
            <div class="ui-widget-header">
                <div id="rpanelTabButtons">
                    <a href="#" id="filterTabButton"></a>
                    <a href="#" id="resultsTabButton"></a>
                </div>
                <div id="filterAnalysis">
                    <div id="filterAnalysisLogo">
                        <span><asp:Localize ID="mapActions_HotSearch_caption"  runat="server" meta:resourcekey="mapActions_HotSearch_caption"></asp:Localize></span>
                        <span id="totalResultsCount"></span>
                    </div>
                    <a id="showWithinBtn" href="#" class="modernLinkBtn" onclick="router('withinBtn');return false;"><asp:Localize runat="server" ID="showWithinBtn" meta:resourcekey="showWithinBtn"></asp:Localize></a>
                    <a id="showQueryStatsBtn" href="#" class="modernLinkBtn"  onclick="router('qstatsBtn');return false;"><asp:Localize runat="server" ID="qstatsBtn" meta:resourcekey="showQueryStatsBtn"></asp:Localize></a>
                    <span id="infoAnalysisHeader">
                        <label for="infoAnalysis_SearchInput"><asp:Localize ID="infoAnalysisHeader"  runat="server" meta:resourcekey="infoAnalysisHeader"></asp:Localize></label>
                        <input id="infoAnalysis_SearchInput" name="infoAnalysis_SearchInput" />
                    </span>
                    
                </div> 
            </div>
            <div id="panel3" class="ui-layout-content collapsed">
                <div id="panel3ContWrapper">
                    <div id="layerPropertiesWrapper">
                        <div id="layerPropertiesPanelCont">
                            <div id="layerPropertiesTitle" class=""></div>
                            <div id="layerPropertiesTabsCont">
                                <div id="layerPropertiesTabs">
                                    <div class="fCaption">
                                        <asp:Localize ID="Localize1"  runat="server" meta:resourcekey="lp_HeaderBasic"></asp:Localize>
                                    </div>
                                    <div>
                                        <div class="layerScrollGroup">
                                            <div id="layerPropertiesCommonActions" class="currentLevelActions">
                                                <a id="A12" onclick="router('tlvp',this);return false;" class="toggleLayerVisible" href="#" runat="server" meta:resourcekey="tl_VisibleTip"></a>
                                                <a id="A13" onclick="router('tle');return false;" class="toggleLayerEditable" href="#" runat="server" meta:resourcekey="tl_EditableTip"></a>
                                                <a onclick="router('tls');return false;" class="toggleLayerSelectable" href="#" meta:resourcekey="tl_SelectableTip"></a>
                                                <a onclick="router('tlz');return false;" class="zoomFull" href="#" meta:resourcekey="tl_ZoomTip"></a>
                                                <a onclick="return false;" class="editLayerStructure" href="#" meta:resourcekey="tl_StructureTip"></a>
                                                <a onclick="router('tlr');return false;" class="deleteLayer" href="#" meta:resourcekey="tl_DeleteTip"></a>
                                        
                                                <div class="layerCommonActionsRow2">
                                                    <span><asp:Localize ID="Localize2"  runat="server" meta:resourcekey="lp_MoveTitle"></asp:Localize></span>
                                                    <input type="text" value="1" class="moveLayerStep" name="moveLayerStep" id="moveLayerStep" />
                                                    <span><asp:Localize ID="Localize3"  runat="server" meta:resourcekey="lp_moveLayerTitle2"></asp:Localize></span>
                                                    <a onclick="router('tlmu');return false;" class="moveUp freshButton" href="#"><asp:Localize ID="Localize26"  runat="server" meta:resourcekey="lp_moveUp"></asp:Localize></a>
                                                    <a onclick="router('tlmd');return false;" class="moveDown freshButton" href="#"><asp:Localize ID="Localize27"  runat="server" meta:resourcekey="lp_Down"></asp:Localize></a>
                                                </div>
                                        
                                                <div class="layerRowGroup">
                                                    <div class="layerRowAction">
                                                        <span class="layerINLINEtitle"><asp:Localize ID="Localize28" runat="server" meta:resourcekey="lp_CloneTitle"></asp:Localize></span>

                                                        <a href="#" class="layerPropertyButton freshButton" ><asp:Localize ID="Localize29"  runat="server" meta:resourcekey="lp_Clone1"></asp:Localize></a>
                                                        <a href="#" class="layerPropertyButton freshButton" ><asp:Localize ID="Localize30" runat="server" meta:resourcekey="lp_Clone2"></asp:Localize></a>
                                                        
                                                    </div>
                                                </div>
                                        
                                                <div class="layerRowGroup">
                                                    <div class="layerRowAction">
                                                        <div><span><asp:Localize ID="Localize31" runat="server" meta:resourcekey="lp_VisibleTitle"></asp:Localize></span></div>
                                                        <div>
                                                            <div id="visibleFrom">
                                                                <a href="#" onclick="router('tlcf');return false;" class="visibleFromBtn freshButton"><asp:Localize ID="Localize32" runat="server" meta:resourcekey="visibleFromLabel"></asp:Localize></a><span>1: </span><input type="text" class="layerVisibleInput" />
                                                                <a href="#" class="layerPropertyButton populateButton" onclick="router('popScaleFrom',this);return false;"></a>
                                                            </div>
                                                            <div id="visibleTo">
                                                                <a href="#" onclick="router('tlct');return false;" class="visibleToBtn freshButton"><asp:Localize ID="Localize33"  runat="server" meta:resourcekey="visibleToLabel"></asp:Localize></a><span>1: </span><input type="text" class="layerVisibleInput" />
                                                                <a href="#" class="layerPropertyButton populateButton" onclick="router('popScaleTo',this);return false;"></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layerRowGroup">
                                                    <div class="layerRowAction">
                                                        <span class="layerINLINEtitle"><asp:Localize ID="Localize34" runat="server" meta:resourcekey="lp_LayerTransparency"></asp:Localize> </span>
                                                        <div id="layerOpacitySlider"></div>
                                                        <dnn:DnnTextBox ID="layerOpacityText" runat="server" ReadOnly="true" Width="40" Text="0%" ClientEvents-OnLoad="setlayerOpacityText"></dnn:DnnTextBox>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fCaption">
                                        <asp:Localize ID="Localize35"  runat="server" meta:resourcekey="lp_HeaderMetadata"></asp:Localize>
                                    </div>
                                    <div>
                                        <div class="layerScrollGroup">
                                            <div class="layerRowGroup">
                                                <div id="layerPropertiesGrouping" class="layerRowAction">
                                                    <span class="layerINLINEtitle"><asp:Localize ID="Localize36"  runat="server" meta:resourcekey="lp_GroupTitle"></asp:Localize></span><input type="text" />
                                                </div>
                                            </div>
                                            <div class="layerRowGroup">
                                                <div id="layerPropertiesKeywords" class="layerRowAction">
                                                    <div><asp:Localize ID="Localize37"  runat="server" meta:resourcekey="lp_KeywordsTitle"></asp:Localize></div>
                                                    <textarea readonly="readonly"></textarea>
                                                </div>
                                                
                                                <div class="layerRowAction">
                                                    <div><asp:Localize ID="Localize38"  runat="server" meta:resourcekey="lp_DescriptionTitle"></asp:Localize></div>
                                                    <textarea readonly="readonly" id="layerPropertiesDescription"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fCaption">
                                        <asp:Localize ID="Localize39"  runat="server" meta:resourcekey="lp_HeaderStyles"></asp:Localize>
                                    </div>
                                    <div>
                                        <div class="styleTab" id="styleTab1">
                                            <div>Κανόνες</div>
                                            <div id="layerstyleRuleListCont">
                                                <div id="layerstyleRuleList"></div>
                                                <div id="layerstyleRuleActions">
                                                    <a href="#" onclick="return false;">Add new rule</a>
                                                    <a href="#" onclick="return false;">Delete selected rule</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="styleTab" id="styleTab2">
                                        <div id="layerstyleSelector">
                                            <div class="stylerFinalButtons">
                                                <a href="#" class="defaultAction freshButton" onclick="router('styleApply');return false;">Apply</a>
                                                <a href="#" class="freshButton" onclick="router('styleSave');return false;">Save</a>
                                                <a href="#" class="freshButton" onclick="router('styleCancel');return false;">Cancel</a>
                                            </div>
                                            <div id="layerstylePanel" class="layerstylePanel">
                                                <div>
                                                    <a id="pointStyleButton" href="#" onclick="toggleStylerButton('Point');return false;" class="glossButton">
                                                        <span class="buttonTitle">Σημεία</span>
                                                        <div class="imgPreview">
                                                            <div id="markerPreview"></div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div>
                                                    <a id="lineStyleButton" href="#" onclick="toggleStylerButton('Line');return false;" class="glossButton">
                                                        <span class="buttonTitle">Γραμμές</span>
                                                        <div class="imgPreview">
                                                            <div id="polylinePreview" class="polylinePreview"></div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div>
                                                    <a id="polygonStyleButton" href="#" onclick="toggleStylerButton('Polygon');return false;" class="glossButton">
                                                        <span class="buttonTitle">Επιφάνειες</span>
                                                        <div class="imgPreview">
                                                            <div id="polygonPreview"></div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <!--</div>-->
                                    <!--<div class="fTab" id="layerLabelsW" style="height: 250px;">-->
                                    <div class="fCaption">
                                        <asp:Localize ID="Localize40"  runat="server" meta:resourcekey="lp_HeaderLabels"></asp:Localize>
                                    </div>
                                    <div></div>
                                    <!--</div>-->
                                    <!--<div class="fTab" id="layerThematicW" style="height: 250px;">-->
                                    <div class="fCaption">
                                        <asp:Localize ID="Localize41"  runat="server" meta:resourcekey="lp_HeaderThematic"></asp:Localize>
                                    </div>
                                    <div>
                                        <div class="layerScrollGroup">
                                    
                                        </div>
                                    </div>
                                     <!--</div>-->
                                </div>
                            </div>
                        </div>
                        
                        <div id="infoAnalysis">
                            
                            <div id="infoAnalysisContents" class="ui-layout-content"></div>
                            <div id="infoAnalysisHiddenContents" style="display:none"></div>
                            <div id="infoDetachContWrapper2" style="display:none"></div>
                        </div>
                        
                        <div id="mapsPropertiesCont">
                            <div id="mapsProperties">
                                <div class="fCaption">
                                    <asp:Localize ID="Localize42"  runat="server" meta:resourcekey="mapsPropertyTitle"></asp:Localize>
                                </div>
                                <div>
                                <div id="mapShortDescription" class="propertyValue"></div>
                                <table class="mapPropertiesTable">
                                    <tbody>
                                        <tr>
                                            <td class="propertyTitle"><asp:Localize ID="mapLayerCount" runat="server" meta:resourcekey="mapLayerCount"></asp:Localize></td>
                                            <td id="mapLayerCount" class="propertyValue"></td>
                                        </tr>
                                        <tr>
                                            <td class="propertyTitle"><asp:Localize ID="mapCreatedDate" runat="server" meta:resourcekey="mapCreatedDate"></asp:Localize></td>
                                            <td id="mapCreatedDate" class="propertyValue"></td>
                                        </tr>
                                        <tr>
                                            <td class="propertyTitle"><asp:Localize ID="mapUpdateDate" runat="server" meta:resourcekey="mapUpdateDate"></asp:Localize></td>
                                            <td id="mapUpdateDate" class="propertyValue"></td>
                                        </tr>
                                        <tr>
                                            <td class="propertyTitle"><asp:Localize ID="mapOwner" runat="server" meta:resourcekey="mapOwner"></asp:Localize></td>
                                            <td id="mapOwner" class="propertyValue"></td>
                                        </tr>
                                        <tr>
                                            <td class="propertyTitle"><asp:Localize ID="mapDeveloper" runat="server" meta:resourcekey="mapDeveloper"></asp:Localize></td>
                                            <td id="mapDeveloper" class="propertyValue"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div id="mapLargeThumbCont">
                                    <img id="mapLargeThumb" />
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        <div id="filterContents"></div>
                    </div>
                </div>
            </div>                           
        </div>
        </div>
        <div class="ui-layout-north">
            <div class="topPane">
                <div id="pageActionsInnerWrapper">
                    <div id="pageMacroActions"></div>
                    <div id="pageActions">
                          
                        <div class="loginActions" style="overflow:hidden;">
                        <a id="cmdHelp" runat="server" onclick="router('appManual2');return false"><asp:Localize id="cmdHelpTranslate" runat="server" meta:resourcekey="cmdHelp"></asp:Localize></a>                       
                        <a id="cmdRegister2" runat="server" onclick="router('cmdRegister2');return false;" class="regButton"><asp:Localize ID="registerBtn" runat="server" meta:resourcekey="registerBtn"></asp:Localize><span class="separator"></span></a><!--
                     --><a id="cmdLogin2" runat="server" onclick="router('cmdLogin2');return false;" class="loginButton"><asp:Localize ID="loginBtn" runat="server" meta:resourcekey="loginBtn"></asp:Localize><span class="separator"></a></span><!--
                     --><div id="pageActionsLeft"><!--
                            <a id="cmdMediaManager" href="#" runat="server" onclick="router('cmdMediaManager');return false;" visible="false" class="mmButton"><asp:Localize runat="server" meta:resourcekey="mediaManagerBtn"></asp:Localize><span class="separator"></span></a><!--
                         --><!--   
                         --><a id="mygis_cmdAP" href="#" runat="server" onclick="router('cmdAdminPanel');return false;" visible="false" class="adminButton"><asp:Localize runat="server" meta:resourcekey="adminPanelBtn"></asp:Localize><span class="separator"></span></a><!--
                         --><a id="cmdSwitchLayouts" href="#" runat="server" onclick="router('cmdSwitchLayout');return false;" visible="false" class="layoutBtn"></a><!--
                         --><a id="cmdInbox" href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;" runat="server" visible="false" class="mailBtn"><asp:Localize ID="inboxBtn" runat="server" meta:resourcekey="inboxBtn"></asp:Localize><span class="separator"></span></a><!--                            
                         --><a id="cmdAdministration" runat="server" href="#" onclick="router('cmdAdministration');return false;" Visible="False"><asp:Localize ID="adminBtn" runat="server" meta:resourcekey="adminBtn"></asp:Localize><span class="separator"></span></a>
                         </div>
                        </div>
                        <div class="flagContainer">
                            <asp:Hyperlink ID="switchEnglish" runat="server" BorderWidth="1"  /><!--
                         --><asp:Hyperlink ID="switchGreek" runat="server" BorderWidth="1"  />
                        </div>     
                    </div>
                </div>
                <div id="appTabs">
                    <div class="domainLogoWrapper2">
                        <a id="A11" href="~" runat="server">
                            <img id="domainLogo2" runat="server" class="domainLogoLeft" />
                        </a>
                    </div>
                    <div class="domainStaticText2">
                        <div style="display: inline-block;vertical-align:middle;">
                            <div class="domainStaticTextBackground" id="domainStaticTextBackground" runat="server">
                                <asp:Localize ID="domainText2" runat="server" />
                            </div>
                        </div>
                        <div class="undecidedTitle">
                                <span id="mapDescription" class="spanTitle"><asp:Localize ID="mapDescription2" runat="server" meta:resourcekey="mapLabel"></asp:Localize></span>
                                <a id="mapTitleEdit" href="#" onclick="displayNotify(msg_errFeatureNotImplemented);return false;"><asp:Localize ID="mapTitleEdit2" runat="server" meta:resourcekey="common_Edit"></asp:Localize></a>
                                <a id="mapChangeBtn"><asp:Localize runat="server" id="mapChangeBtn" meta:resourcekey="mapChangeBtn"></asp:Localize></a>
                            </div>
                    </div>                   
                </div>
            </div>
        </div>
        
        
        
    </div>
    
    <div id="lpanelTabButtons">
        <a href="#" id="allListsTabButton" class="active"></a>
        
    </div>
   
    <div id="rpanelCollapseCont">
        <a href="#" id="rpanelCollapseBtn"></a>
    </div>
       
    <div id="OutputForm" style="display:none">
            <input id="actionfield" value="" />
            <input id="KMLoutput" type="hidden" value="" />
        </div>
    <dnn:DnnTextBox CssClass="reqOrigin" runat="server" ID="requestOrigin" Visible="false" ReadOnly="True" />
    
    <!--<div id="Notification"></div>-->
    <div id="forgotCont" style="display:none">
    </div>
    <div id="loginDialogCont" style="display:none">
        <div id="loginDialog" >
            <div class="introduction">
                <span>
                    <asp:Localize ID="loginTitle" runat="server" meta:resourcekey="loginTitle"></asp:Localize>
                </span>
            </div>
            <div class="fields">
                
                <div>
                    <asp:RequiredFieldValidator ValidationGroup="login_dialog"  ID="RequiredFieldValidator2" runat="server" Display="Static"
                                    ControlToValidate="login_username" ErrorMessage="The textbox can not be empty!" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                    <dnn:DnnTextBox ID="login_username" runat="server" Label="Username" Width="100%" ClientEvents-OnLoad="setLoginUsername" meta:resourcekey="login_username"/>
                </div>
                <div>
                    <asp:RequiredFieldValidator ValidationGroup="login_dialog"  ID="RequiredFieldValidator3" runat="server" Display="Static"
                                    ControlToValidate="login_password" ErrorMessage="The textbox can not be empty!" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                    <dnn:DnnTextBox ID="login_password" runat="server" Label="Password" Width="100%" ClientEvents-OnLoad="setLoginPassword" TextMode="Password" ClientEvents-OnKeyPress="checkKeys" meta:resourcekey="login_password"/>
                    <a id="btnForgottenPassword" href="#" onclick="show_Forgot();return false;"><asp:Localize ID="lblForgottenPassword" runat="server" meta:resourcekey="forgotPassword"></asp:Localize></a>
                </div>    
            </div>
            <div class="buttons">
                <div id="rememberMeButtons">
                    <input type="checkbox" id="RememberMe" />
                    <asp:Label ID="RememberMe" meta:resourcekey="RememberMe" runat="server" />
                </div>
                <div>
                    <!--<a href="#" onclick="login(); return false;" class="login_btn freshButton" runat="server"><asp:Localize ID="loginCmdBtn" runat="server" meta:resourcekey="loginCmdBtn"></asp:Localize></a>-->
                    <asp:LinkButton id="login_btn" runat="server" CssClass="login_btn freshButton" OnClientClick="raiseAsyncPostback();return false;" meta:resourcekey="loginCmdBtn"></asp:LinkButton>
                    <a href="#" id="login_cancel_btn" onclick="$('#loginDialog').hide();return false;" class="freshButton"><asp:Localize ID="loginCancelBtn" runat="server" meta:resourcekey="loginCancelBtn"></asp:Localize></a>
                </div>
            </div>
        </div>
    </div>
    <div id="mapsPanel" style="display:none;">
        <div class="objectWrapper">
            <div id="mapsList"></div>
        </div>  
    </div>
    <div id="mapsPanelOverlay"></div>
    <div id="VariousPopUps">
        
        <div id="userFiles">
            
        </div>
        <div id="mapManager">
        
        </div>
        <div id="layerManager">
        
        </div>
        <div id="fileUploaderCont">
            <div id="fileUploaderInnerCont">
                
                <dnn:DnnAsyncUpload ID="imageUploader" runat="server" 
                    HttpHandlerUrl="~/DesktopModules/AVMap.MapDigitizer_v2/UploadFile.ashx" MultipleFileSelection="Automatic" 
                    EnableInlineProgress="true" Skin="Office2007" OnClientAdded="fileUploading" OnClientFilesUploaded="fileUploadFinished" OnClientFileUploaded="fileUploaded" PersistConfiguration="True" UploadedFilesRendering="BelowFileInput">
                </dnn:DnnAsyncUpload>
                
            </div>
        </div>
        <div id="testLocal">
            <input type="file" id="testLocalBrowse"/>
            <img id="testLocalImg" src="" />
        </div>
        <div id="confirmationBox">
            <div class="messagePrompt"><asp:Localize runat="server" meta:resourcekey="confirmBoxPrompt"></asp:Localize></div>
            <div id="confirmationAction"></div>
            
        </div>
        <div id="editFieldBox">
            <div class="fieldTitle">
                <span><asp:Localize runat="server" meta:resourcekey="edit_fieldTitle"></asp:Localize></span>
            </div>
            <div class="fieldDetailRow">
                <span class="fieldCaption"><asp:Localize runat="server" meta:resourcekey="edit_fieldRecord"></asp:Localize></span>
                <span class="fieldValue" id="editRecordNo">###</span>
            </div>
            <div class="fieldDetailRow">
                <span class="fieldCaption"><asp:localize runat="server" meta:resourcekey="edit_fieldLayer"></asp:localize></span>
                <span class="fieldValue" id="editLayerName">XXXXXXXXXXXXXXXX</span>
            </div>
            <div class="fieldEditorContainer">
                <div class="fieldColumnCont">
                    <span id="fieldColumnName">YYYYYYYYY</span>
                </div>
                <textarea id="fieldEditor" rows="4"></textarea>
            </div>
            <div class="editFieldActionsCont">
                <a href="#" class="defaultAction freshButton" onclick="router('tFieldEditU');return false;"><asp:Localize runat="server" meta:resourcekey="edit_buttonUpdate"></asp:Localize></a>
                <a href="#" class="freshButton" onclick="router('tFieldEditC');return false;"><asp:Localize runat="server" meta:resourcekey="edit_buttonClear"></asp:Localize></a>
                <a href="#" class="freshButton" onclick="router('tFieldEditE');return false;"><asp:Localize runat="server" meta:resourcekey="edit_buttonCancel"></asp:Localize></a>
            </div>
            
        </div>
        <div id="editDigitize"></div>
        <div id="databaseAnalysis"></div>
        <div id="statsAnalysis"></div>
        <div id="newLayerDialog"></div>
        <div id="exportMapAs">
            <div>
                <a href="#" id="exportAs_jpg" class="fileTypes jpg" onclick="router('exportMap',this); return false;"></a>
                <a href="#" id="exportAs_png" class="fileTypes png" onclick="router('exportMap',this); return false;"></a>
                <a href="#" id="exportAs_pdf" class="fileTypes pdf" onclick="router('exportMap',this); return false;"></a>
                <a href="#" id="exportAs_kml" class="fileTypes kml" onclick="router('exportMap',this); return false;"></a>
            </div>
        </div>
        <div id="saveAs" style="display:none">
            <div class="saveAsMethod1">
                <asp:Label ID="saveAsPermalink" runat="server" meta:resourcekey="saveAsPermalink"></asp:Label>
                <a id="saveAsLink" href></a>
            </div>
            <div class="saveAsMethod2">
                <asp:Label ID="saveAsLegend" runat="server" meta:resourcekey="saveAsLegend"></asp:Label>
                <img id="saveAsLegendImg" />
            </div>
        </div>
        
        <div id="infoWindow"></div>
        <div id="registrationDialog" style="display:none">
            <div class="introduction"><span><asp:Localize ID="reg_intro_Title" runat="server" meta:resourcekey="reg_intro_Title"></asp:Localize></span></div>
                <div class="steps">
                    <div id="reg_step1">
                        <div>
                            <asp:RequiredFieldValidator ValidationGroup="step1" ID="nameValidator" runat="server" Display="Static"
                                ControlToValidate="reg_name" ErrorMessage="The textbox can not be empty" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <dnn:DnnTextBox ID="reg_name" runat="server" Width="100%" EmptyMessage="Your name" Label="First name" ClientEvents-OnLoad="setRegName" meta:resourcekey="reg_name"></dnn:DnnTextBox>
                        </div>
                        <div>
                            
                            <asp:RequiredFieldValidator ValidationGroup="step1"  ID="surnameValidator" runat="server" Display="Static"
                                ControlToValidate="reg_surname" ErrorMessage="The textbox can not be empty" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <dnn:DnnTextBox ID="reg_surname" runat="server" Width="100%" EmptyMessage="Your surname" Label="Last name" ClientEvents-OnLoad="setRegLastName" meta:resourcekey="reg_surname"></dnn:DnnTextBox>
                        </div>
                        <div>
                            
                            <asp:RegularExpressionValidator ValidationGroup="step1"  ID="emailValidator" runat="server" Display="Dynamic" EnableClientScript="true" 
                                ErrorMessage="Please, enter valid e-mail address" ValidationExpression="^[\w\.\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]{1,})*(\.[a-zA-Z]{2,3}){1,2}$"
                                ControlToValidate="reg_email" CssClass="validatorMessages">
                            </asp:RegularExpressionValidator>
                            <asp:RequiredFieldValidator ValidationGroup="step1"  ID="Requiredfieldvalidator1" runat="server" Display="Static" EnableClientScript="true" 
                            ControlToValidate="reg_email" ErrorMessage="Please, enter an e-mail" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <dnn:DnnTextBox ID="reg_email" runat="server" Width="100%" EmptyMessage="Your email" Label="Email" ClientEvents-OnLoad="setRegEmail" meta:resourcekey="reg_email"></dnn:DnnTextBox>
                        </div>
                    </div>
                    <div id="reg_step2" style="display:none">
                        <div>                                        
                            <asp:RequiredFieldValidator ValidationGroup="step2"  ID="usernameReqValidator" runat="server" Display="Static"
                                ControlToValidate="reg_username" ErrorMessage="The textbox can not be empty" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <asp:RegularExpressionValidator ValidationGroup="step2"  ID="usernameValidator" runat="server" EnableClientScript="true"
                               ControlToValidate="reg_username"
                               ErrorMessage="Must be alphanumeric and between 6-15 character in length"
                               ValidationExpression="(^[a-z0-9_A-Z]{6,15})$" CssClass="validatorMessages" Display="Dynamic" />
                            <dnn:DnnTextBox ID="reg_username" runat="server" Width="100%" EmptyMessage="Your username" Label="Username" ClientEvents-OnLoad="setRegUserName" meta:resourcekey="reg_username"></dnn:DnnTextBox>
                        </div>
                        <div>                                        
                            <asp:RequiredFieldValidator ValidationGroup="step2"  ID="displaynameValidator" runat="server" Display="Static"
                                ControlToValidate="reg_displayname" ErrorMessage="The textbox can not be empty" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <dnn:DnnTextBox ID="reg_displayname" runat="server" Width="100%" EmptyMessage="Your display name" Label="Display name" ClientEvents-OnLoad="setRegDisplayName" meta:resourcekey="reg_displayname"></dnn:DnnTextBox>
                        </div>
                        <div>
                            
                            <asp:RequiredFieldValidator ValidationGroup="step2"  ID="passwordValidator" runat="server" Display="Static"
                                ControlToValidate="reg_password" ErrorMessage="The textbox can not be empty" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <asp:RegularExpressionValidator ValidationGroup="step2"  ID="valPassword" runat="server" EnableClientScript="true"
                               ControlToValidate="reg_password"
                               ErrorMessage="Minimum password length is 7"
                               ValidationExpression=".{7}.*" CssClass="validatorMessages" Display="Dynamic" />
                            <dnn:DnnTextBox ID="reg_password" runat="server" TextMode="Password" Width="100%" Label="Your password" ClientEvents-OnLoad="setRegPassword" meta:resourcekey="reg_password"></dnn:DnnTextBox>
                        </div>
                        <div>
                            <asp:RequiredFieldValidator ValidationGroup="step2"  ID="confirmReqValidator" runat="server" Display="Static"
                                ControlToValidate="reg_confirmPassword" ErrorMessage="The textbox can not be empty!" EnableClientScript="true" CssClass="validatorMessages" meta:resourcekey="ValidatorRequired"/>
                            <asp:CompareValidator ValidationGroup="step2"  runat="server" ID="confirmValidator" ControlToValidate="reg_confirmPassword" ControlToCompare="reg_password" Text="Password mismatch" EnableClientScript="true" CssClass="validatorMessages" Display="Dynamic" />
                            <dnn:DnnTextBox ID="reg_confirmPassword" runat="server" TextMode="Password" Width="100%" Label="Confirm password" meta:resourcekey="reg_confirmpassword"></dnn:DnnTextBox>
                        </div>
                    </div>
                    <div id="reg_step3" style="display:none">
                        
                    </div>
                    <div id="reg_results" style="display:none">
                        <div id="reg_results_img"></div>
                        <span id="reg_results_msg" />
                    </div>
                </div>
                <div class="extra"><div id="extraMsg"></div></div>
                <div class="buttons">
                    <a href="#" id="reg_back" onclick="prevStep_Registration();return false;" class="freshButton"></a>
                    <a href="#" id="reg_forward" onclick="nextStep_Registration();return false;" class="freshButton"></a>
                </div>
                <div class="clear"></div>
                <input type="hidden" id="currentStep" value="1" />
        </div>
        
        <div id="saveAskDialog" style="display:none">
            <asp:Label ID="lblSaveAsk" runat="server" meta:resourcekey="lblSaveAsk" Text="The map contains:" CssClass="saveTitle"></asp:Label>
            <div class="mapObjectsList">
                <span id="saveMarkers">0</span><img src='<%= Me.ControlPath + "Images/Drawing/location.png" %>' />
                <br />
                <span id="savePolylines">0</span><img src='<%= Me.ControlPath + "Images/Drawing/polyline.png" %>' />
                <br />
                <span id="savePolygons">0</span><img src='<%= Me.ControlPath + "Images/Drawing/polygon_fill.png" %>' />
            </div>
            <div class="saveActionLine">
                <a href="#" class="backBtn" onclick="showSave(); return false;"><asp:Localize ID="backBtn" runat="server" meta:resourcekey="common_Back"></asp:Localize></a>
                <a href="#" class="forwardBtn"><asp:Localize ID="goBtn" runat="server" meta:resourcekey="common_Go"></asp:Localize></a>
            </div>
        </div>
        
        <div id="styleManager">
            <div id="styleManagerContentWrapper" class="contentWrapper">
                <div id="styleManagerActions" class="superActions">
                    <div id="styleManagerToolbar" class="mainToolbar">
                        <a href="#" id="styleManager_save" class="adminGenericAction" onclick="router('adminOK');"><span class="adminActionImg imgSave"></span><asp:Localize runat="server" meta:resourcekey="styleManager_save"></asp:Localize></a>
                        <a href="#" id="styleManager_cancel" class="adminGenericAction" onclick="router('adminCancel');"><span class="adminActionImg imgReset"></span><asp:Localize runat="server" meta:resourcekey="styleManager_cancel"></asp:Localize></a>
                    </div>
                    <div id="amenu_styleManager_cancelTabActions" class="specificToolbar"></div>
                    <div id="amenu_styleManager_cancelActionsTitle">
                        <h2 id="styleManagerTitleElem"></h2>
                        <label for="styleManager_saveStyleAs" id="styleManager_saveStyleAsLabel"><asp:Localize runat="server" meta:resourcekey="styleManager_saveStyleAsLabel"></asp:Localize></label>
                        <input type="text" id="styleManager_saveStyleAs" />
                    </div>
                </div>
                <div id="styleManagerTabsWrapper" class="tabsWrapper">
                    <div id="styleManagerTabsInnerWrapper" class="innerWrapper">
                        <div id="styleManagerLinkTabs" class="linkTabs">
                            <div id="styleManagerLinkTabsCell" class="linkTabsCell">
                                <div id="styleManagerLinkTabsRound" class="linkTabsRound">
                                    <div class="sectionHeader active">
                                        <a href="#" onclick="router('styleManager_ConfigTab',0);"><asp:Localize runat="server" meta:resourcekey="styleManagerTabPoints"></asp:Localize></a>
                                    </div>
                                    <div class="sectionHeader">
                                        <a href="#" onclick="router('styleManager_ConfigTab',1);"><asp:Localize runat="server" meta:resourcekey="styleManagerTabLines"></asp:Localize></a>
                                    </div>
                                    <div class="sectionHeader">
                                        <a href="#" onclick="router('styleManager_ConfigTab',2);"><asp:Localize runat="server" meta:resourcekey="styleManagerTabPolygons"></asp:Localize></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="styleManagerContent" class="contentTabs">
                            <div class="absoluteContainer">
                                <div id="styleManagerHeaderTab">
                                    <div class="appSettingFrame active">
                                        <div id="markerChooseStyle" class="singlePopup active">
                                            <div style="overflow:auto;width:280px;height:84%;padding: 10px;">
                                                <input type="hidden" id="pointGraphicUrl" />
                                                <div id="pointModeContainer">
                                                    <div class="selectContainer">
                                                        <input type="radio" name="PointMode" value="0" checked="checked" onclick="router('pointMode',this);" />
                                                        <span class="selectLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_pointMode_Font"></asp:Localize></span>
                                                    </div>
                                                    <div class="selectContainer">
                                                        <input type="radio" name="PointMode" value="1" onclick="router('pointMode',this);"/>
                                                        <span class="selectLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_pointMode_Icons"></asp:Localize></span>
                                                    </div>
                                                </div>
                                                <div class="markerLine">
                                                    <div id="modeOptions_0">
                                                        <div class="modeColumns">
                                                            <span><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridColumns"></asp:Localize></span>
                                                            <div id="pointColumns"></div>
                                                        </div>
                                                        <div id="selectContainerFont">
                                                            <span><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridFamily"></asp:Localize></span>
                                                            <select id="pointFontFamily">
                                                                <option value="Wingdings" selected="selected">Wingdings</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div id="modeOptions_1" style="display:none">
                                                        <div id="selectContainerIcon" >
                                                            <span><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_From"></asp:Localize></span>
                                                            <select id="pointMyIconFolders">
                                                                <option value="currentMap" selected="selected"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_CurrentMap"></asp:Localize></option>
                                                                <option value="default"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_Default"></asp:Localize></option>
                                                                <option value="gPal2"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_GPal2"></asp:Localize></option>
                                                                <option value="gPal3"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_GPal3"></asp:Localize></option>
                                                                <option value="gPal4"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_GPal4"></asp:Localize></option>
                                                                <option value="gPal5"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_GPal5"></asp:Localize></option>
                                                                <option value="user_Uploads"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_Uploads"></asp:Localize></option>
                                                                <option value="user_Maps"><asp:Localize runat="server" meta:resourcekey="styleManager_pointGridSource_Maps"></asp:Localize></option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="markerLine">
                                                    <div id="pointIcons"></div>
                                                </div>
                                                <div class="markerLine">
                                                    <span><asp:Localize ID="styleMarkerSize" runat="server" meta:resourcekey="styleMarkerSize"></asp:Localize></span>
                                                    <dnn:DnnTextBox ID="markerSizeText" runat="server" ReadOnly="true" Width="40" Text="32" ClientEvents-OnLoad="setMarkerSizeText"></dnn:DnnTextBox>
                                                    <div id="markerSizeSlider"></div>
                                                </div>
                                                <div class="field">
                                                    <span class="fieldLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Fill"></asp:Localize></span>
                                                    <div class="markerLine">
                                                        <span><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Color"></asp:Localize></span>
                                                        <input id="pointColor" readonly="readonly" type="color" value="#000000" data-text="hidden" data-hex="true" style="height:20px;width:20px;" onchange="router('styleUpdate');"/>
                                                    </div>
                                                    <div class="markerLine">
                                                        <span><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Opacity"></asp:Localize></span>
                                                        <dnn:DnnTextBox ID="pointOpacityText" runat="server" ReadOnly="true" Width="40" Text="0%" ClientEvents-OnLoad="setpointOpacityText"></dnn:DnnTextBox>
                                                        <div id="pointOpacitySlider"></div>
                                                    </div>
                                                </div>
                                                <div class="field">
                                                    <span class="fieldLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Border"></asp:Localize></span>
                                                    <div class="markerLine">
                                                        <span><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Size"></asp:Localize></span>
                                                        <dnn:DnnTextBox ID="pointBorderText" runat="server" ReadOnly="true" Width="40" Text="1" ClientEvents-OnLoad="setpointBorderText"></dnn:DnnTextBox>
                                                        <div id="pointBorderSlider"></div>
                                                    </div>
                                                    <div class="markerLine">
                                                        <span><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Color"></asp:Localize></span>
                                                        <input id="pointBorderColor" readonly="readonly" type="color" value="#000000" data-text="hidden" data-hex="true" style="height:20px;width:20px;" onchange="router('styleUpdate');"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>       
                                    
                                    </div>
                                    <div class="appSettingFrame">
                                        <div id="polylineChooseStyle" class="singlePopup active">           
                                            <div style="overflow:auto;width:280px;height:84%;padding: 10px;">
                                                <div id="polylineLine1">
                                                    <span><asp:Localize ID="styleLineStrokeColor" runat="server" meta:resourcekey="styleLineStrokeColor"></asp:Localize></span>
                                                    <input id="polylineStrokeColor" readonly="readonly" type="color" value="#FF0000" data-text="hidden" data-hex="true" style="height:20px;width:20px;" onchange="router('styleUpdate');"/>
                                                </div>
                                                <div id="polylineLine2">
                                                    <span><asp:Localize ID="styleLineStrokeOpacity" runat="server" meta:resourcekey="styleLineStrokeOpacity"></asp:Localize></span>
                                                    <dnn:DnnTextBox ID="polylineStrokeOp" runat="server" Width="40" ReadOnly="true" Text="1" ClientEvents-OnLoad="setLineOpacityText"></dnn:DnnTextBox>
                                                    <div id="lineStrokeOpacitySlider"></div>
                                                </div>
                                                <div id="polylineLine3">
                                                    <span><asp:Localize ID="styleLineStrokeWeight" runat="server" meta:resourcekey="styleLineStrokeWeight"></asp:Localize></span>
                                                    <dnn:DnnTextBox ID="polylineStrokeWeight" runat="server" Width="40"  ReadOnly="true" Text="3" ClientEvents-OnLoad="setLineWeightText"></dnn:DnnTextBox>
                                                    <div id="lineStrokeWeightSlider"></div>
                                                </div>                                                            
                                            </div>
                                        </div>    
                                    </div>
                                    <div class="appSettingFrame">
                                        <div id="polygonChooseStyle" class="singlePopup active">           
                                            <div style="overflow:auto;width:280px;height:84%;padding: 10px;">
                                                <div id="polyOuterWrapper">
                                                <span class="polyLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Border"></asp:Localize></span>
                                                <div id="polygonLine1">
                                                    <span><asp:Localize ID="stylePolygonStrokeColor" runat="server" meta:resourcekey="stylePolygonStrokeColor"></asp:Localize></span>
                                                    <input id="polygonStrokeColor" readonly="readonly" type="color" value="#FF0000" data-text="hidden" data-hex="true" style="height:20px;width:20px;" onchange="router('styleUpdate');"/>
                                                </div>
                                                <div id="polygonLine2">
                                                    <span><asp:Localize ID="stylePolygonStrokeOpacity" runat="server" meta:resourcekey="stylePolygonStrokeOpacity"></asp:Localize></span>
                                                    <dnn:DnnTextBox ID="polygonStrokeOp" runat="server" Width="40" ReadOnly="true" Text="1" ClientEvents-OnLoad="setPolyStrokeOpacityText"></dnn:DnnTextBox>
                                                    <div id="polygonStrokeOpacitySlider"></div>
                                                </div>
                                            </div>
                                                <div id="polyInnerWrapper">
                                                <span class="polyLegend"><asp:Localize runat="server" meta:resourcekey="styleManager_Common_Fill"></asp:Localize></span>
                                                <div id="polygonLine3">
                                                    <span><asp:Localize ID="stylePolygonFillColor" runat="server" meta:resourcekey="stylePolygonFillColor"></asp:Localize></span>
                                                    <input id="polygonFillColor" readonly="readonly" type="color" value="#FF0000" data-text="hidden" data-hex="true" style="height:20px;width:20px;" onchange="router('styleUpdate');"/>
                                                </div>
                                                <div id="polygonLine4">
                                                    <span><asp:Localize ID="stylePolygonFillOpacity" runat="server" meta:resourcekey="stylePolygonFillOpacity"></asp:Localize></span>
                                                    <dnn:DnnTextBox ID="polygonFillOp" runat="server" Width="40" ReadOnly="true" Text="0.5" ClientEvents-OnLoad="setPolyFillOpacityText" ></dnn:DnnTextBox>
                                                    <div id="polygonFillOpacitySlider"></div>
                                                </div>
                                            </div>
                                                <div id="polygonLine5">
                                                <span><asp:Localize ID="stylePolygonStrokeWeight" runat="server" meta:resourcekey="stylePolygonStrokeWeight"></asp:Localize></span>
                                                <dnn:DnnTextBox ID="polygonStrokeWeight" runat="server" Width="40"  ReadOnly="true" Text="3" ClientEvents-OnLoad="setPolyStrokeWeightText"></dnn:DnnTextBox>
                                                <div id="polygonStrokeWeightSlider"></div>
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
        </div>
            
        <div id="dummyGoogle" style="display:none;height:10px;width:10px;"></div>
        <div style="display:none">
            
        </div>
    </div>
</div>
<div id="page_administration" class="MyGISAdmin"></div>
<div id="page_userProfile" class="MyGISAdmin"></div>
<div id="Notification"></div>
<div id="initialLoad" style="display:none">
    <div class="mygis_logo">
        <div id="mygis_AppName"><asp:Localize ID="mygis_AppName" runat="server" /></div>
        <img src='<%= Me.ControlPath +  "GetImage.ashx?qType=GetAppLogo"%>' />
       
        <div id="mygis_loadFeedback"></div>
    </div>
    <div class="mygis_loader"><img src='<%= Me.ControlPath +  "Images/mygis_loader.gif"%>' /></div>
</div>
</div>
<!--[if !IE]><!--> </div> <!--<![endif]-->
