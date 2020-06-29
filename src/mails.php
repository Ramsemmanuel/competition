<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header("Access-Control-Allow-Origin: *");

$errors = '';

if(empty($errors))
{

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$from_email = 'no-reply@domain.com';
	$message = "Please follow this link to reset your password:
	https://localhost:3000/#/password-reset";
	$from_name = 'No-reply';
	$subject = 'Reset your password';

	$to_email = $request->email;
	// $to_email = "ramsemmanuel@gmail.com";

	// $contact = "<p><strong>Names:</strong> $from_name</p>
	// 			<p><strong>Email:</strong> $from_email</p>
	// 			<p><strong>Subject:</strong> $subject</p>";
	$content = "<p>$message/$to_email</p>";

	$email_subject = $subject;

	$email_body = '<html><body>';
	$email_body .= "$content";
	$email_body .= '</body></html>';

	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	$headers .= "Access-Control-Allow-Origin: *";
	$headers .= "Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin,access-control-allow-methods, access-control-allow-headers'";
	$headers .= "From: $from_email\n";
	$headers .= "Reply-To: $from_email";

	mail($to_email,$email_subject,$email_body,$headers);

	$response_array['status'] = 'success';
	$response_array['from'] = $from_email;
	echo json_encode($response_array);
	echo json_encode($from_email);
	header($response_array);
	return $from_email;
} else {
	$response_array['status'] = 'error';
	echo json_encode($response_array);
	header('Location: /error.html');
}
?>
