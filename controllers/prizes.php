<?php

require_once '../db.php';

$_POST = json_decode(file_get_contents('php://input'), true);

switch ($_GET['r']) {
	
	case "list":
		
		$con = new pdo_db();
		
		$prizes = $con->getData("SELECT * FROM prizes");
		
		echo json_encode($prizes);
		
	break;

	case "edit":
	
		$con = new pdo_db();		
		$prize = $con->getData("SELECT * FROM prizes WHERE id = $_POST[id]");
		
		echo json_encode($prize[0]);
	
	break;
	
	case "save_update":
		
		$con = new pdo_db("prizes");
		
		if (isset($_POST['id'])) {
			$prize = $con->updateData($_POST,'id');
		} else {
			$prize = $con->insertData($_POST);
		}
		
		echo "";
	
	break;
	
	case "delete":
	
		$con = new pdo_db("prizes");			
		$con->deleteData(array("id"=>implode(",",$_POST['id'])));
		
		echo "Deletion successful";
	
	break;
	
}

?>