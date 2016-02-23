
<?php 
function file_get_contents_utf8($fn)
{
    $content = @file_get_contents($fn);
	// echo $content.'<br/>';
    return mb_convert_encoding($content, 'UTF-8',mb_detect_encoding($content, 'UTF-8, ISO-8859-7', true));
}
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('allow_url_fopen ','ON');
$content = file_get_contents_utf8("http://maps.emeganisi.gr/mapserver/rest/styles/emeganisi_epixeiriseis.sld");

$xml = simplexml_load_string($content);
//print_r($xml);
// for debug: 
$dom = dom_import_simplexml($xml)->ownerDocument;
$dom->formatOutput = true;
echo $dom->saveXML();*/
?>
