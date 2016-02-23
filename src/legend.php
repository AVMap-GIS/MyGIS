<?php
function file_get_contents_utf8($fn) {
     $content = file_get_contents($fn);
      return mb_convert_encoding($content, 'UTF-8',
          mb_detect_encoding($content, 'UTF-8, ISO-8859-7', true));
}

$layersNames = explode(',', $_GET['layers']);
$returnedArray = array();
// var_dump($layersNames);
for($i=0,$c=count($layersNames);$i<$c;$i++)
{
// echo '*******************************'.$layersNames[$i].'***************************<br/>';
// $sld = 'http://maps.emeganisi.gr/mapserver/rest/styles/emeganisi_epixeiriseis.sld' ;
$sld = 'http://maps.emeganisi.gr/mapserver/rest/styles/'.trim($layersNames[$i]).'.sld' ;
$myXMLData =  file_get_contents_utf8($sld); //xml
// var_dump($myXMLData); //
$xml=simplexml_load_string($myXMLData) or die("Error: Cannot create object");
// var_dump($xml);
$xml->registerXPathNamespace('se', 'http://www.opengis.net/se');
$xml->registerXPathNamespace('ogc', 'http://www.opengis.net/ogc');
// $layersString = $_GET['layers'];
//NAMES
$result_names = array();
$names = $xml->xpath('//se:Rule//se:Name');
foreach ($names as $name)
{$result_names[] = (string)$name;}
// var_dump($result_names);
// echo '***'.count($result_names);
//DESCRIPTIONS
$result_descriptions = array();
$descriptions = $xml->xpath('//se:Rule//se:Description//se:Title');
foreach ($descriptions as $description)
{$result_descriptions[] = (string)$description;}
// var_dump($result_descriptions);

//PROPERTY NAME
$result_filresPropretriesN = array();
$propretriesN = $xml->xpath('//se:Rule//ogc:Filter//ogc:PropertyIsEqualTo//ogc:PropertyName');
foreach ($propretriesN as $propretrieN)
{$result_filresPropretriesN[] = (string)$propretrieN;}
// var_dump($result_filresPropretriesN);
//PROPERTY LITERAL
$result_filresPropretriesL = array();
$propretriesL = $xml->xpath('//se:Rule//ogc:Filter//ogc:PropertyIsEqualTo//ogc:Literal');
foreach ($propretriesL as $propretrieL)
{$result_filresPropretriesL[] = (string)$propretrieL;}
// var_dump($result_filresPropretriesL);

// POINT SYMBOLIZER
// echo ' POINT SYMBOLIZER<br/>';
$result_imgPath = array();
$imgPaths = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:ExternalGraphic//se:OnlineResource');
// var_dump($imgPaths);
foreach ($imgPaths as $imgPath)
{
$tmp = $imgPath->attributes('xlink',true)->href;
$result_imgPath[]= (string) $tmp;
}
// var_dump($result_imgPath);
// POINT SYMBOLIZER
$result_imgFormat = array();
$formats = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:ExternalGraphic//se:Format');
foreach ($formats as $format)
{$result_imgFormat[] = (string)$format;}
// var_dump($result_imgFormat);
// POINT SYMBOLIZER
$result_imgSize = array();
$sizes = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:Size');
foreach ($sizes as $size)
{$result_imgSize[] = (int)$size;}
// var_dump($result_imgSize);

$layerA = array();
$layerA['tableName']=$layersNames[$i];
$layerA['legendInfos']=array();
for($i2=0,$c2=count($result_names);$i2<$c2;$i2++)
{
$tmpA = Array();
$tmpA['name']=isset($result_names[$i2]) ? $result_names[$i2] : '';
$tmpA['description']=isset($result_descriptions[$i2]) ? $result_descriptions[$i2] : '';
$tmpA['propretry_name']=isset($result_filresPropretriesN[$i2]) ? $result_filresPropretriesN[$i2] : '';
$tmpA['propretry_literal']=isset($result_filresPropretriesL[$i2]) ? $result_filresPropretriesL[$i2] : '';
$tmpA['image']=isset($result_imgPath[$i2]) ? $result_imgPath[$i2] : '';
$tmpA['format']=isset($result_imgFormat[$i2]) ? $result_imgFormat[$i2] : '';
$tmpA['size']=isset($result_imgSize[$i2]) ? $result_imgSize[$i2] : '';
array_push($layerA['legendInfos'],$tmpA);
}
array_push($returnedArray,$layerA);
}
echo json_encode($returnedArray);
?>
