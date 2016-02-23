<%@ WebHandler Language="VB" Class="Proxy" %>

Imports System
Imports System.Web
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web.UI
Imports System.Web.UI.WebControls
Imports System.Net
Imports System.IO

Public Class Proxy : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
       
        Dim proxyURL As String = String.Empty
        Try
            proxyURL = HttpUtility.UrlDecode(context.Request.QueryString("u").ToString())
        Catch
        End Try

        If proxyURL <> String.Empty Then
            Dim request__1 As HttpWebRequest = DirectCast(WebRequest.Create(proxyURL), HttpWebRequest)
            request__1.Method = "GET"
            Dim response__2 As HttpWebResponse = DirectCast(request__1.GetResponse(), HttpWebResponse)

            If response__2.StatusCode.ToString().ToLower() = "ok" Then
                Dim contentType As String = response__2.ContentType
                Dim content As Stream = response__2.GetResponseStream()
                Dim contentReader As New StreamReader(content)
                context.Response.ContentType = contentType
                context.Response.Write(contentReader.ReadToEnd())
            End If
        End If


    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class