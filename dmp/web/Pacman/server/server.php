<?php
	$connect = new MySQLi('dmp_mysql','ADMI','admin','dmp','3306');
	if(!$connect){
		echo('error opening db');
		die('Could Note Connect to Database'); //to be substituted
	}
	//if($_SERVER['REQUEST_METHOD'] === 'GET'){
	$method=$_GET['method'];
	$query=$_GET['query'];
	if($method=='GET'){
		$table=$_GET['table'];
		$field=$_GET['field'];
		$data=$_GET['data'];
		$sql="SELECT * FROM $table WHERE $field='$data'";
		$result=mysqli_query($connect,$sql);
		$found=mysqli_num_rows($result);
		$eco="";
		if($found>0){
			if($query=="JSON"){
				$json=array();
				while($row=mysqli_fetch_assoc($result)){
					$json[]=$row;
				}
				echo(json_encode($json));
			}else{
				$row=$result->fetch_row();
				foreach($row as $value){
					$eco=$eco.$value."&";
				}
				$eco=substr($eco,0,strlen($eco)-1);			
				echo($eco);
			}
		}else{
			echo($eco);
		}
	}elseif($method=="POST"){
		$keys=array_keys($_GET);
		$where=$_GET['where'];
		$table=$_GET['table'];
		$keys=array_keys($_GET);
		if($query=="UPDATE"){	
			$sql="UPDATE $table SET ";
			$cont=0;
			foreach($keys as $key){
				if(($key!='method')&&($key!='query')&&($key!='table')&&($key!='where')){
					if($cont>0){
						$sql=$sql.',';
					}
					$cont++;
					$sql=$sql."$key = '$_GET[$key]'";
				}
			}
			$sql=$sql."WHERE ".$where;
		}elseif($query=="INSERT"){
			$sql1="INSERT INTO $table (";
			$sql2="VALUES (";
			$cont=0;
			foreach($keys as $key){
				if(($key!='method')&&($key!='query')&&($key!='table')&&($key!='where')){
					if($cont>0){
						$sql1=$sql1.',';
					}
					$cont++;
					$sql1=$sql1."$key";
					$sql2=$sql2."'$_GET[$key]'";
				}
			}
			$sql1=$sql1.") ";
			$sql2=$sql2.")";	
			$sql=$sql1.$sql2;
		}
		$result=mysqli_query($connect,$sql);
		if($result===TRUE)
			echo('ok');
		else
			echo('error :'.$connect->error);	
	}
?>
