<%@ WebHandler Language="VB" Class="UploadFile" %>

Imports System
Imports System.Web
Imports System.Data
Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Data.SqlClient
Imports System.IO
Imports Telerik.Web.UI

Imports MyGIS_SharedClasses


Public Class UploadFile
    Inherits AsyncUploadHandler
    Implements System.Web.SessionState.IRequiresSessionState
	Implements IHttpHandler
    
    Protected Overrides Function Process(ByVal file As UploadedFile, ByVal context As HttpContext, ByVal configuration As IAsyncUploadConfiguration, ByVal tempFileName As String) As IAsyncUploadResult
        ' Call the base Process method to save the file to the temporary folder
        ' base.Process(file, context, configuration, tempFileName);

        ' Populate the default (base) result into an object of type SampleAsyncUploadResult
        Dim result As SampleAsyncUploadResult = CreateDefaultUploadResult(Of SampleAsyncUploadResult)(file)

        Dim userID As Integer = -1
        ' You can obtain any custom information passed from the page via casting the configuration parameter to your custom class
        Dim sampleConfiguration As MyGIS_SharedClasses.SampleAsyncUploadConfiguration = TryCast(configuration, MyGIS_SharedClasses.SampleAsyncUploadConfiguration)
        If sampleConfiguration IsNot Nothing Then
            userID = sampleConfiguration.UserID
        End If
        
        ' Populate any additional fields into the upload result.
        ' The upload result is available both on the client and on the server
        
        If userID > -1 Then
            If IsAllowedToUpload(file, userID) Then
                result.ImageID = InsertImage(file, userID)
            Else
                result.ImageID = -1
                result.ErrorDescription = "mm_err_noSpace"
            End If
        Else
            result.ErrorDescription = "mm_err_invalidUser"
            result.ImageID = -1 'It was not stored
        End If
        If result.ImageID = -1 AndAlso String.IsNullOrEmpty(result.ErrorDescription()) Then
            result.ErrorDescription = "mm_err_unknown"
        End If
        Return result
       
    End Function

    Public Function InsertImage(ByVal file As UploadedFile, ByVal userID As Integer) As Integer
        Dim connectionString As String = ConfigurationManager.ConnectionStrings.Item("digiConn").ConnectionString.ToString()

        Using conn As New SqlConnection(connectionString)
            Dim cmdText As String = "INSERT INTO mg_Users_Files(USER_ID,FILE_DATA,FILE_NAME,FILE_TYPE) VALUES(@UserID,@ImageData,@ImageName,@FileType ) SET @Identity = SCOPE_IDENTITY()"
            Dim cmd As New SqlCommand(cmdText, conn)

            Dim imageData As Byte()  ' = GetImageBytes(file.InputStream)
            Using br As New BinaryReader(file.InputStream)
                imageData = br.ReadBytes(file.ContentLength)
            End Using
            'imageData = New Byte(file.ContentLength)
            'file.InputStream.Read(imageData, 0, CInt(file.InputStream.Length))
            Dim identityParam As New SqlParameter("@Identity", SqlDbType.Int, 0, "ImageID")
            identityParam.Direction = ParameterDirection.Output
            identityParam.Value = -1  'DEFAULT (on error)
            Try
                
            
                cmd.Parameters.AddWithValue("@ImageData", imageData)
                cmd.Parameters.AddWithValue("@ImageName", file.GetName())
                cmd.Parameters.AddWithValue("@UserID", userID)
                cmd.Parameters.AddWithValue("@FileType", file.GetExtension())

                cmd.Parameters.Add(identityParam)

                conn.Open()
                cmd.ExecuteNonQuery()
            Catch ex As Exception

            End Try
            Return CInt(identityParam.Value)
        End Using
    End Function

    Public Function GetImageBytes(ByVal stream As Stream) As Byte()
        Dim buffer As Byte()

        Using image As Bitmap = Bitmap.FromStream(stream)   'ResizeImage(stream)    'do not resize
            Using ms As New MemoryStream()
                image.Save(ms, ImageFormat.Jpeg)

                'return the current position in the stream at the beginning
                ms.Position = 0

                buffer = New Byte(ms.Length - 1) {}
                ms.Read(buffer, 0, CInt(ms.Length))
                Return buffer
            End Using
        End Using
    End Function

    Public Function ResizeImage(ByVal stream As Stream) As Bitmap
        Dim originalImage As Image = Bitmap.FromStream(stream)

        Dim height As Integer = 500
        Dim width As Integer = 500

        Dim ratio As Double = Math.Min(originalImage.Width, originalImage.Height) / CDbl(Math.Max(originalImage.Width, originalImage.Height))

        If originalImage.Width > originalImage.Height Then
            height = Convert.ToInt32(height * ratio)
        Else
            width = Convert.ToInt32(width * ratio)
        End If

        Dim scaledImage As New Bitmap(width, height)

        Using g As Graphics = Graphics.FromImage(scaledImage)
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic
            g.DrawImage(originalImage, 0, 0, width, height)

            Return scaledImage
        End Using

    End Function
    
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


	Private ReadOnly Property IHttpHandler_IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
    
End Class

    



Public Class SampleAsyncUploadResult
    Inherits AsyncUploadResult
    Private m_imageID As Integer
    Private m_errorDescription As String
    Public Property ImageID() As Integer
        Get
            Return m_imageID
        End Get
        Set(ByVal value As Integer)
            m_imageID = value
        End Set
    End Property
    Public Property ErrorDescription() As String
        Get
            Return m_errorDescription
        End Get
        Set(ByVal value As String)
            m_errorDescription = value
        End Set
    End Property
End Class