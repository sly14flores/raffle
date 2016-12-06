<?php

require('../fpdf181/fpdf.php');
require('../db.php');

$con = new pdo_db();

class PDF extends FPDF
{
// Page header
function Header()
{
    // Logo
    // $this->Image('../images/logo.png',105,6,19);
    // $this->Image('../images/logo-bak.png',85,6,18);
	
	global $title, $raffle, $prize;
	
    // Arial bold 15
    $this->SetFont('Arial','',9);
    $this->SetTextColor(66,66,66);
    $this->Cell(0,5,'PGLU - eRaffle System',0,1,'C');
    $this->SetFont('Arial','B',9);
	$this->SetFontSize(11);
    $this->Cell(0,5,$title,0,1,'C');
    $this->Ln(5);
	$this->SetDrawColor(92,92,92);
	$this->Line(5,25,205,25);
	$this->Ln(10);
    $this->SetFont('Arial','B',14);
    $this->Cell(0,6,$prize,0,1,'C');
    $this->SetFont('Arial','',9);
	$this->SetTextColor(92,92,92);	
    $this->Cell(0,5,$raffle,0,1,'C');

}

// Page footer
function Footer()
{
	if ($this->isFinished) {
		$this->SetDrawColor(92,92,92);	
		$this->Line(85,265,125,265);
		$this->SetY(-30);
		$this->Cell(0,5,"In Charge",0,1,'C');	
	}	
    // Position at 1.5 cm from bottom	
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->SetTextColor(66,66,66);	
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}

function winners($header, $data)
{
	
    $this->Ln(8);	
    // Colors, line width and bold font
    $this->SetFillColor(60,159,223);
    $this->SetTextColor(66,66,66);
    $this->SetDrawColor(17,87,133);
    $this->SetLineWidth(.3);
    // $this->SetFont('','B');

    // Header
	$closingLine = 0;
	foreach ($header as $i => $h) {
		$this->Cell(array_keys($header[$i])[0],7,$header[$i][array_keys($header[$i])[0]],1,0,'C',true);
		$closingLine += array_keys($header[$i])[0];
	}
    $this->Ln();
	
    // Color and font restoration
    $this->SetFillColor(224,235,255);
    $this->SetTextColor(66,66,66);
	$this->SetFont('Arial','',10);
    // Data
	
    $fill = false;
    foreach($data as $key => $row) {
		foreach ($header as $i => $h) {
			$this->Cell(array_keys($header[$i])[0],7,$row[array_keys($row)[$i]],'LR',0,'C',$fill);
		}
        $this->Ln();
        $fill = !$fill;		
    }	
    $this->Cell($closingLine,0,'','T');

}

}

$title = "Christmas Party 2016";

$sql = "SELECT prizes.prize_type raffle, prizes.prize_description prize FROM draws LEFT JOIN prizes ON draws.prize_id = prizes.id WHERE draws.id = $_GET[id]";
$draws = $con->getData($sql);
foreach ($draws as $draw) {
	$raffle = $draw['raffle'];
	$prize = $draw['prize'];
}

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial','',11);

$header = array(
	array(30=>"EmpID"),
	array(90=>"Name"),
	array(70=>"Office")
);

$sql = "SELECT employees.empid, employees.fullname, employees.office FROM winners LEFT JOIN employees ON winners.employee_id = employees.id WHERE winners.draw_id = $_GET[id]";
$data = $con->getData($sql);

$pdf->winners($header,$data);
$pdf->isFinished = true;
$pdf->Output();

?>