<%@ WebHandler Language="VB" Class="mgreq" %>

Imports System
Imports System.Web
Imports MyGIS_SharedClasses
Imports System.Diagnostics
Imports System.Collections.Generic


Public Class mgreq : Implements IHttpHandler, IRequiresSessionState
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        AnalyzeQString()
    End Sub
 
    
    ''' <summary>
    ''' Acts as a router function based on query string or posted data
    ''' </summary>
    ''' <remarks></remarks>
    Private Sub AnalyzeQString()
        Dim query As String
        Dim mgreq As New MyGIS_Request
        
        Try
            query = HttpContext.Current.Request.Item("qtype").ToString()
            
            If Not String.IsNullOrEmpty(query) Then
                Select Case query
                    Case "login"
                        mgreq.Login()
                    Case "register"
                        mgreq.registerNewUser()
                    Case "ConvertCoords"
                        mgreq.ExecuteConversion(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetMapList"
                        mgreq.GetMapList()
                    Case "GetLayerList"
                        mgreq.GetLayerList(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetMapQuickSearches"
                        mgreq.GetMapQuickSearches(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetLayerFields"
                        mgreq.GetLayerFields(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetFeatureList"
                        mgreq.GetFeatures(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetLayerExtent"
                        mgreq.GetExtent(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetUserFiles"
                        mgreq.GetUserFiles()
                    Case "GetUserFilesApplication"
                        Dim appID = HttpContext.Current.Request.Item("qContents").ToString()
                        If String.IsNullOrEmpty(appID) Then
                            appID = DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", HttpContext.Current.Request.Url.Host))
                        End If
                        mgreq.Admin.GetAppFiles(appID)
                    Case "GetObjectImages"
                        mgreq.GetFilesForObject("Images")
                    Case "GetObjectFiles"
                        mgreq.GetFilesForObject("Files")
                    Case "AttachFileToFeature"
                        mgreq.AttachFileToObject(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "DownloadFile"
                        mgreq.DownloadFile()
                    Case "PreviewFile"
                        mgreq.DownloadFile(True)
                    Case "Detachfile"
                        mgreq.DetachFile(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "ReplaceAttached"
                        mgreq.ReplaceAttached(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetUserSpace"
                        mgreq.GetUsedSpace()
                    Case "RemoveUserFile"
                        mgreq.DeleteUserFile(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "DirectQuery"
                        mgreq.DirectQuery(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetLayerDistinct"
                        mgreq.GetLayerDistinct(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "SaveDigitizing"
                        mgreq.SaveDigitizing()
                    Case "isAuthorized"
                        mgreq.CheckAuthorization()
                    Case "testGeo"
                        mgreq.TestGeoComm()
                    Case "updateStyle"
                        mgreq.SaveStyle()
                    Case "GetMyApps"
                        mgreq.Admin.GetAppList()
                    Case "GetAppUserList"
                        Dim appID = HttpContext.Current.Request.Item("qContents").ToString()
                        If String.IsNullOrEmpty(appID) Then
                            appID = DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", HttpContext.Current.Request.Url.Host))
                        End If
                        mgreq.Admin.GetAppUsers(appID)
                    Case "GetAppPotentialUsers"
                        mgreq.Admin.GetAppPotentialUsers()
                    Case "GetAppURLs"
                        mgreq.Admin.GetAppAlias(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetAppMaps"
                        mgreq.Admin.GetAppMaps(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "CreateNewApp"
                        mgreq.Admin.CreateNewApp(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "UpdateAppSettings"
                        mgreq.Admin.UpdateAppSettings(HttpContext.Current.Request.Form("qContents").ToString())

                    Case "AddAppAlias"
                        mgreq.Admin.AddAppAlias(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "RemoveAppAlias"
                        mgreq.Admin.RemoveAppAlias(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "AppAvailableMaps"
                        Dim filterList() As String
                        Try
                            Dim paramparts = HttpContext.Current.Request.Item("qContents").ToString().Split("#")
                            ReDim filterList(paramparts.Length)
                            For i As Integer = 0 To paramparts.Length - 1
                                filterList(i) = paramparts(i)
                            Next
                        Catch ex As Exception

                        End Try
                        If Not filterList Is Nothing Then
                            mgreq.GetPotentialMaps(filterList)
                        Else
                            mgreq.GetPotentialMaps()
                        End If

                    Case "CheckAlias"
                        mgreq.Admin.CheckAliasValidity(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetAppStyles"
                        mgreq.Admin.GetAppStylesFull(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetAvailableThemes"
                        mgreq.GetAvailableThemes()
                    Case "CreateNewMap"
                        mgreq.Admin.DefineNewMap(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "UpdateMapSettings"
                        mgreq.Admin.UpdateExistingMap(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "CreateNewQS"
                        mgreq.Admin.UpdateQS(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "getAppAvailableUsers"
                        mgreq.Admin.GetAppUsers(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "deleteUsers"
                        mgreq.Admin.DeleteUsers(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "GetPotentialLayers"
                        Dim filterList() As String
                        Try
                            Dim paramparts = HttpContext.Current.Request.Item("qContents").ToString().Split("#")
                            ReDim filterList(paramparts.Length)
                            For i As Integer = 0 To paramparts.Length - 1
                                filterList(i) = paramparts(i)
                            Next
                        Catch ex As Exception

                        End Try
                        If Not filterList Is Nothing Then
                            mgreq.Admin.GetPotentialLayers(filterList)
                        Else
                            mgreq.Admin.GetPotentialLayers()
                        End If
                    Case "getMacros"
                        mgreq.GetMapMacros(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetMapMacros"
                        mgreq.GetAdminMacros(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetCurrentUserDetails"
                        mgreq.UserProfile.GetCurrentUserDetails()
                    Case "updateUserProfile"
                        mgreq.UserProfile.updateUserProfile(HttpContext.Current.Request.Form("qContents").ToString())
                    Case "GetFeatureCount"
                        mgreq.GetFeatureCount(HttpContext.Current.Request.Item("qContents").ToString())
                    Case "GetQueryStats"
                        mgreq.GetQueryStats(HttpContext.Current.Request.Form.Item(0).ToString())
                    Case "QueryWithin"
                        mgreq.ExecuteQueryWithin(HttpContext.Current.Request.Form.Item(0).ToString())
                    Case "getUserLayerRights"
                        Dim user As New MyGIS_Request.User()
                        user.GetLayerRights(HttpContext.Current.Request.Form.Item(0).ToString())
                    Case "mg_fn_GetFieldTranslation"
                        mgreq.GetFieldTranslation(HttpContext.Current.Request.Item("qContents").ToString())
                    Case Else
                        AnalyzeQString_PlatformSpecific(query)
                        'Throw New Exception("Unknown query")
                End Select
            End If
        Catch ex As Exception
            HttpContext.Current.Response.Clear()

            HttpContext.Current.Response.ContentType = "application/json/x-zip-compressed"
            HttpContext.Current.Response.Write(ex.Message.ToJson())
            HttpContext.Current.Response.Flush()
            HttpContext.Current.Response.End()
        End Try
    End Sub
    
    Private Sub AnalyzeQString_PlatformSpecific(ByVal query As String)
      
        Select Case query
            Case "ecoplatform_GetMeasurements"
                ecoplatformClasses.ecoplatform.GetMeasurements(HttpContext.Current.Request.Item("qContents").ToString())
                'JK CHANGES
            Case "ecoplatform_GetStations"
                ecoplatformClasses.ecoplatform.GetStations()
            Case "ecoplatform_GetMnames"
                ecoplatformClasses.ecoplatform.GetMnames()
                'JK CHANGES END
            Case "ecoplatform_GetCurves"
                ecoplatformClasses.WUAmodule.GetCurves()
            Case "ecoplatform_GetFlowData"
                ecoplatformClasses.WUAmodule.GetFlowData()
            Case "ecoplatform_WUA_Calculate"
                ecoplatformClasses.WUAmodule.CalculateWUA(HttpContext.Current.Request.Item("qContents").ToString())
            Case "ecoplatform_WUA_getUserData"
                ecoplatformClasses.WUAmodule.GetUserData()
            Case "ecoplatform_WUA_getUnsortedFiles"
                ecoplatformClasses.WUAmodule.GetUnsortedFiles()
            Case "ecoplatform_WUA_saveUserFiles"
                ecoplatformClasses.WUAmodule.saveUserFiles()
            Case "ecoplatform_GetMunicipalityData"
                ecoplatformClasses.DSSmodule.GetMunicipalityData()
            Case "ecoplatform_getPlantCategories"
                ecoplatformClasses.DSSmodule.GetPlantCategories()
            Case "ecoplatform_getHerdCategories"
                ecoplatformClasses.DSSmodule.GetHerdCategories()
            Case "ecoplatform_getPlantWaterData"
                ecoplatformClasses.DSSmodule.GetPlantWaterData(HttpContext.Current.Request.Item("qContents").ToString())
            Case "electra_GetCurrentUserDetails"
                electra.GetCurrentUserDetails()
            Case "electra_Register"
                electra.RegisterNewUser()
            Case "electra_updateUserProfile"
                electra.UpdateUserProfile(HttpContext.Current.Request.Form("qContents").ToString())
            Case "electra_GetUserLayerStatus"
                electra.GetUserLayerStatus()
            Case "electra_CreateUserLayer"
                electra.CreateUserLayer()
            Case "electra_GetPartnerLinks"
                electra.GetPartnerLinks()
            Case "electra_GetAppUserList"
                electra.GetAppUserList()
            Case "electra_authorizeUsers"
                electra.AuthorizeUsers(HttpContext.Current.Request.Form("qContents").ToString())
            Case "psyhat_GetPsyUnitsPerMun"
                'psyhat.GetUnitsPerMun(HttpContext.Current.Request.Item("qContents").ToString())
                Throw New Exception("Disabled query")
            Case "psyhat_GetPsyUnitsPerPop20K"
                'psyhat.GetPsyUnitsPerPop20K()
                Throw New Exception("Disabled query")
            Case "psyhat_GetDimByMalePop35K"
                'psyhat.GetDimByMalePop35K()
                Throw New Exception("Disabled query")
            Case "psyhat_GetDimByFemalePop35K"
                'psyhat.GetDimByFemalePop35K()
                Throw New Exception("Disabled query")
            Case Else
                Throw New Exception("Unknown query")
        End Select
    End Sub
    
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class
