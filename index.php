<?php
  include('server.php');
  $ab = new adatbazis();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Notes | Main</title>
  <link href="bootstrap.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>NoteBook</h1>
    <p>100 elem</p>
  </header>
  <main class="container-fluid">
    <div class="row">
      <section class="col-md-4" id="panel">
      </section>
      <section class="col-md-8">
        <h2>Notes</h2>
        <?php $ab->list(); ?>
      </section>
    </div>
  </main>
</body>
</html>
<!-- Add JQuery -->
<script src="jquery.min.js"></script>
<script src="script.js"></script>