<?php

$length = $_POST['filelength'];
for($i = 0 ; $i < $length; $i++){
    uploadfile("file" . $i);
}

function uploadfile($file){
    print_r($file);
    $uploaddir = "../upload/"; //public-data
    $fileName = $_FILES[$file]['name'];
    $fileZise = $_FILES[$file]['size'];
    $uploaddir = getcwd().DIRECTORY_SEPARATOR.$uploaddir.DIRECTORY_SEPARATOR;
    $uploadfile = $uploaddir.time().basename($fileName);
    move_uploaded_file($_FILES[$file]['tmp_name'], $uploadfile);
    echo $fileName.' ['.$fileZise.'] was uploaded successfully!';
}

?>