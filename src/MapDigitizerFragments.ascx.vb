Imports DotNetNuke
Imports System.IO
Imports System.Linq
Imports MyGIS_SharedClasses

Namespace YourCompany.Modules.MapDigitizerFragments


    Partial Class MapDigitizerFragments
        Inherits Entities.Modules.PortalModuleBase




#Region "Page Initialization"

        

        Protected Overrides Sub FrameworkInitialize()


            Dim cultureName As String = ""
            cultureName = Request.QueryString("language")
            If Not String.IsNullOrEmpty(cultureName) Then
                System.Threading.Thread.CurrentThread.CurrentCulture = New CultureInfo(cultureName)
            End If
            MyBase.FrameworkInitialize()

        End Sub

        ''' -----------------------------------------------------------------------------
        ''' <summary>
        ''' Page_Load runs when the control is loaded
        ''' </summary>
        ''' <remarks>
        ''' </remarks>
        ''' <history>
        ''' </history>
        ''' -----------------------------------------------------------------------------
        Private Sub Page_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
            Dim x As New StringBuilder()
            Dim y As New System.IO.StringWriter(x)
            Dim z As New HtmlTextWriter(y)
            Dim foundSpecific As Boolean = False
            Dim specificID As String = ""
            Dim specificControl As HtmlGenericControl = Nothing
            Try
                DotNetNuke.Framework.jQuery.RequestRegistration()
                Response.Clear()
                'Response.Cache.SetExpires(DateTime.Now.AddDays(1))
                Response.ContentType = "application/x-zip-compressed"
                'Response.ContentType = "application/x-zip-compressed"
                Try
                    specificID = Request.Item("qtype").ToString()
                    foundSpecific = True
                Catch ex As Exception

                End Try
                ReplaceLogo()
                If foundSpecific Then
                    If specificID = "geoicons" Then

                    Else
                        specificControl = Me.FindControl(specificID)
                        specificControl.RenderControl(z)
                    End If
                    

                Else
                    Me.RenderControl(z)
                End If


                Response.Write(RemoveWhitespaceFromHtml(y.ToString().Trim(), foundSpecific, specificControl))
                Response.Flush()
                Response.End()
            Catch exc As Exception
                ProcessModuleLoadException(Me, exc)
            End Try
        End Sub

        Private Sub ReplaceLogo()
            Dim MyAppID = Integer.Parse(DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", HttpContext.Current.Request.Url.Host())))
            Dim results = DB_Functions.RetrieveTable("mg_fn_GetCustomization", , MyAppID)
            With results.Rows(0)
                'staticServerText.Text = .Item("app_welcomeText").ToString()
                'domainLogo.DataValue = .Item("app_logo")
                'domainLogo.DataBind()
                If Not .Item("app_logo") Is DBNull.Value Then
                    userProfileLogo.Src = "GetImage.ashx?qType=GetAppLogo&qContents=" + MyAppID.ToString()

                Else
                    userProfileLogo.Src = Me.ControlPath + "Images/myGIS_logoMini.png"
                End If
            End With
        End Sub

        Private Function GenerateGeoIcons(Optional ByVal specificCategory As String = "") As System.Web.UI.HtmlControls.HtmlGenericControl
            Dim retobject As New HtmlGenericControl()
            Dim retvalue As String = ""
            Dim path = Me.ControlPath + "Images/mapserver"
            Dim size = Request.Item("qSize").ToString()
            Dim bgcolor = Request.Item("qBgColor").ToString()
            Dim bgStroke = Request.Item("qBgStroke").ToString()
            Dim forecolor = Request.Item("qForeColor").ToString()
            Dim myfilename As String = ""
            If Not String.IsNullOrEmpty(specificCategory) Then
                path += "/" + specificCategory
                Dim files = From file In System.IO.Directory.GetFiles(path)
                For Each myfile In files
                    myfilename = myfile.Substring(0, myfile.LastIndexOf("."))
                    retvalue += GenerateSingleGeoIcon(specificCategory, myfilename, size, bgcolor, bgStroke, forecolor)
                Next
            Else
                ''TODO
            End If
            Return retobject
        End Function

        Private Function GenerateSingleGeoIcon(ByVal iconType As String, ByVal file As String, ByVal size As String, ByVal bgColor As String, ByVal bgStroke As String, ByVal forecolor As String) As String
            Dim retvalue As String
            Dim filePath As String = Me.ControlPath + String.Format("GetImage.ashx?qtype=geoIcon&qIconType={0}&qContents={1}&qBgColor={2}&qForeColor={3}&qBgStroke={4}&qSize={5}", _
                                                                     iconType, file, bgColor, forecolor, bgStroke, size)
            retvalue = String.Format("<div class='geoIcon'><object data=""{0}"" type=""image/svg+xml""></object></div>", filePath)
            Return retvalue
        End Function

        Private Function RemoveWhitespaceFromHtml(ByVal html As String, Optional ByVal replaceID As Boolean = False, Optional ByVal control As HtmlGenericControl = Nothing) As String
            html = RegexBetweenTags.Replace(html, ">")

            html = RegexLineBreaks.Replace(html, "<")
            If replaceID Then
                html = "<html><body><div>" + html.Replace(control.ClientID, control.ID) + "</div></body></html>"
            End If


            Return html.Trim()
        End Function

        Private ReadOnly RegexBetweenTags As Regex = New Regex(">(?! )\s+", RegexOptions.Compiled)
        Private ReadOnly RegexLineBreaks As Regex = New Regex("([\n\s])+?(?<= {2,})<", RegexOptions.Compiled)

#End Region




    End Class


End Namespace
