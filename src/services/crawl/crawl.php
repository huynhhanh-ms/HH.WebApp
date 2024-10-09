<?php
function sendMessage($chat_id, $message) {
    // Thêm mã gửi tin nhắn ở đây
}

$url = "https://vnexpress.net/chu-de/gia-xang-dau-3026"; // URL của trang web
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$html = curl_exec($ch);
curl_close($ch);

$dom = new DOMDocument();
libxml_use_internal_errors(true);
$dom->loadHTML($html);
libxml_clear_errors();

$tables = $dom->getElementsByTagName('table');
$message = "";

foreach ($tables as $table) {
    $rows = $table->getElementsByTagName('tr');

    foreach ($rows as $row) {
        $cells = $row->getElementsByTagName('td');
        $rowData = [];

        foreach ($cells as $cell) {
            $rowData[] = trim($cell->nodeValue);
        }

        if (count($rowData) == 3 && $rowData[0] !== "Mặt hàng") {
            $matHang = $rowData[0];
            $gia = $rowData[1];
            $soVoiKyTruoc = $rowData[2];
            $message .= "$matHang: $gia đồng. (Tăng $soVoiKyTruoc đồng)\n\n";
        }
    }

    if (!empty($message)) {
        sendMessage($chat_id, urlencode($message));
        sendMessage($chat_id, "Cập nhật ngày " . date('d/m/Y') . " từ VnExpress.");
    }

    break;
}
?>
