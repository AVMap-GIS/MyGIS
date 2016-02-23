<%@ WebHandler Language="VB" Class="GetImage" %>

Imports System
Imports System.Web
Imports MyGIS_SharedClasses


Public Class GetImage :: Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim pict As Byte()
        Dim rtype As String
        Dim rID As String
        Dim rSize As String
        Try
            rtype = context.Request.QueryString("qType")
            rID = context.Request.QueryString("qContents")
            rSize = context.Request.QueryString("qSize")
            If rSize Is Nothing Then rSize = ""
            Select Case rtype
                Case "mapThumb"
                    pict = RetrieveMapThumbNail(rID, rSize.ToString())
                Case "userFile"
                    pict = RetrieveFileThumbNail(rID, rSize.ToString())
                Case "GetAppLogo", "GetAppLogo1", "GetAppLogo2"
                    pict = RetrieveAppThumbNail(rtype, rID, rSize.ToString())
                Case "GetDefaultButton", "GetDefaultButton1", "GetDefaultButton1_on", "GetDefaultButton2", "GetDefaultButton2_on", "GetDefaultButton3", "GetDefaultButton3_on", "MapArrow", "QSArrow"
                    pict = RecolorImage(rtype, rID, rSize.ToString())
                Case "geoIcon"
                    Dim bgColor = context.Request.QueryString("qBgColor")
                    Dim bgStroke = context.Request.QueryString("qBgStroke")
                    Dim foreColor = context.Request.QueryString("qForeColor")
                    Dim fileType = context.Request.QueryString("qIconType")
                    pict = RecolorSVG(fileType, rID, rSize, bgColor, bgStroke, foreColor)
                Case Else
                    Throw New Exception("Unsupported request")
            End Select
            If rtype <> "geoIcon" Then
                context.Response.ContentType = "image/png"
                If Not (rtype = "GetAppLogo" Or rtype = "GetAppLogo1" Or rtype = "GetAppLogo2") Then
                    context.Response.Cache.SetCacheability(HttpCacheability.Public)
                    context.Response.Cache.SetExpires(DateTime.Now.AddDays(1))
                    context.Response.Cache.SetMaxAge(New TimeSpan(24, 0, 0))
                Else
                    context.Response.Cache.SetCacheability(HttpCacheability.NoCache)
                    context.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches)
                End If
                context.Response.OutputStream.Write(pict, 0, pict.Length)
            Else
                context.Response.ContentType = "image/svg+xml"
                context.Response.Cache.SetCacheability(HttpCacheability.NoCache)
                context.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches)
                context.Response.OutputStream.Write(pict, 0, pict.Length)
            End If
            
        Catch ex As Exception
            context.Response.ContentType = "text/plain"
            context.Response.Write(ex.Message)
        End Try
       
        
        'context.Response.Write("Hello World")
        
        
    End Sub
    
    Private Function RecolorSVG(ByVal type As String, ByVal file As String, Optional ByVal size As String = "", _
                                Optional ByVal bgColor As String = "", Optional ByVal bgStroke As String = "", _
                                Optional ByVal foreColor As String = "") As Byte()
        Dim pict As Byte()
        Dim filepath As String = HttpContext.Current.Server.MapPath(String.Format("~\DesktopModules\AVMap.MapDigitizer_V2\Images\mapserver\{0}\{1}.svg", type, file))
        Dim inputFile As Byte() = System.IO.File.ReadAllBytes(filepath)
        Dim svgText = System.Text.Encoding.UTF8.GetString(inputFile)
        If Not String.IsNullOrEmpty(bgColor) Then
            svgText = svgText.Replace("fill:#111111", String.Format("fill:{0}", bgColor))
            svgText = svgText.Replace("fill:#111", String.Format("fill:{0}", bgColor))
        End If
        If Not String.IsNullOrEmpty(bgStroke) Then
            svgText = svgText.Replace("stroke:#eeeeee", String.Format("stroke:{0}", bgStroke))
            svgText = svgText.Replace("stroke:#eee", String.Format("stroke:{0}", bgStroke))
        End If
        If Not String.IsNullOrEmpty(foreColor) Then
            svgText = svgText.Replace("fill:white", String.Format("fill:{0}", foreColor))
            svgText = svgText.Replace("stroke:white", String.Format("stroke:{0}", foreColor))
            svgText = svgText.Replace("fill:#ffffff", String.Format("fill:{0}", foreColor))
            svgText = svgText.Replace("stroke:#ffffff", String.Format("stroke:{0}", foreColor))
        End If
        If Not String.IsNullOrEmpty(size) Then
            Dim scaleFactor As Double = Math.Round(Integer.Parse(size) / 580, 2)
            Dim width As Integer = 580 * scaleFactor
            Dim height As Integer = 580 * scaleFactor
            Dim insertIndex = svgText.IndexOf("</metadata>") + 11
            svgText = svgText.Insert(insertIndex, String.Format("<g transform=""scale({0})"">", scaleFactor))
            insertIndex = svgText.IndexOf("</svg>")
            svgText = svgText.Insert(insertIndex, "</g>")
            svgText = svgText.Replace("width=""580""", String.Format("width=""{0}""", width))
            svgText = svgText.Replace("height=""580""", String.Format("height=""{0}""", height))
        End If
        pict = System.Text.Encoding.UTF8.GetBytes(svgText)
        Return pict
    End Function
    
    Private Function RetrieveMapThumbNail(ByVal mapID As String, Optional ByVal size As String = "") As Byte()
        Dim pict As Byte()
        Dim con As SqlConnection
        Dim cmd As SqlCommand
        Dim intSize As Integer
        If Not String.IsNullOrEmpty(size) Then
            Dim opResult As Integer = Integer.TryParse(size, intSize)
            If opResult = 0 Then
                intSize = 40
            End If
        Else
            intSize = 40
        End If
        
        
        con = New SqlConnection(ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString.ToString())
        cmd = New SqlCommand("SELECT map_thumb from mg_maps WHERE map_id=@mapID", con)
        cmd.CommandType = CommandType.Text
        cmd.Parameters.AddWithValue("@mapID", mapID)
        con.Open()
        
        pict = CType(cmd.ExecuteScalar(), Byte())
        pict = ResizeImage(pict, intSize, intSize)
        con.Close()
        Return pict
    End Function
    
    Private Function RetrieveFileThumbNail(ByVal fileID As String, Optional ByVal size As String = "") As Byte()
        Dim pict As Byte()
        Dim con As SqlConnection
        Dim cmd As SqlCommand
        Dim intSize As Integer
        Dim userID As Integer = -1
        If Not String.IsNullOrEmpty(size) Then
            Dim opResult As Integer = Integer.TryParse(size, intSize)
            If opResult = 0 Then
                intSize = 20
            End If
        Else
            intSize = 20
        End If
        If HttpContext.Current.User.Identity.IsAuthenticated Then
            userID = UserController.GetCurrentUserInfo().UserID
        End If
        
        con = New SqlConnection(ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString.ToString())
        cmd = New SqlCommand("SELECT FILE_DATA from mg_Users_Files WHERE R_ID=@fileID AND (USER_ID=@userID OR FILE_PUBLIC=1 OR FILE_INUSE=1)", con)
        cmd.CommandType = CommandType.Text
        cmd.Parameters.AddWithValue("@fileID", fileID)
        cmd.Parameters.AddWithValue("@userID", userID)
        con.Open()
        
        pict = CType(cmd.ExecuteScalar(), Byte())
        If Not String.IsNullOrEmpty(size) Then
            pict = ResizeImage(pict, intSize, intSize, True)
        End If
        con.Close()
        Return pict
    End Function
    
    Private Function RetrieveAppThumbNail(ByVal requestType As String, ByVal appID As String, Optional ByVal size As String = "") As Byte()
        Dim pict As Byte()
        Dim con As SqlConnection
        Dim cmd As SqlCommand
        Dim intSize As Integer
        Dim columnName As String = ""
        Select Case requestType
            Case "GetAppLogo"
                columnName = "app_logo"
            Case "GetAppLogo1"
                columnName = "app_AdditionalLogo1"
            Case "GetAppLogo2"
                columnName = "app_AdditionalLogo2"
        End Select
        If Not String.IsNullOrEmpty(size) Then
            Dim opResult As Integer = Integer.TryParse(size, intSize)
            If opResult = 0 Then
                intSize = 20
            End If
        Else
            intSize = 20
        End If
        If String.IsNullOrEmpty(appID) Then
            appID = DB_Functions.RetrieveValue("mg_fn_GetAppForAlias", String.Format("'{0}'", HttpContext.Current.Request.Url.Host()))
        End If
        con = New SqlConnection(ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString.ToString())
        cmd = New SqlCommand(String.Format("SELECT {0} from mg_Apps WHERE app_id=@appID", columnName), con)
        cmd.CommandType = CommandType.Text
        cmd.Parameters.AddWithValue("@appID", appID)
        con.Open()
        
        pict = CType(cmd.ExecuteScalar(), Byte())
        If Not String.IsNullOrEmpty(size) Then
            pict = ResizeImage(pict, intSize, intSize, True)
        End If
        con.Close()
        Return pict
    End Function
    
    Private Function RecolorImage(ByVal requestType As String, ByVal newColor As String, Optional ByVal size As String = "") As Byte()
        Dim pict As Byte()
        Dim intSize As Integer
        Dim filename As String
        Dim oldColor As Color
        Select Case requestType
            Case "GetDefaultButton"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_buttons.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton1"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_start.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton1_on"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_start_on.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton2"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_map.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton2_on"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_map_on.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton3"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_search.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "GetDefaultButton3_on"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\bouncy_buttons\bouncy_search_on.png")
                oldColor = Color.FromArgb(250, 164, 25)
            Case "MapArrow"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images/arrow_north_m.png")
                oldColor = Color.FromArgb(255, 255, 255)
            Case "QSArrow"
                filename = HttpContext.Current.Server.MapPath("~\DesktopModules\AVMap.MapDigitizer_V2\Images\queryBuilder\refine_search.png")
                oldColor = Color.FromArgb(250, 164, 25)
        End Select
        If Not String.IsNullOrEmpty(size) Then
            Dim opResult As Integer = Integer.TryParse(size, intSize)
            If opResult = 0 Then
                intSize = 20
            End If
        Else
            intSize = 20
        End If
        Dim img As Bitmap = Bitmap.FromFile(filename)
        Dim colorMap(0) As System.Drawing.Imaging.ColorMap
        'Dim newColorArgs = newColor.Split(",")
        colorMap(0) = New System.Drawing.Imaging.ColorMap()
        
        colorMap(0).OldColor = oldColor
        colorMap(0).NewColor = System.Drawing.ColorTranslator.FromHtml(newColor)
        Dim attrs As New System.Drawing.Imaging.ImageAttributes()
        attrs.SetRemapTable(colorMap)
        Dim g As Graphics = Graphics.FromImage(img)
        'Dim bmpNew = New Bitmap(img.Width, img.Height, Imaging.PixelFormat.Format32bppArgb)
        Dim rect As New Rectangle(0, 0, img.Width, img.Height)
        g.DrawImage(img, rect, 0, 0, rect.Width, rect.Height, GraphicsUnit.Pixel, attrs)
        Dim streamstore As New System.IO.MemoryStream()
        img.Save(streamstore, Imaging.ImageFormat.Png)
        pict = streamstore.ToArray()
        streamstore.Close()
        img.Dispose()
        If Not String.IsNullOrEmpty(size) Then
            pict = ResizeImage(pict, intSize, intSize, True)
        End If
        Return pict
    End Function
    
    Private Function ResizeImage(ByVal theBytes() As Byte, ByVal MaxWidth As Integer, ByVal MaxHeight As Integer, Optional ByVal Proportional As Boolean = False) As Byte()
        Dim retvalue() As Byte
        Dim stream As New System.IO.MemoryStream(theBytes)
        Dim bmp As New Bitmap(stream)
        stream.Close()
        Dim width As Integer = bmp.Width
        Dim height As Integer = bmp.Height
        Dim factors(1) As Decimal
        Dim bmpNew As Bitmap
        Dim g As Graphics
        If MaxWidth = Nothing And MaxHeight = Nothing Then
            retvalue = theBytes ' do not resize
        Else
            factors(0) = factors(1) = 1
            'If MaxWidth <> Nothing AndAlso width > MaxWidth Then
            If MaxWidth <> Nothing Then
                factors(0) = MaxWidth / width
            End If
            'If MaxHeight <> Nothing AndAlso height > MaxWidth Then
            If MaxHeight <> Nothing Then
                factors(1) = MaxHeight / height
            End If
            If Proportional Then
                Dim commonFactor As Decimal = IIf(factors(0) < factors(1), factors(0), factors(1))
                
                bmpNew = New Bitmap(bmp.Width * commonFactor, bmp.Height * commonFactor, Imaging.PixelFormat.Format32bppArgb)
                
            Else
                bmpNew = New Bitmap(bmp.Width * factors(0), bmp.Height * factors(1), Imaging.PixelFormat.Format32bppArgb)
            End If
            g = Graphics.FromImage(bmpNew)
            g.InterpolationMode = Drawing.Drawing2D.InterpolationMode.HighQualityBicubic
            g.DrawImage(bmp, 0, 0, bmpNew.Width, bmpNew.Height)
            Dim streamstore As New System.IO.MemoryStream()
            bmpNew.Save(streamstore, Imaging.ImageFormat.Png)
            retvalue = streamstore.ToArray()
            streamstore.Close()
        End If
        
        
        Return retvalue
    End Function
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class