<?php
	if($_GET['query']=="newsession"){
		session_start();
		$_SESSION['user']=$_GET['user'];
		echo("set user to ".$_GET['user']);
	}elseif($_GET['query']=="getuser"){
		session_start();
		echo($_SESSION['user']);
	}else
		echo("no query");
?>
