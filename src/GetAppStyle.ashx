<%@ WebHandler Language="VB" Class="GetAppStyle" %>

Imports System
Imports System.Web
Imports System.Web.SessionState
Imports MyGIS_SharedClasses

Public Class GetAppStyle : Implements IHttpHandler, IReadOnlySessionState
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim myconfig As SerializedTypes.AppCSSCustomize
        Try
            myconfig = GetAppCustomization(context)
        Catch ex As Exception

        End Try
        
        context.Response.ContentType = "text/css"
        If myconfig Is Nothing Then
            'finish
        Else
            
            context.Response.Write(BuildHeaderRules(context, myconfig))
            context.Response.Write(BuildRightPanelRules(context, myconfig))
            context.Response.Write(BuildMapRules(context, myconfig))
            context.Response.Write(buildUserHeader(context, myconfig))
            If myconfig.customCSS_enabled Then
                context.Response.Write(myconfig.customCSS) 
            End If
            
        End If
        
        
    End Sub
    
    Private Function BuildHeaderRules(ByVal context As HttpContext, ByVal myconfig As SerializedTypes.AppCSSCustomize) As String
        Dim retvalue As New StringBuilder()
        
        Dim multipleCSS As New StringBuilder()
        'multipleCSS.Append(CreateProperty("display", IIf(myconfig.headerOn, "table-row", "none"), True)) 'Header display
        multipleCSS.Append(CreateProperty("background-color", myconfig.headerBG, True)) 'Header bg
        retvalue.AppendFormat(CreateCSSRule(".topPane"), multipleCSS.ToString())
        retvalue.AppendFormat(CreateCSSRule("#logoPane"), CreateProperty("height", myconfig.headerHeight, True)) 'Header height
        'retvalue.AppendFormat(CreateCSSRule(".domainStaticText2"), CreateProperty("height", (Integer.Parse(myconfig.headerHeight.Substring(0, myconfig.headerHeight.IndexOf("px"))) - 4).ToString() + "px", True)) 'Header height
        retvalue.AppendFormat(CreateCSSRule("#initialLoad .mygis_logo"), CreateProperty("background-color", myconfig.headerBG, True))
        retvalue.AppendFormat(CreateCSSRule("#confirmationBox"), CreateProperty("background-color", myconfig.headerBG, True))
        multipleCSS.Length = 0
        
        multipleCSS.Append(CreateProperty("background-color", myconfig.textBG, True))    'TextBG
        multipleCSS.Append(CreateProperty("border-radius", myconfig.textRadius, True))   'TextRadius
        multipleCSS.Append(CreateProperty("color", myconfig.headerTextColor, True))
        retvalue.AppendFormat(CreateCSSRule(".domainStaticTextBackground"), multipleCSS.ToString())
        retvalue.AppendFormat(CreateCSSRule("#confirmationBox"), CreateProperty("color", myconfig.headerTextColor, True))
        retvalue.AppendFormat(CreateCSSRule("#mygis_AppName"), CreateProperty("color", myconfig.headerTextColor, True))
        
        multipleCSS.Length = 0
        
        retvalue.AppendFormat(CreateCSSRule("#pageActions a"), CreateProperty("color", myconfig.headerTextColor, True))
        
        'multipleCSS.Append(CreateProperty("background-color", myconfig.theme1_FillSelectBG, True))
        multipleCSS.Append(CreateProperty("background-color", "transparent", True))
        multipleCSS.Append(CreateProperty("border-color", "#999", True))
        'multipleCSS.Append(CreateProperty("color", myconfig.menuActiveColor, True))
        retvalue.AppendFormat(CreateCSSRule(".jqx-fill-state-pressed-pk_mg"), multipleCSS.ToString())
        
        multipleCSS.Length = 0
        multipleCSS.Append(CreateProperty("background-color", myconfig.theme1_FillBG, True))
        multipleCSS.Append(CreateProperty("border-color", myconfig.theme1_FillBorderColor, True))
        multipleCSS.Append(CreateProperty("color", myconfig.menuColor, True))
        retvalue.AppendFormat(CreateCSSRule(".jqx-widget-header-pk_mg"), multipleCSS.ToString())
        
        multipleCSS.Length = 0
        multipleCSS.Append(CreateProperty("background-image", String.Format("url('/DesktopModules/AVMap.MapDigitizer_V2/GetImage.ashx?qtype={0}&qContents=%23{1}')", "GetDefaultButton", myconfig.theme1_FillSelectBorderColor.Substring(1))))
        'retvalue.AppendFormat(CreateCSSRule("#pageHelpActions #pageHelpStartHere,#pageHelpActions #pageHelpChangeMap,#pageHelpActions #pageHelpSearchMap"), multipleCSS.ToString())
               
        
        retvalue.AppendFormat(CreateCSSRule("#mapActionsBtn"), CreateProperty("background-color", myconfig.theme1_FillBG, True))
        multipleCSS.Length = 0
        multipleCSS.Append(CreateProperty("background-color", myconfig.theme1_FillBG, True))
        multipleCSS.Append(CreateProperty("border-color", myconfig.theme1_FillBorderColor, True))
        multipleCSS.Append(CreateProperty("background-image", "none", True))
        multipleCSS.Append(CreateProperty("color", myconfig.menuActiveColor, True))
        retvalue.AppendFormat(CreateCSSRule(".ui-dialog .ui-dialog-titlebar"), multipleCSS)
        
        
        
        Return retvalue.ToString()
    End Function
    
    Private Function buildUserHeader(ByVal context As HttpContext, ByVal myconfig As SerializedTypes.AppCSSCustomize) As String
        Dim retvalue As New StringBuilder()
        
        Dim multipleCSS As New StringBuilder()
        multipleCSS.Append(CreateProperty("background-color", myconfig.headerBG, True)) 'Header bg
        retvalue.AppendFormat(CreateCSSRule("#up_Header"), multipleCSS.ToString())
        
        multipleCSS.Length = 0
        multipleCSS.Append(CreateProperty("border-top-color", myconfig.rightPanel_TabsBG, True))
        retvalue.AppendFormat(CreateCSSRule("#up_TopMenu"), multipleCSS.ToString())
        Return retvalue.ToString()
    End Function
    
    Private Function BuildRightPanelRules(ByVal context As HttpContext, ByVal myconfig As SerializedTypes.AppCSSCustomize) As String
        Dim retvalue As New StringBuilder()
        Dim multipleCSS As New StringBuilder()
        'retvalue.AppendFormat(CreateCSSRule("#pageActions"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        retvalue.AppendFormat(CreateCSSRule("#mapSliderCont"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .jqx-fill-state-normal-classic, #fakeTabs .jqx-fill-state-normal-classic,#fakeTabs .jqx-widget-header-classic,#bottomTabContainer .jqx-widget-header-classic"), _
                              CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        
        
        
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .jqx-tabs-headerWrapper ul li.jqx-tabs-title-selected-top-classic,#fakeTabs .jqx-tabs-headerWrapper ul li.jqx-tabs-title-selected-top-classic"), _
                              CreateProperty("background-color", myconfig.rightPanel_TabsBG, True))
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .tabTopActions"), _
                              CreateProperty("background-color", myconfig.rightPanel_TabsBG, True))
        
        retvalue.AppendFormat(CreateCSSRule("#panel1"), CreateProperty("background-color", myconfig.rightPanel_TabsBG, True))
        'retvalue.AppendFormat(CreateCSSRule(".subPanel"), CreateProperty("background-color", myconfig.rightPanel_TabsBG, True))

        
        retvalue.AppendFormat(CreateCSSRule(".expandPanel .listHeader"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        retvalue.AppendFormat(CreateCSSRule(".expandPanel .listHeader"), CreateProperty("color", myconfig.rightPanel_TabColor, True))
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .jqx-tabs-headerWrapper ul li.jqx-item div div"), CreateProperty("color", myconfig.rightPanel_TabColor))
        'retvalue.AppendFormat(CreateCSSRule("#infoAnalysisHeader"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        'retvalue.AppendFormat(CreateCSSRule("#infoAnalysisHeader"), CreateProperty("color", myconfig.rightPanel_TabColor, True))
        retvalue.AppendFormat(CreateCSSRule("#rpanelTabButtons"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        
        
        'retvalue.AppendFormat(CreateCSSRule("#filterAnalysisLogo"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        retvalue.AppendFormat(CreateCSSRule("#filterTabButton"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        retvalue.AppendFormat(CreateCSSRule("#resultsTabButton"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        'retvalue.AppendFormat(CreateCSSRule("#allListsTabButton"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        'retvalue.AppendFormat(CreateCSSRule("#rpanelCollapseBtn"), CreateProperty("background-color", myconfig.rightPanel_TopBG, True))
        
        'retvalue.AppendFormat(CreateCSSRule("#filterAnalysisLogo"), CreateProperty("background-image", String.Format("url('/DesktopModules/AVMap.MapDigitizer_V2/GetImage.ashx?qtype={0}&qContents=%23{1}')", "QSArrow", ToHex(myconfig.rightPanel_TopBG).Substring(1)), True))
        'retvalue.AppendFormat(CreateCSSRule("#filterAnalysisLogo span"), CreateProperty("color", myconfig.rightPanel_TabColor, True))
        
        'retvalue.AppendFormat(CreateCSSRule("#pageActions a"), CreateProperty("color", myconfig.rightPanel_TopColor, True))
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .jqx-tabs-headerWrapper ul li.jqx-item"), _
                              CreateProperty("color", myconfig.rightPanel_TabColor, True))
        
        
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .jqx-tabs-headerWrapper ul li.jqx-tabs-title-selected-top-classic"), _
                              CreateProperty("color", myconfig.rightPanel_TabActiveColor, True))
        retvalue.AppendFormat(CreateCSSRule("#bottomTabContainer .tabTopActions"), CreateProperty("color", myconfig.rightPanel_TabActiveColor, True))
        
        Return retvalue.ToString()
    End Function
    
    Private Function BuildMapRules(ByVal context As HttpContext, ByVal myconfig As SerializedTypes.AppCSSCustomize) As String
        Dim retvalue As New StringBuilder()
        Dim multipleCSS As New StringBuilder()
        retvalue.AppendFormat(CreateCSSRule("#mapTitleInfo"), CreateProperty("background-color", myconfig.mapHeaderBG, True))
        'retvalue.AppendFormat(CreateCSSRule("#fDock1"), CreateProperty("background-color", myconfig.mapHeaderBG, True))
        retvalue.AppendFormat(CreateCSSRule(".toolWindow .yatoolbarLabel"), CreateProperty("color", myconfig.mapDescriptionColor, True))
        'retvalue.AppendFormat(CreateCSSRule("#ll_mouse .coord"), CreateProperty("color", myconfig.mapDescriptionColor, True))
        multipleCSS.Append(CreateProperty("color", myconfig.mapDescriptionColor, True))
        multipleCSS.Append(CreateProperty("font-size", myconfig.mapDescriptionSize, True))
        'retvalue.AppendFormat(CreateCSSRule("#mapDescription"), multipleCSS.ToString())
        retvalue.AppendFormat(CreateCSSRule(".undecidedTitle:before"), CreateProperty("color", myconfig.mapDescriptionColor, True))
        retvalue.AppendFormat(CreateCSSRule("#mapDescription"), CreateProperty("color", myconfig.mapDescriptionColor, True))
        retvalue.AppendFormat(CreateCSSRule("#mapChangeBtn"), CreateProperty("color", myconfig.mapDescriptionColor, True))
        
        retvalue.AppendFormat(CreateCSSRule("#mapFooter"), CreateProperty("background-color", myconfig.mapFooterBG, True))
        retvalue.AppendFormat(CreateCSSRule("#mapFooter .footerCaption"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        'retvalue.AppendFormat(CreateCSSRule("#olScale_wrapper"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        
        'retvalue.AppendFormat(CreateCSSRule("#panel1"), CreateProperty("border-right", String.Format("1px solid {0}", myconfig.rightPanel_TopBG), True))
        'retvalue.AppendFormat(CreateCSSRule("#panel3"), CreateProperty("border-left", String.Format("1px solid {0}", myconfig.rightPanel_TopBG), True))
        
        
        multipleCSS.Length = 0
        multipleCSS.Append(CreateProperty("border-color", myconfig.mapFooterFontColor, True))
        multipleCSS.Append(CreateProperty("color", myconfig.mapFooterFontColor, True))
        retvalue.AppendFormat(CreateCSSRule(".olControlScaleLineTop"), multipleCSS)
        
        retvalue.AppendFormat(CreateCSSRule(".olControlScaleBarMarkerMajor,.olControlScaleBarBar,.olControlScaleBarMarkerMinor,.olControlScaleBarBarAlt"), CreateProperty("background-color", myconfig.mapFooterFontColor, True))
        retvalue.AppendFormat(CreateCSSRule("#northArrow_wrapper .northArrowText"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        retvalue.AppendFormat(CreateCSSRule(".olControlScaleBarWrapper"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        retvalue.AppendFormat(CreateCSSRule("#map_projection_node"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        'retvalue.AppendFormat(CreateCSSRule("#ll_mouse"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        retvalue.AppendFormat(CreateCSSRule(".olControlAttribution"), CreateProperty("color", myconfig.mapFooterFontColor, True))
        'retvalue.AppendFormat(CreateCSSRule("#mapDirectionArrow"), CreateProperty("background-image", String.Format("url('/DesktopModules/AVMap.MapDigitizer_V2/GetImage.ashx?qtype={0}&qContents=%23{1}')", "MapArrow", myconfig.mapFooterFontColor.Substring(1))))
        
        Return retvalue.ToString()
    End Function
    
    Private Function GetAppCustomization(ByVal context As HttpContext) As SerializedTypes.AppCSSCustomize
        Dim retvalue As New SerializedTypes.AppCSSCustomize()
        Dim specificStyle As Integer = -1
        Try
            specificStyle = Integer.Parse(context.Request.QueryString.Item("st"))
        Catch ex As Exception

        End Try
        
        Dim appID = DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", context.Request.Url.Host()))
        Dim results As DataTable
        If specificStyle > -1 Then
            results = DB_Functions.RetrieveTable("mg_fn_GetSpecificCSS", , String.Format("{0},{1}", appID, specificStyle))
        Else
            results = DB_Functions.RetrieveTable("mg_fn_GetActiveCSS", , String.Format("{0},1", appID))
        End If
            
        With results.Rows(0)
            retvalue.headerOn = .Item("headerOn")
            retvalue.headerHeight = .Item("headerHeight")
            retvalue.headerBG = .Item("headerBG")
            retvalue.headerTextColor = .Item("headerTextColor")
            retvalue.textBG = .Item("textBG")
            retvalue.textRadius = .Item("textRadius")
            retvalue.theme1_FillSelectBG = .Item("jqx_pkMG_FillSelectBG")
            retvalue.theme1_FillSelectBorderColor = .Item("jqx_pkMG_FillSelectBorderColor")
            retvalue.theme1_FillBG = .Item("jqx_pkMG_FillBG")
            retvalue.theme1_FillBorderColor = .Item("jqx_pkMG_FillBorderColor")
            retvalue.menuColor = .Item("menuColor")
            retvalue.menuActiveColor = .Item("menuActiveColor")
            retvalue.rightPanel_TopBG = .Item("rightPanel_TopBG")
            retvalue.rightPanel_TabsBG = .Item("rightPanel_TabsBG")
            retvalue.rightPanel_TopColor = .Item("rightPanel_TopColor")
            retvalue.rightPanel_TabColor = .Item("rightPanel_TabColor")
            retvalue.rightPanel_TabActiveColor = .Item("rightPanel_TabActiveColor")
            retvalue.mapHeaderBG = .Item("mapHeaderBG")
            retvalue.mapDescriptionSize = .Item("mapDescriptionSize")
            retvalue.mapDescriptionColor = .Item("mapDescriptionColor")
            retvalue.mapFooterBG = .Item("mapFooterBG")
            retvalue.mapFooterFontColor = .Item("mapFooterFontColor")
            retvalue.customCSS_enabled = .Item("customCSS_enabled")
            retvalue.customCSS = .Item("customCSS").ToString()
        End With
        If appID = "8" Then 'TODO PROPER
            context.Response.Write(String.Format(CreateCSSRule("#avlogo_wrapper"), CreateProperty("display", "none", True)))
        End If
        Return retvalue
    End Function
    
    Private Function CreateCSSRule(ByVal selector As String) As String
        Dim retvalue As String
        retvalue = String.Format("{0}{{{{{1}{{0}}{1}}}}}{1}", selector, Environment.NewLine)
        Return retvalue
    End Function
    
    Private Function CreateProperty(ByVal prop As String, ByVal value As String, Optional ByVal important As Boolean = False) As String
        Dim retvalue As String
        retvalue = String.Format("{0}: {1}{2};{3}", prop, value, IIf(important, " !important", ""), Environment.NewLine)
        Return retvalue
    End Function
    
    Private Function ToHex(ByVal rgbastring As String) As String
        Dim retvalue As String = ""
        Dim numbersOnly = rgbastring.Substring(5)
        numbersOnly = numbersOnly.Substring(0, numbersOnly.Length - 2)
        Dim rgbaParts() As String = numbersOnly.Split(",")
        retvalue = System.Drawing.ColorTranslator.ToHtml(System.Drawing.Color.FromArgb(Integer.Parse(rgbaParts(3)), Integer.Parse(rgbaParts(0)), Integer.Parse(rgbaParts(1)), Integer.Parse(rgbaParts(2))))
        Return retvalue
    End Function
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class