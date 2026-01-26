<?php
	if($_GET['query']=="newsession"){
		session_start();
		$_SESSION['user']=$_GET['user'];
		echo("set user to ".$_GET['user']);
	}elseif($_GET['query']=="getuser"){
		session_start();
		if($_SESSION['user'])
			echo($_SESSION['user']);
		else
			echo("");
	}else
		echo("no query");
?>
