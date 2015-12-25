<?php

$uploaddir = "../upload/"; //public-data
$fileName = $_FILES['fileToUpload']['name'];
$fileZise = $_FILES['fileToUpload']['size'];
$uploaddir = getcwd().DIRECTORY_SEPARATOR.$uploaddir.DIRECTORY_SEPARATOR;
echo basename($fileName);
$uploadfile = $uploaddir.basename($fileName);
move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $uploadfile);
echo $fileName.' ['.$fileZise.'] was uploaded successfully!';

?>