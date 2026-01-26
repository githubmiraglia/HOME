<?php
	$connect = new MySQLi('dmp_mysql','ADMIN','admin','dmp','3306');
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
		if($table=="users")
			$password=$_GET['password'];
		$sql="SELECT * FROM $table WHERE $field='$data'";
		#echo($sql);
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
		$userName=$_GET['userName'];
		$email=$_GET['email'];
		$password=$_GET['password'];
		if($query=="UPDATE"){
			$currentUser=$_GET['currentUser'];
			$sql="UPDATE users SET userName='$userName',email='$email',password='$password' WHERE userName='$currentUser'";
		}
		elseif($query=="INSERT")
			$sql="INSERT INTO users (userName,email,password) VALUES ('$userName','$email','$password')";
		$result=mysqli_query($connect,$sql);
		if($result===TRUE)
			echo('ok');
		else
			echo('error :'.$connect->error);	
	}
?>
