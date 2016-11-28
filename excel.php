<?php

function getSheet($objPHPExcel,$sheet) {

foreach ($objPHPExcel->getWorksheetIterator() as $key => $worksheet) {
    $arrayData[$worksheet->getTitle()] = $worksheet->toArray(null,false,false,false);
}

/*
* 
* toArray();
* @param  mixed    $nullValue          Value returned in the array entry if a cell doesn't 
*                                      exist
* @param  boolean  $calculateFormulas  Should formulas be calculated?
* @param  boolean  $formatData         Should formatting be applied to cell values?
* @param  boolean  $returnCellRef      False - Return a simple array of rows and 
*                                      columns indexed by number counting from zero
*                                      True - Return rows and columns indexed by their 
*                                      actual row and column IDs
*
*/

$sheet_arr = $arrayData[$sheet];

return $sheet_arr;
	
}

require_once 'PHPExcel/IOFactory.php';

$objReader = PHPExcel_IOFactory::createReader('Excel2007');

$file = $_SERVER["DOCUMENT_ROOT"]."raffle/participants/list database.xlsx";
if (!file_exists($file)) {
	echo json_encode(array("status"=>0,"content"=>"File list 'database.xlsx' not found"));
	exit();
}
$objPHPExcel = $objReader->load($file);

$sheet_name = "Sheet1";
$sheet = getSheet($objPHPExcel,$sheet_name);

?>