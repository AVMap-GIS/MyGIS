Imports DotNetNuke
Imports System.IO
Imports System.Web.UI
Imports System.Net
Imports System.Text
Imports System.Diagnostics
Imports System.Threading
Imports System.Collections.Generic

Imports DotNetNuke.Security.Membership
Imports DotNetNuke.Services.Authentication
Imports DotNetNuke.Security
Imports DotNetNuke.Security.Roles
Imports DotNetNuke.Common.Utilities
Imports DotNetNuke.Entities.Users
Imports DotNetNuke.Instrumentation
Imports DotNetNuke.UI.Utilities
Imports i386.UI
Imports Telerik.Web.UI

Imports MyGIS_SharedClasses

Namespace YourCompany.Modules.MapDigitizer2

    Partial Class MapDigitizer2
        Inherits Entities.Modules.PortalModuleBase

        Private MyAppID As String
        Private MyCaller As String
        Private MyUserID As Integer
        Private UserIsAdmin As Boolean
        Private MyCapabilities As New ApplicationCapabilities()
        Private extraInit As String = "null"
        Protected Friend lang As String

        Public IsAjaxPostBack As Boolean


#Region "Page Initialization"

        Protected Overrides Sub FrameworkInitialize()


            Dim cultureName As String = ""
            cultureName = Request.QueryString("clanguage")
            If Not String.IsNullOrEmpty(cultureName) Then
                System.Threading.Thread.CurrentThread.CurrentCulture = New CultureInfo(cultureName)
            End If
            If Not HttpContext.Current.User.Identity.IsAuthenticated Then
                cultureName = GetAppDefaultLang()
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
            Try
                DotNetNuke.Framework.jQuery.RequestRegistration()
                IsAjaxPostBack = (HttpContext.Current.Request.Headers("X-Requested-With") = "XMLHttpRequest")
                Response.AppendHeader("X-XSS-Protection", "0")
                Dim tp As DotNetNuke.Framework.CDefault = CType(Me.Page, DotNetNuke.Framework.CDefault)
                tp.Title = String.Format("MyGIS - {0}", GetLocalResourceObject("slogan.Text"))
                lang = System.Threading.Thread.CurrentThread.CurrentUICulture.Name
                CheckRequestOrigin()
                GetAppCapabilities(MyAppID)
                CheckPostbacks()
                If True Then 'If MyAppID <> "1" Then
                    ApplyAppCustomization()
                End If
                If HttpContext.Current.User.Identity.IsAuthenticated Then
                    ControlsForLogged()
                End If
                RegisterInitScripts()
                InitMe()
                InitControls()
                InitUploaders()
            Catch exc As Exception
                ProcessModuleLoadException(Me, exc)
            End Try
        End Sub

        Private Function GetAppDefaultLang() As String
            If String.IsNullOrEmpty(MyAppID) Then CheckRequestOrigin()
            Return DB_Functions.RetrieveValue("mg_fn_GetAppDefaultLang", String.Format("{0}", MyAppID))
        End Function



        ''' <summary>
        ''' Registers the javascripts used by the application
        ''' </summary>
        ''' <remarks></remarks>
        Private Sub RegisterInitScripts()
            Dim FinalVersion As Boolean = CType(ConfigurationManager.AppSettings.Item("FinalVersion").ToString(), Boolean)
            Dim DEBUG As Boolean = False
            Dim cs As ClientScriptManager = Page.ClientScript
            Dim cb As ScriptManager = ScriptManager.GetCurrent(Me.Page)

            Dim cstype As Type = Me.GetType()

            Dim mapScript, mapScriptUrl As String
            Dim langscript, langUrl As String
            Dim datescript, dateUrl As String

            Dim obf As String = IIf(DEBUG, "_Obfs", "")

            mapScript = "googleApi"
            mapScriptUrl = "http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&language=el-GR"

            langscript = "languageFile"
            datescript = "dateFile"
            langUrl = Me.ControlPath + "lang/"
            dateUrl = Me.ControlPath + "lang/"

            If lang.Contains("el-GR") Then
                langUrl += "gr.js"
                dateUrl += "date-el-GR.js"
            Else
                langUrl += "en.js"
                dateUrl += "date-en-GB.js"
            End If

            Dim langRef As New ScriptReference(langUrl)
            cb1.CompositeScript.Scripts.Add(langRef)

            Dim dateRef As New ScriptReference(dateUrl)
            cb1.CompositeScript.Scripts.Add(dateRef)

            Dim pdf As New ScriptReference(Me.ControlPath + "Scripts/lib/pdf.js")
            cb1.CompositeScript.Scripts.Add(pdf)

            If HttpContext.Current.User.Identity.IsAuthenticated Then
                If UserController.GetCurrentUserInfo().IsInRole("Application Administrators") Then
                    Dim superEditorRef As New ScriptReference(Me.ControlPath + "Scripts/codemirror.js")
                    cb5.CompositeScript.Scripts.Add(superEditorRef)
                End If
            End If
            'JK CHANGES - Get the js files to be loaded and load them
            Dim retvalue As DataTable
            Dim load_lang As String = ""
            If lang.Contains("el-GR") Then
                load_lang = "GR"
            Else
                load_lang = "EN"
            End If

            Dim customSQL = String.Format("SELECT filename,relPath FROM mg_Apps_Scripts WHERE load = 1 AND app_id = " + MyAppID + " AND (lang = 'all' OR lang ='" + load_lang + "')")
            retvalue = DB_Functions.RetrieveCustomTable(customSQL)
            Dim jsfile As String = ""
            Dim result() As DataRow = retvalue.Select()
            Dim counter As Integer = 0
            Dim scripts As New StringBuilder()
            For Each row As DataRow In result
                jsfile = row(1) + row(0)
                jsfile = Me.ControlPath + jsfile
                jsfile = IIf(FinalVersion, jsfile.Replace(".js", "_Obfs.js"), jsfile)
                Dim jsfilepath As New ScriptReference(jsfile)
                scripts.AppendFormat("<script type=""text/javascript"" src=""{0}""></script>", jsfile)
                'cb6.CompositeScript.Scripts.Add(jsfilepath) 'add the js file
                'x.Scriptslibrary.Add(jsfile)
                counter = counter + 1
            Next
            additionalScripts.InnerHtml = scripts.ToString()
            'JK CHANGES END

        End Sub

        ''' <summary>
        ''' Loads static images in ASP:Image tags
        ''' </summary>
        ''' <remarks></remarks>
        Private Sub LoadStaticImages()
            Dim suffix As String
            suffix = IIf(lang = "el-GR", "_GR", "")
            logo.ImageUrl = Me.ControlPath + "Images/AVMapGIS.jpg"
            switchEnglish.ImageUrl = Me.ControlPath + "../../Images/Flags/" + "en-US.gif"
            switchGreek.ImageUrl = Me.ControlPath + "../../Images/Flags/" + "el-GR.gif"
        End Sub

        ''' <summary>
        ''' Inits javascript variables
        ''' </summary>
        ''' <remarks></remarks>
        Private Sub InitMe()
            Dim myscript As New StringBuilder()
            Dim controls As String
            If MyUserID <> Nothing Then
                controls = GetUIControls()
            Else
                controls = "0"  'All enabled
            End If
            ScriptManager.RegisterStartupScript(Me, Me.GetType(), "authenticated", _
                String.Format("Sys.Services.AuthenticationService._authenticated={0};", _
                                      IIf(HttpContext.Current.User.Identity.IsAuthenticated, "true", "false")), _
                True)
            myscript.AppendFormat("mygis.Map.setDigiVars('{0}',[{3}],['{1}','{2}',{4}]);", "mapContainer", "DesktopModules/AVMap.MapDigitizer_v2", "layerCont", controls, extraInit)
            Dim override = Request.QueryString("oDef")
            If override Is Nothing Then override = ""
            If Not String.IsNullOrEmpty(override) Then
                myscript.AppendFormat("mygis.Map.overrideDefaults('{0}');", override)
            End If
            ScriptManager.RegisterStartupScript(Me.Page, Me.Page.GetType(), "DigiInit", myscript.ToString(), True)
            LoadStaticImages()
            If lang = "el-GR" Then
                switchEnglish.NavigateUrl = String.Format("/map.aspx?language=en-US", Me.PortalSettings.HomeTabId)
            Else
                switchGreek.NavigateUrl = String.Format("/map.aspx?language=el-GR", Me.PortalSettings.HomeTabId)
            End If
            'whatIsContent.Text = GetLocalResourceObject("whatIsContent.Text")
        End Sub

        ''' <summary>
        ''' Inits file uploaders
        ''' </summary>
        ''' <remarks></remarks>
        Private Sub InitUploaders()
            Dim userID As Integer
            If HttpContext.Current.User.Identity.IsAuthenticated Then
                userID = DotNetNuke.Entities.Users.UserController.GetCurrentUserInfo().UserID()
            Else
                userID = -1
            End If
            Dim config As MyGIS_SharedClasses.SampleAsyncUploadConfiguration = imageUploader.CreateDefaultUploadConfiguration(Of MyGIS_SharedClasses.SampleAsyncUploadConfiguration)()
            ' Populate any additional fields 
            config.UserID = userID
            ' The upload configuration will be available in the handler 
            imageUploader.UploadConfiguration = config
            imageUploader.AllowedFileExtensions = GetSupportedFileTypes()
            'imageUploadProgress.HeaderText = GetLocalResourceObject("rad_uprogress_Header.Text")
            'With imageUploadProgress.Localization
            '    .Cancel = GetLocalResourceObject("rad_uprogress_Cancel.Text")
            '    .CurrentFileName = GetLocalResourceObject("rad_uprogress_CurrentFileName.Text")
            '    .ElapsedTime = GetLocalResourceObject("rad_uprogress_ElapsedTime.Text")
            '    .EstimatedTime = GetLocalResourceObject("rad_uprogress_EstimatedTime.Text")
            '    .Total = GetLocalResourceObject("rad_uprogress_Total.Text")
            '    .TotalFiles = GetLocalResourceObject("rad_uprogress_TotalFiles.Text")
            '    .TransferSpeed = GetLocalResourceObject("rad_uprogress_TransferSpeed.Text")
            '    .Uploaded = GetLocalResourceObject("rad_uprogress_Upload.Text")
            '    .UploadedFiles = GetLocalResourceObject("rad_uprogress_UploadedFiles.Text")
            'End With
        End Sub



        Private Function GetSupportedFileTypes() As String()
            Dim retvalue() As String
            Dim supported As New List(Of String)
            Dim counter As Integer = 0
            Dim cmdText As String = "SELECT fileExtension FROM mg_enum_FileTypes"

            Dim result As DataTable = DB_Functions.RetrieveCustomTable(cmdText)
            For Each dr As DataRow In result.Rows
                supported.Add(dr.Item("fileExtension").ToString())

            Next
            retvalue = supported.ToArray()
            Return retvalue
        End Function
#End Region

#Region "UI Manipulation"

        Private Sub InitControls()
            If lang = "el-GR" Then
                switchGreek.CssClass = "active"
                switchEnglish.CssClass = ""
            Else
                switchGreek.CssClass = ""
                switchEnglish.CssClass = "active"
            End If
        End Sub

        Public Function ReturnImageUrl(ByVal imagename As String) As String
            Dim retvalue As String
            retvalue = Me.ControlPath + "Images/" + imagename
            retvalue = retvalue.Replace("~", Me.Request.ApplicationPath + "/")
            'retvalue = "http://digitizer.avmap.gr/403-3.gif"
            Return retvalue
        End Function

        Protected Sub ControlsForLogged()
            cmdLogin2.Attributes("onclick") = ""
            cmdLogin2.HRef = "/?ctl=logoff"
            cmdLogin2.InnerHtml = GetLocalResourceObject("cmd_Logoff.Text") + "<span class='separator'></span>"
            cmdRegister2.Attributes("onclick") = "router('cmdUserPanel');return false;"
            registerBtn.Text = String.Format("{0} {1}", GetLocalResourceObject("welcomeUser.Text"), UserController.GetCurrentUserInfo().DisplayName.ToString())
            cmdMediaManager.Visible = True
            If UserController.GetCurrentUserInfo().IsInRole("Application Administrators") Then
                mygis_cmdAP.Visible = True
            End If


        End Sub

        Private Sub IsValidFile(ByVal sender As Object, ByVal e As FileUploadedEventArgs) Handles imageUploader.FileUploaded
            Dim userid As Integer
            If HttpContext.Current.User.Identity.IsAuthenticated Then
                userid = DotNetNuke.Entities.Users.UserController.GetCurrentUserInfo().UserID
                e.IsValid = IsAllowedToUpload(e.File, userid)
            Else
                e.IsValid = False
            End If
        End Sub

        Private Function IsAllowedToUpload(ByVal file As UploadedFile, ByVal userID As Integer) As Boolean
            Dim retvalue As Boolean = False
            Dim connectionString As String = ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString.ToString()

            Using conn As New SqlConnection(connectionString)
                Dim cmdText = "SELECT [digitizer].[dbo].[mg_fn_GetUserFileSize] (1,@userID)"
                Dim query As New SqlCommand(cmdText, conn)
                Dim resultNum As Double = -1
                query.Parameters.AddWithValue("@userID", userID)
                conn.Open()
                Double.TryParse(query.ExecuteScalar(), resultNum)
                If resultNum > -1 Then
                    If file.ContentLength + resultNum <= (1024 * 1024) * 10 Then  'TODO proper
                        retvalue = True
                    End If
                End If
            End Using
            Return retvalue
        End Function


#End Region

#Region "Map Related"
        ''' <summary>
        ''' Loads a previously posted KML to the page
        ''' </summary>
        ''' <param name="postbackurl"></param>
        ''' <remarks></remarks>
        Private Sub LoadPostedKML(ByVal postbackurl As String)
            Try
                Dim posted_kml = Request.Form.Item("kml").ToString()
                If Not String.IsNullOrEmpty(posted_kml) Then
                    Dim loadmeup As String = String.Format("mygis.Drawing.Importing.loadKML('{0}');", posted_kml.Replace("'", """").Replace(vbCrLf, "\r\n"))
                    ScriptManager.RegisterStartupScript(Me.Page, Me.Page.GetType(), "myloadScript", loadmeup, True)

                End If
                extraInit = "'null'"
                Dim posted_extra = Request.Form.Item("extra").ToString()
                If Not String.IsNullOrEmpty(posted_extra) Then
                    Dim loadmeup2 As String = String.Format("setMapDescription('{0}');", posted_extra)
                    ScriptManager.RegisterStartupScript(Me.Page, Me.Page.GetType(), "myloadScript2", loadmeup2, True)
                    extraInit += String.Format(",{0}", posted_extra)
                End If
                extraInit += String.Format(",'{0}'", Request.Form.Item("guid").ToString())
                If String.IsNullOrEmpty(postbackurl) Then
                    postbackurl = DB_Functions.RetrieveValue("mg_fn_GetPostbackUrl", String.Format("'{0}'", MyCaller))
                End If
                extraInit += String.Format(",'{0}'", postbackurl)
            Catch ex As Exception

            End Try
        End Sub

        ''' <summary>
        ''' Stores a kml string in the database
        ''' </summary>
        ''' <param name="kmlstring"></param>
        ''' <remarks></remarks>
        Private Sub StoreKML(ByVal kmlstring As String)
            Dim myconn As New SqlConnection(ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString)
            Dim mysql As New SqlCommand()
            Dim userid As String = ""
            Try

                myconn.Open()
                If HttpContext.Current.User.Identity.IsAuthenticated Then
                    userid = DotNetNuke.Entities.Users.UserController.GetCurrentUserInfo().UserID.ToString()
                    mysql.Connection = myconn
                    mysql.CommandText = String.Format("INSERT INTO DigiData(UserID,MapID, KML_DATA) Values({0},1,'{1}')", _
                                                        userid, kmlstring)
                    mysql.ExecuteReader()
                End If
            Catch ex As Exception
            Finally
                myconn.Close()
            End Try

        End Sub

        ''' <summary>
        ''' Loads last KML opened by the user
        ''' </summary>
        ''' <returns></returns>
        ''' <remarks></remarks>
        Private Function RetrieveLatestKML() As String
            Dim myconn As New SqlConnection(ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString)
            Dim mysql As New SqlCommand()
            Dim MyAdapter As SqlDataAdapter
            Dim dtset As New DataSet

            Dim userid As String = ""
            Dim retTable As New DataTable()
            Dim retvalue As String = ""
            Try
                If HttpContext.Current.User.Identity.IsAuthenticated Then
                    userid = DotNetNuke.Entities.Users.UserController.GetCurrentUserInfo().UserID.ToString()
                    mysql.Connection = myconn
                    mysql.CommandText = String.Format("SELECT TOP 1 KML_DATA FROM DigiData WHERE UserID={0} ORDER BY LayerID Desc", _
                                                        userid)
                    MyAdapter = New SqlDataAdapter(mysql.CommandText, myconn)
                    MyAdapter.Fill(dtset)
                    retTable = dtset.Tables(0)
                    retvalue = retTable.Rows(0).Item("KML_DATA")
                End If
            Catch ex As Exception
            Finally

            End Try
            Return retvalue
        End Function

        ''' <summary>
        ''' Posts the map back to the registered address
        ''' </summary>
        ''' <remarks></remarks>
        Protected Sub savePostback()
            Try

                Dim output = Request.Form("_output").ToString
                Dim extra = Request.Form("_extra").ToString
                Dim guid = Request.Form("guid").ToString()
                Dim postbackurl = Request.Form("postbackurl").ToString()
                Dim params() As String

                If Not String.IsNullOrEmpty(output) Then
                    'output = output.Replace(vbCrLf, "").Replace("""", "")
                    extra = extra.Replace(vbCrLf, "").Replace("""", "")
                    guid = guid.Replace(vbCrLf, "").Replace("""", "")
                    'postbackurl = RetrieveValue("sfn_getPostbackUrl", String.Format("'{0}'", Request.UrlReferrer.Host))
                    If Not String.IsNullOrEmpty(postbackurl) AndAlso postbackurl <> "undefined" Then
                        Dim myrequest As WebRequest
                        Dim myoutput As WebResponse
                        Dim enc As New System.Text.UTF8Encoding()
                        Dim datastream As System.IO.Stream
                        Dim bytesToWrite() As Byte

                        Dim inform = New StringBuilder()
                        Dim outform As String
                        inform.Append(String.Format("updateKML={0}", output))
                        inform.Append(String.Format("&extra=""{0}""", extra))
                        inform.Append(String.Format("&guid=""{0}""", guid))

                        bytesToWrite = enc.GetBytes(inform.ToString())
                        myrequest = HttpWebRequest.Create(postbackurl)
                        myrequest.Method = "POST"
                        myrequest.ContentLength = bytesToWrite.Length
                        myrequest.ContentType = "application/x-www-form-urlencoded"
                        'Dim cookies = New System.Net.CookieContainer()



                        datastream = myrequest.GetRequestStream()
                        datastream.Write(bytesToWrite, 0, bytesToWrite.Length)
                        datastream.Close()
                        myoutput = myrequest.GetResponse()
                        datastream = myoutput.GetResponseStream()
                        Dim myreader As New System.IO.StreamReader(datastream)
                        Using myreader
                            outform = myreader.ReadToEnd()
                        End Using

                        Response.Clear()
                        Response.ContentType = "application/x-zip-compressed"
                        Response.Write(outform)
                        Response.Flush()
                        Response.End()
                    Else
                        'If extra.Contains("mis=") Then
                        Response.Clear()
                        Response.ClearHeaders()
                        Response.ClearContent()
                        Response.ContentType = "application/vnd.google-earth.kml"
                        Response.AddHeader("Content-Disposition", "attachment; filename=Export.kml")
                        Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache)
                        Response.Write(output)
                        Response.Flush()
                        Response.End()
                        'End If
                    End If
                End If
            Catch ex As Exception

            End Try
        End Sub

        Private Sub LoadMap(ByVal mapID As Integer)
            Dim sqlQuery As String = ""
            Dim rettable As DataTable
            Dim results() As String
            Dim layerNames() As String
            Dim counter As Integer = 0
            Dim filename As String = "C:\OSGeo4W\bin\ogr2ogr.exe"
            Dim arguments As String
            rettable = DB_Functions.RetrieveTable("mg_fn_GetLayerList", , mapID, , "layerOrder asc")
            ReDim results(rettable.Rows.Count)
            ReDim layerNames(rettable.Rows.Count)
            For Each dr As DataRow In rettable.Rows
                sqlQuery = "SELECT * FROM " + dr.Item("layer_tableName").ToString()
                arguments = String.Format("-f ""KML"" ""/vsistdout/"" MSSQL:""server=localhost\SQLEXPRESS2008;uid=digiAdmin;database=digitizer;pwd=123456;AutoTranslate=True"" -sql ""{0}"" -overwrite", sqlQuery)
                results(counter) = ProcessRun(filename, arguments)
                layerNames(counter) = dr.Item("layerNAME").ToString()
                counter += 1

            Next
            'Dim loadmeup As String = String.Format("mygis.Drawing.Importing.loadKML('{0}');", posted_kml.Replace("'", """").Replace(vbCrLf, "\r\n"))
            Dim loadString As StringBuilder = New StringBuilder()
            'loadString.Append(vbCrLf)
            'loadString.Append("$(window).load(function(){")
            For i As Integer = 0 To results.Length - 1
                If Not String.IsNullOrEmpty(results(i)) Then

                    loadString.Append("setTimeout(function(){")
                    loadString.AppendFormat("mygis.Drawing.Importing.loadKML('{0}','{1}');", _
                                            results(i).Replace("'", """").Replace(vbCrLf, "").Replace(vbCr, "").Replace(vbLf, ""), _
                                            layerNames(i))
                    loadString.Append("}")
                    loadString.AppendFormat(",{0});", (i * 50).ToString())
                    loadString.AppendFormat(vbCrLf)
                End If
            Next
            'loadString.Append("});" + vbCrLf)
            Try


                Response.Clear()
                Response.ClearContent()

                Response.ContentType = "application/x-zip-compressed"
                Response.Write(loadString.ToString())
                Response.Flush()
                Response.End()
            Catch ex As Exception

            End Try
            'ScriptManager.RegisterStartupScript(Me.Page, Me.Page.GetType(), "myMapLoadScript", loadString.ToString(), True)
        End Sub

#End Region

#Region "Authentication"

        Private Enum userRights
            override_enableAll
            disable_toolbar
            disable_search
            disable_maps
            disable_layers
            disable_marker
            disable_filledRectangle
            disable_rectangle
            disable_filledCircle
            disable_circle
            disable_polygon
            disable_filledPolygon
            disable_polyline
            disable_drive
            disable_database
            disable_undo
        End Enum

        Private Sub CheckLogin()
            Dim postbackurl As String
            Dim debug As String = ""
            Dim postedLogos As DataTable
            If Request.UrlReferrer Is Nothing Then
                'debug = "192.168.0.21"
            Else
                debug = Request.UrlReferrer.Host
            End If
            If String.IsNullOrEmpty(Session.Item("calledBy")) Then
                Session.Add("calledBy", debug)
            Else
                debug = Session.Item("calledBy")
            End If
            If DB_Functions.CheckTrue("fn_checkCorpUser", "isDomainUser", String.Format("'{0}'", debug)) Then
                MyUserID = DB_Functions.RetrieveValue("sfn_getUserID", String.Format("'{0}'", debug))
                postbackurl = DB_Functions.RetrieveValue("sfn_getPostbackUrl", String.Format("'{0}'", debug))
                LoadPostedKML(postbackurl)
                postedLogos = DB_Functions.RetrieveTable("cfn_getUserLogos", , String.Format("{0},'{1}'", MyUserID, lang))
                'logoList.DataSource = postedLogos
                'logoList.DataBind()
            Else
                If HttpContext.Current.User.Identity.IsAuthenticated Then
                    ControlsForLogged()
                End If
            End If
        End Sub

        Private Sub CheckRequestOrigin()
            Dim calledBy As String
            MyAppID = DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", Me.PortalAlias.HTTPAlias.ToString()))
            If String.IsNullOrEmpty(MyAppID) Then
                Try
                    calledBy = Request.UrlReferrer.Host
                    If Not String.IsNullOrEmpty(calledBy) AndAlso String.IsNullOrEmpty(requestOrigin.Text) Then
                        requestOrigin.Visible = True
                        requestOrigin.Text = calledBy
                        Session("calledBy") = calledBy
                    Else
                        calledBy = requestOrigin.Text
                    End If
                Catch ex As Exception
                    Try
                        If Not String.IsNullOrEmpty(Request.Form.Item("extra").ToString()) Then
                            requestOrigin.Text = Session("calledBy")
                        End If

                        If Not String.IsNullOrEmpty(requestOrigin.Text) Then
                            requestOrigin.Visible = True
                            calledBy = requestOrigin.Text
                        End If
                    Catch ex2 As Exception

                    End Try
                End Try

                Dim checkParams As String
                checkParams = "'" + calledBy + "'"

                MyAppID = DB_Functions.RetrieveValue("mg_fn_GetAppForCaller", checkParams)

                If String.IsNullOrEmpty(MyAppID) Then
                    MyAppID = "1" '(default app)
                End If
                MyCaller = DB_Functions.RetrieveValue("mg_fn_GetCallerID", checkParams)
                Session("MyCaller") = MyCaller
            End If
            Session("MyAppID") = MyAppID


        End Sub

        Private Sub CheckPostbacks()
            Try
                LoadPostedKML(Nothing)
            Catch ex As Exception

            End Try
            Dim myTester = ""
            Try
                Dim postbackAction = Request.Form.Item("postbackAction").ToString()
                myTester = postbackAction
                If String.IsNullOrEmpty(postbackAction) Then
                    savePostback()
                Else
                    Select Case postbackAction
                        Case "loadMap"
                            LoadMap(Request.Form.Item("mapID"))
                    End Select
                End If

            Catch ex As Exception
                If String.IsNullOrEmpty(myTester) Then
                    savePostback()
                Else
                    Response.Clear()
                    Response.ContentType = "application/x-zip-compressed"
                    Response.Write(User_Security.CreateUser())
                    Response.Flush()
                    Response.End()
                End If

            End Try
        End Sub

        Private Sub ApplyAppCustomization()
            cmdSwitchLayouts.Visible = False    'TODO
            Dim results = DB_Functions.RetrieveTable("mg_fn_GetCustomization", , MyAppID)
            With results.Rows(0)
                'staticServerText.Text = .Item("app_welcomeText").ToString()
                'domainLogo.DataValue = .Item("app_logo")
                'domainLogo.DataBind()
                If Not .Item("app_logo") Is DBNull.Value Then
                    domainLogo2.Src = "GetImage.ashx?qType=GetAppLogo&qContents=" + MyAppID.ToString()

                Else
                    domainLogo2.Style("display") = "none"
                End If
                If Not .Item("app_AdditionalLogo1") Is DBNull.Value Then
                    domainAdditionalLogo1.Src = "GetImage.ashx?qType=GetAppLogo1&qContents=" + MyAppID.ToString()

                Else
                    domainAdditionalLogo1.Style("display") = "fanonelse"
                End If
                If Not .Item("app_AdditionalLogo2") Is DBNull.Value Then
                    domainAdditionalLogo2.Src = "GetImage.ashx?qType=GetAppLogo2&qContents=" + MyAppID.ToString()

                Else
                    domainAdditionalLogo2.Style("display") = "none"
                End If
                If Not .Item("removeAVLogo") Is Nothing AndAlso .Item("removeAVLogo").ToString() = "True" Then
                    '....
                Else

                End If
                domainText2.Text = .Item("app_welcomeText").ToString()
                domainStaticTextBackground.Attributes("title") = .Item("app_welcomeText").ToString()
                mygis_AppName.Text = .Item("app_welcomeText").ToString() '.Item("app_name").ToString()
                Dim tp As DotNetNuke.Framework.CDefault = CType(Me.Page, DotNetNuke.Framework.CDefault)
                'tp.Title = String.Format("{0} - {1}", .Item("app_name").ToString(), .Item("app_welcomeText").ToString())

                tp.Title = String.Format("{0} - {1}", .Item("app_name").ToString(), .Item("app_welcomeText").ToString())
                Dim myregex As New Regex("<[^>]*(>|$)")
                tp.Title = myregex.Replace(tp.Title, "")
                Dim myregex2 As New Regex("[\s\r\n]+")
                tp.Title = myregex2.Replace(tp.Title, " ")
            End With
        End Sub

        ''' <summary>
        ''' Enables/disables application capabilities according to its id
        ''' </summary>
        ''' <param name="appID"></param>
        ''' <remarks></remarks>
        Private Sub GetAppCapabilities(ByVal appID As String)
            Dim appCaps = DB_Functions.RetrieveTable("mg_fn_GetAppCaps", , appID)
            For Each dr As DataRow In appCaps.Rows
                With dr
                    If .Item("enabled").ToString() = "0" Then
                        Select Case .Item("capab_id")
                            Case AppCap.Login
                                DisableLogin()
                            Case AppCap.RegisterUsers
                                DisableRegister()
                            Case AppCap.Digitize
                                DisableDigitize()



                            Case AppCap.Tables
                                DisableTables()
                            Case AppCap.Import
                                DisableImport()
                            Case AppCap.Export
                                DisableExport()
                        End Select
                    End If


                End With
            Next
        End Sub

        ''' <summary>
        ''' Retrieves the controls that should be enabled at the user interface.
        ''' </summary>
        ''' <returns>A string of comma-delimited numbers</returns>
        ''' <remarks>
        ''' 0 : all tools (ignore the rest)
        ''' 1 : toolbar
        ''' 2 : search
        ''' 3 : maps
        ''' 4 : layers
        ''' 5 : marker
        ''' 6 : filled rectangle
        ''' 7 : open rectangle
        ''' 8 : filled circle
        ''' 9 : open circle
        ''' 10: filled polygon
        ''' 11: open polygon
        ''' 12: polyline
        ''' 13: drive polyline
        ''' 14: database
        ''' </remarks>
        Private Function GetUIControls() As String
            Dim retvalue As String = ""
            Dim toAdd As String = ""
            Dim rights As DataTable = DB_Functions.RetrieveTable("fn_getUserRights", , MyUserID.ToString + ",null")
            Dim counter As Integer = 0
            Dim checkvalue As String
            If rights.Rows(0).Item("override_enableAll").ToString() = "1" Then
                retvalue = "0"
            Else
                For Each s As DataColumn In rights.Columns
                    checkvalue = rights.Rows(0).Item(s.ColumnName).ToString
                    If (checkvalue = "0" Or checkvalue = "") AndAlso s.ColumnName <> "override_enableAll" Then
                        toAdd = CType([Enum].Parse(GetType(userRights), s.ColumnName), Integer).ToString()
                        counter += 1
                        If counter > 1 Then
                            retvalue += ","
                        End If
                        retvalue += toAdd
                    End If
                    If s.ColumnName = "disable_rpanel" AndAlso checkvalue = "True" Then
                        'rsplitbar.Visible = False
                    End If
                    'If s.ColumnName = "disable_saveLayout" AndAlso checkvalue = "1" Then
                    '    btnSaveLayout.Visible = False
                    'End If
                    'If s.ColumnName = "disable_loadLayout" AndAlso checkvalue = "1" Then
                    '    btnLoadLayout.Visible = False
                    'End If
                    'If s.ColumnName = "disable_resetLayout" AndAlso checkvalue = "1" Then
                    '    btnRestoreLayout.Visible = False
                    'End If
                    If s.ColumnName = "disable_options" AndAlso checkvalue = "True" Then
                        'btnGeneralOptions.Visible = False
                    End If
                Next
            End If
            Dim greetText = DB_Functions.RetrieveValue("sfn_getUserGreet", String.Format("{0},'{1}'", MyUserID.ToString(), lang))
            'staticServerText.Text = greetText
            Return retvalue
        End Function

#End Region

#Region "UI Disablers"
        Private Sub DisableLogin()
            cmdLogin2.Visible = False
            cmdInbox.Visible = False
            MyCapabilities.Can_Login = False
        End Sub

        Private Sub DisableRegister()
            cmdRegister2.Visible = False
            MyCapabilities.Can_Register = False
        End Sub

        Private Sub DisableDigitize()
            MyCapabilities.Can_Digitize = False
        End Sub

        Private Sub DisableTables()
            MyCapabilities.Can_UseTables = False
        End Sub






        Private Sub DisableImport()
            MyCapabilities.Can_UseImport = False
        End Sub

        Private Sub DisableExport()
            MyCapabilities.Can_UseExport = False
        End Sub

#End Region

#Region "ENUMS"
        Private Enum AppCap
            Login = 1
            RegisterUsers = 2
            Digitize = 3
            Library = 4
            BuyData = 5
            SellData = 6
            RequestData = 7
            Tables = 8
            Import = 9
            Export = 10
        End Enum
#End Region

#Region "GDAL"


        Private Sub TestExportDBLayer()
            Dim filename As String = "C:\OSGeo4W\bin\ogr2ogr.exe"
            Dim arguments = "-f ""KML"" ""/vsistdout/"" MSSQL:""server=localhost\SQLEXPRESS2008;uid=digiAdmin;database=digitizer;pwd=123456;AutoTranslate=True"" -sql ""SELECT * FROM chios_ROAD_NETWORK_GENERAL"" -overwrite"
            Dim results = ProcessRun(filename, arguments)
            Dim x = 1
        End Sub

        Private Delegate Function StringDelegate() As String

        Private Function ProcessRun(ByVal fileName As String, ByVal arguments As String) As String
            Dim results As String = ""
            Dim customerror As String = ""
            Dim cmdLineProcess As New Process()
            Using cmdLineProcess
                With cmdLineProcess.StartInfo
                    .FileName = fileName
                    .Arguments = arguments
                    .UseShellExecute = False
                    .CreateNoWindow = True
                    .RedirectStandardOutput = True
                    .RedirectStandardError = True

                End With
                Environment.SetEnvironmentVariable("OGR_FORCE_ASCII", "NO")
                'cmdLineProcess.
                If cmdLineProcess.Start() Then
                    Dim outputStreamAsyncReader = New StringDelegate(AddressOf cmdLineProcess.StandardOutput.ReadToEnd)
                    Dim errorStreamAsyncReader = New StringDelegate(AddressOf cmdLineProcess.StandardError.ReadToEnd)
                    Dim outAR As IAsyncResult = outputStreamAsyncReader.BeginInvoke(Nothing, Nothing)
                    Dim ererAr As IAsyncResult = errorStreamAsyncReader.BeginInvoke(Nothing, Nothing)
                    If Threading.Thread.CurrentThread.GetApartmentState = Threading.ApartmentState.STA Then
                        While Not (outAR.IsCompleted And ererAr.IsCompleted)
                            Threading.Thread.Sleep(10)
                        End While
                    Else
                        Dim arWaitHandles(1) As WaitHandle
                        arWaitHandles(0) = outAR.AsyncWaitHandle
                        arWaitHandles(1) = ererAr.AsyncWaitHandle
                        If Not WaitHandle.WaitAll(arWaitHandles) Then
                            customerror = String.Format("Command line aborted: {0}", fileName)
                        End If
                    End If
                    results = outputStreamAsyncReader.EndInvoke(outAR)
                    customerror = errorStreamAsyncReader.EndInvoke(ererAr)
                    If Not cmdLineProcess.HasExited Then
                        cmdLineProcess.WaitForExit()
                    End If
                Else
                    customerror = String.Format("Could not start command line process: {0}", fileName)
                End If
                cmdLineProcess.Close()
            End Using
            Return results
        End Function


#End Region


    End Class



#Region "Additional Classes"


    Public Class ApplicationCapabilities
#Region "Private Members"
        Private _canLogin As Boolean
        Private _canRegister As Boolean
        Private _canDigitize As Boolean
        Private _canUseLibrary As Boolean
        Private _canUseBuyData As Boolean
        Private _canUseSellData As Boolean
        Private _canUseRequestData As Boolean
        Private _canUseTables As Boolean
        Private _canUseImport As Boolean
        Private _canUseExport As Boolean
#End Region

#Region "Properties"
        Public Property Can_Login() As Boolean
            Get
                Return _canLogin
            End Get
            Set(ByVal value As Boolean)
                _canLogin = value
            End Set
        End Property

        Public Property Can_Register() As Boolean
            Get
                Return _canRegister
            End Get
            Set(ByVal value As Boolean)
                _canRegister = value
            End Set
        End Property

        Public Property Can_Digitize() As Boolean
            Get
                Return _canDigitize
            End Get
            Set(ByVal value As Boolean)
                _canDigitize = value
            End Set
        End Property

        Public Property Can_UseLibrary() As Boolean
            Get
                Return _canUseLibrary
            End Get
            Set(ByVal value As Boolean)
                _canUseLibrary = value
            End Set
        End Property

        Public Property Can_UseBuyData() As Boolean
            Get
                Return _canUseBuyData
            End Get
            Set(ByVal value As Boolean)
                _canUseBuyData = value
            End Set
        End Property

        Public Property Can__UseSellData() As Boolean
            Get
                Return _canUseSellData
            End Get
            Set(ByVal value As Boolean)
                _canUseSellData = value
            End Set
        End Property

        Public Property Can_UseRequestData() As Boolean
            Get
                Return _canUseRequestData
            End Get
            Set(ByVal value As Boolean)
                _canUseRequestData = value
            End Set
        End Property

        Public Property Can_UseTables() As Boolean
            Get
                Return _canUseTables
            End Get
            Set(ByVal value As Boolean)
                _canUseTables = value
            End Set
        End Property

        Public Property Can_UseImport() As Boolean
            Get
                Return _canUseImport
            End Get
            Set(ByVal value As Boolean)
                _canUseImport = value
            End Set
        End Property

        Public Property Can_UseExport() As Boolean
            Get
                Return _canUseExport
            End Get
            Set(ByVal value As Boolean)
                _canUseExport = value
            End Set
        End Property

        Sub New()
            For Each p As System.Reflection.PropertyInfo In Me.GetType().GetProperties()
                p.SetValue(Me, True, Nothing)
            Next
        End Sub
#End Region

    End Class

#End Region


End Namespace
