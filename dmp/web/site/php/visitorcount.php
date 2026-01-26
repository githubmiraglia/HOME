<?php
header('Content-Type: application/json');

$counterFile = "counter.txt";
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, "0");
}
$visitorCount = (int) file_get_contents($counterFile);
$visitorCount++;
file_put_contents($counterFile, $visitorCount);

echo json_encode(['visitorCount' => $visitorCount]);
?>