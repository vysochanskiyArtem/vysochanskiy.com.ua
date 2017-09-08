<?php 
	$message = "имя: " . $_REQUEST['name'] . "\n" . "мыло: " . $_REQUEST['email'] . "\n" . "сообщение: " . $_REQUEST['message'];
	$message = wordwrap($message, 70, "\r\n");

	$theme = "Письмо с сайта vysochanskiy.com.ua";
	$email = "visdjuba@gmail.com";

	//Send
	mail($email, $theme, $message);
?>