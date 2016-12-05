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

    // Arial bold 15
    $this->SetFont('Arial','',9);
    $this->Ln(15);
    $this->Cell(0,4,'Don Mariano Marcos Memorial State University',0,1,'C');
    $this->Cell(0,4,'Mid La Union Campus',0,1,'C');
    $this->Cell(0,4,'San Fernando City',0,1,'C');
    $this->Cell(0,4,'La Union 2500',0,1,'C');
    $this->Ln(5);
    $this->SetFont('Arial','B',9);	
    $this->Cell(0,4,'Integrated Campus Testing & Scholarship System',0,1,'C');
    $this->Ln(5);	
}

// Page footer
function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}

function Scholarship($header, $data)
{
	$semester = array(1=>"First",2=>"Second");
    $this->Ln(2);	
    // Colors, line width and bold font
    $this->SetFillColor(106,168,65);
    $this->SetTextColor(34,73,8);
    $this->SetDrawColor(68,114,37);
    $this->SetLineWidth(.3);
    $this->SetFont('','B');
    // Header
    $w = array(22, 40, 40, 43, 43);
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C',true);
    $this->Ln();
    // Color and font restoration
    $this->SetFillColor(224,235,255);
    $this->SetTextColor(65,68,64);
	$this->SetFont('Arial','',8);
    // Data
    $fill = false;
    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row['student_id'],'LR',0,'C',$fill);
        $this->Cell($w[1],6,$row['full_name'],'LR',0,'C',$fill);
        $this->Cell($w[2],6,$row['course'],'LR',0,'C',$fill);
        $this->Cell($w[3],6,$row['college'],'LR',0,'C',$fill);
        $this->Cell($w[4],6,$semester[$row['semester']],'LR',0,'C',$fill);
        $this->Ln();
        $fill = !$fill;
    }
    // Closing line
    $this->Cell(array_sum($w),0,'','T');
}

}

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial','',11);
$pdf->Cell(0,5,"$title",0,1,'C');

/* $header = array("Student ID","Fullname","Course","College","Semester");
$sql = "SELECT accounts.student_id, CONCAT(accounts.first_name, ' ', accounts.middle_name, ' ', accounts.last_name) full_name, scholarships.course, scholarships.college, scholarships.semester FROM scholarships LEFT JOIN accounts ON scholarships.account_id = accounts.id WHERE application_type IN ($scholarship_type) AND account_type != 'Administrator' AND scholarships.status IN ('Approved') AND scholarships.school_year = '$_GET[school_year]'";
$data = $con->getData($sql);
$pdf->Scholarship($header,$data); */

$pdf->Output();

?>