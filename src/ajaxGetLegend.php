<?php
header("Access-Control-Allow-Origin: *");
include('encoding_fix.php');
include('config_legend.php');


$layersNames = explode(',', $_GET['layers']);
$returnedArray = array();
// var_dump($layersNames);
for($i=0,$c=count($layersNames);$i<$c;$i++)
{
    $domaine = 'http://maps.emeganisi.gr/';
    $sld = $domaine.'mapserver/rest/styles/'.trim($layersNames[$i]).'.sld' ;
    $myXMLData = file_get_contents_utf8($sld); //xml

if(!empty($myXMLData))
{
    $xml=simplexml_load_string($myXMLData) or die("Error: Cannot create object");
    $xml->registerXPathNamespace('se', 'http://www.opengis.net/se');
    $xml->registerXPathNamespace('ogc', 'http://www.opengis.net/ogc');
   
    if(isset($xml->NamedLayer->UserStyle->FeatureTypeStyle->Rule) && $xml->NamedLayer->UserStyle->FeatureTypeStyle->Rule != '') // if square or line
    {
        // echo 'SQUARE AND LINE';
        $tmp_rule_name = $xml->NamedLayer->UserStyle->FeatureTypeStyle->Rule->Name;
        $tmp_arr = array();
        $tmp_arr['type'] = 'vector';
        $tmp_arr['tableName'] = trim($layersNames[$i]);
        $tmp_arr['title'] = (string) $xml->NamedLayer->UserStyle->FeatureTypeStyle->Rule->Title;
        $tmp_arr['absctract'] = (string) $xml->NamedLayer->UserStyle->FeatureTypeStyle->Rule->Abstract;
        $tmp_arr['img'] = $domaine.'mapserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=60&HEIGHT=60&LAYER='.trim($layersNames[$i]).'&LEGEND_OPTIONS=forceLabels:off&rule='.$tmp_rule_name;
        array_push($returnedArray,$tmp_arr);
    }
    else
    {
       
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
            $result_imgPath = array();
            $imgPaths = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:ExternalGraphic//se:OnlineResource');
            foreach ($imgPaths as $imgPath)
            {
                $tmp = $imgPath->attributes('xlink',true)->href;
                 $result_imgPath[]= (string) $tmp;
            }
           
        // POINT SYMBOLIZER
            $result_imgFormat = array();
            $formats = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:ExternalGraphic//se:Format');
            foreach ($formats as $format)
            {$result_imgFormat[] = (string)$format;}
           
        // POINT SYMBOLIZER
            $result_imgSize = array();
            $sizes = $xml->xpath('//se:Rule//se:PointSymbolizer//se:Graphic//se:Size');
            foreach ($sizes as $size)
            {$result_imgSize[] = (int)$size;}
       
        $layerA = array();
        $layerA['type'] = 'image';
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
}
}
    echo json_encode($returnedArray);
?>